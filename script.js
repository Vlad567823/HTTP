const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');

const API_KEY = '3265fcd825514c12a8ea3111a4277a6f';
const BASE_URL = 'https://newsapi.org/';

form.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();

  const query = event.currentTarget.elements.query.value.trim();

  if (!query) {
    PNotify.error({ text: 'Введіть пошуковий запит!' });
    return;
  }

  gallery.innerHTML = '';

  fetchImages(query)
    .then(images => {
      if (images.length === 0) {
        PNotify.notice({ text: 'Нічого не знайдено 😔' });
        return;
      }

      gallery.innerHTML = createMarkup(images);
    })
    .catch(error => {
      PNotify.error({ text: error.message });
    });
}

function fetchImages(query) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&per_page=12`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Помилка запиту до сервера');
      }
      return response.json();
    })
    .then(data => data.hits);
}

function createMarkup(images) {
  return images
    .map(image => `
      <li>
        <img src="${image.webformatURL}" alt="${image.tags}">
        <p>❤️ ${image.likes}</p>
      </li>
    `)
    .join('');
}