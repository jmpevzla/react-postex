import { TPost } from "@/types/posts-types";

export default PostDelete

function PostDelete({ post }: { post: TPost }) {
  return (
    <div>
      <p className="font-semibold">Are you sure on delete:</p>
      <p>{post.title}</p>
      <p className="font-semibold">with Author:</p>
      <p>{post.author}</p>
    </div>
  )
}