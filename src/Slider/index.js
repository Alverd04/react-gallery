/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import 'react-slidy/lib/styles.css'
import ReactSlidy from 'react-slidy'
import './index.css'
import { useMediaQuery } from '../hooks/useMediaQuery'
const BASE_CLASS = 'react-image-gallery'

function getItemsToRender({
  index,
  maxIndex,
  items,
  itemsToPreload,
  numOfSlides,
}) {
  let maxIndexToRender = maxIndex
  maxIndex > items.length && (maxIndexToRender = items.length)
  const preload = Math.max(itemsToPreload, numOfSlides)
  if (index >= items.length - numOfSlides) {
    const addNewItems =
      items.length > numOfSlides ? items.slice(0, numOfSlides - 1) : []
    return [...items.slice(0, maxIndexToRender + preload), ...addNewItems]
  } else {
    return items.slice(0, maxIndexToRender + preload)
  }
}

// Fix initial slidesCount to start at 0
export const ImageGallerySlider = ({ images, initialSlide = 0 }) => {
  const { isMobile, isTablet } = useMediaQuery()
  const itemsToPreload = isMobile ? 3 : isTablet ? 5 : 7
  const [currentImage, setCurrentImage] = useState(initialSlide)
  const itemWidth = 100 / itemsToPreload
  const sideItems = (itemsToPreload + 1) / 2
  const list = useRef()

  const itemsToRender = getItemsToRender({
    index: currentImage,
    maxIndex: currentImage + itemsToPreload,
    items: images,
    itemsToPreload: itemsToPreload,
    numOfSlides: 1,
  })

  useEffect(() => {
    if (currentImage < sideItems) {
      list.current.style.transform = `translateX(${0}%)`
    }
    if (currentImage > images.length - sideItems) {
      list.current.style.transform = `translateX(-${
        (images.length - itemsToPreload) * itemWidth
      }%)`
    } else {
      list.current.style.transform = `translateX(-${
        (currentImage + 1 - sideItems) * itemWidth
      }%)`
    }
  }, [currentImage, images.length, itemWidth, itemsToPreload, sideItems])

  const slideImageHandler = (e) => {
    setCurrentImage(e.nextSlide)
  }

  const previewItemClickHandler = (clickSlideId) => {
    setCurrentImage(clickSlideId)
  }
  return (
    <div className={BASE_CLASS}>
      <div className={`${BASE_CLASS}-main`}>
        <ReactSlidy
          infiniteLoop
          doBeforeSlide={slideImageHandler}
          slide={currentImage}
          itemsToPreload={itemsToPreload}
          useFullWidth={false}
          initialSlide={initialSlide}
          keyboardNavigation
        >
          {images.map((image, id) => (
            <span key={id} className={`${BASE_CLASS}-imageWrapper`}>
              <img className={`${BASE_CLASS}-image`} src={image.src} alt='' />
            </span>
          ))}
        </ReactSlidy>
      </div>
      <div className={`${BASE_CLASS}-index`}>{`${currentImage + 1}/${
        images.length
      }`}</div>

      <div className={`${BASE_CLASS}-scroll`}>
        <ul ref={list} className={`${BASE_CLASS}-items`}>
          {itemsToRender.map((item, id) => (
            <li
              className={`${BASE_CLASS}-item`}
              onClick={() => previewItemClickHandler(id)}
              key={id}
            >
              <span
                className={
                  currentImage === id
                    ? `${BASE_CLASS}-imageWrapper ${BASE_CLASS}-selected`
                    : `${BASE_CLASS}-imageWrapper`
                }
              >
                <img className={`${BASE_CLASS}-image`} src={item.src} alt='' />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

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
}
