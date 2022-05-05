import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { TPost } from "@/types/posts-types"
import { putHashParams, removeHashParams } from "@/code/queryBar"
import { getSessionEntity, removeSessionEntity } from "./storage-extras"

const reactSwal = withReactContent(Swal)

export function createEditForm({ post = null, title, html }: 
  { post?: TPost | null, title?: string, html?: React.ReactElement } = {}) {
  
  reactSwal.fire({
    title: (
      <span className="text-lg select-none">
        { post ? 'Edit' : 'Create'} {title}
      </span>
    ),
    html,
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: 'Ok',
    cancelButtonText: 'Cancel',
    denyButtonText: 'Reset',
    reverseButtons: true,
    showLoaderOnConfirm: true,
    showLoaderOnDeny: true,
    preDeny: () => false,
    preConfirm: () => {
      return new Promise<boolean>((resolve) => {
        const listener = (ev: Event) => {
          const customEv = ev as CustomEvent<boolean>
          resolve(customEv.detail)
        }
        
        window.addEventListener('modal-confirm', listener, { once: true })  
      })
    },
    didOpen: () => {
      if (post) {
        putHashParams('edit', post.id)
      } else {
        putHashParams('create')
      }
    },
    didDestroy: () => {
      removeHashParams(post ? 'edit' : 'create')
    }
  })
}

export async function showForm({ id, title, html, onEdit, onDelete }:   
  { id: number, title?: string, html?: React.ReactElement
  , onEdit: () => void, onDelete: (post: TPost) => void }) {
  
  const res = await reactSwal.fire({
    title: (
      <span className="text-lg select-none">
        Show {title}
      </span>
    ),
    html,
    showCancelButton: true,
    showDenyButton: true,
    cancelButtonText: 'Edit',
    denyButtonText: 'Delete',
    confirmButtonText: 'Ok',
    reverseButtons: true,
    didOpen: () => {
      putHashParams('show', id)
    },
    didDestroy: () => {
      removeSessionEntity('post')
      removeHashParams('show')
    }
  })

  if (res.isDismissed) {
    onEdit()
  }

  if (res.isDenied) {
    const post = getSessionEntity<TPost>('post') 
    post && onDelete(post)
  }
}

export async function showSuccess(message: string) {
  return await Swal.fire({
    title: "Success!",
    icon: "success",
    text: message,
    toast: true,
    timerProgressBar: true,
    timer: 1000,
    position: "top",
    showConfirmButton: false,
  });
}

export async function showError(message: string) {
  return await Swal.fire({
    title: "Error",
    icon: "error",
    text: message,
    toast: true,
    timerProgressBar: true,
    timer: 3000,
    position: "top",
    showConfirmButton: false,
  });
}

export async function showDelete({ title, html, onDelete }:
  { title: string, html: React.ReactElement, onDelete: () => void }) {
  const conf = await reactSwal.fire({
    title: "Delete " + title,
    icon: "question",
    html,
    showCancelButton: true,
    showConfirmButton: true,
  })

  if (conf.isConfirmed) {
    onDelete()
  }
}