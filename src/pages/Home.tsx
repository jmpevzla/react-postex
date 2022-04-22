import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { mdiPencil, mdiTrashCan, mdiPlus
  , mdiEye } from "@mdi/js"
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

export default Home

const reactSwal = withReactContent(Swal)

type TPost = any
interface TPrepareGetPostsParams {
  xstateSearch?: TSearch,
  xsearch?: TSearchOpts,
  xstateSort?: any, //TSort,
  xsort?: any //TSortOpts
}

function Home() {
  const [ query, setQueryState ] = useQueryBar([
    ['q', ''],
    ['sort', ''],
    ['order', '']
  ])
  const [search, setSearch] = useSearch()
  //const [search, setSearch] = useSearch()
  const [queryApi, setQueryApi] = useState<Record<string, string>>({})
  const infPostsQuery = useInfPosts(queryApi)

  function prepareGetPost({ xstateSearch, xsearch, xstateSort, xsort }: TPrepareGetPostsParams) {
    const searchQuery = getApiQuerySearch(xsearch, xstateSearch)
    //const sortQuery = getApiQuerySort(xsort, xstateSort)
    const query = createApiQueryObject(searchQuery, {}) //sortQuery)
    setQueryApi(query)
  }
  const prepareGetPostDeb = useDebounce(prepareGetPost)
  
  useEffect(() => {
    let paramsSearch : TSearchOpts = getQueryUrlSearch()
    setSearch(paramsSearch)

  // let paramsSort : TSortOpts = getQueryUrlSort()
  // setSort(paramsSort)
  // if (setSort) {
  //   setSort(paramsSort)
  // } else {
  //   paramsSort = undefined
  // }

    // setQuery({
    //   ...paramsSearch,
    //   ...paramsSort
    // })

    prepareGetPost({
      xsearch: paramsSearch,
      //xsort: paramsSort
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
    
    const res = { data: { id, title: 'TEST', author: 'TEST' } }//await getPost(id)
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

  async function onInputSearch(ev: React.FormEvent<HTMLInputElement>) {
    const q = getInputEventValue(ev)
    setSearch({ q })
    
    const xquery = getMixQuery({ q }, query.current)
    setParamsToQueryBar(xquery)
    
    prepareGetPostDeb({
      xsearch: { q },
      //xstateSort: sort
    })
  }

  return (
    <MainLayout>
      <div className="lg:mx-28">
        <div className="mb-3">
          <div className="lg:mx-36">
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
          </div>
        </div>

        <div className={`h-[calc(100vh_-_8.15rem)] pr-5 overflow-y-scroll`}>
          {infPostsQuery.data?.pages.map(page => {
            return page.data.map(post => (
              <div className="mb-2" key={post.id} onClick={() => openShow(post.id)}>
                <div className="card card-side bg-base-100 shadow-xl">
                  <figure><img src="https://api.lorem.space/image/movie?w=150&h=210" alt="Movie" /></figure>
                  <div className="card-body">
                    <h2 className="card-title">New post!</h2>
                    <p>Author</p>
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