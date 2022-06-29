export function renderImages(data) {
  const imagesMarkup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        id,
      }) =>
        `
        <div class="gallery__item">
          <a href=${largeImageURL}>
            <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" /> 
          </a>
          <div class="info">
            <p class="info__item">
             <b>Likes</b>
             <span class="info__counter">${likes}</span>
            </p>
           <p class="info__item">
             <b>Views</b>
             <span class="info__counter">${views}</span>
  
           </p>
           <p class="info__item">
             <b>Comments</b>
             <span class="info__counter">${comments}</span>
  
           </p>
           <p class="info__item">
             <b>Downloads</b>
             <span class="info__counter">${downloads}</span>
             
           </p>
           <button class="info__fav-button" id="${id}"></button>
        </div>
      </div>
      `
    )
    .join('');
  return imagesMarkup;
}
