import { useEffect, useRef, useState
  , Fragment } from "react"
import { useQueryClient } from "react-query"
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
import { getMixQuery, loadHashParams
  , setParamsToQueryBar } from "@/code/queryBar"
import { useSearch } from "@/hooks/lists/useSearch"
import { useCupdatePost, useDeletePost
  , useInfPosts, usePostId, useUploadPhotoPost } from "@/hooks/rq/posts-hrq"
import { useQueryBar } from "@/hooks/lists/useQueryBar"
import { useDebounce } from "@/hooks/useDebouce"
import SortItem from "@/components/SortItem"
import { useSort } from "@/hooks/lists/useSort"
import { getApiQuerySort, getQueryUrlSort
  , TSort, TSortOpts } from "@/code/lists/sort"
import { TCupdatePostFunc, TPost, TUpdatePhotoFunc } from "@/types/posts-types"
import PostPhoto from "@/components/PostPhoto";
import useInsObs from "@/hooks/useInsObs"
import LoadingComp from "@/components/LoadingComp"
import { createEditForm, showDelete, showError
  , showForm, showSuccess } from "@/extras/swal-extras"
import PostDelete from "@/components/PostDelete"
import PostsError from "@/components/PostsError"

export default Home
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
  const queryClient = useQueryClient()
  const cupdatePost = useCupdatePost(queryClient)
  const uploadPhotoPost = useUploadPhotoPost(queryClient)

  function preparePostForm(idPost: number = 0) { //post?: TPost) {
    
    const onCupdate: TCupdatePostFunc = (values, photo, dispatchConfirmEvent, setError) => {
      cupdatePost.mutate(values, {
        onSuccess: (data) => {
          showSuccess((values.id ? 'Edit' : 'Create') + ' Post Successful')
          if (!values.id && photo) {
            uploadPhotoPost.mutate({ id: data.id, photo }, {
              onSuccess: () => {
                dispatchConfirmEvent(true)    
              }, onError: (error) => {
                setError(error.message)
                dispatchConfirmEvent(false)
              }
            })
          } else {
            dispatchConfirmEvent(true)
          }
        }, onError: (error) => {
          setError(error.message)
          dispatchConfirmEvent(false)
        }
      })
    }

    const onUploadPhoto: TUpdatePhotoFunc = (id, photo, setPhoto, setError) => {
      uploadPhotoPost.mutate({ id, photo }, {
        onSuccess: (data) => {
          setPhoto(data.photo)
        },
        onError: (error) => {
          setError(error.message)
        }
      })
    }
      
    createEditForm({
      id: idPost,
      title: 'Post',
      html: (<PostForm idPost={idPost} 
        onCupdate={onCupdate} 
        onUploadPhoto={onUploadPhoto} 
        setPostQuery={setPostIdEditQuery}
        />)
    })

  }

  const setPostIdEditQuery = usePostId()
  
  function preparePostShow(idPost: number) {
    showForm({
      id: idPost,
      title: 'Post',
      html: (<Post idPost={idPost}
                setPostQuery={setPostIdShowQuery} />),
      onEdit: () => openEdit(idPost),
      onDelete: (post: TPost) => onDeletePost(post)
    })
  }
  
  const setPostIdShowQuery = usePostId()

  const deletePost = useDeletePost(queryClient)

  useEffect(() => {
    let paramsSearch: TSearchOpts = getQueryUrlSearch()
    setSearch(paramsSearch)

    let paramsSort: TSortOpts = getQueryUrlSort()
    setSort(paramsSort)
    
    setQueryBar({
      ...paramsSearch,
      ...paramsSort
    })

    loadHashParams('create', openCreate)
    loadHashParams('edit', openEdit)
    loadHashParams('show', openShow)

    enabledInfQueryRef.current = true
    
    prepareGetPost({
      xsearch: paramsSearch,
      xsort: paramsSort
    })
    
  }, [])

  function openCreate() {
    preparePostForm()
  }

  function openEdit(postId: number) {
    preparePostForm(postId)
  }

  function openShow(postId: number) {
    preparePostShow(postId)
  }

  function onDeletePost(post: TPost) {
    showDelete({
      title: 'Post',
      html: (<PostDelete post={post} />),
      onDelete: () => {
        deletePost.mutate(post.id, {
          onSuccess: () => {
            showSuccess('Post Deleted Successful!')
          },
          onError: (error) => {
            showError(error.message)
          }
        })
      }
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
                w-full bg-input text-txt
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

        <div className={`h-[calc(100vh_-_8.50rem)] pr-5 overflow-y-auto`}>
          {infPostsQuery.data?.pages.map(page => {
            
            return page.data.map(post => (
              <Fragment key={post.id}>
                
                <div className="mb-2 lg:hidden" onClick={() => openShow(post.id)}>
                  <div className="
                    card card-compact card-side 
                    w-full bg-base-100 shadow-xl pl-2">
                    <PostPhoto photo={post.photo} title={post.title} size="100px" />
                    <div className="card-body !py-3 !px-2">
                      <h2 className="card-title break-all">{ post.title }</h2>
                      <p className="break-all">{ post.author }</p>
                      <div className="card-actions justify-end">
                        <div className="inline-block" onClick={(ev) => ev.stopPropagation()}>
                          <button className="btn btn-primary mr-2 h-8 min-h-8" onClick={() => openEdit(post.id)}>
                            <Icon path={mdiPencil} size={0.75} />
                          </button>
                          <button className="btn btn-error h-8 min-h-8" onClick={() => onDeletePost(post)}>
                            <Icon path={mdiTrashCan} size={0.75} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-2 hidden lg:block" onClick={() => openShow(post.id)}>
                  <div className="card card-side bg-base-100 shadow-xl">
                    <PostPhoto photo={post.photo} title={post.title} />
                    <div className="card-body">
                      <h2 className="card-title">{ post.title }</h2>
                      <p>{ post.author }</p>
                      <div className="card-actions justify-end">
                        <div className="inline-block" onClick={(ev) => ev.stopPropagation()}>
                          <button className="btn btn-primary mr-1" onClick={() => openEdit(post.id)}>
                            <Icon path={mdiPencil} size={1} />
                          </button>
                          <button className="btn btn-error" onClick={() => onDeletePost(post)}>
                            <Icon path={mdiTrashCan} size={1} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </Fragment>
            ))

          })}
          {infPostsQuery.isError ? 
            <PostsError error={infPostsQuery.error.message} refetch={infPostsQuery.refetch} />
          :
            <>
              <div ref={loadMoreRef} className="h-3" />
              {infPostsQuery.isFetching && <LoadingComp />}
            </>
          }
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