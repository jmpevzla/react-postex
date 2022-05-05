import { useEffect, useRef, useState } from "react"

export default useLoadingImg

function useLoadingImg(): [React.MutableRefObject<HTMLImageElement | null>, boolean] {
  
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    
    const img = imgRef.current!
  
    const listener = () => {
      setLoad(true)
    }
    
    if(img) {
      img.addEventListener('load', listener)
    } 

    return () => {
      if (img) {
        img.removeEventListener('load', listener)
      }
    }
    
  })

  return [imgRef, load]
}