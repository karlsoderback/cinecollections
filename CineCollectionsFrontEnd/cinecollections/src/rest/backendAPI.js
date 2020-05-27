const baseURL = process.env.REACT_APP_BACKEND_API_ADDRESS + ":" + process.env.REACT_APP_BACKEND_API_PORT + "/";

export function sendBackendPOST(url, body) {
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
               return response.text().then(text => {throw Error(text)});
             } else {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                   return response.json();
                } else {
                   return response.text();
                }
             }
          });
    }

export function sendAuthorizedBackendPOST(url, body, token) {
   return fetch(baseURL + url,
      {
         method: 'POST',
         headers: {
            'Authorization': "Bearer " + token,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(body),
         mode: 'cors',
      }).then(response => {
         if (!response.ok) {
           return response.text().then(text => {throw Error(text)});
         } else {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
               return response.json();
            } else {
               return response.text();
            }
         }
      });
}

    
export function sendBackendGET(url) {
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
               return response.text().then(text => {throw Error(text)});
            }
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
               return response.json();
            } else {
               return response.text();
            }
          });
    }

export function sendAuthorizedBackendGET(url, token) {
   return fetch(baseURL + url,
      {
         method: 'GET',
         headers: {
            'Authorization': "Bearer " + token,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
         },
         mode: 'cors',
      }).then(response => {
         if (!response.ok) {
            return response.text().then(text => {throw Error(text)});
         } else {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
               return response.json();
            } else {
               return response.text();
            }
         }
      });
   }
