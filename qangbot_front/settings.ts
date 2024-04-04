export const LANGUAGES_COOKIE_NAME :"lang" = "lang" 
export const THEME_COOKIE_NAME :"theme" = "theme" 
export type Language = "en"|"fa"
export type Direction = "ltr" | "rtl"
export const NAVBAR_ID : string = "NAVBARID"
export const SUPPORTED_LANGUAGES :  {lang :Language , dir : Direction ,text : string}[] = [{lang:"en",dir:"ltr",text:"English"}, {lang:"fa",dir:"rtl",text:"فارسی"}] 
type Name =  "gridbot" | "strategy" | "aboutus"
type Link = string
export const Site_MENU : {name :Name , link :Link}[] =[
    {
        "name" : "gridbot" , "link" : "/gridbot"
    },
    {
        "name" : "strategy" , "link" : "/strategy"
    },
    {
        "name" : "aboutus" , "link" : "/aboutus"
    }
    
    
] 
export const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
export const BACKEND_URL_PRIVATE = process.env.BACKEND_URL_PRIVATE






