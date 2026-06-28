import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, Shield, LogOut, Plus, Edit2, Trash2, Image as ImageIcon, Settings, FileText, Star } from 'lucide-react';
const logoImg = '/favicon.jpg';
import ceoImg from '../assets/ceo.jpg';
import { compressImage } from '../utils';
import { api, uploadImageToCloudinary } from '../services/api';

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'customers' | 'officers' | 'settings' | 'blog' | 'reviews'>('products');
  const [officer, setOfficer] = useState<any>(null);

  // Data states
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [officersLog, setOfficersLog] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [siteReviews, setSiteReviews] = useState<any[]>([]);
  
  // Settings state
  const [siteSettings, setSiteSettings] = useState({
    logo: logoImg,
    primaryColor: '#ff6b00',
    secondaryColor: '#111827',
    companyName: 'Tiger Garments',
    headerAlertText: '',
    corporateDescription: '',
    officeAddress: '',
    socialFacebook: '',
    socialInstagram: '',
    homeBanner: '',
    ceoImage: ceoImg,
  });

  // Product form state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({ id: '', name: '', price: '', discount: '', description: '', image: '', images: [] as string[] });

  // Blog form state
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [blogForm, setBlogForm] = useState({ id: '', title: '', content: '', image: '' });

  // Review form state
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [reviewForm, setReviewForm] = useState({ id: '', name: '', text: '', rating: '5', avatar: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const activeOfficer = await api.getData('active_officer', null);
        if (!activeOfficer) {
          navigate('/officer-login');
          return;
        }
        setOfficer(activeOfficer);

        // Load data
        api.getProducts().then(data => {
          if (Array.isArray(data)) {
            setProducts(data);
          } else {
            setProducts([]);
          }
        }).catch(() => setProducts([]));
        
        setCustomers(await api.getData('customer_logs', []));
        setOfficersLog(await api.getData('active_officers_log', []));
        setBlogPosts(await api.getData('blog_posts', []));
        
        const storedReviews = await api.getData('site_reviews', []);
        if (storedReviews && storedReviews.length > 0) {
          setSiteReviews(storedReviews);
        } else {
          setSiteReviews([
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
        
        const savedSettings = await api.getData('site_settings', null);
        const dedicatedSettings = await api.getSiteSettings();
        
        if (savedSettings || dedicatedSettings) {
          setSiteSettings({
            ...siteSettings,
            ...savedSettings,
            ...(dedicatedSettings?.logoUrl ? { logo: dedicatedSettings.logoUrl } : {}),
            ...(dedicatedSettings?.ceoImageUrl ? { ceoImage: dedicatedSettings.ceoImageUrl } : {})
          });
        }
      } catch (e) {
        console.warn("Storage access blocked");
        navigate('/officer-login');
      }
    };
    loadData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const activeOfficer = await api.getData('active_officer', null);
      if (activeOfficer) {
        const activeOfficers = await api.getData('active_officers_log', []);
        const updatedLogs = activeOfficers.map((log: any) => {
          if (log.sessionId === activeOfficer.sessionId) {
            return { ...log, logoutTime: new Date().toISOString(), status: 'logged_out' };
          }
          return log;
        });
        await api.setData('active_officers_log', updatedLogs);
      }
    } catch(e) {}

    await api.setData('active_officer', null);
    navigate('/officer-login');
  };

  const isSuperAdmin = officer?.email === 'kazisanaulla765@gmail.com';

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      await api.updateProduct(productForm.id, productForm);
      setProducts(products.map(p => p.id === productForm.id ? productForm : p));
    } else {
      const savedProduct = await api.addProduct(productForm);
      setProducts([...products, savedProduct]);
    }

    setIsAddingProduct(false);
    setEditingProduct(null);
    setProductForm({ id: '', name: '', price: '', discount: '', description: '', image: '', images: [] });
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedBlogs = [...blogPosts];

    if (editingBlog) {
      updatedBlogs = updatedBlogs.map(b => b.id === blogForm.id ? blogForm : b);
    } else {
      updatedBlogs.push({ ...blogForm, id: Date.now().toString(), date: new Date().toISOString() });
    }

    setBlogPosts(updatedBlogs);
    await api.setData('blog_posts', updatedBlogs);
    setIsAddingBlog(false);
    setEditingBlog(null);
    setBlogForm({ id: '', title: '', content: '', image: '' });
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const updatedBlogs = blogPosts.filter(b => b.id !== id);
      setBlogPosts(updatedBlogs);
      await api.setData('blog_posts', updatedBlogs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditBlog = (blog: any) => {
    setBlogForm(blog);
    setEditingBlog(blog);
    setIsAddingBlog(true);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.setData('site_settings', siteSettings);
    await api.updateSiteSettings({ logoUrl: siteSettings.logo, ceoImageUrl: siteSettings.ceoImage });
    // Settings saved silently
    window.location.reload();
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedReviews = [...siteReviews];

    if (editingReview) {
      updatedReviews = updatedReviews.map(r => r.id === reviewForm.id ? { ...reviewForm, rating: Number(reviewForm.rating) } : r);
    } else {
      updatedReviews.push({ ...reviewForm, rating: Number(reviewForm.rating), id: Date.now().toString() });
    }

    setSiteReviews(updatedReviews);
    await api.setData('site_reviews', updatedReviews);
    setIsAddingReview(false);
    setEditingReview(null);
    setReviewForm({ id: '', name: '', text: '', rating: '5', avatar: '' });
  };

  const handleDeleteReview = async (id: string) => {
    try {
      const updatedReviews = siteReviews.filter(r => r.id !== id);
      setSiteReviews(updatedReviews);
      await api.setData('site_reviews', updatedReviews);
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditReview = (review: any) => {
    setReviewForm({ ...review, rating: review.rating.toString() });
    setEditingReview(review);
    setIsAddingReview(true);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (e) {
      console.error("Failed to delete product", e);
    }
  };

  const handleEditProduct = (product: any) => {
    setProductForm(product);
    setEditingProduct(product);
    setIsAddingProduct(true);
  };

  if (!officer) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar / Topbar */}
      <div className="w-full md:w-64 md:h-screen sticky top-0 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col shrink-0 z-50 shadow-sm md:shadow-none">
        <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center md:block">
          <div>
            <h2 className="text-xl font-display font-bold text-gray-900">Officer Portal</h2>
            <p className="text-sm text-gray-500 mt-1 hidden md:block">Tiger Garments</p>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <div className="text-right mr-2 hidden sm:block">
               <p className="text-sm font-medium text-gray-900">{officer.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 p-2 md:p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible scrollbar-hide">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-colors whitespace-nowrap shrink-0 ${activeTab === 'products' ? 'bg-tiger-orange/10 text-tiger-orange font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Package className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Products</span>
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-colors whitespace-nowrap shrink-0 ${activeTab === 'customers' ? 'bg-tiger-orange/10 text-tiger-orange font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Customers Log</span>
          </button>
          <button
            onClick={() => setActiveTab('officers')}
            className={`flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-colors whitespace-nowrap shrink-0 ${activeTab === 'officers' ? 'bg-tiger-orange/10 text-tiger-orange font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Shield className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Active Officers</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-colors whitespace-nowrap shrink-0 ${activeTab === 'reviews' ? 'bg-tiger-orange/10 text-tiger-orange font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Star className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Manage Reviews</span>
          </button>
          
          {isSuperAdmin && (
            <>
              <button
                onClick={() => setActiveTab('blog')}
                className={`flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-colors whitespace-nowrap shrink-0 ${activeTab === 'blog' ? 'bg-tiger-orange/10 text-tiger-orange font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FileText className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Blog Posts</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-colors whitespace-nowrap shrink-0 ${activeTab === 'settings' ? 'bg-tiger-orange/10 text-tiger-orange font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Settings className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Site Settings</span>
              </button>
            </>
          )}
        </nav>

        <div className="hidden md:block p-4 border-t border-gray-200">
          <div className="mb-4 px-4">
            <p className="text-sm font-medium text-gray-900">{officer.name}</p>
            <p className="text-xs text-gray-500 truncate">{officer.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw]">
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
              <button
                onClick={() => {
                  setProductForm({ id: '', name: '', price: '', discount: '', description: '', image: '', images: [] });
                  setEditingProduct(null);
                  setIsAddingProduct(true);
                }}
                className="bg-tiger-orange text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Product</span>
              </button>
            </div>

            {isAddingProduct ? (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none" placeholder="e.g. Premium Cotton T-Shirt" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                      <input type="number" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none" placeholder="e.g. 1500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                      <input type="number" min="0" max="100" value={productForm.discount || ''} onChange={e => setProductForm({...productForm, discount: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none" placeholder="e.g. 10" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea required value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none" placeholder="Product details..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                    <div className="flex flex-col space-y-3">
                      <div className="relative flex-1">
                        <input 
                          type="file" 
                          accept="image/*"
                          multiple
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length > 0) {
                              const uploadedUrls = await Promise.all(
                                files.map((file: any) => uploadImageToCloudinary(file))
                              );
                              setProductForm(prev => {
                                const newImages = [...(prev.images || []), ...uploadedUrls];
                                return {
                                  ...prev,
                                  image: newImages.length > 0 ? newImages[0] : '', // Keep main image sync
                                  images: newImages
                                };
                              });
                            }
                          }} 
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-tiger-orange/10 file:text-tiger-orange hover:file:bg-tiger-orange/20 cursor-pointer outline-none" 
                        />
                      </div>
                      
                      {productForm.images && productForm.images.length > 0 ? (
                        <div className="flex flex-wrap gap-4 mt-4">
                          {productForm.images.map((imgUrl, idx) => (
                            <div key={idx} className="h-32 w-32 rounded-lg border border-gray-200 overflow-hidden relative bg-[#f9f9f9]">
                              <img src={imgUrl} alt={`Preview ${idx + 1}`} className="w-full h-full object-contain" />
                              <button 
                                type="button" 
                                onClick={() => setProductForm(prev => {
                                  const newImages = prev.images.filter((_, i) => i !== idx);
                                  return {
                                    ...prev,
                                    image: newImages.length > 0 ? newImages[0] : '',
                                    images: newImages
                                  };
                                })}
                                className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm rounded-full p-1.5 text-red-500 hover:text-red-700 hover:bg-white transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        productForm.image && (
                          <div className="h-32 w-32 rounded-lg border border-gray-200 overflow-hidden relative bg-[#f9f9f9]">
                            <img src={productForm.image} alt="Preview" className="w-full h-full object-contain" />
                            <button 
                              type="button" 
                              onClick={() => setProductForm({...productForm, image: '', images: []})}
                              className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm rounded-full p-1.5 text-red-500 hover:text-red-700 hover:bg-white transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={() => setIsAddingProduct(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-white bg-gray-900 hover:bg-gray-800 rounded-lg font-medium transition-colors">Save Product</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {products.length === 0 ? (
                  <div className="col-span-full py-12 text-center bg-white rounded-xl border border-gray-100 border-dashed">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                    <p className="text-gray-500">Add a product to display it on the main website.</p>
                  </div>
                ) : (
                  products.map(product => (
                    <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                      <div className="h-64 sm:h-72 overflow-hidden bg-[#f9f9f9] relative flex items-center justify-center p-2">
                        <img src={(product.images && product.images.length > 0) ? product.images[0] : product.image} alt={product.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800'; }} />
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
                        {product.discount ? (
                          <div className="flex items-baseline space-x-2 mt-1">
                            <span className="text-tiger-orange font-bold text-lg">
                              ₹{Math.round(Number(product.price) - (Number(product.price) * Number(product.discount) / 100))}
                            </span>
                            <span className="text-gray-400 text-sm line-through">₹{product.price}</span>
                            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">{product.discount}% OFF</span>
                          </div>
                        ) : (
                          <p className="text-tiger-orange font-medium mt-1">₹{product.price}</p>
                        )}
                        <p className="text-gray-500 text-sm mt-2 line-clamp-2 flex-1">{product.description}</p>
                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                          <button onClick={() => handleEditProduct(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Customer Logins</h1>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Logout Time</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No customer logins recorded yet.</td>
                      </tr>
                    ) : (
                      [...customers].reverse().map((customer, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${customer.method === 'Google' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {customer.method}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(customer.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {customer.logoutTime ? new Date(customer.logoutTime).toLocaleString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {customer.status === 'logged_in' ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                Logged Out
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'officers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Active Officer Log</h1>
            </div>
            <div className="grid gap-4">
              {officersLog.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No recent officer logins.</div>
              ) : (
                [...officersLog].reverse().map((log, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0">
                        <Shield className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{log.name}</p>
                        <p className="text-sm text-gray-500">{log.email} • Tiger Garments Admin</p>
                      </div>
                    </div>
                    <div className="sm:text-right text-sm text-gray-500">
                      <div className="mb-1">
                        {log.status === 'logged_in' ? (
                          <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active Session
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Logged Out
                          </span>
                        )}
                      </div>
                      <div>Login: <span className="font-medium text-gray-700">{new Date(log.loginTime).toLocaleString()}</span></div>
                      {log.logoutTime && (
                        <div className="mt-0.5">Logout: <span className="font-medium text-gray-700">{new Date(log.logoutTime).toLocaleString()}</span></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {isSuperAdmin && activeTab === 'blog' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
              <button
                onClick={() => {
                  setBlogForm({ id: '', title: '', content: '', image: '' });
                  setEditingBlog(null);
                  setIsAddingBlog(true);
                }}
                className="bg-tiger-orange text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Post</span>
              </button>
            </div>

            {isAddingBlog ? (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">{editingBlog ? 'Edit Post' : 'Add New Post'}</h3>
                <form onSubmit={handleSaveBlog} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" required value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none" placeholder="Post title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <textarea required value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} rows={5} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none" placeholder="Post content..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                    <div className="flex flex-col space-y-3">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const uploadedUrl = await uploadImageToCloudinary(file);
                            setBlogForm({...blogForm, image: uploadedUrl});
                          }
                        }} 
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-tiger-orange/10 file:text-tiger-orange hover:file:bg-tiger-orange/20 cursor-pointer outline-none" 
                      />
                      {blogForm.image && (
                        <div className="h-32 w-32 rounded-lg border border-gray-200 overflow-hidden relative bg-gray-50">
                          <img src={blogForm.image} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button" 
                            onClick={() => setBlogForm({...blogForm, image: ''})}
                            className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm rounded-full p-1.5 text-red-500 hover:text-red-700 hover:bg-white transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={() => setIsAddingBlog(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-white bg-gray-900 hover:bg-gray-800 rounded-lg font-medium transition-colors">Save Post</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPosts.length === 0 ? (
                  <div className="col-span-full py-12 text-center bg-white rounded-xl border border-gray-100 border-dashed">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No posts found</h3>
                    <p className="text-gray-500">Create a post to display on the blog.</p>
                  </div>
                ) : (
                  blogPosts.map(post => (
                    <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                      {post.image && (
                        <div className="h-48 overflow-hidden bg-gray-100 relative">
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{post.title}</h3>
                        <p className="text-gray-500 text-sm mt-2 line-clamp-3 flex-1">{post.content}</p>
                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                          <button onClick={() => handleEditBlog(post)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteBlog(post.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Manage Reviews</h1>
              <button
                onClick={() => {
                  setReviewForm({ id: '', name: '', text: '', rating: '5', avatar: '' });
                  setEditingReview(null);
                  setIsAddingReview(true);
                }}
                className="bg-tiger-orange text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Review</span>
              </button>
            </div>

            {isAddingReview ? (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">{editingReview ? 'Edit Review' : 'Add New Review'}</h3>
                <form onSubmit={handleSaveReview} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                      <input type="text" required value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none" placeholder="e.g. John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Star Rating (1-5)</label>
                      <select value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none">
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review Text</label>
                    <textarea required value={reviewForm.text} onChange={e => setReviewForm({...reviewForm, text: e.target.value})} rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none" placeholder="Review comment..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                    <div className="flex flex-col space-y-3">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const uploadedUrl = await uploadImageToCloudinary(file);
                            setReviewForm({...reviewForm, avatar: uploadedUrl});
                          }
                        }} 
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-tiger-orange/10 file:text-tiger-orange hover:file:bg-tiger-orange/20 cursor-pointer outline-none" 
                      />
                      {reviewForm.avatar && (
                        <div className="h-20 w-20 rounded-full border border-gray-200 overflow-hidden relative bg-gray-50">
                          <img src={reviewForm.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                    <button type="button" onClick={() => setIsAddingReview(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-tiger-orange text-white rounded-lg hover:bg-orange-600 transition-colors">Save Review</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {siteReviews.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No reviews found</h3>
                    <p className="text-gray-500 mt-1">Add your first customer review to get started.</p>
                  </div>
                ) : (
                  siteReviews.map((review: any) => (
                    <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-5">
                        <div className="flex items-center space-x-3 mb-4">
                          {review.avatar ? (
                            <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-tiger-orange/10 flex items-center justify-center text-tiger-orange font-bold text-xl">
                              {review.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-gray-900">{review.name}</h4>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < Number(review.rating) ? 'fill-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-3 italic">"{review.text}"</p>
                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                          <button onClick={() => handleEditReview(review)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteReview(review.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {isSuperAdmin && activeTab === 'settings' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Site Customization</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input type="text" value={siteSettings.companyName} onChange={e => setSiteSettings({...siteSettings, companyName: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Header Alert Notification Text</label>
                  <input type="text" value={siteSettings.headerAlertText} onChange={e => setSiteSettings({...siteSettings, headerAlertText: e.target.value})} placeholder="e.g. Free shipping on orders over $50" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color (Hex)</label>
                    <div className="flex items-center space-x-3">
                      <input type="color" value={siteSettings.primaryColor} onChange={e => setSiteSettings({...siteSettings, primaryColor: e.target.value})} className="h-10 w-10 rounded cursor-pointer" />
                      <input type="text" value={siteSettings.primaryColor} onChange={e => setSiteSettings({...siteSettings, primaryColor: e.target.value})} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none" placeholder="#ff6b00" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color (Hex)</label>
                    <div className="flex items-center space-x-3">
                      <input type="color" value={siteSettings.secondaryColor} onChange={e => setSiteSettings({...siteSettings, secondaryColor: e.target.value})} className="h-10 w-10 rounded cursor-pointer" />
                      <input type="text" value={siteSettings.secondaryColor} onChange={e => setSiteSettings({...siteSettings, secondaryColor: e.target.value})} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none" placeholder="#111827" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Corporate Description</label>
                  <textarea value={siteSettings.corporateDescription} onChange={e => setSiteSettings({...siteSettings, corporateDescription: e.target.value})} rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none resize-none" placeholder="Enter corporate description..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
                  <textarea value={siteSettings.officeAddress} onChange={e => setSiteSettings({...siteSettings, officeAddress: e.target.value})} rows={2} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none resize-none" placeholder="Enter office address..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                    <input type="url" value={siteSettings.socialFacebook} onChange={e => setSiteSettings({...siteSettings, socialFacebook: e.target.value})} placeholder="https://facebook.com/..." className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                    <input type="url" value={siteSettings.socialInstagram} onChange={e => setSiteSettings({...siteSettings, socialInstagram: e.target.value})} placeholder="https://instagram.com/..." className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-tiger-orange outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Official Company Logo</label>
                  <div className="flex flex-col space-y-3">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const uploadedUrl = await uploadImageToCloudinary(file);
                          setSiteSettings({...siteSettings, logo: uploadedUrl});
                          await api.updateSiteSettings({ logoUrl: uploadedUrl });
                        }
                      }} 
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-tiger-orange/10 file:text-tiger-orange hover:file:bg-tiger-orange/20 cursor-pointer outline-none" 
                    />
                    {siteSettings.logo && (
                      <div className="h-32 w-32 rounded-lg border border-gray-200 overflow-hidden relative bg-gray-50 p-2 flex items-center justify-center">
                        <img src={siteSettings.logo} alt="Company Logo" className="max-w-full max-h-full object-contain" />
                        <button 
                          type="button" 
                          onClick={() => setSiteSettings({...siteSettings, logo: ''})}
                          className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm rounded-full p-1.5 text-red-500 hover:text-red-700 hover:bg-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hero Background Image</label>
                  <div className="flex flex-col space-y-3">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const uploadedUrl = await uploadImageToCloudinary(file);
                          setSiteSettings({...siteSettings, homeBanner: uploadedUrl});
                        }
                      }} 
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-tiger-orange/10 file:text-tiger-orange hover:file:bg-tiger-orange/20 cursor-pointer outline-none" 
                    />
                    {siteSettings.homeBanner && (
                      <div className="h-32 w-full rounded-lg border border-gray-200 overflow-hidden relative bg-gray-50">
                        <img src={siteSettings.homeBanner} alt="Hero Banner" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setSiteSettings({...siteSettings, homeBanner: ''})}
                          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 text-red-500 hover:text-red-700 hover:bg-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEO Profile Image</label>
                  <div className="flex flex-col space-y-3">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const uploadedUrl = await uploadImageToCloudinary(file);
                          setSiteSettings({...siteSettings, ceoImage: uploadedUrl});
                          await api.updateSiteSettings({ ceoImageUrl: uploadedUrl });
                        }
                      }} 
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-tiger-orange/10 file:text-tiger-orange hover:file:bg-tiger-orange/20 cursor-pointer outline-none" 
                    />
                    {siteSettings.ceoImage && (
                      <div className="h-32 w-32 rounded-lg border border-gray-200 overflow-hidden relative bg-gray-50">
                        <img src={siteSettings.ceoImage} alt="CEO Image" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => setSiteSettings({...siteSettings, ceoImage: ''})}
                          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 text-red-500 hover:text-red-700 hover:bg-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button type="submit" className="px-6 py-2 text-white bg-gray-900 hover:bg-gray-800 rounded-lg font-medium transition-colors shadow-lg shadow-gray-900/20">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
