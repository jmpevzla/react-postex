import React, { useState, useEffect, useCallback } from 'react';
import { debounce, cloneDeep } from 'lodash'
import { mdiArrowDown, mdiArrowUp } from '@mdi/js'
import { Icon } from '@mdi/react'
import { getPosts } from './api'

interface TSearch {
  q: string,
}

interface TSort {
  sort: string,
  order: string,
  dir: string
}

// interface TQuery {
//   q?: string,
//   sort?: string,
//   order?: string,
// }

//type TQuery = [name: string, value: string][] | []
type TQuery = Record<string, string>[] | []

type TSearchOpts = Partial<TSearch>

type TSortOpts = Partial<TSort>

type TSetSearch = React.Dispatch<React.SetStateAction<TSearch>>
type TSetSort = React.Dispatch<React.SetStateAction<TSort>>
type TSetQuery = React.Dispatch<React.SetStateAction<TQuery>>

type TSearchState = [TSearch, TSetSearch]
type TSortState = [TSort, TSetSort]
type TQueryState = [TQuery, TSetQuery]

// type TSetSearchParam = (search: TSearchOpts, params: Record<string, any>) => void
// type TSetSearchInState = (search: TSearchOpts, set: TSetSearchParam, params: Record<string, any>) => void

////
type TSetSearchCompStateParams = { oldSearch: TSearch, setSearch: TSetSearch }
type TSetSortCompStateParams = { oldSort: TSort, setSort: TSetSort }
type TSetCompStateParams<T> = { state: T, setState: React.Dispatch<React.SetStateAction<T>>}
//type TSetSearchCompState = (search: TSearchOpts, params: TSetSearchCompStateParams) => void
////

interface TActionGetPostsParams {
  xstateSearch?: TSearch,
  xsearch?: TSearchOpts,
  xstateSort?: TSort,
  xsort?: TSortOpts
}

// interface TOrqGetPostsAccessParams {
//   xsearch?: TSearchOpts
// }

function List() {
  // const stateSearch = useState({
  //   q: '',
  //   demo: 'text'
  // }) as TSearchState
  // const [search] = stateSearch

  const [search, setSearch] = useState({
    q: ''
  }) as TSearchState

  const [sort, setSort] = useState({
    sort: '',
    order: '',
    dir: ''
  }) as TSortState

  const [query, setQuery] = useState([
    {q: ''},
    {sort: ''},
    {order: ''}
  ]) as unknown as TQueryState

  /*function setSearchInCompState(xsearch: TSearchOpts, 
    params: TSetSearchCompStateParams) {
      params.setSearch({
        ...params.oldSearch,
        ...xsearch
      })
  }

  function setSortInCompState(xsort: TSortOpts, 
    params: TSetSortCompStateParams) {
      params.setSort({
        ...params.oldSort,
        ...xsort
      })
  }*/


  function setObjInCompState<T>(xState: Partial<T>, 
    params: TSetCompStateParams<T>) {
      params.setState({
        ...params.state,
        ...xState
      })
  }

  function queryAssign(xQuery: TQuery, obj: Record<string, any>) {
    for(let qry of xQuery) {
      const key = Object.keys(qry).shift() as string
      const find = Object.keys(obj).find((value) => value === key)
      if (find) {
        qry[key] = obj[key]
      }
    }
  }

  function setQueryInCompState(xState: Record<string, string>, 
    params: TSetCompStateParams<TQuery>) {
      const arrState = [...params.state]

      // for(let st of arrState) {
      //   const key = Object.keys(st).shift() as string
      //   const find = Object.keys(xState).find((value) => value === key)
      //   if (find) {
      //     st[key] = xState[key]
      //   }
      // }
      queryAssign(arrState, xState)
  
      params.setState(arrState)
  }

  function setSearchState(xSearch: TSearchOpts) {
    //setSearchInCompState(xsearch, { oldSearch: search, setSearch })
    setObjInCompState(xSearch, { state: search, setState: setSearch })
  }

  function setSortState(xSort: TSortOpts) {
    setObjInCompState(xSort, { state: sort, setState: setSort })
  }

  function setQueryState(xQuery: Record<string, string>) {
    setQueryInCompState(xQuery, { state: query, setState: setQuery })
  }

  function getQueryUrlSearch(): TSearchOpts {
    //const [xsearch, xSetSeach] = xStateSearch
    const queryString = window.location.search
    const params = new URLSearchParams(queryString)
    const q = params.get('q') || ''
    return { q }
    //xSetSeach({ ...xsearch, q })
  }

  function getQueryUrlSort(): TSortOpts {
    const queryString = window.location.search
    const params = new URLSearchParams(queryString)
    const sort = params.get('sort') || ''
    
    let order = '', dir = ''
    if (sort !== '') {
      order = params.get('order') || ''
      dir = ''

      switch(order) {
        case 'asc':
          dir = mdiArrowUp
          break
        case 'desc':
          dir = mdiArrowDown
          break
        default:
          order = 'asc'
          dir = mdiArrowUp
      } 
    } 
    
    return { sort, order, dir }
  }

  // function setQSearch(xStateSearch: TSearchState, text: string) {
  //   const [xsearch, xSetSearch] = xStateSearch
  //   xSetSearch({
  //     ...xsearch,
  //     q: text
  //   })
  // }

  function createPropIfCondition(condition: boolean, name: string, value: string) {
    return {
      ...(condition && { [name]: value })
    }  
  }

  function createPropIfNotEmpty(name: string, value: string) {
    return createPropIfCondition(value !== '' , name, value)
  }

  function getApiQuerySearch(search: TSearchOpts = {}, state: TSearchOpts = {}) {
    const q = search.q ?? state.q ?? ''
    
    return {
      ...createPropIfNotEmpty('q', q)
    }
  }

  function getApiQuerySort(sort: TSortOpts = {}, state: TSortOpts = {}) {
    const xsort = sort.sort ?? state.sort ?? ''
    let order = sort.order ?? state.order ?? ''
    
    order = xsort === '' ? '' : order

    return {
      ...createPropIfNotEmpty('_sort', xsort),
      ...createPropIfNotEmpty('_order', order)
    }
  }

  //function createApiQueryObject(queries: Record<string, String | number>[] = []) {
  function createApiQueryObject(...queries: Record<string, String | number>[]) {
    let objQueries = {}
    for(const query of queries) {
      objQueries = Object.assign(objQueries, query)
    }
    
    return objQueries
  }

  async function actionGetPost({ xstateSearch, xsearch, xstateSort, xsort }: TActionGetPostsParams) {
    const searchQuery = getApiQuerySearch(xsearch, xstateSearch)
    const sortQuery = getApiQuerySort(xsort, xstateSort)
    const query = createApiQueryObject(searchQuery, sortQuery)
    const response = await getPosts(query)
    console.log(response?.data, response?.request.responseURL)
    return response
  }

  // async function actionGetPostAccess({ xsearch }: TOrqGetPostsAccessParams) {
  //   const response = await actionGetPost({
  //     xsearch: xsearch || {},
  //     xstateSearch: stateSearch
  //   })
  //   console.log(response)
  //   return response
  // }

  useEffect(() => {
    //console.log(search)
  })

  useEffect(() => {
    const paramsSearch = getQueryUrlSearch()
    setSearchState(paramsSearch)

    const paramsSort = getQueryUrlSort()
    setSortState(paramsSort)

    // setQueryState({
    //   ...paramsSearch,
    //   ...omit(paramsSort, 'dir')
    // })

    setQueryState({
      ...paramsSearch,
      ...paramsSort
    })

    async function init() {
      await actionGetPost({
        xsearch: paramsSearch,
        xsort: paramsSort
      })
    }
    init()
  }, [])

  // function setParamIfNotEmpty(UrlSP: URLSearchParams, name: string, param: string): void {
  //   param !== '' ? UrlSP.set(name, param) : UrlSP.delete(name)
  // }
  
  // function newQueryToParams(query: TQuery): URLSearchParams {
  //   const UrlSP = new URLSearchParams()
  //   const xquery: Record<string, string> = query as any
  //   for(let key in xquery) {
  //     setParamIfNotEmpty(UrlSP, key, xquery[key])
  //   }
  //   return UrlSP
  // }

  // function setQuerySearchToParams(UrlSP: URLSearchParams, xsearch: TSearch): void {
  //   setParamIfNotEmpty(UrlSP, 'q', xsearch.q)
  // }

  // function setQuerySortToParams(UrlSP: URLSearchParams, xsort: TSort): void {
  //   setParamIfNotEmpty(UrlSP, 'sort', xsort.sort)
  //   setParamIfNotEmpty(UrlSP, 'order', xsort.order)
  // }

  function getMixQuery(obj: Record<string, any>, stateQuery: TQuery): TQuery {
    const _query = [...stateQuery]//cloneDeep(stateQuery)

    // for (let qry of _query) {
    //   const key = Object.keys(qry).shift() as string
    //   const find = Object.keys(obj).find(value => value === key)
    //   if (find) {
    //     qry[key] = obj[key]
    //   }
    // }
    queryAssign(_query, obj)

    return _query
  }

  //function setParamsToQueryBar(UrlSP: URLSearchParams) {
  // function setParamsToQueryBar(xquery: TQuery, {
  //   search = {}, sort = {}
  // }: { search?: TSearchOpts, sort?: TSortOpts } = {}) {
  function setParamsToQueryBar(xquery: TQuery) {
    const path = window.location.pathname 
    
    // const UrlSP = new URLSearchParams()
    // setQuerySearchToParams(UrlSP, { q : search?.q || xquery.q || '' })
    // setQuerySortToParams(UrlSP, { 
    //   sort : sort?.sort || xquery.sort || '', 
    //   order: sort?.order || xquery.order || '',
    //   dir: '' 
    // })

    const UrlSP = new URLSearchParams()

    for(let qry of xquery) {
      const key = Object.keys(qry).shift() as string
      qry[key] !== '' ? UrlSP.set(key, qry[key]) : null
    }

    if (UrlSP.toString() !== '') {
      window.history.replaceState({}, '', path + '?' + UrlSP.toString())  
    } else {
      window.history.replaceState({}, '', path)  
    }
  }

  const actionGetPostDeb = useCallback(debounce(actionGetPost, 500), []) // hay que pasar todos los estados via debounce
  
  function getInputEventValue(ev: React.FormEvent<HTMLInputElement>) {
    return ev.currentTarget.value 
  }

  async function onInputSearch(ev: React.FormEvent<HTMLInputElement>) {
    const q = getInputEventValue(ev)
    setSearchState({ q })
    
    //const UrlSP = newQueryToParams(query)
    //setQuerySearchToParams(UrlSP, { q })
    const xquery = getMixQuery({ q }, query)
    setParamsToQueryBar(xquery)
    setQueryState({ q })

    await actionGetPostDeb({
      // xstateSearch: search,
      xsearch: { q },
      xstateSort: sort
    })
  }


  function changeSort(field: string, state: TSort): TSort {
    let sort = '', order = '', dir = ''
    if (field !== state.sort) {
      sort = field
      order = 'asc'
      dir = mdiArrowUp
    } else if (state.order === 'asc') {
      sort = field
      order = 'desc'
      dir = mdiArrowDown
    } 

    return { sort, order, dir }
  }

  function getOnSortClick(field: string) {
    return async function (_ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      const xsort = changeSort(field, sort)
      setSortState(xsort)

      //const UrlSP = newQueryToParams(query)
      //setQuerySortToParams(UrlSP, xsort)
      const xquery = getMixQuery(xsort, query)
      setParamsToQueryBar(xquery)
      setQueryState({
        sort: xsort.sort,
        order: xsort.order
      })
  
      await actionGetPost({
        xstateSearch: search,
        //xstateSort: sort,
        xsort
      })  
    }
  }


  function ShowSortDir({ fieldState = '', field = '', sortDir = '' } = {}) {
    return (
      <>
        { fieldState !== '' && fieldState === field && sortDir !== '' &&
          <Icon path={sortDir} size="1rem" />
        }
      </>
    )
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
    </div>
  )
}

export default List