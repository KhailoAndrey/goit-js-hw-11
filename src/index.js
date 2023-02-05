import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';
// import { findLastIndex } from 'lodash';
const userId = '33355093-a15ac59f0161a10cfc7b50674';
const requestUrl = 'https://pixabay.com/api/?';
const emptyRequest =
  'Sorry, there are no images matching your search query. Please try again.';
const endOfRequest =
  "We're sorry, but you've reached the end of search results.";
const formRequest = document.querySelector('#search-form');
const galleryDesk = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
// const findText = '';
let totalHits = 0;
// const totalImagesInRequest = `'Hooray! We found ${totalHits} images.'`;
let numPage = 1;
const per_page = 40;
let responseArray = [];
let webformatURL = null;
let largeImageURL = null;
let tags = null;
let likes = 0;
let views = 0;
let comments = 0;
let downloads = 0;

formRequest.addEventListener('submit', e => {
  e.preventDefault();
  numPage = 1;
  const findText = formRequest.elements.searchQuery.value.trim();
  console.log(findText);

  async function getImage() {
    // try {
    const request = await axios({
      url: `${requestUrl}`,
      params: {
        key: userId,
        q: findText,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: per_page,
        page: numPage,
      },
    });
    totalHits = request.data.totalHits;
    const pageGroup = totalHits / per_page;
    console.log(pageGroup);
    responseArray = [];
    for (const elem of request.data.hits) {
      webformatURL = elem.webformatURL;
      largeImageURL = elem.largeImageURL;
      tags = elem.tags;
      likes = elem.likes;
      views = elem.views;
      comments = elem.comments;
      downloads = elem.downloads;
      responseArray.push({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      });
    }
    console.log(responseArray);
    totalMessage(totalHits);
    // return request.data;
  }
  getImage().then(() => {
    numPage += 1;
    loadBtn.removeAttribute('hidden');

    createCardImage(responseArray);
    console.log;
  });
});
function createCardImage(responseArray) {
  const markup = responseArray
    .map(
      arrItem => `
       
      <a class="image-link" href="${arrItem.largeImageURL}">
        <div class="photo-card">
        <img class="gallery-image" src="${arrItem.webformatURL}" alt="${arrItem.tags}" loading="lazy" width=320px height=215px/>
        
<div class="info">
<ul>
<li>
<p class="info-item">
<b>Likes</b>
</p>
<p>
${arrItem.likes}
</p>
</li>
<li>
<p class="info-item">
<b>Views</b>
</p>
<p>
${arrItem.views}
</p>
</li>
<li>
<p class="info-item">
<b>Comments</b>
</p>
<p>
${arrItem.comments}
</p>
</li>
<li>
<p class="info-item">
<b>Downloads</b>
</p>
<p>
${arrItem.downloads}
</p>
</li>
</ul>
</div>
        </div>
        </a>
        `
    )
    .join('');
  galleryDesk.innerHTML = markup;
}
let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

galleryDesk.addEventListener('click', event => {
  event.preventDefault();
  gallery.on('show.Simplelightbox');
});

function emptyMessage() {
  Notiflix.Notify.info(`${emptyRequest}`);
}

function endMessage() {
  Notiflix.Notify.info(`${endOfRequest}`);
}

function totalMessage(totalHits) {
  Notiflix.Notify.info(`'Hooray! We found ${totalHits} images.'`);
}
