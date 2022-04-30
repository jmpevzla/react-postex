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
        <img 
          src={photo}
          alt={`Post ${title}`}
          className={classNames([styles.posts, 'w-[105px] max-h-[125px] md:w-[210px] md:max-h-[250px]'])}
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