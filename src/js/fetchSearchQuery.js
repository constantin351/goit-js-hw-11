import axios from "axios";

const baseUrl = "https://pixabay.com/api/"
const API_KEY = "34526250-d4c92221e4f75204ff5bed4fd";
const SEARCH_OPTIONS = "image_type=photo&orientation=horizontal&safesearch=true";
export const LIMIT = 40;
    
export async function fetchSearchQuery(searchQuery, pageNumber) {
    try {
        return await axios.get(`${baseUrl}?key=${API_KEY}&q=${searchQuery}&${SEARCH_OPTIONS}&page=${pageNumber}&per_page=${LIMIT}`);
    } catch (error) {
        console.error(error);
    }
}
