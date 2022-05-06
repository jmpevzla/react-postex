import { useEffect } from "react"
import { revokeURL } from "@/code/file"

export default useUnmountRevokeURL

function useUnmountRevokeURL(url?: string | null) {
  useEffect(() => {
    return () => {
      revokeURL(url)
    }
  }, [url])
}