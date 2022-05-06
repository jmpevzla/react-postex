import React from "react"
import bg from './images/bg.jpg'

export default AuthLayout

function AuthLayout({ children }: { children: React.ReactNode }) {
  
  return (
    
      <div className="mx-4 bg-auth rounded-xl my-4">
        <div className="flex flex-row">
          <div 
            className="
              flex-1 bg-no-repeat 
              bg-cover rounded-tl-xl 
              rounded-bl-xl hidden 
              lg:block
              " 
            style={{ backgroundImage: `url(${bg})`, backgroundPosition: "0% 40%" }}>
            <div className="flex flex-col h-full">
              <div className="flex-1 flex justify-center items-center">

               <p className="text-3xl font-sans font-bold text-gray-100 select-none">Welcome!</p>

              </div>
              <p className="text-xs text-center text-gray-400">Photo by Cliford Mervil: https://www.pexels.com/photo/starry-sky-over-mountains-2469122/</p>
            </div>
          </div>

          <div className="flex-1">
            { children }
          </div>
        </div>
      </div>
    
  )
}