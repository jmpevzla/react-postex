import { useContext, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import { useLocation } from 'wouter'
import Swal from 'sweetalert2'
import { clearUserAction, userContext } from '@/contexts/userContext'
import MenuLink from './MenuLink'
import { useLogout } from '@/hooks/rq/auth-hrq'
import { clearStUser } from '@/extras/storage-extras'

export default AppLinks

function AppLinks({ onClickLink = () => {} }: 
  { onClickLink?: () => void }) {
  const queryClient = useQueryClient()
  const [user] = useContext(userContext)!
  const logout = useLogout(queryClient)
  const [, setLocation] = useLocation()

  async function onLogout() {
    onClickLink()
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      icon: 'question',
      text: "Do you want logout now?",
      showConfirmButton: true,
      showCancelButton: true
    })
    
    if (confirm.isConfirmed) {
      logout.mutate(undefined, {
        onSuccess: () => {
          clearStUser()
          setLocation('/login')
        }
      })
    }
  }

  if (user == null) {
    return (
      <>
        <li><MenuLink href="/login" onClick={onClickLink}>Login</MenuLink></li>
        <li><MenuLink href="/register" onClick={onClickLink}>Register</MenuLink></li>
      </>
    )
  }

  return (
    <>
      <li><MenuLink href="/about" onClick={onClickLink}>About</MenuLink></li>
      <li><span onClick={onLogout} className="font-semibold">{ user.name }</span></li>
    </>
  )
}