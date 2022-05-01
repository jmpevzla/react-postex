import { revokeURL } from "@/code/file"
import { useEffect } from "react"

export default useUnmountRevokeURL

function useUnmountRevokeURL(url?: string | null) {
  useEffect(() => {
    return () => {
      revokeURL(url)
    }
  }, [url])
}