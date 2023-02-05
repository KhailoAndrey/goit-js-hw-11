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
const findText = '';
let numPage = 1;

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
        per_page: 40,
        page: numPage,
      },
    });
    //   console.log(request.data);
    return request.data;
    // } catch (error) {
    //   console.error(error);
    // }
  }
  getImage().then(console.log).catch(emptyMessage());
});

function emptyMessage() {
  Notiflix.Notify.info(`${emptyRequest}`);
}
function endMessage() {
  Notiflix.Notify.info(`${endOfRequest}`);
}
function totalMessage() {
  Notiflix.Notify.info(`${totalImagesInRequest}`);
}
// webformatURL - ссылка на маленькое изображение для списка карточек.
// largeImageURL - ссылка на большое изображение.
// tags - строка с описанием изображения. Подойдет для атрибута alt.
// likes - количество лайков.
// views - количество просмотров.
// comments - количество комментариев.
// downloads - количество загрузок.
