import { useEffect } from 'react'
import { themeChange } from 'theme-change'

export default ToggleTheme

function ToggleTheme() {

  useEffect(() => {
    themeChange(false)
  }, [])

  return (
    <div>
      🌞 
      <div className="inline-block w-10"> 
        <span data-toggle-theme="dark" 
        data-act-class="!pl-4" 
        className="border rounded-full 
          border-accent flex 
          items-center cursor-pointer 
          w-10 bg-green transition-all 
          duration-300 ease-in-out pl-0
          "> 
          <span className="rounded-full w-3 h-3 m-1 bg-accent"></span> 
        </span> 
      </div>
      🌚 
    </div>
  )
}