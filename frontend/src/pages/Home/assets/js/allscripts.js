export function loadCardScripts() {
    const scripts = [
        '/src/pages/Home/assets/js/card-scripts.js',
        '/src/pages/Home/assets/js/marqueeHandler.js',
        '/src/pages/Home/assets/js/swiper-bundle.min.js',
    ]

    scripts.forEach(src => {
        const script = document.createElement('script')
        script.src = src
        script.defer = true
        document.body.appendChild(script)
    })
}