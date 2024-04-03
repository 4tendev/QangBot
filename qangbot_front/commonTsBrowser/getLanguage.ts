import { SUPPORTED_LANGUAGES  , LANGUAGES_COOKIE_NAME} from "@/settings"
import getCookie from "./getCookie"

const getLanguage = ():  typeof  SUPPORTED_LANGUAGES[number] => {
  
  const decidedLanguage =  getCookie(LANGUAGES_COOKIE_NAME)
  const language = SUPPORTED_LANGUAGES.filter ( language => language.lang === decidedLanguage )[0]

  return language
    ? language
    : SUPPORTED_LANGUAGES[0]
};

export default getLanguage;