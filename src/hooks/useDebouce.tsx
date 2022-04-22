import { debounce } from "lodash"
import { useCallback } from "react"

export function useDebounce<T extends (...args: any) => any>(func: T, delay = 500) {
  const funcDeb = useCallback(debounce(func, delay), []) 

  return funcDeb
}
