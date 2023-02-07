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

const formRequest = document.querySelector('#search-form');
const galleryDesk = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

let numPage = 1;
const per_page = 40;
let totalHits = 0;

//  1. Слушаем форму сабмит и берем слово для поиска.
//  2. Делаем запрос на бекенд используя слово для поиска.
//  3. Получаем массив от бекенда и делаем разметку.
//  4. Подключаем библиотеку SimpleLightBox.
//  5. При нажатии на кнопку Загрузки отправляем следующий запрос на бекенд.
//  6. Добавляем разметку в конец существующей.
//  7. При новом запросе очищаем форму и разметку.

// Слушаем форму
formRequest.addEventListener('submit', async e => {
  e.preventDefault();
  loadBtn.classList.add('visually-hidden');
  numPage = 1;
  galleryDesk.replaceChildren();
  await createCardImage();
  loadBtn.classList.remove('visually-hidden');
  Notiflix.Notify.info(`'Hooray! We found ${totalHits} images.'`);

  galleryLightBox();
});

// Жмем кнопку подгрузки картинок
loadBtn.addEventListener('click', addMarkupImages);

// Запрос на бекенд
async function getImages(findText) {
  try {
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
    // console.log(request.data);
    return request.data;
  } catch (error) {
    emptyMessage();
    console.error(error);
  }
}

// Обработка массива с бекенда
async function createMarkupImages() {
  const findText = formRequest.elements.searchQuery.value.trim();
  const response = await getImages(findText);
  totalHits = response.totalHits;
  const arrayImages = [];
  for (const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } of response.hits) {
    arrayImages.push({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    });
  }
  return arrayImages;
}

// Создание разметки
async function createCardImage() {
  const arrayImages = await createMarkupImages();
  const markup = arrayImages
    .map(
      arrItem => `       
      <a class="image-link" href="${arrItem.largeImageURL}">
        <div class="photo-card">
        <img class="gallery-image" src="${arrItem.webformatURL}" alt="${arrItem.tags}" loading="lazy"/>
        
<div class="info">
<ul>
<li><p class="info-item"><b>Likes</b></p><p>${arrItem.likes}</p></li>
<li><p class="info-item"><b>Views</b></p><p>${arrItem.views}</p></li>
<li><p class="info-item"><b>Comments</b></p><p>${arrItem.comments}</p></li>
<li><p class="info-item"><b>Downloads</b></p><p>${arrItem.downloads}</p></li>
</ul>
</div>
        </div>
        </a>
        `
    )
    .join('');
  galleryDesk.insertAdjacentHTML('beforeend', markup);
}

// Подключаем библиотеку SimpleLightBox.
function galleryLightBox() {
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

// Доп.запрос на бекенд и добавление разметки
async function addMarkupImages() {
  numPage += 1;
  if (numPage > totalHits / per_page) {
    endMessage();
    loadBtn.classList.add('visually-hidden');
  }
  await createCardImage();
  lightbox.refresh();
}

function emptyMessage() {
  Notiflix.Notify.failure(`${emptyRequest}`);
}

function endMessage() {
  Notiflix.Notify.failure(`${endOfRequest}`);
}
