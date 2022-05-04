import { useEffect, useContext, useRef } from 'react'
import { themeChange } from 'theme-change'
import classNames from 'classnames'
import { setThemeAction, themeContext } from '@/contexts/themeContext'
import { isThemeDark, isThemeEmpty
  , isThemeLight, setTheme } from '@/extras/storage-extras'
import { isPrefersColorSchemeDark } from '@/extras/theme-extras'

export default ToggleTheme

function ToggleTheme() {
  const [theme, dispatch] = useContext(themeContext)!
  const switchRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    themeChange(false)
    
    if (!theme) {
      const payload = { name: 'light' }
      if (isPrefersColorSchemeDark()) {

        if (isThemeEmpty()) {
          setTheme('dark')
        }

        payload.name = 'dark'
      } else {

        if (isThemeEmpty()) {
          setTheme('light')
        }

      }

      dispatch({
        type: setThemeAction,
        payload
      })
    }

    if (isThemeLight()) {
      switchRef.current?.classList.remove('!pl-4')
    }

  }, [])

  return (
    
    <div>
      🌞 
      <div className="inline-block w-10"> 
        <span data-toggle-theme="dark,light" 
        data-act-class="!pl-4"
        ref={switchRef} 
        className={classNames(`border rounded-full 
          border-accent flex 
          items-center cursor-pointer 
          w-10 bg-green transition-all 
          duration-300 ease-in-out pl-0
          `, { '!pl-4' : isThemeDark() })}> 
          <span className="rounded-full w-3 h-3 m-1 bg-accent"></span> 
        </span> 
      </div>
      🌚 
    </div>

  )
}