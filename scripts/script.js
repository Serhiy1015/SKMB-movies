const apiKey = '5d9bd0db1b2ad96c481abe41217190d2'
const baseUrl = 'https://api.themoviedb.org/3'

const moviesCont = document.querySelector('.actual-movies')
const searchInput = document.getElementById('search-input')
const searchResultsCont = document.querySelector('.search-results')

const modalWrapper = document.querySelector('.modal-film-info')
const modalImg = document.querySelector('.modal-img')
const modalTitle = document.querySelector('.l-modal-title')
const modalSecondTitle = document.querySelector('.l-modal-second-title')
const movieBio = document.querySelector('.bio')
const closeModal = document.querySelector('.modal-close')
const overlay = document.querySelector('.overlay')

const randomFilmButton = document.querySelector('.l-random-film')

const genreLinks = document.querySelectorAll('.fixed-hover-div p')
const sectionH1 = document.querySelector('.section-h1')

const savedMoviesButton = document.querySelector('.l-saved-button')

const popularUrl = `${baseUrl}/movie/popular?api_key=${apiKey}&language=uk`
fetchMovies(popularUrl)

savedMoviesButton.addEventListener('click', () => {
  const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || []
  displayMovies(savedMovies)
  sectionH1.textContent = 'Збережене'
})


function fetchMoviesByGenre(genreId, genreName) {
  const genreUrl = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=uk`
  fetchMovies(genreUrl)
  sectionH1.textContent = genreName
}

genreLinks.forEach(genreLink => {
  genreLink.addEventListener('click', () => {
    const genreId = getGenreId(genreLink.textContent)
    const genreName = genreLink.textContent
    fetchMoviesByGenre(genreId, genreName)
  })
})


function getGenreId(genreName) {
  const genreMap = {
    'Драми': 18,
    'Жахи': 27,
    'Комедії': 35,
    'Фантастика': 878,
    'Детективи': 9648
  }
  return genreMap[genreName]

}

function handleSaveHeart(movie) {
  const saveHeart = document.createElement('span')
  saveHeart.textContent = '+'
  saveHeart.classList.add('add-to-saved')

  saveHeart.addEventListener('click', (event) => {
    event.stopPropagation()
    const movieData = JSON.stringify(movie)

    const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || []
    const isSaved = savedMovies.some(savedMovie => savedMovie.id === movie.id)

    if (isSaved) {
      const movieIndex = savedMovies.findIndex(savedMovie => savedMovie.id === movie.id)
      if (movieIndex !== -1) {
        savedMovies.splice(movieIndex, 1)
        localStorage.setItem('savedMovies', JSON.stringify(savedMovies))
      }
      saveHeart.classList.remove('add-to-saved-active')
    } else {
      savedMovies.push(movie)
      localStorage.setItem('savedMovies', JSON.stringify(savedMovies))
      saveHeart.classList.add('add-to-saved-active')
    }
  })

  const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || []
  const isSaved = savedMovies.some(savedMovie => savedMovie.id === movie.id)

  if (isSaved) {
    saveHeart.classList.add('add-to-saved-active')
  }

  return saveHeart
}

function openModal(movie) {
  modalImg.src = `https://image.tmdb.org/t/p/w342/${movie.poster_path}`
  modalTitle.textContent = movie.title
  modalSecondTitle.textContent = movie.original_title
  movieBio.textContent = movie.overview
  modalWrapper.style.display = 'flex'
  overlay.style.display = 'block'
  document.body.style.overflow = 'hidden'

  const saveHeart = handleSaveHeart(movie)
  const modalContainer = document.querySelector('.modal-container')
  const movieInfoDiv = document.querySelector('.movie-info')
  saveHeart.classList.add('add-to-saved')
  movieInfoDiv.appendChild(saveHeart)

  closeModal.addEventListener('click', () => {
    modalWrapper.style.display = 'none'
    overlay.style.display = 'none'
    document.body.style.overflow = 'auto'
  })
}

function displayMovies(movies) {
  moviesCont.innerHTML = ''

  movies.forEach(movie => {
    const card = document.createElement('div')
    const img = document.createElement('img')
    const title = document.createElement('h2')
    const rating = document.createElement('span')

    img.src = `https://image.tmdb.org/t/p/w342/${movie.poster_path}`

    title.textContent = movie.title
    rating.textContent = `${movie.vote_average}`
    rating.classList.add('rating')

    const saveHeart = handleSaveHeart(movie)

    card.append(img, title, rating, saveHeart)
    card.classList.add('actual-movie-card')
    card.dataset.movie = JSON.stringify(movie)
    moviesCont.appendChild(card)

    card.addEventListener('click', () => {
      openModal(movie)
    })
  })
}






function fetchMovies(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const movies = data.results
      displayMovies(movies)
    })
    .catch(error => {
      console.error('Помилка запиту до API:', error)
    })
}

function handleSearch() {
  const searchTerm = searchInput.value.trim()

  if (searchTerm !== '') {
    const searchUrl = `${baseUrl}/search/movie?api_key=${apiKey}&query=${searchTerm}&language=uk&queryLanguage=uk`
    fetchMovies(searchUrl)
  } else {
    const popularUrl = `${baseUrl}/movie/popular?api_key=${apiKey}&language=uk`
    fetchMovies(popularUrl)
  }
}

function displaySearchResults(results) {
  searchResultsCont.innerHTML = ''

  results.slice(0, 4).forEach(movie => {
    if (!movie.poster_path || (!movie.title && !movie.original_title)) {
      return
    }

    const item = document.createElement('div')
    item.classList.add('search-item-result')

    const img = document.createElement('img')
    const title = document.createElement('h2')
    const titleEnglish = document.createElement('p')
    const titlesWrap = document.createElement('div')
    titlesWrap.classList.add('titles-wrapper')



    const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w342/${movie.poster_path}` : 'замінити_ізображення.jpg'
    img.src = posterPath

    if (movie.title !== movie.original_title) {
      title.textContent = movie.title
      titleEnglish.textContent = movie.original_title
    } else if (movie.title) {
      title.textContent = movie.title
    } else if (movie.original_title) {
      title.textContent = movie.original_title
    }

    titlesWrap.append(title, titleEnglish)
    item.append(img, titlesWrap)
    searchResultsCont.appendChild(item)

    item.addEventListener('click', () => {
      openModal(movie)
    })
  })

  const openAllLink = document.createElement('a')
  openAllLink.classList.add('open-all-link')
  openAllLink.href = 'all.html'
  openAllLink.textContent = 'Відкрити всі'
  if (results.length > 0) {
    searchResultsCont.appendChild(openAllLink)
  } else {
    searchResultsCont.innerHTML = ''
  }
}

function handleSearchInput(event) {
  const searchTerm = event.target.value.trim()

  if (searchTerm !== '') {
    const searchUrl = `${baseUrl}/search/multi?api_key=${apiKey}&query=${searchTerm}&language=uk`
    fetch(searchUrl)
      .then(response => response.json())
      .then(data => {
        const results = data.results
        displaySearchResults(results)
      })
      .catch(error => {
        console.error('Помилка запиту до API:', error)
      })
  } else {
    searchResultsCont.innerHTML = ''
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function fetchRandomMovie() {
  const top100Url = `${baseUrl}/movie/top_rated?api_key=${apiKey}&language=uk&page=1`

  fetch(top100Url)
    .then(response => response.json())
    .then(data => {
      const movies = data.results
      const randomIndex = getRandomNumber(0, movies.length - 1)
      const randomMovie = movies[randomIndex]
      openModal(randomMovie)
    })
    .catch(error => {
      console.error('Помилка запиту до API:', error)
    })
}

document.addEventListener('click', event => {
  const isInsideSearchResults = event.target.closest('.search-results')
  const isSearchInput = event.target.matches('#search-input') || event.target.closest('.search-input')

  if (!isInsideSearchResults && !isSearchInput) {
    searchResultsCont.innerHTML = ''
  }
})

randomFilmButton.addEventListener('click', () => {
  setTimeout(fetchRandomMovie, 200)
})




searchInput.addEventListener('input', handleSearchInput)
