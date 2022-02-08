import { IMAGES } from "./config";
import { ImageGallerySlider } from "./Slider";

export default function App() {
  return (
    <div className="app">
      <h1>SLIDER DEMO</h1>
      <div className="sliderContainer">
        <ImageGallerySlider images={IMAGES} />
      </div>
    </div>
  );
}
