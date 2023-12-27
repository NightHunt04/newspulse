// exports.hover_effect = function() {
//     const cards = document.querySelectorAll('.content-wrapper a')

//     if(cards.length){

//     cards.forEach(card => {
//         card.addEventListener('mouseenter', e => {
//             gsap.to('.content-wrapper a .card', {
//                 height: 'auto',
//                 duration: 2
//             })
//             console.log('mouse enter')
//         })
//         card.addEventListener('mouseleave', e => {
//             gsap.to(card, {
//                 height: '600px',
//                 duration: 2
//             })
//         })
//     })
// }


function hover_effect() {
    const cards = document.querySelectorAll('.content-wrapper a')
    console.log(cards)
    console.log(content_wrapper)
    if(cards.length){

        cards.forEach(card => {
            card.addEventListener('mouseenter', e => {
                gsap.to(card.querySelector('.card'), {
                    height: 'auto',
                    duration: 0.4,
                    ease: 'power4.inOut'
                })
                console.log('mouse enter')
            })
            card.addEventListener('mouseleave', e => {
                gsap.to(card.querySelector('.card'), {
                    height: '600px',
                    duration: 0.4,
                    ease: 'power4.inOut'
                })
            })
        })
    }
}

