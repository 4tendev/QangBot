
export default function setCookie(name :string, value : string, expirationDays :number =0) {
    const date = new Date();
    date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    const expires = expirationDays > 0 ? "expires=" + date.toUTCString() :"";
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}