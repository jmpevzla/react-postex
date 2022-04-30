import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange';
import classNames from 'classnames';
import noPhotoImage from "@/assets/no-photo.jpg"
import loadingImage from "@/assets/loading-ani.gif"
import styles from "@/styles/PostPhoto.module.css"

export default PostPhoto

function PostPhoto({ photo, title }: { photo: string | null, title: string }) {
  return (
    <figure>
      {photo ? (
        <img data-src={photo} 
          src={loadingImage}
          alt={`Post ${title}`}
          className={classNames([styles['posts-photo'], styles.posts, 'lazyload'])}
        />
      ) : (
        <img src={noPhotoImage} 
          alt={`No Photo Post ${title}`} 
          className={classNames([styles.posts, 'w-[210px] h-[210px]'])}
        />
      )}
    </figure>
  )
}