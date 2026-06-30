import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { api, optimizeCloudinaryUrl } from '../services/api';
import ImageWithLoader from './ImageWithLoader';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await api.getData('site_reviews', []);
        if (stored && stored.length > 0) {
          setReviews(stored);
        } else {
          setReviews([
            {
              id: '1',
              name: 'Ananya Sharma',
              rating: 5,
              text: 'Ordered a bulk batch of knitwear t-shirts for our store. The fabric quality is absolutely premium and the stitching is perfect. Highly recommended for bulk orders!',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
            },
            {
              id: '2',
              name: 'Rahul Chatterjee',
              rating: 5,
              text: 'Excellent communication and professional service from the team. The delivery to Kolkata was right on time, and the pricing in INR is very competitive.',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
            },
            {
              id: '3',
              name: 'Vikram Singh (Apparel Retailer)',
              rating: 5,
              text: 'Superb finishing on the bulk fabric sourcing. The discount calculator made the wholesale pricing transparent. Will definitely place our next seasonal order here.',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
            },
            {
              id: '4',
              name: 'Priya Patel',
              rating: 5,
              text: 'Very impressed with the baby cotton suits collection quality. The designs are modern and the materials are extremely soft. Great wholesale experience!',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
            },
            {
              id: '5',
              name: 'Md. Sajid',
              rating: 5,
              text: 'Top-notch response time from the support team via WhatsApp. The product specifications and descriptions matched exactly with what we received.',
              avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150'
            }
          ]);
        }
      } catch(e) {
        console.warn("Storage blocked");
      }
    };
    loadData();
  }, []);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-24 bg-tiger-dark text-white relative overflow-hidden">
      {/* Decorative abstract elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full bg-tiger-orange/10 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full bg-tiger-orange/5 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-sm font-mono tracking-widest text-tiger-orange uppercase block mb-3 font-bold">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            What Our Clients Say
          </h2>
          <div className="w-24 h-1.5 bg-tiger-orange mx-auto rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-14 rounded-3xl shadow-2xl relative"
            >
              <Quote className="absolute top-8 right-10 w-16 h-16 text-white/5" />
              
              <div className="flex flex-col items-center text-center">
                <div className="flex space-x-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-6 h-6 ${i < reviews[currentIndex].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                    />
                  ))}
                </div>

                <p className="text-xl md:text-2xl font-medium leading-relaxed mb-10 text-gray-200 italic">
                  "{reviews[currentIndex].text}"
                </p>

                <div className="flex flex-col items-center space-y-3">
                  {reviews[currentIndex].avatar ? (
                    <ImageWithLoader 
                      src={optimizeCloudinaryUrl(reviews[currentIndex].avatar)} 
                      alt={reviews[currentIndex].name} 
                      loading="lazy"
                      className="w-16 h-16 rounded-full object-cover border-2 border-tiger-orange p-0.5"
                      containerClassName="w-16 h-16 rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-tiger-orange/20 border-2 border-tiger-orange p-0.5 flex items-center justify-center">
                      <span className="text-tiger-orange font-bold text-2xl uppercase">
                        {reviews[currentIndex].name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h4 className="font-bold text-lg text-white">{reviews[currentIndex].name}</h4>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {reviews.length > 1 && (
            <div className="flex justify-center items-center space-x-6 mt-10">
              <button 
                onClick={prevReview}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all focus:outline-none"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex space-x-3">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-tiger-orange scale-125' : 'bg-white/20 hover:bg-white/40'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <button 
                onClick={nextReview}
                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all focus:outline-none"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
