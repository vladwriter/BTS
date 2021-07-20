const tl = gsap.timeline();
tl.fromTo('.third', {x: '-50%'}, {x: '-800%'})

const main = document.querySelector('.main__move');
ScrollTrigger.create({
    animation: tl,
    trigger: '.body',
    start: 'top top',
    // end: () => main.offsetWidth / 2,
    end: () => main.offsetWidth,
    scrub: true,
    pin: true
});


const tlMobile = gsap.timeline();
tlMobile.fromTo('.third-mobile', {x: '100%'}, {x: '-810%'})

const mainMobile = document.querySelector('.main__move-mobile');
ScrollTrigger.create({
    animation: tlMobile,
    trigger: '.body',
    start: 'top top',
    end: () => mainMobile.offsetWidth / 0.5,
    scrub: true,
    pin: true
});

