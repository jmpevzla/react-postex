import { useRef, useEffect, useMemo } from "react"

export default useInsObs

function useInsObs(func: (entries: IntersectionObserverEntry[]) => void, updateAt?: number) {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const optionsIO = useMemo(() => ({
    root: null,
    rootMargin: '0px',
    threshold: 0.75
  }), [])

  useEffect(() => {
    const observer = new IntersectionObserver(func, optionsIO)
    if (loadMoreRef.current) observer.observe(loadMoreRef.current)

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current)
    }
  }, [loadMoreRef, updateAt])

  return loadMoreRef
}