import { useState } from "react"
import { mdiUpload } from "@mdi/js"
import { Icon } from "@mdi/react"
import PostPhotoShow from "./PostPhotoShow"

export default UploadPhoto

function UploadPhoto({ onChange, title, photo }:
  { onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void,
    title: string, photo: string | null
  }) {

  const [load, setLoad] = useState(false)

  function onIsLoad(value: boolean) {
    setLoad(value)
  }

  return (
    <>
      <input id="inputPhoto" type="file" 
        className="form-control-file hidden" 
        name="photo" onChange={onChange} 
        accept=".jpg,.gif,.svg,.png" 
        title="" value="" />
            
      <div className="flex flex-col items-center justify-center">
        <div className="mb-2 p-1 border-4 rounded-lg inline-block hover:opacity-75" 
          title="Upload Photo">
          
          <label htmlFor="inputPhoto">
            <PostPhotoShow photo={photo} title={title} onIsLoad={onIsLoad} />
          </label>
        </div>
        {load && <div>
          <label htmlFor="inputPhoto" 
            className="btn btn-info !min-h-0 h-8 tracking-wider text-sm">
            <Icon path={mdiUpload} size={1} /> Photo
          </label>
        </div>}
      </div>
    </>
  )
}