//const api

const apikey = "08a493be2f1af33ed9cda67abb1b9c15";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original"
const apiPaths = {
    fetchAllCategories: `${apiEndpoint}//genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,//it shows url for everyobj


    fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,

    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyAb7bMts90-3apuVwYEYpZeNs3lUekvwZU` //cause it takes argument
}

//Boots up the app

function init() {
    //fetchAndBuildMovieSection(apiPaths.fetchTrending, 'Trending Now')
    fetchTrendingMovies()
    fetchAndBuildMovieSection()
    fetchAndBuildAllCategories();
    searchMovieTrailer()
    /*fetch(apiPaths.fetchAllCategories)
        .then(res => res.json())
        .then(res => console.log (res.genres))
        .catch(err => console.error(err));*/
}

function fetchTrendingMovies() {
    fetchBuildMovieSection(apiPaths.fetchTrending, 'Trending Now')

        .then(List => {
            const randomIndex = parseInt(Math.random() * List.length)
            buildBannerSection(List[randomIndex])
        }).catch(err => {
            console.error(err)
        })
}

function buildBannerSection(movie) {  //for banner
    const bannerCont = document.getElementById('banner-section')
    bannerCont.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;

    const div = document.createElement('div');
    div.innerHTML = `
            <h2 class="banner-title">${movie.name && movie.name.value !== name ? movie.name : movie.title} </h2>
            <p class="banner">Trending in movie | Released-${movie.popularity}</p>
            <p class="following-demo">${movie.overview && movie.overview.length > 200 ? movie.overview.slice(0, 200).trim() + '...' : movie.overview}</p>
            <div class="action-buton-cont">
                <button class="action-buttom"> <i class="fa-solid fa-play"></i>play</button>
                <button class="actions-buttom"> <i class="fa-sharp fa-solid fa-circle-info"></i>More Info</button>
            </div>`

    bannerCont.append(div)
}

function fetchAndBuildAllCategories() {
    fetch(apiPaths.fetchAllCategories)
        .then(res => res.json())
        .then(res => {
            const categories = res.genres;
            if (Array.isArray(categories) && categories.length) {
                categories.slice(0, 6).forEach(category => {
                    fetchAndBuildMovieSection(apiPaths.fetchMoviesList(category.id), category);
                })
                //buildMovieSection();
            }
            //console.table(categories)
        })
        .catch(err => console.error(err));
}

function fetchAndBuildMovieSection(fetchUrl, category) {
    console.log(fetchUrl, category);
    fetch(fetchUrl)
        .then(res => res.json())
        .then(res => {
            console.log(res.results);
            const movies = res.results;
            if (Array.isArray(movies) && movies.length) {
                buildMoviesSection(movies.slice(0, 6), category.name)

            }


        })
        .catch(err => console.error(err))
}

function fetchBuildMovieSection(fetchUrl, categoryName) {//for trending banner
    console.log(fetchUrl, categoryName);
    return fetch(fetchUrl)
        .then(res => res.json())
        .then(res => {
            console.log(res.results);
            const movies = res.results;
            if (Array.isArray(movies) && movies.length) {
                buildMoviesSection(movies.slice(0, 6), categoryName)
            }
            return movies;
        })
        .catch(err => console.error(err))
}

function buildMoviesSection(List, categoryName) {
    console.log(List, categoryName)

    const moviesCont = document.getElementById("movies-cont");

    const movieListHTML = List.map(item => { // if we need this onclick we have to put inside img tag for showingmovie trailer in youtube onClick="searchMovieTrailer('${item.title}')
        return `
        <div class="movie-item" onmouseenter ="searchMovieTrailer('${item.title}','yt${item.id}')">
        <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}"onClick="searchMovieTrailer('${item.title}')"> 
        <div class="iframe-wrap"  id="yt${item.id}"></div>
        </div>`;

    }).join('');

    const movieSectionHTML = `
    <h2 class = "moviess">${categoryName}<span class="explore">Explore All</span></h2>
    <div class="movies-row">
    ${movieListHTML}
    </div>

    `
    /* const name = "Janaki";
     const greet = "Hello " + name;
     const greet2 = `Hello ${name}`;*/


    console.log(movieSectionHTML)

    const div = document.createElement('div');
    div.className = "movies-section";
    div.innerHTML = movieSectionHTML;


    //append html into movie container


    moviesCont.append(div);
}

function searchMovieTrailer(movieName, iframId) {
    if (!movieName)
        return
    fetch(apiPaths.searchOnYoutube(movieName))
        .then(res => res.json())
        .then(res => {
            console.log(res.items[0])
            const bestResult = res.items[0];
            const elements = document.getElementById(iframId);
            console.log(elements, iframId)
            //const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`
            //console.log(youtubeUrl);
            //window.open(youtubeUrl, '_blank')
            const div = document.createElement('div');
            div.innerHTML = `<iframe width="200px" height="200px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`
            elements.append(div);
        })
        .catch(err => {
            console.error(err)
        })
}

window.addEventListener('load', function () { //${bestResult.id.videoId}
    init();


    window.addEventListener('scroll', function () {
        //header update

        const header = document.getElementById('header');

        if (this.window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg')
    })
})