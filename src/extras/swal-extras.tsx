import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { TPost } from "@/types/posts-types"
import { putHashParams, removeHashParams } from "@/code/queryBar"
import { getSessionEntity, removeSessionEntity } from "./storage-extras"

const reactSwal = withReactContent(Swal)

export function createEditForm({ id = 0, title, html }: 
  { id?: number, title?: string, html?: React.ReactElement } = {}) {
  
  reactSwal.fire({
    title: (
      <span className="text-lg select-none">
        { id > 0 ? 'Edit' : 'Create'} {title}
      </span>
    ),
    html,
    background: 'var(--background-auth)',
    color: 'var(--txt)',
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
      if (id > 0) {
        putHashParams('edit', id)
      } else {
        putHashParams('create')
      }
    },
    didDestroy: () => {
      removeHashParams(id > 0 ? 'edit' : 'create')
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
    background: 'var(--background-auth)',
    color: 'var(--txt)',
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
    background: 'var(--background-auth)',
    color: 'var(--txt)',
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
    background: 'var(--background-auth)',
    color: 'var(--txt)',
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
    background: 'var(--background-auth)',
    color: 'var(--txt)',
    showCancelButton: true,
    showConfirmButton: true,
    reverseButtons: true,
  })

  if (conf.isConfirmed) {
    onDelete()
  }
}

export async function showLogout({ onConfirm }:
  { onConfirm: () => void }) {

  const confirm = await Swal.fire({
    title: 'Are you sure?',
    icon: 'question',
    text: "Do you want logout now?",
    background: 'var(--background-auth)',
    color: 'var(--txt)',
    showConfirmButton: true,
    showCancelButton: true,
    reverseButtons: true,
  })
  
  if (confirm.isConfirmed) {
    onConfirm()
  }
}