import React from "react";
import ModelCarousel from "./ModelCarousel";
import { CarouselItemProps } from "./CarouselItem";

const carouselItems: CarouselItemProps[] = [
  {
    title: "Electronics",
    description: "Speakers, Mobiles, SmartCases, Earphones and many more.",
    buttonText: "Shop Now",
    modelColor: "#8B5CF6",
    modelType: "cube",
    source:"/3dModels/g735_logitech_gaming_headset.glb",
  },
  {
    title: "Smooth Sphere",
    description: "A perfectly round sphere that shows the beauty of curved surfaces. This model has no edges or corners, making it ideal for demonstrating principles of rotation and spherical geometry.",
    buttonText: "Explore",
    modelColor: "#D946EF",
    modelType: "sphere",
    source:"/3dModels/t-shirt.glb",
  },
  {
    title: "Complex Torus",
    description: "A torus, or donut shape, represents a higher level of geometric complexity. This shape has fascinating topological properties that make it unique among 3D forms. Rotate it to see its hollow center.",
    buttonText: "View Details",
    modelColor: "#F97316",
    modelType: "torus",
    source:"/3dModels/unused_blue_vans_shoe.glb",
  },
  {
    title: "Focused Cone",
    description: "This conical shape demonstrates the principle of convergence to a point. Its circular base transitions smoothly to an apex, creating an elegant form that's both simple and mathematically interesting.",
    buttonText: "Discover",
    modelColor: "#0EA5E9",
    modelType: "cone",
    source:"",
  },
  {
    title: "Wireframe Cylinder",
    description: "A cylinder shown in wireframe mode reveals the underlying structure of this 3D form. The transparent design lets you see through the model while still understanding its dimensional properties.",
    buttonText: "Analyze",
    modelColor: "#10B981",
    modelType: "cylinder",
    source:"",
    wireframe: true,
  },
];

const Carousel = () => {
  return (
    <div className=" bg-transparent mt-12">
        <ModelCarousel items={carouselItems} />
    </div>
  );
};

export default Carousel;