import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';
const userId = '33355093-a15ac59f0161a10cfc7b50674';
const requestUrl = 'https://pixabay.com/api/?';
const emptyRequest =
  'Sorry, there are no images matching your search query. Please try again.';
const endOfRequest =
  "We're sorry, but you've reached the end of search results.";
const totalImagesInRequest = 'Hooray! We found totalHits images.';
const formRequest = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
// const findText = '';
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
    const pageGroup = request.data.totalHits / per_page;
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
<div class="info">
<p class="info-item">
      <b>Likes</b>${arrItem.likes}
    </p>
    <p class="info-item">
      <b>Views</b>${arrItem.views}
    </p>
    <p class="info-item">
      <b>Comments</b>${arrItem.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${arrItem.downloads}
    </p>
</div>
        </div>
        </a>
        `
    )
    .join('');
  gallery.innerHTML = markup;
  gallery.style.display = displayFlex;
}

function emptyMessage() {
  Notiflix.Notify.info(`${emptyRequest}`);
}
function endMessage() {
  Notiflix.Notify.info(`${endOfRequest}`);
}
function totalMessage() {
  Notiflix.Notify.info(`${totalImagesInRequest}`);
}
