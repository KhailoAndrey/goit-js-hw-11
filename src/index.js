import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import { findLastIndex } from 'lodash';
const userId = '33355093-a15ac59f0161a10cfc7b50674';
const requestUrl = 'https://pixabay.com/api/?';
const emptyRequest =
  'Sorry, there are no images matching your search query. Please try again.';
const endOfRequest =
  "We're sorry, but you've reached the end of search results.";
const formRequest = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
// const findText = '';
let totalHits = 0;
// const totalImagesInRequest = `'Hooray! We found ${totalHits} images.'`;
let numPage = 1;
const per_page = 10;
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
    for (elem of request.data.hits) {
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
    createCardImage(responseArray);
    console.log;
  });
});
function createCardImage(responseArray) {
  const markup = responseArray
    .map(
      arrItem => `
        <a>
        <div class="photo-card">
          <img src="${arrItem.webformatURL}" alt="${arrItem.tags}" loading="lazy" />
<div class="info" style="align-items: center">
<ul style="display: flex; list-style: none; align-items: center; gap: 20px">
<li>
<p class="info-item">
<b>Likes</b>
<p>
${arrItem.likes}
</p>
</p>
</li>
<li>
<p class="info-item">
<b>Views</b>
<p>
${arrItem.views}
</p>
</p>
</li>
<li>
<p class="info-item">
<b>Comments</b>
<p>
${arrItem.comments}
</p>
</p>
</li>
<li>
<p class="info-item">
<b>Downloads</b>
<p>
${arrItem.downloads}
</p>
</p>
</li>
</ul>
</div>
        </div>
        </a>
        `
    )
    .join('');
  gallery.innerHTML = markup;
  // gallery.style.display = flex;
}

function emptyMessage() {
  Notiflix.Notify.info(`${emptyRequest}`);
}

function endMessage() {
  Notiflix.Notify.info(`${endOfRequest}`);
}

function totalMessage(totalHits) {
  Notiflix.Notify.info(`'Hooray! We found ${totalHits} images.'`);
}
