import {} from 'react'

function Post({ post }: { post: TPost }) {
  
  return (
    <div className="text-left">
      <div className="mb-3">
        <p className="font-bold">ID</p>
        <p className="border-2 rounded-lg text-xl p-2">{ post.id }</p>
      </div>
      
      <div className="mb-3">
        <p className="font-bold">TITLE</p>
        <p className="border-2 rounded-lg text-xl p-2">{ post.title }</p>
      </div>

      <div className="mb-3">
        <p className="font-bold">AUTHOR</p>
        <p className="border-2 rounded-lg text-xl p-2">{ post.author }</p>
      </div>
    </div>
  )
}

export default Post