const form = document.getElementById('search-form');
const newsList = document.getElementById('news');

// Ваш ключ News API
const API_KEY = '3265fcd825514c12a8ea3111a4277a6f';
const BASE_URL = 'https://newsapi.org/v2/everything';

form.addEventListener('submit', onSearch);


function onSearch(event) {
  event.preventDefault();
  const query = form.elements.query.value.trim();

  if (!query) {
    PNotify.error({ text: 'Введіть пошуковий запит!' });
    return;
  }

  newsList.innerHTML = '';
  fetchNews(query)
    .then(data => {
      if (data.articles.length === 0) {
        PNotify.notice({ text: 'Новин не знайдено 😔' });
        return;
      }

      renderArticles(data.articles);
    })
    .catch(error => {
      PNotify.error({ text: error.message });
    });
}


function fetchNews(query) {
  const url = `${BASE_URL}?q=${query}&pageSize=12&apiKey=${API_KEY}`;
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Помилка запиту до News API');
      }
      return response.json();
    });
}

// ===== 3. Функція для рендеру статей =====
function renderArticles(articles) {
  const markup = articles.map(article => createArticleMarkup(article)).join('');
  newsList.innerHTML = markup;
}

// ===== 4. Шаблон для однієї статті =====
function createArticleMarkup(article) {
  return `
    <li class="news-item">
      <a href="${article.url}" target="_blank" rel="noopener noreferrer">
        ${article.title}
      </a>
      <p>${article.description || ''}</p>
    </li>
  `;
}