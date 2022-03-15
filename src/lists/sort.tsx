import { partialRight } from "lodash"
import { useState } from "react"
import Icon from "@mdi/react"
import { mdiArrowDown, mdiArrowUp } from '@mdi/js'
import { setObjInCompState } from "../global/state"
import { createPropsIfNotEmpty } from "../global/create"

/** types */

export interface TSort {
  sort: string,
  order: string,
  dir: string
}

export type TSortOpts = Partial<TSort>

type TSetSort = React.Dispatch<React.SetStateAction<TSort>>

type TSortState = [TSort, TSetSort]
type TSetSortCompStateParams = { setSort: TSetSort }
export type TUseSetSort = (search: TSortOpts) => void 
type TUseSort = [TSort, TUseSetSort]

/** end types */

/** private */

function setSearchInCompState(search: TSortOpts, 
  params: TSetSortCompStateParams) {
    setObjInCompState(search, { setState: params.setSort })
}

/** end private */

/** public */

export function getQueryUrlSort(): TSortOpts {
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

export function getApiQuerySort(sort: TSortOpts = {}, state: TSortOpts = {}) {
  const xsort = sort.sort ?? state.sort ?? ''
  let order = sort.order ?? state.order ?? ''
  
  order = xsort === '' ? '' : order

  return createPropsIfNotEmpty({ '_sort': xsort, '_order': order })
}

export function changeSort(field: string, state: TSort): TSort {
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

/** end public */

/** hooks */

export function useSort(): TUseSort {
  const [sort, setSort] = useState({
    sort: '',
    order: '',
    dir: ''
  }) as TSortState

  const setSortState = partialRight(setSearchInCompState, 
    { setSort } as TSetSortCompStateParams)

  return [
    sort,
    setSortState
  ]
}

/** end hooks */
