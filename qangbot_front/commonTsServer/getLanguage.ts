import { cookies } from 'next/headers';
import { SUPPORTED_LANGUAGES  , LANGUAGES_COOKIE_NAME} from "@/settings"

type Language = typeof SUPPORTED_LANGUAGES[number];

const getLanguage = (): Language => {
  
  const decidedLanguage = cookies().get(LANGUAGES_COOKIE_NAME)?.value as Language;

  return SUPPORTED_LANGUAGES.includes(decidedLanguage)
    ? decidedLanguage
    : SUPPORTED_LANGUAGES[0]
};

export default getLanguage;