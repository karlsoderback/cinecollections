import React from 'react'

    const Collections = ({ collections }) => {
      return (
        <div>
          <center><h1>Collections</h1></center>
          {collections.map((collection) => (
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">{collection.collection_name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">{collection.creator}</h6>
                <p class="card-text">{collection.films}</p>
              </div>
            </div>
          ))}
        </div>
      )
    };

    export default Collections