
class Rest {
   constructor() {}

   sendPOST(restUrl, body) {
       return fetch(restUrl,
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
    
   sendGET(url) {
       return fetch(url,
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

}

module.exports = Rest;