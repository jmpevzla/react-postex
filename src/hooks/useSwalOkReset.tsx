import { useCallback, useEffect } from "react"

export default useSwalOkReset

function useSwalOkReset(onOk: () => void, onReset: () => void) {
  const onOkCB = useCallback(onOk, [])
  const onResetCB = useCallback(onReset, [])
  
  useEffect(() => {
    const btnOk = document.querySelector('.swal2-actions > button.swal2-confirm') as HTMLButtonElement
    const btnReset = document.querySelector('.swal2-actions > button.swal2-deny') as HTMLButtonElement

    btnOk?.addEventListener('click', onOkCB)
    btnReset?.addEventListener('click', onResetCB)

    return () => {
      btnOk?.removeEventListener('click', onOkCB)
      btnReset?.removeEventListener('click', onResetCB)
    }
  }, [])
}