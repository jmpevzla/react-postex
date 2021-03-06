import { useEffect, useMemo, useState } from "react"
import { useQuery, useInfiniteQuery, QueryFunctionContext
  , QueryKey, useMutation, QueryClient } from "react-query"

import { TError, TQuery } from "@/types/api-types"
import { TPhotoPost, TPhotoPostMutation
  , TPost, TPostsInf, TPosts, TUsePostId } from "@/types/posts-types"
import { cupdatePost, deletePost
  , getPost, getPosts, uploadPhotoPost } from "@/api/posts-api"
import { infPlaceholder, postKey
  , postsKey, staleTime } from "./extras/config-hrq"
import { onSuccessPostsFunc } from "./extras/helpers-hrq"
import InfQueryBuilder from "./builders/infQueryBuilder-hrq"
import { showError } from "@/extras/swal-extras"

export function useInfPosts(query: TQuery, enabled: boolean) {
  const infQueryBuilder = useMemo(() => new InfQueryBuilder<TPosts>(), [])

  return useInfiniteQuery<TPostsInf, TError>
    ([postsKey, query], async (params: QueryFunctionContext<QueryKey, number>) => {
      const qo = infQueryBuilder
        .setInfPage(params)
        .setInfLimit()
        .setInfQueryParams(query)
        .getInfQueryParams()
      
      const response = await getPosts(qo)
      
      return infQueryBuilder
        .setInfResponse(response)
        .setNextPage()
        .getReturn()
  }, {
    placeholderData: infPlaceholder,
    staleTime: staleTime,
    enabled,
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
    staleTime: staleTime,
    enabled: false,
  
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

export function usePostId(): TUsePostId {
  const [postStId, setPostStId] = useState({
    id: 0,
    onSuccess: (data: TPost) => {},
    isLoading: (value: boolean) => {}
  })
  const postQuery = usePost(postStId.id)

  useEffect(() => {
    async function init() {
      postStId.isLoading(true) 
      let postQ = postQuery
      if (postQuery.isStale) {
        postQ = await postQuery.refetch()
      }
      
      if (postQ.isSuccess) {
        postStId.onSuccess(postQ.data)
      } else {
        showError(postQ.error?.message || 'Error fetch data, Try Again!')
      }

      postStId.isLoading(false)
      setPostStId({ ...postStId, id: 0 })
    }

    postStId.id > 0 && init()
  }, [postStId.id])

  return setPostStId
}
