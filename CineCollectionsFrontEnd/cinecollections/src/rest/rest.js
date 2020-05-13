const baseURL = process.env.REACT_APP_BACKEND_API_ADDRESS + ":" + process.env.REACT_APP_BACKEND_API_PORT + "/";

export function sendPOST(url, body) {
         return fetch(baseURL + url,
          {
             method: 'POST',
             headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
             },
             body: JSON.stringify(body),
             mode: 'cors',
          }).then(response => {
             if (!response.ok) {
                throw response.statusText;
             }
             return response.statusText;
          });
    }
    
export function sendGET(url) {
       return fetch(baseURL + url,
          {
             method: 'GET',
             headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
             },
             mode: 'cors',
          }).then(response => {
             if (!response.ok) {
                throw response.statusText;
             }
             return response.json();
          });
    }
