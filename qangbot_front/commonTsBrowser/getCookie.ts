export default function getCookie(cookieName: string): string | undefined {
    const cookies = document.cookie.split(';');
  
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === cookieName) {
        return decodeURIComponent(value);
      }
    }
  
    return undefined;
  }
  