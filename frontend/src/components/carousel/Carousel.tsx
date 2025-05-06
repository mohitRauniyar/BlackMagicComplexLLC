import React from "react";
import ModelCarousel from "./ModelCarousel";
import { CarouselItemProps } from "./CarouselItem";

const carouselItems: CarouselItemProps[] = [
  {
    title: "Electronics",
    description: "Discover cutting-edge electronics including gaming headsets, smartphones, speakers, and accessories for all your tech needs.",
    buttonText: "Shop Now",
    modelColor: "#8B5CF6",
    modelType: "cube",
    source: "/3dModels/g735_logitech_gaming_headset.glb",
  },
  {
    title: "Clothing",
    description: "Browse stylish and comfortable clothing for men, women, and children — from everyday basics to party outfits.",
    buttonText: "Explore",
    modelColor: "#D946EF",
    modelType: "sphere",
    source: "/3dModels/t-shirt.glb",
  },
  {
    title: "Footwear",
    description: "Step into quality with our range of sneakers, formal shoes, sandals, and boots for all ages and occasions.",
    buttonText: "View Details",
    modelColor: "#F97316",
    modelType: "torus",
    source: "/3dModels/unused_blue_vans_shoe.glb",
  },
  {
    title: "Perfume",
    description: "Experience a collection of elegant and long-lasting perfumes that leave a lasting impression with every spray.",
    buttonText: "Discover",
    modelColor: "#0EA5E9",
    modelType: "cone",
    source: "/3dModels/sauvage_perfume.glb",
  },
  {
    title: "Accessories",
    description: "Complete your look with premium accessories — watches, bags, sunglasses, and more for everyday and special moments.",
    buttonText: "Analyze",
    modelColor: "#10B981",
    modelType: "cylinder",
    source: "",
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