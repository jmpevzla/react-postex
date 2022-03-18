import { Link } from "wouter"

function AboutMe() {
  return (
    <div className="flex flex-col text-center select-none h-[calc(100vh_-_3rem)] justify-center">
      <h1 className="text-9xl font-extrabold mb-4">500</h1>
      <p className="text-3xl font-bold mb-3">Internal Server Error</p>
      <p className="italic font-bold">Ups! something went wrong</p>
      <p className="italic font-bold">Try to go to <Link href="/"><a className="link">home page</a></Link> </p> 
      <p className="italic font-bold">
        or feel free to contact me if the problem persists
      </p>
    </div>
  )
}

export default AboutMe