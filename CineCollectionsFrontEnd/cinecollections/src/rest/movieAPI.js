const OMDB_URL = "http://www.omdbapi.com/"; //process.env.REACT_APP_OMDB_API_ADDRESS;
const POSTER_URL = " http://img.omdbapi.com/"; // process.env.REACT_APP_POSTER_API_ADDRESS;

const API_KEY = "dc6335dd"; //process.env.REACT_APP_OMDB_API_KEY;

// TODO - Add const for postersize



export function getFilm(id) {
   return fetch(OMDB_URL + "?i=" + id + "&apikey=" + API_KEY,
   {
      method: 'GET',
      headers: {
         'Accept': 'application/json',
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

export function getPoster(id) {
   return fetch(POSTER_URL + "?i=" + id + "&h=200&apikey=" + API_KEY,
   {
      method: 'GET',
      headers: {
         'Accept': 'application/json',
      },
      mode: 'cors',
   }).then(response => {
      if (!response.ok) {
        return response.text().then(text => {throw Error(text)});
      } else {
         return response.blob();
      }
   });
}
