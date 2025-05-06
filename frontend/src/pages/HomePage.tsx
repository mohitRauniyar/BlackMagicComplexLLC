import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PresentationControls,
  Environment,
} from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ProductType } from "../types";
import React from "react";
import RevolvingModel from "../components/RevolvingModel";
import Carousel from "../components/carousel/Carousel";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get("/api/products?featured=true&limit=3");
        // Ensure the response data is an array before setting it
        const products = Array.isArray(response.data) ? response.data : [];
        // setFeaturedProducts(products);
        setFeaturedProducts([
          {
            _id: "1",
            name: "Midnight Mystique",
            brand: "Luxe Noir",
            description: "A captivating blend of exotic spices and deep amber.",
            price: 89.99,
            image:
              "https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            category: "perfume",
            stock: 15,
            featured: true,
          },
          {
            _id: "2",
            name: "Golden Aura",
            brand: "Éclat",
            description: "Luxurious notes of jasmine, vanilla, and sandalwood.",
            price: 75.5,
            oldPrice: 95.0,
            image:
              "https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            category: "perfume",
            stock: 8,
            featured: true,
          },
          {
            _id: "3",
            name: "Velvet Rose",
            brand: "Opulence",
            description:
              "An elegant composition featuring Bulgarian rose and patchouli.",
            price: 120.0,
            image:
              "https://images.pexels.com/photos/265144/pexels-photo-265144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            category: "perfume",
            stock: 12,
            featured: true,
          },
        ]);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        // Use dummy data for now
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    console.log(featuredProducts);
  }, [featuredProducts]);

  return (
    <div className="overflow-x-hidden">
      <img src="/waves2.svg" className="w-full absolute top-0" alt="" />
      <motion.div
        ref={heroRef}
        style={{ opacity, scale }}
        className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      >
        {/* Background animation */}
        <div className="absolute inset-0 bg-primary-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-800/20 via-primary-900/40 to-primary-950 animate-pulse"></div>
        </div>

        {/* 3D Model */}
        {/* <div className="absolute inset-0 flex items-center justify-start z-10">
          <div className="w-full h-full">
            <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, -5, 2]} angle={0.15} penumbra={1} intensity={5} castShadow />
                <spotLight position={[-10, -5, 2]} angle={0.15} penumbra={1} intensity={5} castShadow />
                
                <PresentationControls
                  global
                  // rotation={[0, 0, 0]}
                  // polar={[-Math.PI / 4, Math.PI / 4]}
                  // azimuth={[-Math.PI / 4, Math.PI / 4]}
                  // config={{ mass: 2, tension: 400 }}
                  // snap={{ mass: 4, tension: 400 }}
                >

                  <PerfumeModel />
                </PresentationControls>
                <Environment preset="city" />
              </Suspense>
            </Canvas>
          </div>
        </div> */}

        <div className="absolute inset-0 flex items-center justify-start z-10">
          <div className="w-full h-full">
            <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <spotLight
                  position={[10, -5, 2]}
                  angle={0.15}
                  penumbra={1}
                  intensity={5}
                  castShadow
                />
                <spotLight
                  position={[-10, -5, 2]}
                  angle={0.15}
                  penumbra={1}
                  intensity={5}
                  castShadow
                />

                <PresentationControls global>
                  {/* Multiple Revolving Models */}
                  <RevolvingModel
                    modelPath="/3dModels/sauvage_perfume.glb"
                    revolutionRadius={0.5}
                    initialOffset={
                      window.innerWidth > 1200 ? [-1, 0, 0] : [0, 0, 0]
                    }
                    revolutionSpeed={0.1}
                    scale={11}
                    floating
                    initialAngle={60}
                    initialRotationAngle={210}
                  />

                  <RevolvingModel
                    modelPath="/3dModels/perfume_bottle_triangle.glb"
                    revolutionRadius={0.5}
                    initialOffset={window.innerWidth > 1200 ? [1, -1.2, 0]: [0, -1.2, 0]}
                    scale={3}
                    revolutionSpeed={0.05}
                    initialAngle={45}
                  />
                </PresentationControls>

                <Environment preset="city" />
              </Suspense>
            </Canvas>
          </div>
        </div>

        {/* Hero content */}
        <div className="container px-4 relative flex justify-end pt-32 items-end z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-3xl text-center"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-accent-400 text-transparent bg-clip-text">
              Discover Your Signature Scent
            </h1>
            <p className="text-lg md:text-xl text-primary-200 mb-8">
              Exquisite fragrances that capture the essence of luxury and
              individuality
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="btn btn-primary btn-black px-8 py-3 text-lg flex items-center justify-center"
              >
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#featured"
                className="btn btn-secondary px-8 py-3 text-lg"
              >
                Explore Collection
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white flex items-start justify-center p-1">
            <div className="w-1 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </motion.div>

      <section id="corousel" className="mt-32">
        <Carousel />
      </section>

      {/* Featured section */}
      <section id="featured" className="py-20 bg-primary-900 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Featured Collections
            </h2>
            <p className="text-primary-300 max-w-2xl mx-auto">
              Discover our handpicked selection of premium fragrances that
              define elegance and sophistication
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="product-card group"
              >
                <Link to={`/products/${product._id}`}>
                  <div className="relative overflow-hidden h-80">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-accent-600 text-white text-xs uppercase tracking-wider py-1 px-2 rounded flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" /> Featured
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {product.name}
                    </h3>
                    <p className="text-primary-300 text-sm mb-3">
                      {product.brand}
                    </p>
                    <p className="text-primary-400 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-accent-500 font-semibold text-lg">
                          ${product.price.toFixed(2)}
                        </p>
                        {product.oldPrice && (
                          <p className="text-primary-400 text-sm line-through">
                            ${product.oldPrice.toFixed(2)}
                          </p>
                        )}
                      </div>

                      <button className="btn btn-primary">View Details</button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn btn-secondary inline-flex items-center"
            >
              View All Collections <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/8128671/pexels-photo-8128671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Luxury perfume"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Experience Luxury
            </h2>
            <p className="text-primary-200 mb-8">
              Subscribe to our newsletter and be the first to know about new
              releases, exclusive offers, and special events.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="input-field flex-grow"
                required
              />
              <button type="submit" className="btn btn-gold whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
