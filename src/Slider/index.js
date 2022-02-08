/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { createRef, useEffect, useState } from "react";
import "react-slidy/lib/styles.css";
import ReactSlidy from "react-slidy";
import "./index.css";
const BASE_CLASS = "slider";

function getItemsToRender({
  index,
  maxIndex,
  items,
  itemsToPreload = 2,
  numOfSlides,
}) {
  const preload = Math.max(itemsToPreload, numOfSlides);
  if (index >= items.length - numOfSlides) {
    const addNewItems =
      items.length > numOfSlides ? items.slice(0, numOfSlides - 1) : [];
    return [...items.slice(0, maxIndex + preload), ...addNewItems];
  } else {
    return items.slice(0, maxIndex + preload);
  }
}

export const ImageGallerySlider = ({
  images,
  customArrowLeft,
  customArrowRight,
  itemsToPreload = 5,
  initialSlide = 0,
}) => {
  const [currentImage, setCurrentImage] = useState(initialSlide);
  const [direction, setDirection] = useState("right");
  const [maxIndex, setMaxIndex] = useState(initialSlide);

  const itemsToRender = getItemsToRender({
    index: currentImage,
    maxIndex: maxIndex + 1,
    items: images,
    itemsToPreload: itemsToPreload,
    numOfSlides: 1,
  });

  const refs = itemsToRender.reduce((acc, value) => {
    acc[value.id] = createRef();
    return acc;
  }, {});

  const onClickHandler = (clickSlideId) => {
    if (clickSlideId - currentImage > 0) setDirection("right");
    if (clickSlideId - currentImage < 0) setDirection("left");
    setCurrentImage(clickSlideId);
  };

  const handlePreviewMove = () => {
    if (direction === "right") {
      if (currentImage === images.length || currentImage === 1) {
        refs[currentImage].current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        refs[currentImage + 1].current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
    if (direction === "left") {
      if (currentImage === 1 || currentImage === images.length) {
        setMaxIndex(10);
        refs[currentImage].current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        refs[currentImage - 1].current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  useEffect(() => {
    handlePreviewMove();
  }, [currentImage, direction, refs, images.length]);

  const imageChangeHandler = (e) => {
    const { currentSlide, nextSlide } = e;
    if (nextSlide + 1 > maxIndex) setMaxIndex(nextSlide + 1);
    if (currentSlide - nextSlide > 0) {
      setDirection("left");
      setCurrentImage(nextSlide + 1);
    }
    if (currentSlide - nextSlide < 0) {
      setDirection("right");
      setCurrentImage(nextSlide + 1);
    }
  };

  return (
    <div className={BASE_CLASS}>
      <ReactSlidy
        ArrowLeft={customArrowLeft}
        ArrowRight={customArrowRight}
        infiniteLoop
        doBeforeSlide={imageChangeHandler}
        slide={currentImage - 1}
        itemsToPreload={itemsToPreload}
        useFullWidth={false}
        initialSlide={initialSlide - 1}
      >
        {itemsToRender.map((image) => (
          <img alt="" key={image.id} src={image.src} />
        ))}
      </ReactSlidy>
      <p>{`${currentImage}/${images.length}`}</p>
      <div className={`${BASE_CLASS}-scroll`}>
        <ul className={`${BASE_CLASS}-scroll-ul`}>
          {itemsToRender.map((item) => (
            <li
              className={`${BASE_CLASS}-scroll-li`}
              onClick={() => onClickHandler(item.id)}
              ref={refs[item.id]}
              key={item.id}
            >
              <img
                className={
                  currentImage === item.id
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
