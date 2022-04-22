import { cloneDeep } from "lodash"

export type TQueryBar = [key: string, value: string][] | []

export function queryAssign(xQuery: TQueryBar, obj: Record<string, any>) {
  for(let qry of xQuery) {
    const key = qry[0]
    const find = Object.keys(obj).find((value) => value === key)
    if (find) {
      qry[1] = obj[key]
    }
  }
}

export function getMixQuery(obj: Record<string, any>, stateQuery: TQueryBar): TQueryBar {
  const _query = cloneDeep(stateQuery)

  queryAssign(_query, obj)

  return _query
}

export function setParamsToQueryBar(xquery: TQueryBar) {
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