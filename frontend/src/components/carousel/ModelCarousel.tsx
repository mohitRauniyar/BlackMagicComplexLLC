import React from "react";
import { useState, useEffect } from "react";
import CarouselItem, { CarouselItemProps } from "./CarouselItem";

interface ModelCarouselProps {
  items: CarouselItemProps[];
}

const ModelCarousel = ({ items }: ModelCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full">
      {/* Main carousel container */}
      <div className="overflow-hidden relative rounded-xl shadow-xl">
        <div 
          className="transition-transform duration-500 ease-out flex"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <CarouselItem {...item} />
            </div>
          ))}
        </div>

        
      </div>

      {/* Indicator dots */}
      <div className="flex justify-center gap-4 z-50">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-1 rounded-full transition-colors ${
              index === currentIndex ? "bg-red-500" : "bg-gray-700"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ModelCarousel;