import { useCallback } from 'react'
import { debounce } from 'lodash'
import { getApiQuerySearch, getQueryUrlSearch, TSearch, TSearchOpts, TUseSetSearch } from './search'
import { changeSort, getApiQuerySort, getQueryUrlSort, TSort, TSortOpts, TUseSetSort } from './sort'
import { createApiQueryObject } from '../global/create'
import { getPosts } from '../posts/api'
import { getMixQuery, setParamsToQueryBar, TQuery, TUseSetQuery } from '../global/query'
import { getInputEventValue } from '../global/event'

/** types */

interface TActionGetPostsParams {
  xstateSearch?: TSearch,
  xsearch?: TSearchOpts,
  xstateSort?: TSort,
  xsort?: TSortOpts
}

interface TInitParams {
  setSearch: TUseSetSearch, 
  setSort: TUseSetSort, 
  setQuery: TUseSetQuery
}

/** end types */

/** public */

export async function actionGetPost({ xstateSearch, xsearch, xstateSort, xsort }: TActionGetPostsParams) {
  const searchQuery = getApiQuerySearch(xsearch, xstateSearch)
  const sortQuery = getApiQuerySort(xsort, xstateSort)
  const query = createApiQueryObject(searchQuery, sortQuery)
  const response = await getPosts(query)
  console.log(response?.data, response?.request.responseURL)
  //return response
}

export async function actionInit({ setSearch, setSort, setQuery }: TInitParams) {
  let paramsSearch : TSearchOpts = getQueryUrlSearch()
  setSearch(paramsSearch)
  // if (setSearch) {
  //   setSearch(paramsSearch)
  // } else {
  //   paramsSearch = undefined
  // }

  let paramsSort : TSortOpts = getQueryUrlSort()
  setSort(paramsSort)
  // if (setSort) {
  //   setSort(paramsSort)
  // } else {
  //   paramsSort = undefined
  // }

  setQuery({
    ...paramsSearch,
    ...paramsSort
  })

  // setQuery ? setQuery({
  //   ...paramsSearch,
  //   ...paramsSort
  // }) : null

  await actionGetPost({
    xsearch: paramsSearch,
    xsort: paramsSort
  })  
}

export async function actionInputSearch({
  ev,
  setSearch,
  setQuery,
  query,
  actionGetPostDeb,
  sort
}: {
  ev: React.FormEvent<HTMLInputElement>,
  setSearch: TUseSetSearch,
  setQuery: TUseSetQuery,
  query: React.MutableRefObject<TQuery>,
  actionGetPostDeb: (params: TActionGetPostsParams) => Promise<void> | undefined,
  sort: TSort
}) {
  
  const q = getInputEventValue(ev)
  setSearch({ q })
   
  const xquery = getMixQuery({ q }, query.current)
  setParamsToQueryBar(xquery)
  setQuery({ q })

  await actionGetPostDeb({
    xsearch: { q },
    xstateSort: sort
  })
  
}

export function actionGetOnSort({ 
  sort,
  setSort,
  query,
  setQuery,
  search
} : {
  sort: TSort,
  setSort: TUseSetSort,
  query: React.MutableRefObject<TQuery>,
  setQuery: TUseSetQuery,
  search: TSearch
}) {
  return function getOnSortClick(field: string) {
    return async function (_ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      const xsort = changeSort(field, sort)
      setSort(xsort)

      const xquery = getMixQuery(xsort, query.current)
      setParamsToQueryBar(xquery)
      setQuery({
        sort: xsort.sort,
        order: xsort.order
      })

      await actionGetPost({
        xstateSearch: search,
        xsort
      })  
    }
  }
}

/** end public */

/** hooks */

export function useActionGetPostDebounce(delay = 500) {
  const actionGetPostDeb = useCallback(debounce(actionGetPost, delay), []) // hay que pasar todos los estados via debounce

  return actionGetPostDeb
}

/** end hooks */
