import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange';
import classNames from 'classnames';
import noPhotoImage from "@/assets/no-photo.jpg"
import styles from "@/styles/PostPhoto.module.css"
import loadingStyles from "@/styles/Loading.module.css"
import useLoadingImg from '@/hooks/useLoadingImg';
import { useEffect } from 'react';

export default PostPhotoShow

function PostPhotoShow({ photo, title, onIsLoad }: 
  { photo: string | null, title: string, onIsLoad?: (value: boolean) => void }) {
  
  const [imgRef, load] = useLoadingImg()

  useEffect(() => {
    onIsLoad && onIsLoad(load)
  }, [load])

  return (
    <>
      <figure>
        {photo ? (
          <img
            ref={imgRef} 
            src={photo}
            alt={`Post ${title}`}
            className={classNames([styles.posts, 
              'max-w-[250px] max-h-[250px] md:max-w-[210px] md:max-h-[210px]'])}
          />
        ) : (
          <img src={noPhotoImage} 
            alt={`No Photo Post ${title}`} 
            className={classNames([styles.posts, 
              'max-w-[250px] max-h-[250px] md:max-w-[190px] md:max-h-[190px]'])}
          />
        )}
      </figure>
      {!load &&
        <div className="flex justify-center">
          <div className={classNames(loadingStyles['lds-facebook'])}><div></div><div></div><div></div></div>
        </div>
      }
    </>
  )
}