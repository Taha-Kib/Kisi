import './App.css';
import photos from "./photos";
import { useState, useEffect, useRef } from "react";
import logo from './logo.svg'

export default function App() {
  const fullscreenRef = useRef();
  const [slideNumber, setSlideNumber] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [size, setSize] = useState("thumb");
  const [fullImageLoaded, setFullImageLoaded] = useState(false);

  /*Checking if fullscreenRef is defined and modal is open, then set focus on fullscreenRef. 
    Also checking if modal is open, then stop scrolling. 
  */
  useEffect(() => {
    if (fullscreenRef && fullscreenRef.current && openModal) {
      fullscreenRef.current.focus();
    }
    if (openModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [fullscreenRef, openModal])

  /*Configurations for InterSectionObserverApi. Rootmargin is used to effectively expand or shrink the 
    root element's intersection area with the target element (top, right, bottom, left) 
    Threshold represents the percentage of the target element's visibility 
    that must be visible in the root element before the observer's callback function is called
  */
  const observerConfig = {
    rootMargin: "0px 0px 0px 0px",
    threshold: 0.3
  }


  /*  This useeffect hook is for intersection observerApi to load iamges when they come into view
      We use Intersectionobserver in useEffect to ensure that the observer is created and starts observing the target elements when the component mounts
      It fires the callback if target element intersects with viewport. If so, it calls loadImages and unobserves element.
      We are observering all images with attribute: data-src
      The return statement is for cleanup to unobserve all images when unmounted.
  */
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

    return () => {
      images.forEach(image => {
        observer.unobserve(image);
      })
    }
  })

  //This function takes the actual src from data-src and copies it into src so it renders.
  function loadImages(image) {
    image.src = image.dataset.src;
  }

  /*Whenever slideNumberChanges or modal opens, useEffect called
    It checks whether the fullScreenImage has been loaded or not. If it has, it sets the state value to true. THis is to replace placeholder thumb img
  */
  useEffect(() => {
    setFullImageLoaded(false);
  }, [slideNumber, openModal])

  //Called when clicked on image to open modal. We are setting size to full, Slidenumber to the index of img which is clicked and openModal to true
  const handleOpenModal = (index) => {
    setSlideNumber(index);
    setOpenModal(true);
    setSize("full");
  }

  //Called when escape or close button is clicked while modal is open. We are setting size to thumb and openModal to false
  const handleCloseModal = () => {
    setOpenModal(false);
    setSize("thumb");
  }

  //Adds +1 to slide number. If it is last slide, then resets slidenumber to 0
  const nextSlide = () => {
    slideNumber === photos.length - 1 ? setSlideNumber(0) : setSlideNumber(slideNumber + 1)
  }

  //Subtracts -1 from slide number. If it is first slide, then resets slidenumber to last slide
  const prevSlide = () => {
    slideNumber === 0 ? setSlideNumber(photos.length - 1) : setSlideNumber(slideNumber - 1)
  }

  //When modal is open, it checks whether ArrowRight, ArrowLeft or Escape key is pressed and calls functions based on it.
  const handleKeyPressed = (event) => {
    if (event.key === "ArrowRight") {
      nextSlide()
    } else if (event.key === "ArrowLeft") {
      prevSlide()
    } else if (event.key === "Escape") {
      handleCloseModal()
    }
  }


  return (
    <>
      {/* When the modal is opened, we render some buttons along with the fullScreen image. At start we render the thumb size of image as placeholder along with a loader.
          When the fullscreen image is loaded, we replace the thumb image by the full image and remove the loader.
      */}
      {openModal &&
        <div ref={fullscreenRef} tabIndex={0} onKeyDownCapture={handleKeyPressed} className="sliderWrap fade-in" >
          <div className="btnClose" onClick={handleCloseModal}>X</div>
          <div className="btnNext" onClick={nextSlide}>&gt;</div>
          <div className="btnPrev" onClick={prevSlide}>&lt;</div>
          <div className="fullScreenImage">
            <img style={{ display: fullImageLoaded ? 'none' : 'block' }} src={photos[slideNumber].urls["thumb"]} alt="" />
            <img style={{ display: fullImageLoaded ? 'block' : 'none' }} src={photos[slideNumber].urls[size]} alt="" onLoad={() => {
              setFullImageLoaded(true);
            }} />
            {!fullImageLoaded && <span className="loader"></span>}
          </div>
        </div>
      }
      {/* Here we are rendering the pictures. img src at start is set to a placeholder image. When they come into viewport, 
      the useEffect is called and sets src from data-src to src. On click of an image, the fullscreen image is opened */}
      <div className="App">
        <h3 >Photos courtesy of Unsplash and it's users</h3>
        <div className="photoGrid">
          {photos.map((p, index) => (
            <div key={p.id}>
              <img className="fade-in" data-src={p.urls[size]} src={logo} onClick={() => handleOpenModal(index)} alt={`Taken by ${p.user.name}`} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
