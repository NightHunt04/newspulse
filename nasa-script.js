const NASA_API_KEY = 'ZahrlmtmO6nHKcAsOWgLygV27sZlXDje5BUgBRGP'

// DOM
const nasaContentWrapper = document.querySelector('.nasa-content'),
randomAPODBtn = document.querySelector('.view-random-aopd'),
marsPhotosBtn = document.querySelector('.mars-photo'),
apodBtn = document.querySelector('.apod'),
apodContextWrapper = document.querySelector('.apod-context')

const PROMISES = [
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`)
        .then(response => response.json()),
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&count=100`)
        .then(response => response.json()),
    fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=1&api_key=${NASA_API_KEY}`) 
        .then(response => response.json())
]

apodBtn.focus()

let isFetched = [false, false, false]
Promise.allSettled(PROMISES)
    .then(response => {
        console.log(response)
        /*  0: apod single image
            1: other apod multiple images
            2: mars photo   */
            
        for(let ind = 0; ind < response.length; ind++) {
            if(response[ind].status === 'fulfilled') {
                isFetched[ind] = true

                if(ind === 0) {
                    sessionStorage.setItem('APOD', JSON.stringify(response[ind].value))
                    setAPOD(response[ind].value)
                }

                else if(ind === 1)  
                    sessionStorage.setItem('randomAPOD', JSON.stringify(response[ind].value))

                else sessionStorage.setItem('marsPhotos', JSON.stringify(response[ind].value))
            }
        }
    })

// this function will set the html data after the promise is resolved successfully of APOD
function setAPOD(data) {
    const date = data.date,
    explanation = data.explanation,
    title = data.title,
    url = data.url

    apodContextWrapper.style.display = 'block'

    const h3 = document.createElement('h3')
    const span = document.createElement('span')
    span.className = 'date'
    span.textContent = `(${date})`

    h3.textContent = title
    h3.appendChild(span)

    const divImgWrapper = document.createElement('div')
    divImgWrapper.className = 'img-wrapper'

    const img = document.createElement('img')
    img.src = url

    divImgWrapper.appendChild(img)

    const p = document.createElement('p')
    p.textContent = explanation

    nasaContentWrapper.innerHTML = ''

    nasaContentWrapper.appendChild(h3)
    nasaContentWrapper.appendChild(divImgWrapper)
    nasaContentWrapper.appendChild(p)
}

document.querySelectorAll('.left-item button')
    .forEach(butn => {
        butn.addEventListener('click', e => {
            if((butn.className === 'apod' || butn.className === 'apod active') && isFetched[0]) {
                const data = JSON.parse(sessionStorage.getItem('APOD'))
                setAPOD(data)
                console.log('apod', data)
            }
            else if((butn.className === 'view-random-apod' || butn.className === 'view-random-apod active') && isFetched[1]) {
                const data = JSON.parse(sessionStorage.getItem('randomAPOD'))
                console.log('randomApod', data)
                setRandomAPOD(data)
                apodBtn.blur()
            }
            else if((butn.className === 'mars-photo' || butn.className === 'mars-photo active') && isFetched[2]) {
                const data = JSON.parse(sessionStorage.getItem('marsPhotos'))
                console.log('marsPhotots', data.photos)
                apodBtn.blur()
            }
            else alert('Something went wrong while fetching API!')  
        })
    })

let indexRandomAPOD = 0
function setRandomAPOD(data) {
    for(let i = 0; i < 15; i++) {
        console.log(data[i].media_type)
    }
}

