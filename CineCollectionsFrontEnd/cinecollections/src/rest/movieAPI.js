const OMDB_URL = process.env.REACT_APP_OMDB_API_ADDRESS;
const POSTER_URL = process.env.REACT_APP_POSTER_API_ADDRESS;

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;

// TODO - Add const for postersize

export function getFilmById(id) {
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

export function getFilmByTitle(title) {
   return fetch(OMDB_URL + "?t=" + title + "&apikey=" + API_KEY,
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

function getPoster(id) {
   return fetch(POSTER_URL + "?i=" + id + "&h=800&apikey=" + API_KEY,
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

export async function getFilmPoster(id) {
   return await new Promise(resolve => {
       getPoster(id).then(
           poster => {
               resolve(poster);
           }
       )
   });
}
