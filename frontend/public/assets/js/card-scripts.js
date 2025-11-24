// Card Scripts Initialization
    document.addEventListener("DOMContentLoaded", function () {
        // Initialize the first swiper (City)
        const swiperMulti = new Swiper('.swiper.is-city', {
            speed: 800,
            slidesPerView: 3,
            spaceBetween: 20,
            // autoplay: {
            // delay: 3000,
            // },
            navigation: {
                nextEl: '.swiper-btn-next',
                prevEl: '.swiper-btn-prev',
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                // when window width is >= 1024px (desktop)
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                },
                // when window width is >= 768px (tablet)
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                // when window width is < 768px (mobile)
                0: {
                    slidesPerView: 1.25,
                    spaceBetween: 20,
                }
            }
        });
        // Initialize the second swiper (Photos)
        const swiperCard = new Swiper('.swiper.is-photos', {
            effect: "cards",
            grabCursor: true,
            loop: true,
            pagination: {
                el: '.swiper-pagination.photos',
            },
        });
    });
