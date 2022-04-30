import { mdiFileAlert } from "@mdi/js"
import Icon from "@mdi/react"

export default PostsError

function PostsError({ error, refetch }: { error: string, refetch: () => void }) {
  return (
    <div className="h-3 text-center">
      <div className="text-4xl font-extrabold mb-4 flex flex-row justify-center">
        <Icon path={mdiFileAlert} size={1.5} /> 
        <p>Error</p>
      </div>
      <p className="italic font-bold text-error-content mb-3">{ error }</p>
      <p className="italic font-bold">
        <a className="link" onClick={refetch}>Refetch Again</a>
      </p>
    </div>
  )
}