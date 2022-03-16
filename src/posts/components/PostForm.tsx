import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { cupdatePost } from '../api';

function PostForm({ post, change, fieldErrors }: 
  { post: TPost, change: (e: React.ChangeEvent<any>) => void, fieldErrors: Record<string, string> }) {
  return (
    <div className="text-left mx-2">
      { post.id > 0 && (
        <div className="mb-3">
          <p className="font-bold tracking-wider">ID</p>
          <input className="input input-bordered text-xl p-2 w-full" defaultValue={post.id} disabled />
        </div>
      )}
      
      <div className="mb-3">
        <p className="font-bold tracking-wider">TITLE</p>
        <input className="input input-bordered text-xl p-2 w-full"
          name="title" value={post.title} onChange={change} />
        {fieldErrors.title && <p className="text-error">{fieldErrors.title}</p>}
      </div>

      <div className="mb-3">
        <p className="font-bold tracking-wider">AUTHOR</p>
        <input className="input input-bordered text-xl p-2 w-full"
          name="author" value={post.author} onChange={change} />
        {fieldErrors.author && <p className="text-error">{fieldErrors.author}</p>}
      </div>
    </div>
  )
}

function dispatchConfirmEvent(value: boolean) {
  const ev = new CustomEvent('modal-confirm', { detail: value })
  return window.dispatchEvent(ev)
}

function withSwalPostForm({ post }: { post: TPost | null }) {
  const validate = (values: TPost) => {
    const errors: Record<string, string> = {} 
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
      author: post?.author || ''
    },
    validate,
    onSubmit: async (values) => {
      setError('')
      const res = await cupdatePost(values)

      setTimeout(() => {
        if (res?.status === 200 || res?.status === 201) {
          dispatchConfirmEvent(true)
        }

        setError('Error, try again!')
        dispatchConfirmEvent(false)

      }, 2000)
    },
    onReset: () => {
      setError('')
      setFieldErrors('')
    } 
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

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
      {error !== '' && (<p className="text-error">{ error }</p>)}
      <form>
        <PostForm post={formFormik.values} change={formFormik.handleChange} 
          fieldErrors={fieldErrors} />
      </form>
    </div>
  )
} 

export default withSwalPostForm