import React from "react";
import Model3D from "./Model3D";

export type ModelType = "cube" | "sphere" | "torus" | "cone" | "cylinder";

export interface CarouselItemProps {
  title: string;
  description: string;
  buttonText: string;
  modelColor: string;
  modelType: ModelType;
  wireframe?: boolean;
  source:string;
}

const CarouselItem = ({
  title,
  description,
  buttonText,
  modelColor,
  modelType,
  wireframe,
  source,
}: CarouselItemProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full lg:items-center p-4 h-full">
      <div className="w-full lg:w-3/4">
        <div className="backdrop-blur-sm bg-black rounded-xl">
          <Model3D color={modelColor} type={modelType} wireframe={wireframe} source={source} />
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-start gap-4 items-start p-8 lg:pt-16">
        <h2 className="text-3xl font-bold mb-4 text-red-500">{title}</h2>
        <p className="text-gray-300 mb-6 text-left">
          {description}
        </p>
        <button className="btn-primary text-white py-2 px-6 rounded-md transition-colors duration-300">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default CarouselItem;