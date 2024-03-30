
export function fetchapi(endpoint : string , method : "GET" | "POST" |"PATCH" |"PUT" | "DELETE" , data? :object) {

    let rootAddress = window.location.protocol + '//' + window.location.host;
    const url = rootAddress == "http://127.0.0.1:3000" ? "http://127.0.0.1:8000" : ('https://api.' + rootAddress.substring(8))
    return fetch(url + endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: data?   JSON.stringify(data) : null,
      credentials: 'include',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      });

}
