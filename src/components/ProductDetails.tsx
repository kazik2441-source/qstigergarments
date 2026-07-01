import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, CheckCircle2, ChevronLeft, ChevronRight, Search, X, Heart, ZoomIn, ArrowLeft } from 'lucide-react';
import { api, optimizeCloudinaryUrl } from '../services/api';
import { CONTACT_INFO, PRODUCTS } from '../data';
import ImageWithLoader, { loadedUrls } from './ImageWithLoader';
import { FaWhatsapp } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import LoginModal from './LoginModal';

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isMainImageLoaded, setIsMainImageLoaded] = useState(false);

  useEffect(() => {
    const images = product?.images && product.images.length > 0 ? product.images : (product?.image ? [product.image] : []);
    const currentUrl = images[activeImageIndex] ? optimizeCloudinaryUrl(images[activeImageIndex]) : '';
    if (currentUrl && loadedUrls.has(currentUrl)) {
      setIsMainImageLoaded(true);
    } else {
      setIsMainImageLoaded(false);
    }
  }, [activeImageIndex, slug, product]);

  useEffect(() => {
    // Scroll to top when slug changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const savedWishlist = JSON.parse(localStorage.getItem('user_wishlist') || '[]');
    setWishlist(savedWishlist);

    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const dynamicProducts = await api.getProducts();
        const allProducts = dynamicProducts && dynamicProducts.length > 0 
          ? dynamicProducts 
          : PRODUCTS;

        // Try to find the product matching the slug (ID)
        const found = allProducts.find((p: any) => p.id === slug);
        
        if (found) {
          setProduct({
            ...found,
            features: found.features && found.features.length > 0 ? found.features : ['High Quality', 'Comfortable Fit', 'Durable']
          });
          
          // Get similar products (same category, exclude current)
          const category = found.category;
          let similar = allProducts
            .filter((p: any) => p.category === category && p.id !== slug)
            .slice(0, 10); // get up to 10 similar
          
          if (similar.length === 0) {
            similar = allProducts
              .filter((p: any) => p.id !== slug)
              .slice(0, 10);
          }
          
          setSimilarProducts(similar);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Error fetching product details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [slug]);

  // Inject JSON-LD Product Schema
  useEffect(() => {
    if (!product) return;

    const schemaData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.image ? optimizeCloudinaryUrl(product.image) : (product.images?.[0] ? optimizeCloudinaryUrl(product.images[0]) : ""),
      "description": product.description,
      "category": product.category,
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": product.discount 
          ? Math.round(Number(product.originalPrice || product.price?.replace(/[^0-9]/g, '')) - (Number(product.originalPrice || product.price?.replace(/[^0-9]/g, '')) * Number(product.discount) / 100))
          : (product.originalPrice || product.price?.replace(/[^0-9]/g, '')),
        "availability": "https://schema.org/InStock",
        "url": window.location.href,
        "itemCondition": "https://schema.org/NewCondition"
      }
    };

    const scriptId = 'json-ld-product';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(schemaData);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [product]);

  const toggleWishlist = () => {
    if (!product) return;
    setWishlist(prev => {
      const newWishlist = prev.includes(product.id) 
        ? prev.filter(id => id !== product.id)
        : [...prev, product.id];
      localStorage.setItem('user_wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const getWhatsAppEnquiryLink = (productName: string) => {
    const text = `Hello Q.S TIGER GARMENTS, I am visiting your virtual showroom and am highly interested in placing a wholesale order or getting a quote for the [${productName}]. Please share pricing, minimum order quantities (MOQ), and available fabric catalogs. Thank you!`;
    return `https://wa.me/91${CONTACT_INFO.phoneRaw}?text=${encodeURIComponent(text)}`;
  };

  const handleShare = async () => {
    const shareData = {
      title: product?.name || 'Q.S TIGER GARMENTS Product',
      text: `Check out ${product?.name} from Q.S TIGER GARMENTS`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Product link copied to clipboard!');
      }
    } catch (err) {
      // Ignore share cancellation errors
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-tiger-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col">
        <Header activeSection="" setActiveSection={() => {}} onLoginClick={() => setIsLoginModalOpen(true)} />
        <div className="flex-grow flex flex-col items-center justify-center text-center p-6 mt-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-tiger-dark mb-4">Product Not Found</h2>
          <p className="text-gray-500 mb-6">We couldn't find the product you're looking for.</p>
          <button 
            onClick={() => navigate('/#products')}
            className="px-6 py-2.5 bg-tiger-orange text-white font-semibold rounded-full hover:bg-orange-600 transition-colors"
          >
            Back to Products
          </button>
        </div>
        <Footer />
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </div>
    );
  }

  const allImages = product?.images && product.images.length > 0 
    ? product.images 
    : (product?.image ? [product.image] : []);

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col">
      <Header activeSection="" setActiveSection={() => {}} onLoginClick={() => setIsLoginModalOpen(true)} />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-6 flex items-center justify-start">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 bg-white border border-gray-100 rounded-full shadow-sm hover:shadow-md text-gray-500 hover:text-tiger-orange transition-all duration-200"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col md:flex-row mb-16">
            {/* Preload all images of the product into the global cache for 30ms transitions */}
            <div className="hidden" aria-hidden="true">
              {allImages.filter((img: string) => !!img).map((img: string, idx: number) => {
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

            {/* Left Image Section */}
            <div className="md:w-1/2 flex flex-col bg-[#f9f9f9] border-r border-gray-100">
              <div 
                className="relative min-h-[300px] md:min-h-[500px] flex items-center justify-center p-8 overflow-hidden cursor-zoom-in"
                onClick={() => {
                  if (allImages.length > 0) setIsLightboxOpen(true);
                }}
              >
                {allImages.length > 0 ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {!isMainImageLoaded && (
                      <div className="absolute inset-0 bg-gray-100/60 animate-pulse rounded-2xl flex items-center justify-center z-10">
                        <div className="w-8 h-8 border-3 border-tiger-orange border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <motion.img 
                      key={activeImageIndex}
                      src={optimizeCloudinaryUrl(allImages[activeImageIndex]) || null} 
                      alt={product.name} 
                      loading="lazy"
                      onLoad={() => setIsMainImageLoaded(true)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: isMainImageLoaded ? 1 : 0, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.03 }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(e, { offset }) => {
                        if (offset.x < -50) {
                          e.stopPropagation();
                          setActiveImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : prev);
                        } else if (offset.x > 50) {
                          e.stopPropagation();
                          setActiveImageIndex(prev => prev > 0 ? prev - 1 : 0);
                        }
                      }}
                      className="w-full h-full max-h-[60vh] object-contain cursor-grab active:cursor-grabbing relative z-10"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <span className="text-sm">No image available</span>
                  </div>
                )}
                {product.discount && (
                  <div className="absolute top-6 left-6 z-30">
                    <span className="inline-block bg-red-600 text-white text-sm uppercase font-bold px-4 py-2 rounded-full shadow-lg">
                      {product.discount}% OFF
                    </span>
                  </div>
                )}
                
                {/* Floating Action Icons */}
                <div className="absolute top-6 right-6 z-30 flex flex-col space-y-3">
                  {allImages.length === 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLightboxOpen(true);
                      }}
                      className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md text-gray-600 hover:text-tiger-orange hover:scale-105 transition-all duration-200"
                    >
                      <ZoomIn className="w-6 h-6" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist();
                    }}
                    className="bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 hover:scale-105 transition-all duration-200"
                    title={wishlist.includes(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart className={`w-6 h-6 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    className="bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-tiger-orange hover:scale-105 transition-all duration-200"
                    title="Share Product"
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>

                {/* Slider Dots Indicator */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2">
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex(idx);
                        }}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm ${
                          activeImageIndex === idx ? 'bg-tiger-orange w-6' : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="flex items-center p-4 space-x-3 overflow-x-auto bg-white border-t border-gray-100 hide-scrollbar">
                  {allImages.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(idx);
                      }}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        activeImageIndex === idx ? 'border-tiger-orange opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <ImageWithLoader 
                        src={optimizeCloudinaryUrl(img)} 
                        alt={`Thumbnail ${idx + 1}`} 
                        className="w-full h-full object-cover" 
                        containerClassName="w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Details Section */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
              <span className="text-xs font-mono font-bold text-tiger-orange tracking-wider uppercase mb-2 block">
                {product.category} • {product.subcategory}
              </span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-tiger-dark tracking-tight mb-2">
                {product.name}
              </h1>
              
              <div className="mb-6 flex flex-wrap items-center gap-4">
                {product.discount ? (
                  <div className="flex items-baseline space-x-3 p-4 bg-[#f0fdf4] rounded-2xl border border-green-200 w-fit">
                    <span className="text-3xl font-bold text-green-800">
                      ₹{Math.round(Number(product.originalPrice || product.price?.replace(/[^0-9]/g, '')) - (Number(product.originalPrice || product.price?.replace(/[^0-9]/g, '')) * Number(product.discount) / 100))}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{product.originalPrice || product.price?.replace(/[^0-9]/g, '')}
                    </span>
                  </div>
                ) : (
                  product.price && (
                    <div className="flex items-baseline p-4 bg-[#f0fdf4] rounded-2xl border border-green-200 w-fit">
                      <span className="text-3xl font-bold text-green-800">{product.price}</span>
                    </div>
                  )
                )}
                <div className="text-[11px] text-[#000000] select-none mt-1">
                  NOTE: Plus applicable taxes
                </div>
              </div>

              <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-wrap">{product.description}</p>
              </div>

              <div className="mt-auto space-y-6">
                <div>
                  <span className="block text-xs font-mono uppercase tracking-widest text-gray-400 font-bold mb-4">
                    SPECIFICATIONS
                  </span>
                  
                  {/* Dynamic Product Object Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {['fabric', 'sizeRatio', 'packSize', 'minimumOrder', 'moq', 'material'].map(key => {
                      if (product[key] || product[key.charAt(0).toUpperCase() + key.slice(1)]) {
                        const val = product[key] || product[key.charAt(0).toUpperCase() + key.slice(1)];
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        return (
                          <div key={key} className="flex items-start space-x-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                            <span className="font-bold text-gray-900 min-w-[80px]">{label}:</span>
                            <span className="font-medium text-gray-600">{val}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.features && product.features.length > 0 ? (
                      product.features.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                          <CheckCircle2 className="w-4 h-4 text-tiger-orange shrink-0" />
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))
                    ) : (
                      // Only show fallback if we have no dynamic keys either
                      !['fabric', 'sizeRatio', 'packSize', 'minimumOrder', 'moq', 'material'].some(k => product[k] || product[k.charAt(0).toUpperCase() + k.slice(1)]) && (
                        <div className="text-gray-500 italic text-sm">Detailed specifications unavailable.</div>
                      )
                    )}
                  </div>
                </div>

                <a
                  href={getWhatsAppEnquiryLink(product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20b858] text-white py-4 px-6 rounded-xl text-base font-bold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl hover:-translate-y-1 mt-6"
                >
                  {/* @ts-ignore */}
                  <FaWhatsapp className="w-6 h-6 text-white" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Similar Products Section */}
          {similarProducts.length > 0 && (
            <div className="mt-16">
              <h3 className="font-display font-bold text-2xl text-tiger-dark tracking-tight mb-8">
                {product.category && similarProducts.some(p => p.category === product.category) 
                  ? `Similar Products in ${product.category}`
                  : "You May Also Like"}
              </h3>
              
              <div className="flex overflow-x-auto pb-8 space-x-6 snap-x hide-scrollbar">
                {similarProducts.map((simProduct) => (
                  <SimilarProductCard key={simProduct.id} product={simProduct} navigate={navigate} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <FloatingWhatsApp />
      <Footer />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && allImages.length > 0 && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setIsLightboxOpen(false)}
            />
            
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
                  }}
                  className="absolute left-4 md:left-8 z-10 p-3 md:p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
                  }}
                  className="absolute right-4 md:right-8 z-10 p-3 md:p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
                >
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              </>
            )}

            <motion.img
              key={activeImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={optimizeCloudinaryUrl(allImages[activeImageIndex])}
              alt="Zoomed"
              className="max-w-[90vw] max-h-[90vh] object-contain relative z-[5]"
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SimilarProductCard({ product, navigate }: { product: any, navigate: any, key?: any }) {
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
    <div 
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex-shrink-0 w-[180px] sm:w-[220px] bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer snap-start group"
    >
      <div className="h-40 sm:h-48 bg-white relative flex items-center justify-center p-3 sm:p-4">
        <img 
          src={optimizeCloudinaryUrl(images[activeImgIdx] || product.image) || null} 
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
      <div className="p-3 sm:p-4 text-left">
        <div className="mb-1">
          <span className="text-[9px] sm:text-[10px] font-medium text-gray-500 uppercase tracking-wide">
            {product.category || "General"}
          </span>
        </div>
        <h4 className="font-sans font-medium text-sm text-gray-800 tracking-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.name}
        </h4>
        <div className="flex flex-col mt-1 shrink-0 select-none">
          <div className="flex items-center flex-wrap gap-1 sm:gap-2">
            {product.discount ? (
              <>
                <span className="text-sm sm:text-base font-bold text-gray-900">
                  ₹{Math.round(Number(product.originalPrice || product.price?.replace(/[^0-9]/g, '')) - (Number(product.originalPrice || product.price?.replace(/[^0-9]/g, '')) * Number(product.discount) / 100))}
                </span>
                <span className="text-[10px] text-gray-500 line-through">
                  ₹{product.originalPrice || product.price?.replace(/[^0-9]/g, '')}
                </span>
                <span className="text-[10px] font-bold text-green-600">{product.discount}% off</span>
              </>
            ) : (
              <span className="text-sm sm:text-base font-bold text-gray-900">{product.price || 'Price on request'}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}