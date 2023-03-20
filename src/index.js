import './css/styles.css';
import { fetchSearchQuery } from './js/fetchSearchQuery';
import { pageNumber, limit } from './js/fetchSearchQuery';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector("#search-form");
const galleryBox = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");
// loadMoreBtn.disabled = true;

// console.log(galleryBox);


let searchQuery = '';

//
// let pageNumber = 1;
//

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    searchQuery = event.currentTarget.elements.searchQuery.value.trim();
    console.log(searchQuery);

    // pageNumber += 1;

    try {
        const queryResult = await fetchSearchQuery(searchQuery);
        console.log(queryResult);
        

        // pageNumber += 1;

        const totalHits = queryResult.data.totalHits; //общее количество изображений которые подошли под критерий поиска
        console.log(totalHits);
        
        const queryResultsArray = queryResult.data.hits; //результат поиска (массив с фото)
        console.log(queryResultsArray);

        // loadMoreBtn.classList.add("is-visible");
  
        if (searchQuery === "") { 
                    
                    // Notify.failure("Please fill your query into the search field!");
                    // querySearchArray.length = 0;
            galleryBox.innerHTML = "";
            return;
        }
        
        renderQueryResultsList(queryResultsArray);

        if (queryResultsArray.length === 0 || searchQuery === "") {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            galleryBox.innerHTML = "";
            return;
        } else if (queryResultsArray.length > 0) {
            Notify.info(`Hooray! We found ${totalHits} images.`);
            loadMoreBtn.classList.add("is-visible");
        } 

    } catch (error) {
        console.log(error.message);
    }

    form.reset(); // очищает инпут формы при сабмите
    // galleryBox.innerHTML = "";
});

////
loadMoreBtn.addEventListener("click", async () => {
    // event.preventDefault();

    // const searchQuery = event.currentTarget.elements.searchQuery.value.trim();
    // console.log(searchQuery);

    try {
        const queryResult = await fetchSearchQuery(searchQuery);
        // console.log(queryResult);
        
        const totalHits = queryResult.data.totalHits; //общее количество изображений которые подошли под критерий поиска
        // console.log(totalHits);
        
        const queryResultsArray = queryResult.data.hits; //результат поиска (массив с фото)
        // console.log(queryResultsArray);
        
        loadMoreBtn.classList.add("is-visible");
  
        if (searchQuery === "") { 
                    
                    // Notify.failure("Please fill your query into the search field!");
                    // querySearchArray.length = 0;
                    galleryBox.innerHTML = "";
        }
        
        renderQueryResultsList(queryResultsArray);

        if (queryResultsArray.length === 0 || searchQuery === "") {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            galleryBox.innerHTML = "";
        } else if (queryResultsArray.length > 0) {
            Notify.info(`Hooray! We found ${totalHits} images.`);
        } 



    } catch (error) {
        console.log(error.message);
    }
});




function renderQueryResultsList(queryResultsArray) {
    const markup = queryResultsArray
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `
            <div class="photo-card">
               <a class="photo-card__link" href="${largeImageURL}">
                    <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
               </a>
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b> ${likes}
                    </p>
                    <p class="info-item">
                        <b>Views</b> ${views}
                    </p>
                    <p class="info-item">
                        <b>Comments</b> ${comments}
                    </p>
                    <p class="info-item">
                        <b>Downloads</b> ${downloads}
                    </p>
                </div>
            </div>
            `
        })
        .join("");
    galleryBox.insertAdjacentHTML("beforeend", markup);

    var lightbox = new SimpleLightbox('.gallery a');

    lightbox.refresh(); // КУДА СТАВИТЬ?
}
