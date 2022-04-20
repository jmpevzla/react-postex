import { Link } from "wouter"
import { Icon } from "@mdi/react"
import { mdiFileAlert } from "@mdi/js"
import MainLayout from "./layout/MainLayout"

export default PageError

function PageError({ error }: { error: string }) {
  return (
    <MainLayout>
      <div className="flex flex-col text-center select-none h-[calc(100vh_-_4rem)] justify-center">
        <div className="text-7xl font-extrabold mb-4 flex flex-row justify-center">
          <Icon path={mdiFileAlert} size={3} /> 
          <p>Error</p>
        </div>
        <p className="italic font-bold text-error-content mb-3">{ error }</p>
        <p className="italic font-bold">
          Go to <Link href="/"><a className="link">home page</a></Link>
        </p>
      </div>
    </MainLayout>
  )
}