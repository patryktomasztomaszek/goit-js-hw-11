document.cookie = null;

// initializing libraries
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { throttle } from 'lodash.throttle';

// Initializing internal scripts
import { getImages } from './js/getImages.js';
import { renderImages } from './js/renderImages.js';

// Seleting search form elements
const input = document.querySelector('[search-input]');
const submit = document.querySelector('[search-submit]');

// Selecting search result display
const display = document.querySelector('[display]');

// Variables
let searchQuery = '';
let pageCount = 1;
let lightbox;

// Function for purging display and resetting page count
function resetSearch() {
  display.innerHTML = '';
  pageCount = 1;
}

// Search event handler
const searchEventHandler = event => {
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

    if (typeof lightbox === 'object') {
      lightbox.destroy();
    }
    lightbox = new SimpleLightbox('.gallery__item a');

    // Initializing infinite scroll listener
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
};

// initializing serach form event listener
submit.addEventListener('click', searchEventHandler);

const loadMore = () => {
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
        if (typeof lightbox === 'object') {
          lightbox.destroy();
        }
        lightbox = new SimpleLightbox('.gallery__item a');
      })
      .catch(error => console.error(error));
  }
};
