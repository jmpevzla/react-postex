import 'lazysizes'
import 'lazysizes/plugins/attrchange/ls.attrchange';
import noPhotoImage from "@/assets/no-photo.jpg"
import loadingImage from "@/assets/loading-ani.gif"

export default PostPhoto

function PostPhoto({ photo, title }: { photo: string | null, title: string }) {
  return (
    <figure>
      {photo ? (
        <img data-src={photo} 
          src={loadingImage}
          alt={`Post ${title}`}
          className="lazyload"
          style={{objectFit: "cover", height: '210px', width: '210px'}}
        />
      ) : (
        <img src={noPhotoImage} 
          alt={`No Photo Post ${title}`} 
          className="w-[210px] h-[210px]" 
        />
      )}
    </figure>
  )
}