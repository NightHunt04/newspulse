// Below goes your nasa api key
const NASA_API_KEY = 'NASA_API_KEY'

// DOM
const nasaContentWrapper = document.querySelector('.nasa-content'),
randomAPODBtn = document.querySelector('.view-random-aopd'),
marsPhotosBtn = document.querySelector('.mars-photo'),
apodBtn = document.querySelector('.apod'),
apodContextWrapper = document.querySelector('.apod-context'),
loadRandomAPODBtn = document.querySelector('.load'),
loadMarsPhotosBtn = document.querySelector('.load-mars')

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
    loadRandomAPODBtn.style.display = 'none'
    apodContextWrapper.style.display = 'block'

    const date = data.date,
    explanation = data.explanation,
    title = data.title,
    url = data.url

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

let indexRandomAPOD = 0,
gridContainer

sessionStorage.setItem('isRandomAPODLoaded', false)
let newlyLoaded = false
function setRandomAPOD(data) {
    if(!newlyLoaded) {
        newlyLoaded = true

        gridContainer = document.createElement('div')
        gridContainer.className = 'grid-container'

        let h3 = document.createElement('h3')
        h3.textContent = 'Randomly chosen APODs'

        // const aLoadRandomAPOD = document.createElement('a')
        // aLoadRandomAPOD.className = 'load'
        // aLoadRandomAPOD.textContent = 'Load more'

        nasaContentWrapper.innerHTML = ''
        nasaContentWrapper.appendChild(h3)
        nasaContentWrapper.appendChild(gridContainer)
        // nasaContentWrapper.appendChild(aLoadRandomAPOD)

        h3 = null
        apodContextWrapper.style.display = 'none'
        loadRandomAPODBtn.style.display = 'flex'
    }

    for(let i = 0; i < 15; i++) {
        if(indexRandomAPOD > 100) {
            alert('No more random APODs!')
            return
        }

        if(data[indexRandomAPOD].media_type !== 'video') {
            const card = document.createElement('div')
            card.className = 'card'

            const imgWrapper = document.createElement('div')
            imgWrapper.className = 'img-wrapper'

            const img = document.createElement('img')
            img.src = data[indexRandomAPOD].url

            imgWrapper.appendChild(img)

            const imgContent = document.createElement('div')
            imgContent.className = 'img-content'

            const h4 = document.createElement('h4')
            h4.textContent = data[indexRandomAPOD].title

            const date = document.createElement('p')
            date.className = 'date'
            date.textContent = data[indexRandomAPOD].date

            const desc = document.createElement('p')
            desc.className = 'desc'
            desc.textContent = data[indexRandomAPOD].explanation

            imgContent.appendChild(h4)
            imgContent.appendChild(date)
            imgContent.appendChild(desc)

            card.appendChild(imgWrapper)
            card.appendChild(imgContent)
            gridContainer.appendChild(card)
        }
        indexRandomAPOD++
    }
}

loadRandomAPODBtn.addEventListener('click', e => {
    const data = JSON.parse(sessionStorage.getItem('randomAPOD'))
    console.log('clicked on load more')
    setRandomAPOD(data)
})

let indexMars = 0
let newlyMarsLoaded = false
function setMarsPhotos(data) {
    if(!newlyMarsLoaded) {
        newlyMarsLoaded = true
        nasaContentWrapper.innerHTML = ''
        apodContextWrapper.style.display = 'none'
        loadRandomAPODBtn.style.display = 'none'
        loadMarsPhotosBtn.style.display = 'flex'

        marsContainer = document.createElement('div')
        marsContainer.className = 'mars-img-container'

        let h3 = document.createElement('h3')
        h3.textContent = 'Mars Rover Photos'

        nasaContentWrapper.appendChild(h3)
        nasaContentWrapper.appendChild(marsContainer)
    }
    for(let i = 0; i < 10; i++) {
        const card = document.createElement('div')
        card.className = 'card'

        const imgWrapper = document.createElement('div')
        imgWrapper.className = 'img-wrapper'
        const img = document.createElement('img')
        img.src = data.photos[indexMars].img_src
        imgWrapper.appendChild(img)

        const p = document.createElement('p')
        p.className = 'date'
        p.textContent = data.photos[indexMars].earth_date

        card.appendChild(imgWrapper)
        card.appendChild(p)

        marsContainer.appendChild(card)
        indexMars++
    }
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
                setMarsPhotos(data)
                apodBtn.blur()
            }
            else alert('Something went wrong while fetching API!')  
        })
    })