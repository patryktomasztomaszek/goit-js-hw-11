// Initializing Axios library
import { Axios } from 'axios';
const axios = require('axios').default;

// Pixabay API Key
const PIXABAY_API_KEY = '28170500-383bebb45fc8810a60b241432';

// Function for fetching images by search query
export async function getImages(searchQuery, pageCount) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
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
