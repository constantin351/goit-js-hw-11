import axios from "axios";

let pageNumber = 1;
    // Controls the number of items in the group
let limit = 40;
    // In our case total number of pages is calculated on frontend
// const totalPages = 100 / limit;
export { pageNumber, limit };

///

export async function fetchSearchQuery(searchQuery) {
    const baseUrl = "https://pixabay.com/api/"
    const API_KEY = "34526250-d4c92221e4f75204ff5bed4fd";
    const SEARCH_OPTIONS = "image_type=photo&orientation=horizontal&safesearch=true";

    try {
        pageNumber += 1;
        const response = await axios.get(`${baseUrl}?key=${API_KEY}&q=${searchQuery}&${SEARCH_OPTIONS}&page=${pageNumber}&per_page=${limit}`);
        // console.log(response);
        return response;
        
    } catch (error) {
        console.error(error);
    }
}

// `https://pixabay.com/api/?key=34526250-d4c92221e4f75204ff5bed4fd&q=${searchQuery}
// & image_type=photo & orientation=horizontal & safesearch=true`