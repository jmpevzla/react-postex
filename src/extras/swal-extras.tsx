import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { TPost } from "@/types/posts-types"

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
    }
  })
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