import { createPropsIfNotEmpty } from "../create"

export interface TSort {
  sort: string,
  order: string
}

export type TSortOpts = Partial<TSort>

export function getQueryUrlSort(): TSortOpts {
  const queryString = window.location.search
  const params = new URLSearchParams(queryString)
  let sort = params.get('sort') || ''
  let order = ''
  if (sort !== '') {
    sort = sort.toLowerCase()
    order = params.get('order') || ''
    order = order.toLowerCase()
  }
  
  return { sort, order }
}

export function getApiQuerySort(sort: TSortOpts = {}, state: TSortOpts = {}, sortInEmpty: string = '') {
  let xsort = sort.sort ?? state.sort ?? ''
  let order = sort.order ?? state.order ?? ''

  if (xsort === '') {
    order = sortInEmpty === '' ? '' : 'asc'
    return createPropsIfNotEmpty({ '_sort': sortInEmpty, '_order': order })
  }

  return createPropsIfNotEmpty({ '_sort': xsort, '_order': order })
}

export function changeSort(field: string, state: TSort): TSort {
  let sort = '', order = ''

  if (field !== state.sort) {
    sort = field
    order = 'asc'
  } else if (state.order === 'asc') {
    sort = field
    order = 'desc'
  }

  return { sort, order }
}