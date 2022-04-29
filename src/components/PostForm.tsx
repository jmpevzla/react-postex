import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { mdiUpload } from "@mdi/js"
import { Icon } from "@mdi/react"
import { TCupdatePostFunc, TPost } from '@/types/posts-types'

export default PostForm
interface TFieldErrors {
  title?: string,
  author?: string,
  photo?: string
}

function PostForm({ post, onCupdate }: 
  { post?: TPost, 
    onCupdate: TCupdatePostFunc }) {
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<TFieldErrors>({})

  const validate = (values: TPost) => {
    const errors: TFieldErrors = {} 
    if (!values.title) {
      errors.title = 'Required'
    }
    if (!values.author) {
      errors.author = 'Required'
    }
    return errors
  }
  
  const formFormik = useFormik<TPost>({
    initialValues: {
      id: post?.id || 0,
      title: post?.title || '',
      author: post?.author || '',
      photo: post?.photo || null
    },
    validate,
    onSubmit: async (values: TPost) => {
      setError('')
      onCupdate(values, dispatchConfirmEvent, setError)
    },
    onReset: () => {
      setError('')
      setFieldErrors({})
    } 
  })
  
  function dispatchConfirmEvent(value: boolean) {
    const ev = new CustomEvent('modal-confirm', { detail: value })
    return window.dispatchEvent(ev)
  }

  useEffect(() => {

    const btnOk = document.querySelector('.swal2-actions > button.swal2-confirm') as HTMLButtonElement
    const btnReset = document.querySelector('.swal2-actions > button.swal2-deny') as HTMLButtonElement

    const listOk = async () => {
      const errors = await formFormik.validateForm()
      setFieldErrors(errors)
      
      if (Object.keys(errors).length > 0) {
        dispatchConfirmEvent(false)
      }

      formFormik.submitForm()
    }

    const listReset = () => {
      formFormik.resetForm()
    }

    btnOk?.addEventListener('click', listOk)
    btnReset?.addEventListener('click', listReset)

    return () => {
      btnOk?.removeEventListener('click', listOk)
      btnReset?.removeEventListener('click', listReset)
    }
  }, [])

  return (
    <div>
      <form>
        <div className="text-left mx-2">
          { formFormik.values.id > 0 && (
            <div className="mb-3">
              <label htmlFor="inputId" 
                className="font-bold tracking-wider text-xs">ID</label>
              <input id="inputId" 
                className="
                  input input-bordered text-xl 
                  p-2 w-full mt-1 border-1
                  !border-gray-600 !cursor-default
                " 
                defaultValue={formFormik.values.id} disabled />
            </div>
          )}
          
          <div className="mb-3">
            <label htmlFor="inputTitle" 
              className="font-bold tracking-wider text-xs">Title</label>
            <input id="inputTitle"
              className="
                input input-primary text-xl 
                p-2 w-full mt-1
              "
              name="title" value={formFormik.values.title} 
              onChange={formFormik.handleChange} />
            {fieldErrors.title && <p className="text-error">* {fieldErrors.title}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="inputAuthor" 
              className="font-bold tracking-wider text-xs">Author</label>
            <input id="inputAuthor" 
              className="
                input input-primary text-xl 
                p-2 w-full mt-1
              "
              name="author" value={formFormik.values.author} 
              onChange={formFormik.handleChange} 
            />
            {fieldErrors.author && <p className="text-error">* {fieldErrors.author}</p>}
          </div>

          <div className="mb-3">
            <input id="inputPhoto" type="file" className="form-control-file hidden" 
                  name="photo" onChange={() => {}} 
                  accept=".jpg,.gif,.svg,.png" title="" value="" />
            <label htmlFor="inputPhoto" 
              className="btn btn-info tracking-wider text-sm">
              <Icon path={mdiUpload} size={1} /> Photo
            </label>
            {/*photo.preview && <div className="mb-2">
                <label htmlFor="file">
                  <img alt="photo" src={photo.preview} className="w-32" />
                  <p>{photo.name}</p>
                </label>
            </div>*/}
            {fieldErrors.photo && <p className="text-error">* {fieldErrors.photo}</p>}
          </div>
        </div>
      </form>
      {error !== '' && (<p className="text-error">{ error }</p>)}
    </div>
  )
} 