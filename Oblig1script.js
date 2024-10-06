
/**
 * Weather - page
 * 
 */

//List of coordinates to cities
const coordinates = [
    {latitude: 35.6895, longitude: 139.6917, city: 'Tokyo'},
    {latitude: 60.88191, longitude: 11.56231, city: 'Elverum'},
    {latitude: 59.91273, longitude: 10.74609, city: 'Oslo'},
    {latitude: 40.71427, longitude: -74.00597, city: 'New York'},
    {latitude: 48.85341, longitude: 2.3488, city: 'Paris'},
    {latitude: 25.07725, longitude: 55.30927, city: 'Dubai'}
];

//Function to fetch weather data from API
async function getweather(latitude, longitude) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);

    //If the response is not okay, throw an error
    if (!response.ok) {
        throw new Error("Error with the status: " + response.status);
    }
    return response.json();
}


// Function to display weather data for each city in array
async function weatherdisplay() {
    const container2 = document.getElementById('weather-container')

        //Clear any previous content in container
        container2.innerHTML = "";

    //Loop through each set of coordinates
    for (const coord of coordinates) {
    try {

        //Fetch weather data for the current city's coordinates
        const weatherdata = await getweather(coord.latitude, coord.longitude);

        //Check if weather data contains current weather info
        if(weatherdata && weatherdata.current_weather) {
            const { temperature, winddirection, windspeed, weathercode} = weatherdata.current_weather;

            //Creates elements to hold info, and display them
            const article = document.createElement("article");

            //Append elements to article, and add to the container
            const temp = document.createElement("h1");
            temp.innerText = `Temperature: ${temperature}°C`;
            const city = document.createElement('h2');
            city.innerText = coord.city;
            const info = document.createElement("p");
            info.innerText = `Wind: ${windspeed} km/h, Direction ${winddirection}°, Weather Code: ${weathercode}`;
            

            article.appendChild(city);
            article.appendChild(temp);
            article.appendChild(info);
            container2.appendChild(article);

                
        } else {
            console.error(`Weather Data for ${coord.city} not found`);
        }
    //Catch and log any errors that occur while fetching weather data
    } catch (error) {
        console.error(`Failed to fetch weather data for ${coord.city}:`, error);
    }
    }
    
}

//Calling function to display weather information when page loads
weatherdisplay();



/**
 * ABOUT - Page
 */

//Variables to control page and loding state
    let start = 0;
    let limit = 3;
    let isLoading = false;
    let allPostsLoaded = false;

//Function to fetch posts data from the API
function fetchHomeData() {

    //Prevent fetching if data already is loading or have been loaded
    if(isLoading || allPostsLoaded) return;     

    isLoading = true; //loading state to true

    //Fetching data from API with start and limit
    fetch(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`)
    .then((response) => {
        //If response is not okay, throw error
        if (!response.ok) {
            throw new Error("Error with the status: " + response.status);
        }
        return response.json();
    })
    .then((posts) => {
        //console.log(posts);

        let container = document.getElementById("main-container");

        //Clear the container if it's the first set of posts
        if(start == 0) {
            container.innerHTML = "";
        }

        //If no post have returned, all posts have been loaded
        if(posts.length == 0) {
            allPostsLoaded = true;
            return;
        }

        //Loop through each post and display its data
        for (post of posts) {
                const article = document.createElement("article");
                const id = document.createElement("h1");
                const title = document.createElement("h2");
                title.textContent = post.title;
                const body = document.createElement("p");
                body.textContent = post.body;
                article.appendChild(id);
                article.appendChild(title);
                article.appendChild(body);
                container.appendChild(article);
                id.textContent = `ID: ${post.id}`;
            
        }

        //Increase the start value for next set of posts
        start += limit;
    })

    .finally(() => { 
        isLoading = false; //Set loading state to false once data has been fetched
    });
}



// Function to check if user has scrolled to the bottom of the page
function pageCheck() {
    const {scrollTop, scrollHeight, clientHeight } = document.documentElement;

    //If user has scrolled to bottom, fetch more posts
    if (scrollTop + clientHeight >= scrollHeight -1 ) {
        fetchHomeData();
    }
}


//Eventlistener for scroll function
window.addEventListener('scroll', pageCheck);

//Initioal fetch of posts when page loads
fetchHomeData();




