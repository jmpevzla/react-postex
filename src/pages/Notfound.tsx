import { Link } from "wouter"
import { Icon } from "@mdi/react"
import { mdiAlertCircle } from "@mdi/js"
import MainLayout from "./layout/MainLayout"

export default NotFound

function NotFound() {
  return (
    <MainLayout>
      <div className="flex flex-col text-center select-none h-[calc(100vh_-_4rem)] justify-center">
        <h1 className="text-9xl font-extrabold mb-4">404</h1>
        <div className="text-3xl font-bold mb-3 flex flex-row justify-center">
          <Icon path={mdiAlertCircle} size={1.5} /> 
          <p>Not Found</p>
        </div>
        <p className="italic font-bold">Ups! The page you are looking for does not exist.</p>
        <p className="italic font-bold">It might have been moved or deleted. </p> 
        <p className="italic font-bold">
          You can to go to <Link href="/"><a className="link">home page</a></Link>
        </p>
      </div>
    </MainLayout>
  )
}