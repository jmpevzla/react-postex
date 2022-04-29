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

function getHashId() {
  const hash = window.location.hash
  const split = hash.split('/')
  const id = parseInt(split[1])
  if (isNaN(id) || id < 1) {
    return 0
  }
  return id
}

export function loadHashParams(route: string, onLoad: (id: number) => void) {
  const hash = '#' + route

  const hashString = window.location.hash
  if (hashString.includes(hash)) {
    onLoad(getHashId())
  }
}

function getPathSearch() {
  return window.location.pathname + window.location.search
}

export function putHashParams(route: string, id?: number) {
  const params = id && id > 0 ? '/' + id.toString() : ''
  const hash = '#' + route + params
  const path = getPathSearch() + hash
  if (!window.location.hash.includes(hash)) {
    window.history.replaceState(null, '', path)
  }
}

export function removeHashParams(route: string) {
  const hash = '#' + route
  const path = getPathSearch()
  if (window.location.hash.includes(hash)) {
    window.history.replaceState({}, '', path)
  }
}
