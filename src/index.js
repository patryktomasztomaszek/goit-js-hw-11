// initializing libraries
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Initializing internal scripts
import { getImages } from './js/pixabay-api-handler.js';
import { renderImages } from './js/renderImages.js';
import { favButtonsAndLightboxHandler } from './js/favButonsAndLightboxHandler.js';
import { displayFavorites } from './js/favoritesHandler.js';

// Seleting search form elements
const input = document.querySelector('[search-input]');
const submit = document.querySelector('[search-submit]');

// Selecting Favorite button
const favButton = document.querySelector('[display-favorites]');

// Selecting search result display
export const display = document.querySelector('[display]');

// Variables
let searchQuery = '';
export let pageCount = 1;

// Function for purging display and resetting page count
function resetSearch() {
  display.innerHTML = '';
  pageCount = 1;
}

// Check for 'favorite-array' key in local storage,
// if null , create key with '[]' value
if (localStorage.getItem('favorites-array') === null) {
  localStorage.setItem('favorites-array', '[]');
  console.log('Ls created');
}

// Function for infinite scrolling
function loadMore() {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 5
  ) {
    pageCount++;
    getImages(searchQuery, pageCount)
      .then(response => {
        // Ckeching for end of hits,
        // Then removing infinite scroll listener
        if (response.data.hits.length < 40) {
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
          window.removeEventListener('scroll', loadMore, { passive: true });
        }
        display.insertAdjacentHTML(
          'beforeend',
          renderImages(response.data.hits)
        );
        favButtonsAndLightboxHandler();
      })
      .catch(error => console.error(error));
  }
}

// - - - - - MAIN FUNCTION - - - - -
// Search event handler
function searchEventHandler(event) {
  event.preventDefault();
  resetSearch();

  searchQuery = input.value.split(' ').join('+'); //Keeping search input value for pagination

  // Check if search query is empty,
  // notify if it is
  if (input.value === '' || searchQuery === '') {
    return Notify.failure('No dice. Fill in something!~');
  }

  getImages(searchQuery, pageCount).then(response => {
    // Check for any hits and purge display
    if (response.data.total === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    display.insertAdjacentHTML('beforeend', renderImages(response.data.hits));

    favButtonsAndLightboxHandler();

    if (response.data.totalHits > 40) {
      window.addEventListener('scroll', loadMore, { passive: true });
    }

    if (pageCount > 1) {
      const { height: cardHeight } = document
        .querySelector('.gallery .gallery__item')
        .getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  });
}

// - - - - - MAIN FUNCTION END - - - - -

// initializing serach form event listener
submit.addEventListener('click', searchEventHandler);

// - - - - - TEST GROUND - - - - -
// Function for handling favorites display
function favDisplayHandler() {
  window.removeEventListener('scroll', loadMore, { passive: true });
  resetSearch();

  const favArray = JSON.parse(localStorage.getItem('favorites-array'));

  if (favArray === null || favArray !== 0) {
    displayFavorites();
  } else {
    Notify.info(
      'Your favorites list is empty! Find something you love... And add it!'
    );
  }
}
//  Setting event listener on favorite button
favButton.addEventListener('click', favDisplayHandler);
