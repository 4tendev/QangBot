import type { Metadata } from "next";
import localFont from "next/font/local"
import "./globals.css";
import getdir from "@/commonTsServer/getDir";
import getlanguage from "@/commonTsServer/getLanguage";
import getTheme from "@/commonTsServer/getTheme";
import dictionary from "./dictionary.json"
const myVazirFont =  localFont({src:"../public/Vazirmatn.ttf"})
const  myPoppinsFont =  localFont({src:"../public/Poppins-Regular.ttf"})
import { StoreProvider } from "./StoreProvider";




export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const language =  getlanguage()
  const direction =  getdir()
  const theme =  getTheme()

  const title = dictionary.WebSiteName[language]  ?? "WebSiteName"

  const metadata: Metadata = {
    title:title,
    description: "A platform for automated trading",
  };



  return (
    <StoreProvider >
    <html lang={language}  dir={direction}>
     
      <body className={direction ==="ltr" ?   myPoppinsFont.className  : myVazirFont.className  } data-theme={theme} >
        {children}
      </body>
    </html>
    </StoreProvider>

  );
}
