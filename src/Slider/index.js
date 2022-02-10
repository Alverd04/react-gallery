/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import "react-slidy/lib/styles.css";
import ReactSlidy from "react-slidy";
import "./index.css";
const BASE_CLASS = "slider";

// Still need to adapt checks for our component
function getItemsToRender({
  index,
  maxIndex,
  items,
  itemsToPreload,
  numOfSlides,
}) {
  maxIndex > items.length && (maxIndex = items.length);
  const preload = Math.max(itemsToPreload, numOfSlides);
  if (index >= items.length - numOfSlides) {
    const addNewItems =
      items.length > numOfSlides ? items.slice(0, numOfSlides - 1) : [];
    return [...items.slice(0, maxIndex + preload), ...addNewItems];
  } else {
    return items.slice(0, maxIndex + preload);
  }
}

// Fix initial slidesCount to start at 0
export const ImageGallerySlider = ({
  images,
  itemsToPreload = 5,
  initialSlide = 0,
}) => {
  const [currentImage, setCurrentImage] = useState(initialSlide);
  const itemWidth = 100 / itemsToPreload;
  const sideItems = (itemsToPreload + 1) / 2;

  const list = useRef();

  const itemsToRender = getItemsToRender({
    index: currentImage,
    maxIndex: currentImage + itemsToPreload,
    items: images,
    itemsToPreload: itemsToPreload,
    numOfSlides: 1,
  });

  useEffect(() => {
    if (currentImage < sideItems) {
      list.current.style.transform = `translateX(${0}%)`; // 0%
    }
    if (currentImage > images.length - 1 - sideItems) {
      list.current.style.transform = `translateX(-${
        (images.length - sideItems - 2) * itemWidth
      }%)`; // 100%
    } else {
      list.current.style.transform = `translateX(-${
        (currentImage + 1 - sideItems) * itemWidth
      }%)`;
    }
  }, [currentImage, images.length]);

  const slideImageHandler = (e) => {
    const { nextSlide, currentSlide } = e;
    console.log(nextSlide, currentSlide);
    setCurrentImage(nextSlide);
  };

  const previewItemClickHandler = (clickSlideId) => {
    console.log(clickSlideId);
    setCurrentImage(clickSlideId);
  };

  return (
    <div className={BASE_CLASS}>
      <ReactSlidy
        infiniteLoop
        doBeforeSlide={slideImageHandler}
        slide={currentImage}
        itemsToPreload={itemsToPreload}
        useFullWidth={false}
        initialSlide={initialSlide}
      >
        {images.map((image, id) => (
          <img alt="" key={id} src={image.src} />
        ))}
      </ReactSlidy>
      <p>{`${currentImage + 1}/${images.length}`}</p>
      <div className={`${BASE_CLASS}-scroll`}>
        <ul ref={list} className={`${BASE_CLASS}-scroll-ul`}>
          {itemsToRender.map((item, id) => (
            <li
              className={`${BASE_CLASS}-scroll-li`}
              onClick={() => previewItemClickHandler(id)}
              key={id}
            >
              <img
                className={
                  currentImage === id
                    ? `${BASE_CLASS}-scroll-img selected`
                    : `${BASE_CLASS}-scroll-img`
                }
                src={item.src}
                alt=""
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

ImageGallerySlider.propTypes = {
  /*Images to be shown in gallery */
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      src: PropTypes.string,
    })
  ).isRequired,
  /*Custom arrow left icon */
  customArrowLeft: PropTypes.elementType,
  /*Custom arrow right icon */
  customArrowRight: PropTypes.elementType,
  /*Number of images to preload */
  itemsToPreload: PropTypes.number,
  /*Initial slide */
  initialSlide: PropTypes.number,
};
