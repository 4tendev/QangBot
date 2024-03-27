import type { Metadata } from "next";
import localFont from "next/font/local"

import getlanguage from "@/commonTsServer/getLanguage";
import getTheme from "@/commonTsServer/getTheme";
import "./globals.css";

import { StoreProvider } from "./StoreProvider";
import Navbar from "./navbar/Navbar"
import Main from "./Main";
import dictionary from "./dictionary.json"


const myVazirFont =  localFont({src:"../public/Vazirmatn.ttf"})
const  myPoppinsFont =  localFont({src:"../public/Poppins-Regular.ttf"})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const language =  getlanguage()
  const lang = language.lang
  const direction =  language.dir
  const theme =  getTheme()

  const title = dictionary.WebSiteName[lang]  
  const description = dictionary.WebSiteDis[lang]

  const metadata: Metadata = {
    title,
    description,
  };



  return (
    <StoreProvider >
      <html lang={lang}  dir={direction}  data-theme={theme}>
        <body className={(direction ==="ltr" ?   myPoppinsFont.className  : myVazirFont.className)  +  " h-screen w-screen " } >
          <Navbar />
          <Main >
              {children}
          </Main>
        </body>
      </html>
    </StoreProvider>

  );
}
