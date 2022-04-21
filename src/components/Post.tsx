export default Post

type TPost = any

function Post({ post }: { post: TPost }) {
  
  return (
    <div className="text-left">
      <div className="mb-3">
        <p className="font-bold text-xs select-none">ID</p>
        <p className="border-2 rounded-lg text-xl p-2">{ post.id }</p>
      </div>
      
      <div className="mb-3">
        <p className="font-bold text-xs select-none">Title</p>
        <p className="border-2 rounded-lg text-xl p-2">{ post.title }</p>
      </div>

      <div className="mb-3">
        <p className="font-bold text-xs select-none">Author</p>
        <p className="border-2 rounded-lg text-xl p-2">{ post.author }</p>
      </div>

      <div className="mb-3">
        <p className="font-bold text-xs select-none">Photo</p>
        <p className="border-2 rounded-lg text-xl p-2">{ post.photo }</p>
      </div>
    </div>
  )
}