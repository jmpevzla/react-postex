import { useEffect, useState, useRef, ChangeEvent } from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { useLocation } from "wouter"
import { ShowSortDir } from "@/components/sort"
import { TQuery, useQuery } from "@/global/query"
import { actionInputSearch, actionGetOnSort, 
  actionInit, useActionGetPostDebounce } from "@/lists/actions"
import { useSearch } from "@/lists/search"
import { useSort } from "@/lists/sort"
import { cupdatePost, deletePost, getPost, getPosts, logout, upload } from "./api"
import Post from "./components/Post"
import PostForm from "./components/PostForm"
import { themeChange } from 'theme-change'
import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange';
import {
  useQuery as useRQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from 'react-query'
import { AxiosResponse } from "axios"
import { clearUserAction, userContext } from '@/ContextUser'
import { useContext } from "react"

const reactSwal = withReactContent(Swal)

function usePosts(queryObj: Record<string, string>) {
  return useRQuery(['posts', queryObj], async () => {
    const { data } = await getPosts(queryObj) as AxiosResponse
    const xdata = data.map((value: any) => {
      return {
        ...value,
        photo: value.photo ? 'http://localhost:4000/' + value.photo : null
      }
    })
    return xdata
  }, {
    //initialData: [], //in cache
    placeholderData: [],
    //staleTime: Infinity,
    staleTime: 60000, // (1000 = 1s) * 60 = 1m
    //refetchOnWindowFocus: false,
    //enabled: false
  }) 
}

function usePostsMutation(queryClient: QueryClient) {
  return useMutation((editTodo: TPost) => {
    return cupdatePost(editTodo)
  }, {
    //retry,
    //retryDelay,
    onSuccess: () => {
      queryClient.invalidateQueries('posts')
    },
  })
}

function List() {
  const [ search, setSearchState ] = useSearch()

  const [ sort, setSortState ] = useSort()

  const [ query, setQueryState ] = useQuery([
    ['q', ''],
    ['sort', ''],
    ['order', '']
  ])

  const actionGetPostDeb = useActionGetPostDebounce()

  const [, setLoc] = useLocation()
  const [ stPost, setStPost ] = useState({ id: 0, title: '', author: '' }) as unknown as [TPost, React.Dispatch<React.SetStateAction<TPost>>]
  const refDeleteModal = useRef(null) as unknown as React.MutableRefObject<HTMLInputElement>
  const [ photo, setPhoto ] = useState({
    preview: '',
    name: '',
    file: null
  } as {
    preview: string,
    name: string,
    file: File | null
  })
  const [ list, setList ] = useState([] as [{
    id: number,
    title: string,
    author: string,
    photo: string | null
  }] | []) 
  
  const queryClient = useQueryClient()
  const [ queryApi, setQueryApi ] = useState({} as Record<string, string>)
  const postsQuery = usePosts(queryApi)
  const postsMut = usePostsMutation(queryClient)

  const [user, userDispatch] = useContext(userContext)!

  // async function refetchPosts() {
  //   const query = await postsQuery.refetch()
  //   const xdata = query.data.map((value: any) => {
  //     return {
  //       ...value,
  //       photo: value.photo ? 'http://localhost:4000/' + value.photo : null
  //     }
  //   })
  //   setList(xdata)
  // }

  // async function refetchPosts() {
  //   const query = await postsQuery.refetch()
  //   setList(query.data)
  // }

  useEffect(() => {
    setList(postsQuery.data)
  }, [postsQuery.data])

  useEffect(() => {
    // actionInit({
    //   setSearch: setSearchState,
    //   setSort: setSortState,
    //   setQuery: setQueryState
    // })

    async function init() {
      // const res = await getPosts({})
      // const data = res?.data.map((value: any) => {
      //   return {
      //     ...value,
      //     photo: value.photo ? 'http://localhost:4000/' + value.photo : null
      //   }
      // })
      // setList(data)
      // const query = postsQuery
      //refetchPosts({})
    }
    init()

    themeChange(false)
  }, [])

  function onInputSearch(ev: React.FormEvent<HTMLInputElement>) {
    actionInputSearch({
      ev,
      setSearch: setSearchState,
      setQuery: setQueryState,
      query,
      sort,
      actionGetPostDeb
    })
  }

  const getOnSortClick = actionGetOnSort({
    search,
    query,
    setQuery: setQueryState,
    sort,
    setSort: setSortState
  })

  ///
  function randomId() {
    let randomId = 0
    while (randomId < 2) {
      randomId = Math.ceil((Math.random() * 100)) % 7
    }
    return randomId
  }

  async function showPost(id: number) {
    const res = await getPost(id)
    const post: TPost = res?.data 

    setStPost(post)
  }

  async function deleteConfirmPost(id: number) {
    const res = await getPost(id)
    const post: TPost = res?.data 

    setStPost(post)
  }

  async function xDeletePost(id: number) {
    const res = await deletePost(id)
   
    if (res?.status == 200) {
      const checked = refDeleteModal.current.checked
      refDeleteModal.current.checked = !checked
      
      return setStPost({
        id: 0,
        title: '',
        author: '',
        photo: null
      })
    }

    Swal.fire('error', 'Try again!', 'error')
  }

  async function openCreate() {
    // await Swal.fire(
    //   'Create Post!',
    //   'Create Here!',
    //   'success'
    // )

    showPostForm()
  }
  async function openShow(id: number) {
    
    const res = await getPost(id)
    const post: TPost = res?.data 

    await reactSwal.fire({
      title: 'Show Post!',
      html: (<Post post={post} />)
    })
  }

  async function openDelete(id: number) {
    const res = await getPost(id)
    const post: TPost = res?.data 

    onDelete(post)
  }
  async function onDelete(post: TPost) {
    const response = await reactSwal.fire({
      title: 'Delete Post!',
      html: (<Post post={post} />),
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    })

    if (response.isConfirmed) {
      const res = await deletePost(post.id)
   
      if (res?.status == 200) {
        return Swal.fire('OK', 'Post Deleted!', 'success')  
      }

      await Swal.fire('error', 'Try again!', 'error')
      onDelete(post)
    }
  }

  async function showPostForm({ post = null }: { post?: TPost | null } = {}) {
    await reactSwal.fire({
      title: `${ post && post.id > 0 ? 'Edit' : 'Create'} Post`,
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

  async function openEdit(id: number) {
    const res = await getPost(id)
    const post: TPost = res?.data 

    showPostForm({ post })
  }

  async function onLogout() {
    const res = await logout()

    if(res.ok) {
      window.localStorage.removeItem('postex-token')
      
      userDispatch({ type: clearUserAction })
      
      return setLoc('/login')
    }
    
    Swal.fire({
      title: 'Error!',
      icon: 'error',
      toast: true,
      text: res.error,
      timer: 2000,
      position: 'top',
      timerProgressBar: true,
      showConfirmButton: false
    })
  }

  async function onSubmitPhoto(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    
    if (photo.file) {
      const res = await upload(3, photo.file)
      if (res.ok) {
        Swal.fire({
          title: 'Upload Complete!',
          icon: 'success',
          toast: true,
          text: 'The photo was uploaded correctly!',
          timer: 2000,
          position: 'top',
          timerProgressBar: true,
          showConfirmButton: false
        })

      } else {
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          toast: true,
          text: res.error,
          timer: 2000,
          position: 'top',
          timerProgressBar: true,
          showConfirmButton: false
        })
      }
    }
  }

  function onChangePhoto(ev: ChangeEvent<HTMLInputElement>) {
    const files = ev.currentTarget.files 
    URL.revokeObjectURL(photo.preview)
    if (files && files.length > 0) {
      let ok = true
      switch(files[0].type) {
        case 'image/jpeg':
          break
        case 'image/png':          
          break
        case 'image/gif':
          break
        case 'image/svg+xml':
          break
        default:
          ok = false
      }

      if (ok) {
        const url = URL.createObjectURL(files[0])
        setPhoto({
          preview: url,
          name: files[0].name,
          file: files[0]
        })
      } else {
        setPhoto({
          name: '',
          preview: '',
          file: null
        })
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: 'File is not valid!'
        })
      }
    }
  }

  function onTheme(ev: any) {
    setList(list => {
      const xlist = [...list]
      xlist.splice(0, 1)
      const first = list[0]!
      xlist.push({
        ...first,
        title: 'MODIFIED!',
        photo: 'http://localhost:4000/uploads/photo-1647904671105-249559290 (copy 11).jpg'
      })
      return xlist as any
    })
  }

  async function onSearchAll() {
    setQueryApi({})
    //await postsQuery.refetch()
  }

  async function onSearchNeed() {
    setQueryApi({ q: 'sega' })
  }

  async function onMutate() {
    //const res = await postsMut.mutateAsync({
    postsMut.mutate({
      "title": "Rush 2049",
      "author": "Sega Dreamcast",
      "id": 3,
      "photo": "uploads/photo-1647904671105-249559290 (copy 2).jpg"
    })
    // queryClient.invalidateQueries(['posts'], {
    //   //exact: true
    // })
  }

  return (
    <div>
      <div className="mb-2">
        <label htmlFor="search" className="font-bold">
          Search:
        </label>
        <input
          className="border p-2 border-gray-500 w-full"
          id="search"
          type="text"
          value={search.q}
          onInput={onInputSearch}
        />
      </div>
      <div className="grid grid-cols-2">
        <div>
          <h2>User: { user?.name }</h2>
          <div>
            <h2 className="font-bold">Sort</h2>
            <button className="btn btn-primary" onClick={getOnSortClick('id')}>
              <span>ID</span> 
              <ShowSortDir fieldState={sort.sort} field="id" sortDir={sort.dir} />
            </button>
            <button className="btn btn-secondary" onClick={getOnSortClick('title')}>
              <span>Title</span> 
              <ShowSortDir fieldState={sort.sort} field="title" sortDir={sort.dir} />
            </button>
            <button className="btn btn-info" onClick={getOnSortClick('author')}>
              <span>Author</span>
              <ShowSortDir fieldState={sort.sort} field="author" sortDir={sort.dir} />
            </button>
          </div>
          
          {/* daisyUI */}
          <div className="mt-5">
            <label htmlFor="post-modal" className="btn btn-primary">
              Create / Edit
            </label>
            <label htmlFor="show-modal" className="btn btn-info" onClick={() => showPost(randomId())}>
              Show
            </label>
            <label htmlFor="delete-modal" className="btn !bg-red-500 border-0" onClick={() => deleteConfirmPost(randomId())}>
              Delete
            </label>
          </div>
          {/* SwalAlert */}
          <div className="mt-5">
            <button className="btn btn-primary" onClick={openCreate}>
              Create
            </button>
            <button className="btn btn-primary" onClick={() => openEdit(randomId())}>
              Edit
            </button>
            <button className="btn btn-info" onClick={() => openShow(randomId())}>
              Show
            </button>
            <button className="btn !bg-red-500 border-0" onClick={() => openDelete(randomId())}>
              Delete
            </button>
          </div>
          <div>
            <button className="btn !bg-black text-white border-0" onClick={onLogout}>
              Logout
            </button>
          </div>
          <button className="btn btn-primary" onClick={onTheme} data-toggle-theme="light,dark" data-act-class="btn-error">
            change theme
          </button>

          <div className="flex flex-row mt-4">
            <button className="btn btn-primary" onClick={onSearchAll}>
              Search All
            </button>
            <button className="btn btn-primary" onClick={onSearchNeed}>
              Search Sega
            </button>
            <button className="btn btn-primary" onClick={onMutate}>
              Mutate to Sega
            </button>
          </div>
          
          <form className="mt-3" onSubmit={onSubmitPhoto}>
              {photo.preview && <div className="mb-2">
                <label htmlFor="file">
                  <img alt="photo" src={photo.preview} className="w-32" />
                  <p>{photo.name}</p>
                </label>
              </div>}
              <div className="form-group">
                <input id="file" type="file" className="form-control-file hidden" 
                  name="photo" onChange={onChangePhoto} 
                  accept=".jpg,.gif,.svg,.png" title="" value="" />
                <label htmlFor="file" className="btn btn-info">Select Photo</label>
              </div>
              <input type="submit" value="Upload!" className="btn btn-default" />            
          </form>
        </div>
        <div>
          { list.map(post =>(
            <div key={post.id} className="card card-side bg-base-100 shadow-xl mb-2">
              {post.photo && (
                <figure>
                  <img data-src={post.photo} alt="Game" className="lazyload"
                    style={{objectFit: "cover", height: '200px', width: '200px'}}
                     />
                </figure>
              )}
              <div className="card-body">
                <h2 className="card-title">{post.title}</h2>
                <p>{post.author}</p>
                <div className="card-actions justify-end">
                  {/*<button className="btn btn-primary">Show</button>
                   <button className="btn btn-secondary">Edit</button>
                  <button className="btn btn-error">Delete</button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <input type="checkbox" id="post-modal" className="modal-toggle" />
      <div className="modal items-center">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Modal Create!</h3>
          <p>New Post Elements!</p>
          <div className="modal-action">
            <label htmlFor="post-modal" className="btn btn-primary">Ok</label>
          </div>
        </div>
      </div>

      <input type="checkbox" id="show-modal" className="modal-toggle" />
      <div className="modal items-center">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-center">Show Post!</h3>
          <Post post={stPost} />
          <div className="modal-action">
            <label htmlFor="show-modal" className="btn btn-primary">Ok</label>
          </div>
        </div>
      </div>

      <input type="checkbox" id="delete-modal" className="modal-toggle" ref={refDeleteModal} />
      <div className="modal items-center">
        <div className="modal-box">
          <h3 className="font-bold text-3xl text-red-600 text-center">Delete Post!</h3>
          <Post post={stPost} />
          <p className="text-center text-xl font-bold">Are you sure?</p>
          <div className="modal-action">
            <label htmlFor="delete-modal" className="btn text-white ">Cancel</label>
            <button className="btn text-white bg-red-700"
              onClick={() => xDeletePost(stPost.id)}>Ok</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default List