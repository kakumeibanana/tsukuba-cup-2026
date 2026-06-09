import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

const SLIDES = [
  { src: '/futsal-image.png',  pos: 'center center' },
  { src: '/futsal-image2.png', pos: 'center center' },
  { src: '/futsal-image.png',  pos: 'center 30%'    },
  { src: '/futsal-image2.png', pos: 'center 40%'    },
]

export default function HeroGallery() {
  const progressRef = useRef(null)
  const prevRef     = useRef(null)
  const nextRef     = useRef(null)

  return (
    <section className="gallery-section">
      <div className="gallery-wrap">
        <Swiper
          className="gallery-main"
          modules={[Autoplay, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current
            swiper.params.navigation.nextEl = nextRef.current
            swiper.navigation.init()
            swiper.navigation.update()
          }}
          onAutoplayTimeLeft={(_, __, ratio) => {
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${1 - ratio})`
          }}
          loop
          speed={1400}
          grabCursor
        >
          {SLIDES.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="gallery-slide">
                <img
                  src={slide.src}
                  alt=""
                  className="gallery-slide-img"
                  style={{ objectPosition: slide.pos }}
                />
                <div className="gallery-overlay" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button ref={prevRef} className="gallery-prev gallery-arrow" aria-label="前へ">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button ref={nextRef} className="gallery-next gallery-arrow" aria-label="次へ">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div className="gallery-progress-track">
          <div className="gallery-progress-fill" ref={progressRef} />
        </div>
      </div>
    </section>
  )
}
