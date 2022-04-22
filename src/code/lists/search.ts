import { createPropsIfNotEmpty } from '@/code/create'

export interface TSearch {
  q: string,
}
export type TSearchOpts = Partial<TSearch>

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
