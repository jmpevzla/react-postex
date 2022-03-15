import { cloneDeep, partialRight } from "lodash"
import { useRef } from "react"

/** types */
//export type TQuery = Record<string, string>[] | []
export type TQuery = [key: string, value: string][] | []

type TSetQueryCompStateParams = { ref: React.MutableRefObject<TQuery> }
export type TUseSetQuery = (query: Record<string, string>) => void 
type TUseQuery = [React.MutableRefObject<TQuery>, TUseSetQuery]

/** end types */

/** private */

function queryAssign(xQuery: TQuery, obj: Record<string, any>) {
  for(let qry of xQuery) {
    const key = qry[0]
    const find = Object.keys(obj).find((value) => value === key)
    if (find) {
      qry[1] = obj[key]
    }
  }
}

/** end private */

/** public */

export function setQueryInCompState(xState: Record<string, string>, 
  params: TSetQueryCompStateParams) {
    
    queryAssign(params.ref.current, xState)
}

export function getMixQuery(obj: Record<string, any>, stateQuery: TQuery): TQuery {
  const _query = cloneDeep(stateQuery)

  queryAssign(_query, obj)

  return _query
}

export function setParamsToQueryBar(xquery: TQuery) {
  const path = window.location.pathname 

  const UrlSP = new URLSearchParams()

  for(let qry of xquery) {
    const key = qry[0]
    const value = qry[1]
    value !== '' ? UrlSP.set(key, value) : null
  }

  if (UrlSP.toString() !== '') {
    window.history.replaceState({}, '', path + '?' + UrlSP.toString())  
  } else {
    window.history.replaceState({}, '', path)  
  }
}
/** end public */

/** hooks */

export function useQuery(querys: TQuery): TUseQuery {
  const query = useRef(querys)

  const setQueryState = partialRight(setQueryInCompState, 
    { ref: query } as TSetQueryCompStateParams)

  return [
    query,
    setQueryState
  ] 
}

/** end hooks */