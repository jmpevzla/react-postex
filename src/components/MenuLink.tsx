import { Link } from 'wouter'

export default MenuLink

function MenuLink({ href, children, onClick }: 
  { children: React.ReactNode, href: string, onClick?: () => void }) {

  return (
    <Link href={href} onClick={onClick} >
      <a>{ children }</a>
    </Link>
  )
}