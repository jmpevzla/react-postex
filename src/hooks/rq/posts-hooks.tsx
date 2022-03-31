import { useQuery, useInfiniteQuery, QueryFunctionContext
  , QueryKey, useMutation, QueryClient} from "react-query"

import { TError, TQuery } from "@/types/api-types"
import { TPhotoPost, TPhotoPostMutation, TPost, TPostsInf } from "@/types/posts-types"
import { cupdatePost, deletePost, getPost, getPosts, uploadPhotoPost } from "@/api/posts-api"
import { infPlaceholder, postKey, postsKey, staleTime } from "./extras/config-hrq"

import { getInfLimit, getInfNextPage, getInfPage
  , getInfQuery, getInfTotalPages, onSuccessPostsFunc } from "./extras/helpers-hrq"

export function useInfPosts(query: TQuery) {
  return useInfiniteQuery<TPostsInf, TError>
    ([postsKey, query], async (params: QueryFunctionContext<QueryKey, number>) => {
      
      const page = getInfPage(params)
      const limit = getInfLimit()

      const qo = getInfQuery(query, page, limit)
      const response = await getPosts(qo)

      return {
        data: response.info!,
        nextPage: getInfNextPage(page, getInfTotalPages(response.total, limit))
      }
  }, {
    placeholderData: infPlaceholder,
    staleTime: staleTime,
    getNextPageParam: (lastPage: TPostsInf, _pages: TPostsInf[]) => {
      return lastPage.nextPage
    }
  })
}

export function usePost(id: number) {
  return useQuery<TPost, TError>
    ([postKey, id], async () => {
      const { info } = await getPost(id)
      return info!
  }, {
    staleTime: staleTime
  })
}

export function useDeletePost(queryClient: QueryClient) {
  return useMutation<TPost, TError, number>
    (async (id) => {
      const { info } = await deletePost(id)
      return info!
  }, {
    onSuccess: onSuccessPostsFunc(queryClient)
  })
}

export function useCupdatePost(queryClient: QueryClient) {
  return useMutation<TPost, TError, TPost>
    (async (post) => {
      const { info } = await cupdatePost(post)
      return info!
  }, {
    onSuccess: onSuccessPostsFunc(queryClient)
  })
}

export function useUploadPhotoPost(queryClient: QueryClient) {
  return useMutation<TPhotoPost, TError, TPhotoPostMutation>
  (async ( { id, photo } ) => { 
    const { info } = await uploadPhotoPost(id, photo)
    return info!
  }, {
    onSuccess: onSuccessPostsFunc(queryClient)
  })
}


