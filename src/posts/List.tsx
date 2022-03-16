import { useEffect } from "react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { ShowSortDir } from "../components/sort"
import { useQuery } from "../global/query"
import { actionInputSearch, actionGetOnSort, 
  actionInit, useActionGetPostDebounce } from "../lists/actions"
import { useSearch } from "../lists/search"
import { useSort } from "../lists/sort"

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

  async function openCreate() {
    await Swal.fire(
      'Create Post!',
      'Create Here!',
      'success'
    )
  }
  async function openShow() {
    await Swal.fire(
      'Show Post!',
      'Show Here!',
      'success'
    )
  }
  async function openDelete() {
    await reactSwal.fire({
      title: 'Delete Post!',
      // icon: 'question',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: 'Yes!',
      cancelButtonText: 'Nope!',
      html: (
        <div>
          <h3>Create Post!</h3>
          <p>You can create a post here!</p>
          <input type="text" className="input input-bordered input-md input-primary max-w-xs" placeholder="title?" />
        </div>
      )
    })
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
        <label htmlFor="show-modal" className="btn btn-info">
          Show
        </label>
        <label htmlFor="delete-modal" className="btn !bg-red-500 border-0">
          Delete
        </label>
      </div>
      <div className="mt-5">
        <button className="btn btn-primary" onClick={openCreate}>
          Create / Edit
        </button>
        <button className="btn btn-info" onClick={openShow}>
          Show
        </button>
        <button className="btn !bg-red-500 border-0" onClick={openDelete}>
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
          <h3 className="font-bold text-lg">Modal Show!</h3>
          <p>Show Elements!</p>
          <div className="modal-action">
            <label htmlFor="show-modal" className="btn btn-primary">Ok</label>
          </div>
        </div>
      </div>

      <input type="checkbox" id="delete-modal" className="modal-toggle" />
      <div className="modal items-center">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Modal Delete!</h3>
          <p>Are you sure?</p>
          <div className="modal-action">
            <label htmlFor="delete-modal" className="btn text-white bg-red-700">Ok</label>
          </div>
        </div>
      </div>

    </div>
  )
}

export default List