import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shirt, Baby, Grid, Heart, Share2, Search, ArrowLeft } from 'lucide-react';
import { api, optimizeCloudinaryUrl } from '../services/api';
import { FaWhatsapp } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import { CONTACT_INFO } from '../data';
import LoginModal from './LoginModal';

export default function Wishlist() {
  const navigate = useNavigate();
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const loadWishlist = async () => {
      setLoading(true);
      try {
        const ids = JSON.parse(localStorage.getItem('user_wishlist') || '[]');
        setWishlistIds(ids);

        if (ids.length > 0) {
          const allProducts = await api.getProducts();
          const filtered = allProducts.filter((p: any) => ids.includes(p.id));
          setWishlistProducts(filtered);
        }
      } catch (err) {
        console.error("Failed to load wishlist", err);
      } finally {
        setLoading(false);
      }
    };
    loadWishlist();
  }, []);

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    
    const newIds = wishlistIds.filter(id => id !== productId);
    setWishlistIds(newIds);
    setWishlistProducts(prev => prev.filter(p => p.id !== productId));
    localStorage.setItem('user_wishlist', JSON.stringify(newIds));
  };

  const getWhatsAppEnquiryLink = (productName: string) => {
    const text = `Hello Q.S TIGER GARMENTS, I'm interested in the [${productName}] from my wishlist. Please share pricing, MOQ, and catalogs. Thank you!`;
    return `https://wa.me/91${CONTACT_INFO.phoneRaw}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col">
      <Header activeSection="" setActiveSection={() => {}} onLoginClick={() => setIsLoginModalOpen(true)} />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center space-x-4 mb-8">
            <button 
              onClick={() => navigate('/')}
              className="p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:text-tiger-orange transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-display font-bold text-tiger-dark tracking-tight">My Wishlist</h1>
              <p className="text-gray-500 text-sm mt-1">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-tiger-orange border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : wishlistProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-red-300" />
              </div>
              <h2 className="text-2xl font-bold text-tiger-dark mb-4">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Explore our catalog and save your favorite items to view them later.
              </p>
              <button 
                onClick={() => navigate('/#products')}
                className="px-8 py-3 bg-tiger-orange text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
               <AnimatePresence>
                 {wishlistProducts.map((product) => (
                   <WishlistProductCard 
                     key={product.id}
                     product={product}
                     toggleWishlist={toggleWishlist}
                     navigate={navigate}
                   />
                 ))}
               </AnimatePresence>
             </div>
           )}

         </div>
       </main>

       <FloatingWhatsApp />
       <Footer />
       <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
     </div>
   );
 }

function WishlistProductCard({ product, toggleWishlist, navigate }: { product: any, toggleWishlist: any, navigate: any, key?: any }) {
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col h-full bg-white rounded-md overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div 
        className="w-full h-40 sm:h-56 overflow-hidden bg-white relative flex items-center justify-center p-3 sm:p-4 cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img 
          src={optimizeCloudinaryUrl(images[activeImgIdx] || product.image) || null} 
          alt={product.name} 
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Top Right Action Icons Overlay */}
        <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
          <button
            onClick={(e) => toggleWishlist(e, product.id)}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            className="bg-white/80 hover:bg-white backdrop-blur shadow-sm p-2 rounded-full text-red-500 hover:text-gray-400 transition-colors"
            title="Remove from Wishlist"
          >
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
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
      </div>

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
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mt-1 mb-2 shrink-0 select-none">
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
            {/* PRICE EXCLUDES APPLICABLE TAXES next to the price */}
            <span className="text-[8px] sm:text-[9px] font-bold text-purple-800 bg-[#E6E6FA] border border-purple-200 px-1.5 py-0.5 rounded uppercase whitespace-nowrap">
              PRICE EXCLUDES APPLICABLE TAXES
            </span>
          </div>
        ) : (
          product.price && (
            <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mt-1 mb-2 shrink-0 select-none">
              <span className="text-base sm:text-lg font-bold text-gray-900">{product.price}</span>
              {/* PRICE EXCLUDES APPLICABLE TAXES next to the price */}
              <span className="text-[8px] sm:text-[9px] font-bold text-purple-800 bg-[#E6E6FA] border border-purple-200 px-1.5 py-0.5 rounded uppercase whitespace-nowrap">
                PRICE EXCLUDES APPLICABLE TAXES
              </span>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}
