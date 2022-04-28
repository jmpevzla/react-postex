import { TQuery } from "@/types/api-types"
import { TPhotoPost, TPost } from "@/types/posts-types"
import { QueryClient, QueryFunctionContext, QueryKey } from "react-query"
import { infLimit, postKey, postsKey } from "./config-hrq"

export function onSuccessFunc(queryClient: QueryClient, key?: QueryKey) {
  return () => {
    queryClient.invalidateQueries(key)
  }
}

export function onSuccessPostsFunc(queryClient: QueryClient) {
  return (post: TPost | TPhotoPost) => {
    queryClient.invalidateQueries(postsKey)
    queryClient.invalidateQueries([postKey, post.id])
  }
}

export function onSuccessFuncRemQueries(queryClient: QueryClient) {
  return () => {
    queryClient.removeQueries()
  }
}

export function getInfPage(params: QueryFunctionContext<QueryKey, number>) {
  return params.pageParam || 1
}

export function getInfLimit() {
  return infLimit
}

export function getInfQuery(query: TQuery, page: number, limit: number) {
  return { ...query, _page: page, _limit: limit }
}

export function getInfTotalPages(total: number, limit: number) {
  return Math.ceil(total / limit)
}

export function getInfNextPage(page: number, totalPages: number): number | null {
  return (page + 1) > totalPages ? null : page + 1
}

export function throwErrorCalled(method: string) {
  throw new Error(`${method} has not been called`);
}