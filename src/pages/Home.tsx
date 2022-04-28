import { useEffect, useRef, useState } from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { mdiPencil, mdiTrashCan
  , mdiPlus, mdiSort } from "@mdi/js"
import { Icon } from "@mdi/react"
import MainLayout from "./layout/MainLayout"
import PostForm from "@/components/PostForm"
import Post from "@/components/Post"
import { getApiQuerySearch, getQueryUrlSearch
  , TSearch, TSearchOpts } from "@/code/lists/search"
import { createApiQueryObject } from "@/code/create"
import { getInputEventValue } from "@/code/event"
import { getMixQuery, setParamsToQueryBar } from "@/code/queryBar"
import { useSearch } from "@/hooks/lists/useSearch"
import { useInfPosts } from "@/hooks/rq/posts-hrq"
import { useQueryBar } from "@/hooks/lists/useQueryBar"
import { useDebounce } from "@/hooks/useDebouce"
import SortItem from "@/components/SortItem"
import { useSort } from "@/hooks/lists/useSort"
import { getApiQuerySort, getQueryUrlSort
  , TSort, TSortOpts } from "@/code/lists/sort"
import { TPost } from "@/types/posts-types"
import PostPhoto from "@/components/PostPhoto";
import useInsObs from "@/hooks/useInsObs"
import LoadingComp from "@/components/LoadingComp"

export default Home

const reactSwal = withReactContent(Swal)

interface TPrepareGetPostsParams {
  xstateSearch?: TSearch,
  xsearch?: TSearchOpts,
  xstateSort?: TSort,
  xsort?: TSortOpts
}

function Home() {
  const [ queryBar, setQueryBar ] = useQueryBar([
    ['q', ''],
    ['sort', ''],
    ['order', '']
  ])
  const [ search, setSearch ] = useSearch()
  const [ sort, setSort ] = useSort()
  const [ queryApi, setQueryApi ] = useState<Record<string, string>>({})
  const enabledInfQueryRef = useRef(false)
  const infPostsQuery = useInfPosts(queryApi, enabledInfQueryRef.current)
  
  function prepareGetPost({ xstateSearch, xsearch, xstateSort, xsort }: TPrepareGetPostsParams) {
    const searchQuery = getApiQuerySearch(xsearch, xstateSearch)
    const sortQuery = getApiQuerySort(xsort, xstateSort, 'title')
    const query = createApiQueryObject(searchQuery, sortQuery)
    setQueryApi(query)
  }
  const prepareGetPostDeb = useDebounce(prepareGetPost)
  
  function onInsObsEvent(entries: IntersectionObserverEntry[]) {
    const [ entry ] = entries
    if (entry.isIntersecting && infPostsQuery.hasNextPage && !infPostsQuery.isFetchingNextPage) {
      infPostsQuery.fetchNextPage()
    }
  }
  const loadMoreRef = useInsObs(onInsObsEvent, infPostsQuery.dataUpdatedAt)

  useEffect(() => {
    let paramsSearch: TSearchOpts = getQueryUrlSearch()
    setSearch(paramsSearch)

    let paramsSort: TSortOpts = getQueryUrlSort()
    setSort(paramsSort)
    
    setQueryBar({
      ...paramsSearch,
      ...paramsSort
    })

    enabledInfQueryRef.current = true
    
    prepareGetPost({
      xsearch: paramsSearch,
      xsort: paramsSort
    })
    
  }, [])

  function showPostForm({ post = null }: { post?: TPost | null } = {}) {
    reactSwal.fire({
      title: (
        <h2 className="text-lg select-none">
          { post ? 'Edit' : 'Create'} Post
        </h2>
      ),
      html: (<PostForm post={post} />),
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      denyButtonText: 'Reset',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      showLoaderOnDeny: true,
      preDeny: () => false,
      preConfirm: () => {
        return new Promise<boolean>((resolve) => {
          const listener = (ev: Event) => {
            const customEv = ev as CustomEvent<boolean>
            resolve(customEv.detail)
          }
          
          window.addEventListener('modal-confirm', listener, { once: true })  
        })
      }
    })
  }

  function openCreate() {
    showPostForm()
  }

  async function openShow(id: number) {
    
    const res = { data: { id, title: 'TEST', author: 'TEST', photo: '' } }//await getPost(id)
    const post: TPost = res?.data 

    await reactSwal.fire({
      title: (
        <h2 className="text-lg select-none">
          Show Post
        </h2>
      ),
      html: (<Post post={post} />)
    })
  }

  function onInputSearch(ev: React.FormEvent<HTMLInputElement>) {
    const q = getInputEventValue(ev)
    setSearch({ q })
    
    const xquery = getMixQuery({ q }, queryBar.current)
    setParamsToQueryBar(xquery)
    setQueryBar({ q })

    prepareGetPostDeb({
      xsearch: { q },
      xstateSort: sort
    })
  }

  function changeSort(newSort: TSort) {
    setSort(newSort)

    const xquery = getMixQuery(newSort, queryBar.current)
    setParamsToQueryBar(xquery)
    setQueryBar(newSort)

    prepareGetPostDeb({
      xstateSearch: search,
      xsort: newSort
    })
  }

  return (
    <MainLayout>
      <div className="lg:mx-28">
        <div className="mb-3">
          <div className="lg:mx-36 flex flex-row">
            <input type="search" 
              placeholder="Search..." 
              value={search.q}
              onInput={onInputSearch}
              className="
                form-control input-primary mr-2 
                p-2 rounded-xl flex-1
                outline-2 outline-double outline-gray-500
                w-full
              " 
            />
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn m-1">
                <Icon path={mdiSort} size={1} />
              </label>
              <ul tabIndex={0} 
                  className="
                    dropdown-content menu p-2 
                    shadow bg-base-200 rounded-box 
                    w-52
                  ">
                <li><SortItem 
                  caption="ID" field="id" 
                  sort={sort} 
                  onChangeSort={changeSort} /></li>
                <li><SortItem caption="Title" field="title" 
                  sort={sort} 
                  onChangeSort={changeSort} /></li>
                <li><SortItem caption="Author" field="author" 
                  sort={sort} 
                  onChangeSort={changeSort} /></li>
              </ul>
            </div>

          </div>
        </div>

        <div className={`h-[calc(100vh_-_8.50rem)] pr-5 overflow-y-scroll`}>
          {infPostsQuery.data?.pages.map(page => {
            
            return page.data.map(post => (
              <div className="mb-2" key={post.id} onClick={() => openShow(post.id)}>
                <div className="card card-side bg-base-100 shadow-xl">
                  <PostPhoto photo={post.photo} title={post.title} />
                  <div className="card-body">
                    <h2 className="card-title">{ post.title }</h2>
                    <p>{ post.author }</p>
                    <div className="card-actions justify-end">
                      {/* <button className="btn btn-accent">
                        <Icon path={mdiEye} size={1} />
                      </button> */}
                      <button className="btn btn-primary">
                        <Icon path={mdiPencil} size={1} />
                      </button>
                      <button className="btn btn-error">
                        <Icon path={mdiTrashCan} size={1} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))

          })}
          <div ref={loadMoreRef} className="h-3" />
          {infPostsQuery.isFetching && <LoadingComp />}
        </div>

        <div className="fixed bottom-4 right-8">
          <div className="flex flex-row">
            <button
              onClick={openCreate}
              className="
                btn btn-primary btn-circle 
                mr-1 
            ">

              <Icon path={mdiPlus} size={1} />
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}