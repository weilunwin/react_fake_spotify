import image1 from "../assets/images/CarouselImage1.svg";
import image2 from "../assets/images/CarouselImage2.svg";
import image3 from "../assets/images/CarouselImage3.svg";
import "./LoginCarousel.scss";
import { useState, useEffect } from "react";
import clsx from "clsx";

export const Carousel = () => {
  const images = [image1, image2, image3];
  const [stepPage, setStepPage] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setStepPage((prevStepPage) => (prevStepPage + 1) % images.length);
    }, 2500);
    return () => clearInterval(intervalId);
  }, []);

  const handlePrev = (e) => {
    setStepPage((prevStepPage) => {
      if (stepPage === 0) {
        return (prevStepPage = images.length - 1);
      }
      return prevStepPage - 1;
    });
  };
  const handleNext = (e) => {
    setStepPage((prevStepPage) => {
      if (stepPage === images.length - 1) {
        return (prevStepPage = 0);
      }
      return prevStepPage + 1;
    });
  };
  return (
    <>
      <div className="image-wrapper">
        <img src={images[stepPage]} alt={`image${stepPage}`} />
      </div>
      <div className="controller-wrapper">
        <div className="btn-wrapper">
          <div className="prevBtn" onClick={handlePrev}></div>
          <div className="nextBtn" onClick={handleNext}></div>
        </div>
        <div className="text-content">
          {stepPage === 0 && (
            <>
              <h1>鼓舞人心的故事</h1>
              <p>從非凡的人生故事和成功經歷中獲得靈感</p>
            </>
          )}
          {stepPage === 1 && (
            <>
              <h1>輕鬆分類與管理</h1>
              <p>一目了然的分類，讓收藏的 Podast 保持整潔</p>
            </>
          )}
          {stepPage === 2 && (
            <>
              <h1> Spotify 快速同步</h1>
              <p>透過 Spotify 登入，即刻同步您的數據，隨時隨地收聽</p>
            </>
          )}
        </div>
        <div className="step">
          <span className={clsx("", { active: stepPage === 0 })}></span>
          <span className={clsx("", { active: stepPage === 1 })}></span>
          <span className={clsx("", { active: stepPage === 2 })}></span>
        </div>
      </div>
    </>
  );
};
