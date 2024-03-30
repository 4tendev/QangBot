"use client"
import { Navbar_Height } from '@/settings';
import React, { useEffect } from 'react';

function Main({ children }: { children: React.ReactNode }) {
    useEffect(() => {
       
        
        const mainElement :HTMLElement | null = document.querySelector('.mainContent');
        if (mainElement) {
          mainElement.style.height = (window.innerHeight - Navbar_Height) + 'px';
        }
        
        function handleResize() {
          if (mainElement) {
            mainElement.style.height = (window.innerHeight - Navbar_Height) + 'px';
          }
        }
    
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
  return (
    <main className="w-full  mainContent overflow-auto bg-base-100">
      {children}
    </main>
  );
}

export default Main;