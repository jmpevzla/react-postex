import { Link } from "wouter"

function Page401() {
  return (
    <div className="flex flex-col text-center select-none h-[calc(100vh_-_3rem)] justify-center">
      <h1 className="text-9xl font-extrabold mb-4">401</h1>
      <p className="text-3xl font-bold mb-3">Unauthorizated</p>
      <p className="italic font-bold">You don't have credentials for to be here, 
        please go to <Link href="/login"><a className="link">login page</a></Link>
      </p>
    </div>
  )
}

export default Page401