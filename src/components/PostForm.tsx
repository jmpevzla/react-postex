import { useState } from 'react'
import { useFormik } from 'formik'
import { TCupdatePostFunc, TPost
  , TUpdatePhotoFunc } from '@/types/posts-types'

import useSwalOkReset from '@/hooks/useSwalOkReset'
import UploadPhoto from './UploadPhoto'

export default PostForm
interface TFieldErrors {
  title?: string,
  author?: string,
  photo?: string
}

function PostForm({ post, onCupdate, onUploadPhoto }: 
  { post?: TPost, 
    onCupdate: TCupdatePostFunc,
    onUploadPhoto: TUpdatePhotoFunc }) {
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

  function handleChangePhoto(ev: React.ChangeEvent<HTMLInputElement>) {
    if (post && ev.currentTarget.files) {
      const photo = ev.currentTarget.files[0]

      function setPhoto(photo: string) {
        formFormik.setFieldValue('photo', photo)
      }

      onUploadPhoto(post.id, photo, setPhoto, setError)
    }
  }

  async function onOk() {
    const errors = await formFormik.validateForm()
    setFieldErrors(errors)
    
    if (Object.keys(errors).length > 0) {
      dispatchConfirmEvent(false)
    }

    formFormik.submitForm()
  }
  function onReset() {
    formFormik.resetForm()
  }
  useSwalOkReset(onOk, onReset)

  return (
    <div>
      <form>
        <div className="
          text-left px-2 mx-2 
          max-h-[calc(100vh_-_15rem)] overflow-y-auto
          grid grid-rows-[1fr-275px] gap-2
          md:grid-rows-none md:grid-cols-[1fr_210px]
        ">
          <div>
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
          </div>

          <div className="mb-3 flex justify-center">
            <UploadPhoto onChange={handleChangePhoto} 
              title={formFormik.values.title} 
              photo={formFormik.values.photo} />
            
            {/*fieldErrors.photo && <p className="text-error">* {fieldErrors.photo}</p>*/}
          </div>
        </div>
      </form>
      {error !== '' && (<p className="text-error">{ error }</p>)}
    </div>
  )
} 