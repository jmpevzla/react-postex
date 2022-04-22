import { useState } from 'react'
import { partialRight } from 'lodash'
import { setObjInCompState } from '@/code/state'
import { TSearch, TSearchOpts } from '@/code/lists/search'

export type TSetSearch = React.Dispatch<React.SetStateAction<TSearch>>
export type TSearchState = [TSearch, TSetSearch]

export type TUseSetSearch = (search: TSearchOpts) => void
export type TUseSearch = [TSearch, TUseSetSearch]
type TSetSearchCompStateParams = { setSearch: TSetSearch }

function setSearchInCompState(search: TSearchOpts, 
  params: TSetSearchCompStateParams) {
    setObjInCompState(search, { setState: params.setSearch })
}

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