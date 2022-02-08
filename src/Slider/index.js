import React, { createRef, useEffect, useState } from "react";
import "react-slidy/lib/styles.css";
import ReactSlidy from "react-slidy";
import "./index.css";
const BASE_CLASS = "slider";

export const ImageGallerySlider = ({
  images,
  customArrowLeft,
  customArrowRight,
  lazyLoading,
  itemsToPreload,
}) => {
  const [currentImage, setCurrentImage] = useState(1);
  const [direction, setDirection] = useState();

  const refs = images.reduce((acc, value) => {
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
        useFullWidth={false}
      >
        {images.map((image) => (
          <img alt="" key={image.id} src={image.src} />
        ))}
      </ReactSlidy>
      <p>{`${currentImage}/${images.length}`}</p>
      <div className={`${BASE_CLASS}-scroll`}>
        <ul className={`${BASE_CLASS}-scroll-ul`}>
          {images.map((item) => (
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
