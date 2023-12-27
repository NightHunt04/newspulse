const NEWS_API_KEY = '0f7e87ab2d6b4a36b5ea1644ba6cc876',
NEWS_URL_ENDPOINT = `https://newsapi.org/v2/top-headlines?apiKey=${NEWS_API_KEY}&language=en`,
OPEN_WEATHER_API_KEY = `abaa2cd9cbad066635281a7a8dbe5bfc`
let CURRENT_WEATHER_URL_ENDPOINT

// DOM
const content_wrapper = document.querySelector('.banner .right .content-wrapper'),
load_more_btn = document.querySelector('.load-more'),
city_temp = document.querySelector('.weather-card .temp-city h2'),
city_name = document.querySelector('.weather-card .temp-city p'),
wind = document.querySelector('.row.wind .res'),
pressure = document.querySelector('.row.pressure .res'),
humidity = document.querySelector('.row.humidity .res'),
weather_desc = document.querySelector('.weather-card .weather-description p'),
weather_desc_icon = document.querySelector('.weather-description .weather-img-wrapper .material-symbols-outlined'),
cursor = document.querySelector('.cursor'),
input_search = document.querySelector('.input-search'),
heading = document.querySelector('.right h2'),
logo = document.querySelector('.logo'),
category_btn = document.querySelector('.categorize-news'),
category_drop_menu = document.querySelector('.categories-drop-down'),
add_more_category = document.querySelector('.add-more'),
input_category = document.querySelector('.input-category'),
cancel_input_category = document.querySelector('.cancel-input-category'),
sources_btn = document.querySelectorAll('.sources button')

// fetch the url and if the response is resolved then calling a function to set the news on cards
let index = 0, news_data

// function to set the data on home
function set_news_data(news_data, load_more = false) {
    if(!load_more)
        content_wrapper.innerHTML = ''

    if(index > news_data.length){
        alert('No more news!')
        return
    }
    let news_counter = 0
    let temp = index
    for(const news of news_data){
        if(temp){
            temp--
            console.log(temp)
            continue
        }
        else{
            if(index > news_data.length){
                alert('no more news')
                return
            }
            if(news_counter === 8){
                break
            }

            const author = news.author,
            description = news.description,
            published_at = news.publishedAt,
            url_content = news.url,
            url_img = news.urlToImage,
            title = news.title

            if(author === null || author === '' || title === null || title === '' || description === null || description === ''){
                index++
                continue
            }
            // console.log('author:', author, '\ndescription:', description)

            const a_tag = document.createElement('a')
            a_tag.target = '_blank'
            a_tag.href = url_content

            const card = document.createElement('div')
            card.className = 'card'
            card.innerHTML = `
                <div class="img-wrapper">
                    <img src="${url_img}" alt="img">
                </div>
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="about-info">
                    <div class="published-by">
                        <span class="material-symbols-outlined">person</span>
                        <p>${author}</p>
                    </div>
                    <p class="published-at">Published at : ${published_at}</p>
                </div>
            `
            a_tag.appendChild(card)
            content_wrapper.appendChild(a_tag)

            index++
            news_counter++
        }
    }
    hover_effect()
    temp = null
}

load_more_btn.addEventListener('click', function(){
    if(news_data !== undefined)
        set_news_data(news_data, true)
})

function set_weather_data(short, weather_data) {
    if(short) {
        const temperature = Math.floor(parseFloat(weather_data.main.temp))
        const wind_speed = (weather_data.wind.speed * 3.6).toFixed(1)

        city_temp.innerHTML = `${temperature}&deg;C`
        city_name.textContent = weather_data.name
        wind.textContent = `${wind_speed}km/h`
        pressure.textContent = `${weather_data.main.pressure}hPa`
        humidity.textContent = `${weather_data.main.humidity}%`
        weather_desc.textContent = weather_data.weather[0].description

        switch(weather_data.weather[0].description.toLowerCase()) {
            case 'clear sky' || 'cloud' || 'few clouds':
                weather_desc_icon.textContent = 'cloud'
                break
            case 'rain':
                weather_desc_icon.textContent = 'rainy'
                break
            case 'snow':
                weather_desc_icon.textContent = 'cloudy_snowing'
                break
            case 'thunderstorm':
                weather_desc_icon.textContent = 'thunderstorm'
                break
            case 'mist':
                weather_desc_icon.textContent = 'mist'
                break
            case 'drizzle':
                weather_desc_icon.textContent = 'rainy_light'
                break
            case 'fog':
                weather_desc_icon.textContent = 'foggy'
                break
        }
    }
}

async function fetchData(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error fetching data');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

function cursor_listener() {
    let cursor = document.querySelector('.cursor')
    let body = document.querySelector('body')

    body.addEventListener('mousemove', e => {
        gsap.to(cursor, {
            x: e.x + 'px',
            y: e.y + 'px'
        })
    })
}
cursor_listener()

// cursor hover effect using gsap
function hover_effect() {
    const a_tags = document.querySelectorAll('.content-wrapper a')
    if(a_tags.length){

        a_tags.forEach(a => {
            const card = a.querySelector('.card')
            const total_card_height = card.querySelector('.img-wrapper img').offsetHeight + card.querySelector('h3').offsetHeight + card.querySelector('p').offsetHeight + card.querySelector('.about-info').offsetHeight

            a.addEventListener('mouseenter', e => {
                if(card.offsetHeight - 30 < total_card_height) {
                    gsap.to(card, {
                        height: `${total_card_height + 60}px`,
                        duration: 0.2,
                        ease: Elastic.easeInOut
                    })
                }
                
                // for cursor
                gsap.to(cursor, {
                    opacity: 1,
                    display: 'flex',
                    width: '150px',
                    height: '150px',
                    innerHTML: `Redirect to<br>original content`
                })

                cursor.addEventListener('mouseenter', e => {
                    gsap.to(cursor, {
                        opacity: 1,
                        display: 'flex',
                        width: '150px',
                        height: '150px',
                        innerHTML: `Redirect to<br>original content`
                    })
                })
            })

            a.addEventListener('mouseleave', e => {
                gsap.to(card, {
                    height: '600px',
                    duration: 0.2,
                    ease: Elastic.easeInOut
                })

                //for cursor
                gsap.to(cursor, {
                    opacity: 0,
                    display: 'none',
                    width: '25px',
                    height: '25px',
                    innerHTML: '',
                })

            })            
        })
    }
}

let is_load_more_btn = false
let is_news_fetched = false
async function fetchApis(latitude, longitude, search = '') {
    let newsApiUrl
    if(search === ''){
        newsApiUrl = `https://newsapi.org/v2/top-headlines?apiKey=${NEWS_API_KEY}&language=en&q=${search}`;
        console.log('no searching')
    }
    else{
        newsApiUrl = `https://newsapi.org/v2/everything?apiKey=${NEWS_API_KEY}&language=en&q=${search}`;
        index = 0
        heading.textContent = search
    }

    try {
      // Fetch News API regardless of geolocation permission
        const newsData = await fetchData(newsApiUrl);

        if(!is_news_fetched)
            is_news_fetched = true

        news_data = newsData.articles
        console.log(news_data)
        set_news_data(newsData.articles)

        if(!is_load_more_btn){
            load_more_btn.style.display = 'block'
            is_load_more_btn = true
        }

        // Only fetch OpenWeather API if geolocation permission is granted
        if (latitude && longitude) {
            const openWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_API_KEY}&units=metric`;
            const weatherData = await fetchData(openWeatherApiUrl);

            set_weather_data(true, weatherData)
        }

        
    } catch (error) {
        console.error('Error fetching one or more APIs:', error.message);
    }
}

logo.addEventListener('click', (e) => {
    index = 0
    fetchApis(null, null, '')
    heading.innerHTML = 'Top Headlines'
    input_search.value = ''
})

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    fetchApis(latitude, longitude);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation. Fetching News API only.");
            fetchApis(); // Fetch News API without coordinates
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
    console.log('Error: Geolocation is not supported by this browser');
}

// function to get the searched news
function search_news() {
    if(!input_search.value)
        return
    fetchApis(null, null, input_search.value)
}

input_search.addEventListener('keydown', e => {
    if(e.key === 'Enter'){
        search_news()
    }
})

let is_active_category_btn = false
category_btn.addEventListener('click', e => {
    if(category_drop_menu.style.display === 'block')
        category_drop_menu.style.display = 'none'
    else 
        category_drop_menu.style.display = 'block'
})
category_drop_menu.addEventListener('click', e => {
    if(e.target.tagName === 'LI'){
        console.log(e.target.textContent)

        if(e.target.textContent === 'Headlines'){
            index = 0
            fetchApis(null, null, '')
            heading.textContent = 'Headlines'
        }
        else
            fetchApis(null, null, e.target.textContent)
        category_drop_menu.style.display = 'none'
    }
})

add_more_category.addEventListener('click', e => {
    console.log('clicked more')
    if(input_category.style.display === 'block' && input_category.value){
        console.log(input_category.value)
        //category_dropdown
        const li = document.createElement('li')
        li.textContent = input_category.value

        category_drop_menu.querySelector('ul').appendChild(li)

        input_category.value = ''
        li = null

    }
    else{
        input_category.style.display = 'block'
        cancel_input_category.style.display = 'block'
    }
})

cancel_input_category.addEventListener('click', e => {
    input_category.value = ''
    input_category.style.display = 'none'
    cancel_input_category.style.display = 'none'
})


const t1 = gsap.timeline()

t1.to('body', {
    overflow: 'hidden'
})
t1.from('.layer .letter', {
    delay: 1,
    stagger: 0.06,
    opacity: 0,
    y: 83,
    duration: 1.2
})
t1.to('.layer .letter', {
    delay: 0.6,
    opacity: 0,
    duration: 0.7,
    display: 'none'
})
t1.to('.blocks .box', {
    delay: 1,
    duration: 1,
    // ease: 'power2.inOut',
    opacity: 0
}, 'a')
t1.to('.layer', {
    display: 'none'
}, 'a')
t1.to('body', {
    overflow: 'auto'
}, 'a')
t1.to('.blocks', {
    display: 'none'
}, 'a')
t1.to('.blocks .box', {
    display: 'none'
}, 'a')

function fetch_thru_source(source) {
    let newsApiUrl = `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${NEWS_API_KEY}`

    fetch(newsApiUrl)
    .then(response => response.json())
    .then(data => {
        news_data = data.articles
        index = 0
        heading.textContent = source
        set_news_data(news_data)
    })
}

sources_btn.forEach(btn => {
    btn.addEventListener('click', e => {
        let source = btn.textContent

        if(is_news_fetched)
            fetch_thru_source(source)
    })
})

