import { Language } from "@/settings";
import dictionary from "./dictionary.json"
export default function responseMessage(selectedDictionary:{[key: string]: {[key: string] : string }} , lang : Language , code:string ) :string {

    switch (code) {
        case "500":
            return  dictionary["500"][lang]
        default:
            break;
    }
    try {
        const response = selectedDictionary[code][lang]
        return response
        
    } catch (error) {

        return  dictionary.unknownCode[lang]
        
    }
   
    
}