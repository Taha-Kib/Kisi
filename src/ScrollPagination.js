import React, { useEffect, useState } from 'react'
import photos from "./photos";
import './Pagination.css';


const ScrollPagination = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [pics, setPics] = useState()
    const photosPerPage = 20;
    window.onscroll = function () {
        if ((window.innerHeight + document.documentElement.scrollTop) === document.documentElement.offsetHeight) {
            scrollToEnd();
        }
    }
    const scrollToEnd = () => {
        setPageNumber(pageNumber + 1);
    }

    useEffect(() => {
        console.log(pageNumber)
        setPics(photos.slice(0, (photosPerPage * pageNumber)))
    }, [pageNumber])

    return (
        <div className="page-container">
            <div className="img-container">
                {pics && pics.length > 0 && pics.map((photo, index) => {
                    return <img key={photo.id} src={photo.urls["thumb"]} alt="" />
                })}
            </div>
        </div>
    )
}

export default ScrollPagination