// Imports
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { addOrRemoveToFavorites } from './favoritesHandler.js';

// Function for Handling favorite button on each image,
// And resetting lightbox
export function favButtonsAndLightboxHandler() {
  // Looking for favorites button
  const favoritesArray = document.querySelectorAll('.info__fav-button');

  // Set event listeners for favorite buttons
  for (button of favoritesArray) {
    button.addEventListener('click', addOrRemoveToFavorites);
    if (
      JSON.parse(localStorage.getItem('favorites-array')).includes(button.id)
    ) {
      button.style.filter = 'none';
    }
  }

  // Reset lightbox
  if (typeof lightbox === 'object') {
    lightbox.destroy();
  }
  lightbox = new SimpleLightbox('.gallery__item a');
}
