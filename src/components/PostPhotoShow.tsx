import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange';
import classNames from 'classnames';
import noPhotoImage from "@/assets/no-photo.jpg"
import styles from "@/styles/PostPhoto.module.css"

export default PostPhotoShow

function PostPhotoShow({ photo, title }: { photo: string | null, title: string }) {
  return (
    <figure>
      {photo ? (
        <img 
          src={photo}
          alt={`Post ${title}`}
          className={classNames([styles.posts, 'max-w-[250px] max-h-[250px] md:max-w-[210px] md:max-h-[210px]'])}
        />
      ) : (
        <img src={noPhotoImage} 
          alt={`No Photo Post ${title}`} 
          className={classNames([styles.posts, 'max-w-[250px] max-h-[250px] md:max-w-[190px] md:max-h-[190px]'])}
        />
      )}
    </figure>
  )
}