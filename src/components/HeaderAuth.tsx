export default HeaderAuth

function HeaderAuth({ text }: { text: string }) {

  return(
    <header className="text-center">
      <p className="text-xl lg:text-left"> 
        Hello <span className="lg:hidden text-violet-600">to Postex.io</span>!
      </p>
      <p className="text-violet-600 font-bold 
        text-2xl lg:text-left hidden lg:block">
        Welcome to Postex.io
      </p>
      <h1 className="text-center text-lg mt-4">
        <span className="text-violet-700">{ text }</span> Your Account
      </h1>
    </header>
  )
}