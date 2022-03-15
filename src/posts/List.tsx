import { useEffect } from "react"
import { ShowSortDir } from "../components/sort"
import { useQuery } from "../global/query"
import { actionInputSearch, actionGetOnSort, 
  actionInit, useActionGetPostDebounce } from "../lists/actions"
import { useSearch } from "../lists/search"
import { useSort } from "../lists/sort"

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
    </div>
  )
}

export default List