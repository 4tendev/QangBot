export const LANGUAGES_COOKIE_NAME :"lang" = "lang" 
export const THEME_COOKIE_NAME :"theme" = "theme" 
export const Navbar_Height :number = 80 
export type Language = "en"|"fa"
export type Direction = "ltr" | "rtl"
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







