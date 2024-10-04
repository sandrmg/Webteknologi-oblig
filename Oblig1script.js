
/**
 * Weather - page
 * 
 */


const coordinates = [
    {latitude: 35.6895, longitude: 139.6917, city: 'Tokyo'},
    {latitude: 60.88191, longitude: 11.56231, city: 'Elverum'},
    {latitude: 59.91273, longitude: 10.74609, city: 'Oslo'},
    {latitude: 40.71427, longitude: -74.00597, city: 'New York'},
    {latitude: 48.85341, longitude: 2.3488, city: 'Paris'},
    {latitude: 25.07725, longitude: 55.30927, city: 'Dubai'}
];


async function getweather(latitude, longitude) {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    if (!response.ok) {
        throw new Error("Error with the status: " + response.status);
    }
    return response.json();
}



async function weatherdisplay() {
    const container2 = document.getElementById('weather-container')

        container2.innerHTML = "";

    
    for (const coord of coordinates) {
    try {

        const weatherdata = await getweather(coord.latitude, coord.longitude);

        if(weatherdata && weatherdata.current_weather) {
            const { temperature, winddirection, windspeed, weathercode} = weatherdata.current_weather;

            const article = document.createElement("article");

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
    } catch (error) {
        console.error(`Failed to fetch weather data for ${coord.city}:`, error);
    }
    }
    
}

weatherdisplay();



/**
 * ABOUT - Page
 */

    let start = 0;
    let limit = 3;
    let isLoading = false;
    let allPostsLoaded = false;


function fetchHomeData() {

    if(isLoading || allPostsLoaded) return;     //Fetcher ikke hvis den allered loader eller har loadet 

    isLoading = true;

    fetch(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Error with the status: " + response.status);
        }
        return response.json();
    })
    .then((posts) => {
        //console.log(posts);

        let container = document.getElementById("main-container");
        
        if(start == 0) {
            container.innerHTML = "";
        }

        
        if(posts.length == 0) {
            allPostsLoaded = true;
            return;
        }
        
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

        start += limit;
    })

    .finally(() => { 
        isLoading = false;
    });
}




function pageCheck() {
    const {scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight -1 ) {
        fetchHomeData();
    }
}


//Eventlistener for scroll function
window.addEventListener('scroll', pageCheck);

fetchHomeData();




