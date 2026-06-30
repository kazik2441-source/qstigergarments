import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shirt, Baby, Grid, CheckCircle2, MessageSquare, ArrowUpRight, Award, X, Search, Share2, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCTS, CONTACT_INFO, ProductItem } from '../data';
import { api, optimizeCloudinaryUrl } from '../services/api';
import { FaWhatsapp } from 'react-icons/fa';
import ImageWithLoader, { loadedUrls } from './ImageWithLoader';

export default function ProductSection() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'All' | 'Knitwear' | 'Baby Collection'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dynamicProducts, setDynamicProducts] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await api.getProducts();
        if (Array.isArray(products)) {
          setDynamicProducts(products);
        } else {
          setDynamicProducts([]);
        }
      } catch(e) {
        console.warn("Failed to fetch products");
        setDynamicProducts([]);
      }
    };
    fetchProducts();
    
    const savedWishlist = JSON.parse(localStorage.getItem('user_wishlist') || '[]');
    setWishlist(savedWishlist);
  }, []);

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setWishlist(prev => {
      const newWishlist = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('user_wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const allCombinedProducts = dynamicProducts.map(dp => ({
    ...dp,
    id: dp.id,
    name: dp.name,
    category: dp.category || 'Dynamic',
    subcategory: dp.subcategory || 'New Arrival',
    description: dp.description,
    price: dp.price,
    originalPrice: dp.price,
    discount: dp.discount,
    image: (dp.images && dp.images.length > 0) ? dp.images[0] : dp.image,
    images: dp.images || (dp.image ? [dp.image] : []),
    features: dp.features || ['High Quality', 'Comfortable Fit', 'Durable']
  }));

  const filteredProducts = (allCombinedProducts.length > 0 ? allCombinedProducts : PRODUCTS).filter((p) => {
    const matchesFilter = filter === 'All' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getWhatsAppEnquiryLink = (productName: string) => {
    const text = `Hello Q.S TIGER GARMENTS, I am visiting your virtual showroom and am highly interested in placing a wholesale order or getting a quote for the [${productName}]. Please share pricing, minimum order quantities (MOQ), and available fabric catalogs. Thank you!`;
    return `https://wa.me/91${CONTACT_INFO.phoneRaw}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="products" className="py-24 bg-transparent relative overflow-hidden">
      
      {/* Decorative Thread design line background */}
      <div className="absolute top-0 right-0 w-32 h-screen bg-striped-fabric opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div id="product-heading" className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-tiger-orange/10 px-3.5 py-1.5 rounded-full mb-4">
            <Shirt className="w-4 h-4 text-tiger-orange" />
            <span className="text-xs font-mono font-bold tracking-widest text-tiger-orange uppercase">Interactive Showroom</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-tiger-dark tracking-tight leading-tight">
            Ready-Made Garments & Textile Collections
          </h2>
          <p className="text-gray-500 mt-4 text-base sm:text-lg">
            Sourced responsibly, stitched flawlessly. Switch tabs below to explore our core wholesale product categories.
          </p>
          <div className="w-16 h-1.5 bg-tiger-orange mx-auto mt-6 rounded-full" />
        </div>

        {/* Search Bar & Categories */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 sm:mb-16">
          {/* Categories Tab Selector */}
          <div id="product-tab-controls" className="flex flex-wrap items-center gap-3">
            <button
              id="tab-all"
              onClick={() => setFilter('All')}
              className={`flex items-center space-x-2.5 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                filter === 'All'
                  ? 'bg-tiger-dark text-white shadow-xl shadow-tiger-dark/10'
                  : 'bg-tiger-light hover:bg-gray-200/60 text-gray-700'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>All Products ({allCombinedProducts.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tiger-orange focus:border-tiger-orange sm:text-sm transition-all shadow-sm"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center w-full"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-tiger-dark mb-2">No products found</h3>
            <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base">
              We couldn't find any products matching "{searchQuery}". Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setFilter('All'); }}
              className="mt-6 px-6 py-2.5 bg-tiger-orange text-white font-semibold rounded-full hover:bg-orange-600 transition-colors"
            >
              Clear search & filters
            </button>
          </motion.div>
        ) : (
          <div id="product-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                navigate={navigate}
              />
            ))}
          </AnimatePresence>
        </div>
        )}

      </div>

    </section>
  );
}

function ProductCard({ product, wishlist, toggleWishlist, navigate }: { product: any, wishlist: string[], toggleWishlist: any, navigate: any, key?: any }) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

  useEffect(() => {
    if (!isHovered || images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImgIdx(prev => {
        if (prev < images.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;

    if (Math.abs(diffX) > 30 && Math.abs(diffY) < 40) {
      e.stopPropagation();
      if (diffX > 0) {
        setActiveImgIdx(prev => (prev < images.length - 1 ? prev + 1 : prev));
      } else {
        setActiveImgIdx(prev => (prev > 0 ? prev - 1 : 0));
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const diffX = Math.abs(touchStartX.current - touchEndX.current);
    const diffY = Math.abs(touchStartY.current - touchEndY.current);
    if (diffX > 15 || diffY > 15) {
      e.stopPropagation();
      return;
    }
    navigate(`/product/${product.id}`);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx(prev => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx(prev => (prev < images.length - 1 ? prev + 1 : prev));
  };

  const currentImg = images[activeImgIdx] || product.image;

  return (
    <motion.div
      id={`product-card-${product.id}`}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col h-full bg-white rounded-md overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Preload all images of the product into the global cache for 30ms transitions */}
      <div className="hidden" aria-hidden="true">
        {images.filter((img: string) => !!img).map((img: string, idx: number) => {
          const url = optimizeCloudinaryUrl(img);
          return url ? (
            <img 
              key={idx} 
              src={url} 
              alt="" 
              onLoad={() => {
                loadedUrls.add(url);
              }} 
            />
          ) : null;
        })}
      </div>

      {currentImg && (
        <div 
          className="w-full h-40 sm:h-56 overflow-hidden bg-white relative flex flex-col items-center justify-center p-3 sm:p-4 cursor-pointer"
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Image Slider */}
          <div className="w-full h-full flex items-center justify-center relative">
            <ImageWithLoader 
              key={activeImgIdx}
              src={optimizeCloudinaryUrl(currentImg)} 
              alt={product.name} 
              loading="lazy"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              containerClassName="w-full h-full"
            />
          </div>

          {/* Left/Right Arrow Navigation Buttons for Card Slider */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Next Image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Slider Dots Indicator directly under the image (inside container) */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 z-30 flex justify-center space-x-1">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                    activeImgIdx === idx ? 'bg-tiger-orange w-3.5' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Top Right Action Icons Overlay */}
          <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
            <button
              onClick={(e) => toggleWishlist(e, product.id)}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              className="bg-white/80 hover:bg-white backdrop-blur shadow-sm p-2 rounded-full text-gray-500 hover:text-red-500 transition-colors"
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const shareUrl = `${window.location.origin}/product/${product.id}`;
                if (navigator.share) {
                  navigator.share({
                    title: product.name,
                    text: `Check out ${product.name}`,
                    url: shareUrl,
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(shareUrl);
                  alert('Product link copied to clipboard!');
                }
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              className="bg-white/80 hover:bg-white backdrop-blur shadow-sm p-2 rounded-full text-gray-500 hover:text-tiger-orange transition-colors"
              title="Share Product"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Product Text Tags Holder */}
          <div className="absolute top-2 left-2 z-10 flex space-x-2">
            <span className="inline-block bg-gray-900/80 text-white text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-sm backdrop-blur-sm">
              {product.subcategory}
            </span>
          </div>
        </div>
      )}
      {!currentImg && (
        <div className="relative pt-4 px-4 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
          <span className="inline-block z-10 bg-gray-900/80 text-white text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-sm">
            {product.subcategory}
          </span>
        </div>
      )}

      {/* Content Panel */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow text-left cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
        <div className="mb-1">
          <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
        </div>

        <h3 className="font-sans font-medium text-sm sm:text-base text-gray-800 tracking-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {product.originalPrice ? (
          <div id={`product-price-${product.id}`} className="flex flex-col mt-1 mb-2 shrink-0 select-none">
            <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
              {product.discount ? (
                <>
                  <span className="text-base sm:text-lg font-bold text-gray-900">
                    ₹{Math.round(Number(product.originalPrice) - (Number(product.originalPrice) * Number(product.discount) / 100))}
                  </span>
                  <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-green-600">{product.discount}% off</span>
                </>
              ) : (
                <span className="text-base sm:text-lg font-bold text-gray-900">₹{product.originalPrice}</span>
              )}
            </div>
          </div>
        ) : (
          product.price && (
            <div id={`product-price-${product.id}`} className="flex flex-col mt-1 mb-2 shrink-0 select-none">
              <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-bold text-gray-900">{product.price}</span>
              </div>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}
