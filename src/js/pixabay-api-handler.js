// Initializing Axios library
import { Axios } from 'axios';
const axios = require('axios').default;

// Pixabay API Key
const PIXABAY_API_KEY = '28170500-383bebb45fc8810a60b241432';
const PIXABAY_URL = 'https://pixabay.com/api/';

// Function for fetching images by search query
export async function getImages(searchQuery, pageCount) {
  try {
    const response = await axios.get(PIXABAY_URL, {
      params: {
        key: PIXABAY_API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safeserach: true,
        per_page: 40,
        page: pageCount,
      },
    });
    return response;
  } catch (error) {
    return console.error(`Error: ${error}`);
  }
}

export async function getFavorites(id) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: PIXABAY_API_KEY,
        id: id,
        image_type: 'photo',
        orientation: 'horizontal',
        per_page: 100,
        safeserach: true,
      },
    });
    return response;
  } catch (error) {
    return console.error(`Error: ${error}`);
  }
}
