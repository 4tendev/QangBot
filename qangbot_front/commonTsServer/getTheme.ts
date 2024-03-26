import { cookies } from "next/headers";
import config from "@/tailwind.config";
import {THEME_COOKIE_NAME} from "@/settings"

type Theme = typeof config.daisyui.themes[number];

const getTheme = (): Theme => {
  const cookieStore =   cookies()
  const theme = cookieStore.get(THEME_COOKIE_NAME)?.value
  return config.daisyui.themes.includes(theme)
    ? theme
    : config.daisyui.themes[0]
}

export default getTheme