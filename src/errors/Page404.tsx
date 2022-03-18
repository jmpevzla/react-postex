import { Link } from "wouter"

function Page404() {
  return (
    <div className="flex flex-col text-center select-none h-[calc(100vh_-_3rem)] justify-center">
      <h1 className="text-9xl font-extrabold mb-4">404</h1>
      <p className="text-3xl font-bold mb-3">Not Found</p>
      <p className="italic font-bold">Ups! The page you are looking for does not exist.</p>
      <p className="italic font-bold">It might have been moved or deleted. </p> 
      <p className="italic font-bold">
        You can to go to <Link href="/"><a className="link">home page</a></Link>
      </p>
    </div>
  )
}

export default Page404