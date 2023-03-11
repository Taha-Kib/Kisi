import './App.css';
import photos from "./photos";
import { useState, useEffect } from "react";
import logo from './logo.svg'


export default function App() {
  const [slideNumber, setSlideNumber] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [size, setSize] = useState("thumb");
  // const [selected, setSelected] = useState(null);

  const observerConfig = {
    rootMargin: "0px 0px 0px 0px",
    threshold: 0.5
  }

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImages(entry.target);
          observer.unobserve(entry.target);
        }
      })
    }, observerConfig)
    const images = document.querySelectorAll('img[data-src]');
    images.forEach((image) => {
      observer.observe(image);
    });

    return () =>{
      images.forEach(image =>{
        observer.unobserve(image);
      })
    }
  })

  function loadImages(image) {
    // const rect = image.getBoundingClientRect();
    // console.log(rect)
    // console.log(window.innerHeight)
    // if (rect.top < window.innerHeight && rect.bottom > 0) {
    //   if (!image.src) {
    //     console.log()
    //   }
      image.src = image.dataset.src;
    // }
  }
  const handleOpenModal = (index) => {
    setSlideNumber(index);
    setOpenModal(true);
    setSize("full");
  }
  const handleCloseModal = () => {
    setOpenModal(false);
    setSize("thumb");
  }
  const nextSlide = () => {
    slideNumber === photos.length - 1 ? setSlideNumber(0) : setSlideNumber(slideNumber + 1)
  }
  const prevSlide = () => {
    slideNumber === 0 ? setSlideNumber(photos.length - 1) : setSlideNumber(slideNumber - 1)
  }



  return (
    <>
      {openModal &&
        <div className="sliderWrap fade-in">
          <div className="btnClose" onClick={handleCloseModal}>Close</div>
          <div className="btnNext" onClick={nextSlide}>Next</div>
          <div className="btnPrev" onClick={prevSlide}>Previous</div>
          <div className="fullScreenImage fade-in" onClick={handleCloseModal}>
            <img src={photos[slideNumber].urls[size]} alt="" />
          </div>
        </div>
      }

      <div className="App">
        <h3 >Photos courtesy of Unsplash and it's users</h3>
        <div className="photoGrid">
          {photos.map((p, index) => (
            <div key={p.id}>
              <img data-src={p.urls[size]} src={logo} onClick={() => handleOpenModal(index)} alt={`Taken by ${p.user.name}`} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
