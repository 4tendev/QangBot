import { cookies } from "next/headers";
import config ,{Theme} from "@/tailwind.config";
import {THEME_COOKIE_NAME} from "@/settings"


const getTheme = (): Theme => {
  const theme =  cookies().get(THEME_COOKIE_NAME)?.value
  return config.daisyui.themes.includes(theme)
    ? theme
    : config.daisyui.themes[0]
}

export default getTheme