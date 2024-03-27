import { cookies } from 'next/headers';
import { SUPPORTED_LANGUAGES  , LANGUAGES_COOKIE_NAME} from "@/settings"


const getLanguage = ():  typeof  SUPPORTED_LANGUAGES[number] => {
  
  const decidedLanguage = cookies().get(LANGUAGES_COOKIE_NAME)?.value
  const language = SUPPORTED_LANGUAGES.filter ( language => language.lang === decidedLanguage )[0]

  return language
    ? language
    : SUPPORTED_LANGUAGES[0]
};

export default getLanguage;