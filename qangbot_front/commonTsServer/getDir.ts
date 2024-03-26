import { cookies } from "next/headers";
import { SUPPORTED_DIR } from "@/settings"


type Direction = typeof SUPPORTED_DIR[number];

const getDirection = (): Direction => {

  const direction = cookies().get('dir')?.value as Direction

  return SUPPORTED_DIR.includes(direction)
    ? direction
    : SUPPORTED_DIR[0]
  
}

export default getDirection