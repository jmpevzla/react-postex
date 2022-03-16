import { useEffect, useState, useRef } from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { ShowSortDir } from "../components/sort"
import { useQuery } from "../global/query"
import { actionInputSearch, actionGetOnSort, 
  actionInit, useActionGetPostDebounce } from "../lists/actions"
import { useSearch } from "../lists/search"
import { useSort } from "../lists/sort"
import { deletePost, getPost } from "./api"
import Post from "./components/Post"

const reactSwal = withReactContent(Swal)

function List() {
  const [ search, setSearchState ] = useSearch()

  const [ sort, setSortState ] = useSort()

  const [ query, setQueryState ] = useQuery([
    ['q', ''],
    ['sort', ''],
    ['order', '']
  ])

  const actionGetPostDeb = useActionGetPostDebounce()

  const [ stPost, setStPost ] = useState({ id: 0, title: '', author: '' }) as unknown as [TPost, React.Dispatch<React.SetStateAction<TPost>>]
  const refDeleteModal = useRef(null) as unknown as React.MutableRefObject<HTMLInputElement>

  useEffect(() => {
    actionInit({
      setSearch: setSearchState,
      setSort: setSortState,
      setQuery: setQueryState
    })
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
        author: ''
      })
    }

    Swal.fire('error', 'Try again!', 'error')
  }

  async function openCreate() {
    await Swal.fire(
      'Create Post!',
      'Create Here!',
      'success'
    )
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

    const response = await reactSwal.fire({
      title: 'Delete Post!',
      html: (<Post post={post} />),
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    })

    if (response.isConfirmed) {
      const res = await deletePost(id)
   
      if (res?.status == 200) {
        return Swal.fire('OK', 'Post Deleted!', 'success')  
      }

      Swal.fire('error', 'Try again!', 'error')
    }

    console.log(response)
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
      <div className="mt-5">
        <button className="btn btn-primary" onClick={openCreate}>
          Create / Edit
        </button>
        <button className="btn btn-info" onClick={() => openShow(randomId())}>
          Show
        </button>
        <button className="btn !bg-red-500 border-0" onClick={() => openDelete(randomId())}>
          Delete
        </button>
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