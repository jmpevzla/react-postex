import { partialRight } from "lodash"
import { useRef } from "react"
import { queryAssign, TQueryBar } from "@/code/queryBar"

export type TUseSetQueryBar = (query: Record<string, string>) => void 
export type TUseQueryBar = [React.MutableRefObject<TQueryBar>, TUseSetQueryBar]
type TSetQueryBarCompStateParams = { ref: React.MutableRefObject<TQueryBar> }

function setQueryBarInCompState(xState: Record<string, string>, 
  params: TSetQueryBarCompStateParams) {
    
  queryAssign(params.ref.current, xState)
}

export function useQueryBar(querys: TQueryBar): TUseQueryBar {
  const query = useRef(querys)

  const setQueryState = partialRight(setQueryBarInCompState, 
    { ref: query } as TSetQueryBarCompStateParams)

  return [
    query,
    setQueryState
  ] 
}