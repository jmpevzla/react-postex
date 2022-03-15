import { useState } from 'react'
import { partialRight } from 'lodash'
import { setObjInCompState } from '../global/state'
import { createPropsIfNotEmpty } from '../global/create'

/** types */

export interface TSearch {
  q: string,
}

export type TSearchOpts = Partial<TSearch>

type TSetSearch = React.Dispatch<React.SetStateAction<TSearch>>
type TSearchState = [TSearch, TSetSearch]

type TSetSearchCompStateParams = { setSearch: TSetSearch }
export type TUseSetSearch = (search: TSearchOpts) => void
type TUseSearch = [TSearch, TUseSetSearch]

/** end types */

/** private */

function setSearchInCompState(search: TSearchOpts, 
  params: TSetSearchCompStateParams) {
    setObjInCompState(search, { setState: params.setSearch })
}

/** end private */

/** public */

export function getQueryUrlSearch(): TSearchOpts {
  const queryString = window.location.search
  const params = new URLSearchParams(queryString)
  const q = params.get('q') || ''
  return { q }
}

export function getApiQuerySearch(search: TSearchOpts = {}, state: TSearchOpts = {}) {
  const q = search.q ?? state.q ?? ''
  
  return createPropsIfNotEmpty({ q })
}

/** end public */

/** hooks */

export function useSearch(): TUseSearch {
  const [search, setSearch] = useState({
    q: ''
  }) as TSearchState

  const setSearchState = partialRight(setSearchInCompState, 
    { setSearch } as TSetSearchCompStateParams)

  return [
    search,
    setSearchState
  ]
}

/** end hooks */