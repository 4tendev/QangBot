"use client"
import { NAVBAR_ID } from '@/settings';
import React, { useEffect } from 'react';

function Main({ children }: { children: React.ReactNode }) {
    useEffect(() => {
       
        const navbarElement  :HTMLElement | null = document.getElementById(NAVBAR_ID);
        const mainElement :HTMLElement | null = document.querySelector('.mainContent');
        const NavbarHeight = navbarElement?.offsetHeight || 80
        if (mainElement) {
          mainElement.style.height = (window.innerHeight -NavbarHeight) + 'px';
        }
        
        function handleResize() {
          if (mainElement) {
            mainElement.style.height = (window.innerHeight - NavbarHeight) + 'px';
          }
        }
    
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
  return (
    <main className="w-full max-w-7xl mx-auto px-5 sm:px-11 py-2  mainContent overflow-auto bg-base-100">
      {children}
    </main>
  );
}

export default Main;