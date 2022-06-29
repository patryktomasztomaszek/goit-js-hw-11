// Local storage key for favorites: 'favorites-array'

// Initializing internal scripts
import { getFavorites } from './pixabay-api-handler.js';
import { renderImages } from './renderImages.js';
import {
  favButtonsAndLightboxHandler,
  // displayHeartIfInArray,
} from './favButonsAndLightboxHandler.js';

// Variable for handling local web storage
let favoritesArrayBuffer = [];

// Variable for handling API requests
let displayFavBuffer = [];
let displayFavBufferSingle = [];

// Variable for favorites display
const display = document.querySelector('[display]');

// - - - - - INTERNAL FUNCTIONS - - - - -

// Function for updating buffer variable with local web storage
function updateBuffer() {
  const buffer = JSON.parse(localStorage.getItem('favorites-array'));
  if (buffer !== null) {
    return (favoritesArrayBuffer = buffer);
  }
}

// Checking if present in favorites array
function checkDuplicate(id) {
  updateBuffer();
  if (favoritesArrayBuffer.includes(id) === false) {
    return false;
  } else {
    return true;
  }
}

// - - - - -INTERNAL FUNCTIONS END - - - - -

export function addOrRemoveToFavorites(event) {
  // Variables for storing id number of event id,
  // and buffer for local web storage for simpler handling
  const id = event.target.id;

  // Check if there is no duplicate, and then
  // accordingly to situation,
  // store favorite image id in local web storage,
  // or delete it from favorites
  if (checkDuplicate(id)) {
    updateBuffer();
    favoritesArrayBuffer.splice(favoritesArrayBuffer.indexOf(id), 1);

    localStorage.setItem(
      'favorites-array',
      JSON.stringify(favoritesArrayBuffer)
    );
    event.target.style.filter = 'grayscale()';
  } else {
    updateBuffer();

    favoritesArrayBuffer.push(id);
    localStorage.setItem(
      'favorites-array',
      JSON.stringify(favoritesArrayBuffer)
    );
    event.target.style.filter = 'none';
  }
}

export function displayFavorites() {
  updateBuffer();
  displayFavBuffer = [];

  for (const id of favoritesArrayBuffer) {
    if (id !== undefined || id !== null) {
      getFavorites(id)
        .then(response => {
          displayFavBuffer.push(response.data.hits[0]);
          displayFavBufferSingle.splice(0, 1, response.data.hits[0]);

          display.insertAdjacentHTML(
            'beforeend',
            renderImages(displayFavBufferSingle)
          );

          favButtonsAndLightboxHandler();
        })
        .catch(error => console.error(error));
    }
  }
}
