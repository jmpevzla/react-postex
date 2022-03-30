import { QueryClient, QueryKey } from "react-query"

export function onSuccessFunc(queryClient: QueryClient, key?: QueryKey) {
  return () => {
    queryClient.invalidateQueries(key)
  }
}