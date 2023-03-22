import './css/styles.css';
import { fetchSearchQuery } from './js/fetchSearchQuery';
import { LIMIT } from './js/fetchSearchQuery';

import { renderQueryResultsList } from './js/renderQueryResultsList';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

var lightbox = new SimpleLightbox('.gallery a');

const form = document.querySelector("#search-form");
const galleryBox = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

let pageNumber = 1;
let totalSearchResults = 0;
let searchQuery = '';


form.addEventListener("submit", onFormSubmit);

async function onFormSubmit(event) {
    event.preventDefault();
    searchQuery = event.currentTarget.elements.searchQuery.value.trim();
    pageNumber = 1;
    loadMoreBtn.classList.remove("is-visible");
    
    try {
        const queryResult = await fetchSearchQuery(searchQuery, pageNumber); 
        const totalHits = queryResult.data.totalHits; //общее количество изображений которые подошли под критерий поиска
        const queryResultsArray = queryResult.data.hits; //результат поиска (массив с фото)
        totalSearchResults = queryResultsArray.length; //кол-во результатов при каждом запросе (40)
        
        if (searchQuery === "") {  
            Notify.failure("The search field is empty! Please fill your query into the search field!");
            form.reset();
            return;
        }

        if (queryResultsArray.length === 0 || searchQuery === "") {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            galleryBox.innerHTML = "";
            loadMoreBtn.classList.remove("is-visible");
        } else if (queryResultsArray.length > 0) {
            Notify.info(`Hooray! We found ${totalHits} images.`);
            loadMoreBtn.classList.add("is-visible");
            galleryBox.innerHTML = "";
            renderQueryResultsList(queryResultsArray);
            lightbox.refresh();
        }
        
        if (totalHits < LIMIT) { 
            loadMoreBtn.classList.remove("is-visible");
        }

    } catch (error) {
        console.log(error.message);
    }
    
    form.reset();
}



loadMoreBtn.addEventListener("click", onLoadMoreBtnClick);
    
async function onLoadMoreBtnClick() {
    pageNumber += 1;
    
    try {
        const queryResult = await fetchSearchQuery(searchQuery, pageNumber);
        const totalHits = queryResult.data.totalHits;
        const queryResultsArray = queryResult.data.hits;
        totalSearchResults += queryResultsArray.length;

        renderQueryResultsList(queryResultsArray);
        lightbox.refresh();

        // плавная прокрутка страницы
        const { height: cardHeight } = document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth",
        });
        //
           
        if (totalSearchResults > totalHits) {
            loadMoreBtn.classList.remove("is-visible");
            Notify.failure("We're sorry, but you've reached the end of search results.")
        }

    } catch { 
        console.log(error.message);
    }
}





