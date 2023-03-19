import './Pagination.css';
import photos from "./photos";
import { useState, useEffect, useRef } from "react";

import React from 'react'

const Pagination = () => {

  const [currentPage, setCurrentPage] = useState(0);
  const photosPerPage = 10;

  const [paginatedPhotos, setPaginatedPhotos] = useState(photos.slice(currentPage, currentPage + photosPerPage))

  function handleBtnClick(index) {
    setCurrentPage(index-1);
  }

  useEffect(() => {
    const pics = currentPage * photosPerPage;
    setPaginatedPhotos(photos.slice(pics, pics + photosPerPage))
    // console.log(currentPage);
  }, [currentPage]);
  

  function generateButtons(numButtons) {
    const buttons = [];
    for (let i = 1; i <= numButtons; i++) {
      buttons.push(<button key={i} onClick={()=>handleBtnClick(i)} className="page-btn">{i}</button>);
    }
    return buttons;
  }
  const buttons = generateButtons(8);


  return (
    <div className="page-container">
      <div className="img-container">
        {paginatedPhotos.map((photo, index) => {
          // { console.log(photo.urls["thumb"]) }
          return <img src={photo.urls["thumb"]} alt="" />
        })}
      </div>
      <div className="btnContainer">
        {buttons}
      </div>
      {/* <div className = "btnContainer">
        {noOfPages.map((index)=>{
          return <button className="page-btn">{index}</button>
        })}
      </div> */}
    </div>
  )
}

export default Pagination
