import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock, ChevronDown, Sparkles } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { CONTACT_INFO, PRODUCTS } from '../data';

export default function ContactSection() {
  const [dynamicProducts, setDynamicProducts] = useState<any[]>([]);
  const [address, setAddress] = useState(CONTACT_INFO.headquarters);
  
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    productInterest: '',
    monthlyVolume: '500 - 1,000 pieces',
    customSpecs: '',
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { api } = await import('../services/api');
        const parsed = await api.getProducts();
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDynamicProducts(parsed);
          if (!formData.productInterest) {
            setFormData(prev => ({...prev, productInterest: parsed[0].name}));
          }
        } else {
          setDynamicProducts(PRODUCTS);
          if (PRODUCTS.length > 0 && !formData.productInterest) {
            setFormData(prev => ({...prev, productInterest: PRODUCTS[0].name}));
          }
        }
        
        const settings = await api.getData('site_settings', null);
        if (settings && settings.officeAddress) {
          setAddress(settings.officeAddress);
        }
      } catch(e) {
        console.warn("Storage blocked");
        setDynamicProducts(PRODUCTS);
        if (PRODUCTS.length > 0 && !formData.productInterest) {
          setFormData(prev => ({...prev, productInterest: PRODUCTS[0].name}));
        }
      }
    };
    loadProducts();
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Handle form field modifications
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) {
      setFormError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setFormError("Full Name and Mobile Number are required fields.");
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    // To make this work, create a free account at https://www.emailjs.com/
    // 1. Add an Email Service (e.g., Gmail) and get your SERVICE_ID
    // 2. Create an Email Template with variables matching the keys below and get the TEMPLATE_ID
    // 3. Get your PUBLIC_KEY from the Account Settings
    const serviceId = 'service_q471ivi';
    const templateId = 'template_xsqbt69';
    const publicKey = 'wuETGLekOGfeGychV';

    const templateParams = {
      fullName: formData.fullName,
      businessName: formData.businessName || 'N/A',
      email: formData.email || 'N/A',
      phone: formData.phone,
      productInterest: formData.productInterest,
      monthlyVolume: formData.monthlyVolume,
      customSpecs: formData.customSpecs || 'None provided',
      to_email: 'qstigergarments2010@gmail.com', // Sending to this address
    };

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        setIsSubmitting(false);
        setIsSuccess(true);
        console.log('SUCCESS!', response.status, response.text);
      })
      .catch((err) => {
        setIsSubmitting(false);
        setFormError("Failed to send request. Please check your configuration or try contacting us directly.");
        console.log('FAILED...', err);
      });
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      businessName: '',
      email: '',
      phone: '',
      productInterest: dynamicProducts.length > 0 ? dynamicProducts[0].name : '',
      monthlyVolume: '500 - 1,000 pieces',
      customSpecs: '',
    });
    setIsSuccess(false);
    setFormError(null);
  };

  return (
    <section id="contact" className="py-24 bg-[#faf9f6] relative overflow-hidden">
      
      <div className="absolute top-1/3 left-10 w-72 h-72 rounded-full bg-tiger-orange/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div id="contact-heading" className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center space-x-2 bg-tiger-orange/10 px-3.5 py-1.5 rounded-full mb-4">
            <Mail className="w-4 h-4 text-tiger-orange" />
            <span className="text-xs font-mono font-bold tracking-widest text-tiger-orange uppercase">Sales Bureau</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-tiger-dark tracking-tight leading-tight">
            Initiate Bulk Procurement or Custom Sampling
          </h2>
          <p className="text-gray-500 mt-4 text-base sm:text-lg">
            Connect with our manufacturing specialists to request digital fabric catalogs, sample garment tests, and competitive B2B wholesale pricing.
          </p>
          <div className="w-16 h-1.5 bg-tiger-orange mx-auto mt-6 rounded-full" />
        </div>

        {/* Master layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Direct Corporate Lines */}
          <div id="contact-channels" className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-gray-400 font-bold block mb-2">
                DIRECT CHANNELS
              </span>
              <h3 className="font-display font-bold text-2xl text-tiger-dark leading-snug">
                Let's Stitch Together a Long-Term Strategic Partnership
              </h3>
            </div>

            <div className="space-y-6">
              
              {/* HQ address card */}
              <div className="flex items-start space-x-4 bg-white p-5 rounded-xl border border-gray-150 shadow-sm">
                <div className="bg-tiger-orange/15 border border-tiger-orange/30 text-tiger-orange p-3.5 rounded-xl shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-tiger-dark text-base">Corporate Office & HQ</h4>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed whitespace-pre-wrap">
                    {address}
                  </p>
                </div>
              </div>

              {/* Direct Telephone contact */}
              <a
                id="contact-phone-card"
                href={`tel:${CONTACT_INFO.phoneRaw}`}
                className="flex items-start space-x-4 bg-white p-5 rounded-xl border border-gray-150 shadow-sm hover:border-tiger-orange/40 hover:shadow-md transition-all block group"
              >
                <div className="bg-tiger-orange/15 border border-tiger-orange/30 text-tiger-orange p-3.5 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-tiger-dark text-base group-hover:text-tiger-orange transition-colors">
                    Direct Mobile Call
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {CONTACT_INFO.phone}
                  </p>
                  <span className="text-[11px] font-semibold text-tiger-orange font-mono uppercase tracking-widest block mt-2">
                    AVAILABLE 9 AM - 8 PM IST
                  </span>
                </div>
              </a>

              {/* Verified mail contact */}
              <a
                id="contact-email-card"
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-start space-x-4 bg-white p-5 rounded-xl border border-gray-150 shadow-sm hover:border-tiger-orange/40 hover:shadow-md transition-all block group"
              >
                <div className="bg-tiger-orange/15 border border-tiger-orange/30 text-tiger-orange p-3.5 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-tiger-dark text-base group-hover:text-tiger-orange transition-colors">
                    Official Corporate Email
                  </h4>
                  <p className="text-gray-600 text-sm mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    {CONTACT_INFO.email}
                  </p>
                  <span className="text-[11px] font-semibold text-tiger-orange font-mono uppercase tracking-widest block mt-2">
                    STRICT RESPLY WITHIN 24 HOURS
                  </span>
                </div>
              </a>

              {/* Working Hours */}
              <div className="flex items-start space-x-4 bg-white/50 p-5 rounded-xl border border-gray-200">
                <div className="bg-gray-100 text-gray-600 p-3.5 rounded-xl shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-tiger-dark text-base">Facility Operational Hours</h4>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed">
                    Monday to Saturday: 10:00 AM – 07:00 PM IST<br />
                    Sunday: Closed (Manufacturing automated checks only)
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Highly functional quote form container */}
          <div id="contact-form-container" className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-150 relative">
            
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-tiger-orange to-amber-500 rounded-t-3xl" />

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  id="contact-success-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center text-center py-12 space-y-6"
                >
                  <div className="bg-green-100 text-green-600 p-5 rounded-full border border-green-200 animate-bounce">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-2xl text-tiger-dark">
                      Sampling Request Received Successfully!
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
                      Thank you for contacting Q.S Tiger Garments. Our business managers are reviewing your specifications and will follow up with direct quotations or call your mobile <strong>{formData.phone}</strong> shortly.
                    </p>
                  </div>
                  
                  {/* Summary of what they requested */}
                  <div className="bg-[#faf9f6] border border-gray-150 p-5 rounded-xl text-left w-full text-xs space-y-2 max-w-md font-mono">
                    <span className="block font-bold text-tiger-dark border-b border-gray-200 pb-2 mb-2">QUOTATION MEMO:</span>
                    <div className="flex justify-between">
                      <span className="text-gray-400 uppercase">REPRESENTATIVE:</span>
                      <span className="text-tiger-dark font-bold text-right">{formData.fullName} ({formData.businessName || "Indepedent Trader"})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 uppercase">INTEREST:</span>
                      <span className="text-tiger-dark font-bold text-right">{formData.productInterest}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 uppercase">VOLUME REQ:</span>
                      <span className="text-tiger-dark font-bold text-right">{formData.monthlyVolume}</span>
                    </div>
                  </div>

                  <button
                    id="reset-form-btn"
                    onClick={handleReset}
                    className="bg-tiger-dark hover:bg-tiger-orange text-white font-semibold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all shadow-md shadow-tiger-dark/10"
                  >
                    Submit Another Wholesale Quote Form
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  id="b2b-procurement-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-tiger-dark flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-tiger-orange" />
                      <span>Get a Wholesale Quote</span>
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Provide details below to receive specialized custom material fabric rates.
                    </p>
                  </div>

                  {formError && (
                    <div id="form-validation-error-alert" className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-xs font-semibold leading-relaxed flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5 text-left">
                      <label htmlFor="fullName" className="block text-xs font-mono uppercase tracking-wider text-gray-500 font-bold">
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        required
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full bg-[#faf9f6] border border-gray-200 focus:border-tiger-orange focus:ring-1 focus:ring-tiger-orange rounded-xl px-4 py-3.5 text-sm transition-all outline-none"
                      />
                    </div>

                    {/* Business Name */}
                    <div className="space-y-1.5 text-left">
                      <label htmlFor="businessName" className="block text-xs font-mono uppercase tracking-wider text-gray-500 font-bold">
                        Business / Agency Name
                      </label>
                      <input
                        id="businessName"
                        type="text"
                        name="businessName"
                        placeholder="Garment Distributing Co."
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="w-full bg-[#faf9f6] border border-gray-200 focus:border-tiger-orange focus:ring-1 focus:ring-tiger-orange rounded-xl px-4 py-3.5 text-sm transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email address */}
                    <div className="space-y-1.5 text-left">
                      <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-gray-500 font-bold">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-[#faf9f6] border border-gray-200 focus:border-tiger-orange focus:ring-1 focus:ring-tiger-orange rounded-xl px-4 py-3.5 text-sm transition-all outline-none"
                      />
                    </div>

                    {/* Mobile contact number */}
                    <div className="space-y-1.5 text-left">
                      <label htmlFor="phone" className="block text-xs font-mono uppercase tracking-wider text-gray-500 font-bold">
                        Mobile Number *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        required
                        placeholder="98XXXXXXXX"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-[#faf9f6] border border-gray-200 focus:border-tiger-orange focus:ring-1 focus:ring-tiger-orange rounded-xl px-4 py-3.5 text-sm transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Product interest selection dropdown */}
                    <div className="space-y-1.5 text-left">
                      <label htmlFor="productInterest" className="block text-xs font-mono uppercase tracking-wider text-gray-500 font-bold">
                        Core Product Interest
                      </label>
                      <div className="relative">
                        <select
                          id="productInterest"
                          name="productInterest"
                          value={formData.productInterest}
                          onChange={handleInputChange}
                          className="w-full bg-[#faf9f6] border border-gray-200 focus:border-tiger-orange focus:ring-1 focus:ring-tiger-orange rounded-xl px-4 py-3.5 text-sm transition-all outline-none appearance-none cursor-pointer pr-10"
                        >
                          {dynamicProducts.map((p: any, idx: number) => (
                            <option key={idx} value={p.name}>{p.name}</option>
                          ))}
                          <option value="General Bulk RMG Fabric Sourcing">General Bulk RMG Fabric Sourcing</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Volume Estimate Dropdown list */}
                    <div className="space-y-1.5 text-left">
                      <label htmlFor="monthlyVolume" className="block text-xs font-mono uppercase tracking-wider text-gray-500 font-bold">
                        Est. Monthly Volume Required
                      </label>
                      <div className="relative">
                        <select
                          id="monthlyVolume"
                          name="monthlyVolume"
                          value={formData.monthlyVolume}
                          onChange={handleInputChange}
                          className="w-full bg-[#faf9f6] border border-gray-200 focus:border-tiger-orange focus:ring-1 focus:ring-tiger-orange rounded-xl px-4 py-3.5 text-sm transition-all outline-none appearance-none cursor-pointer pr-10"
                        >
                          <option>Less than 500 pieces</option>
                          <option>500 - 1,000 pieces</option>
                          <option>1,000 - 5,000 pieces</option>
                          <option>5,000 - 10,000 pieces</option>
                          <option>More than 10,000 pieces / month</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Specifications custom notes text */}
                  <div className="space-y-1.5 text-left">
                    <label htmlFor="customSpecs" className="block text-xs font-mono uppercase tracking-wider text-gray-500 font-bold">
                      Fabric Specifications or Brand Custom Requirements
                    </label>
                    <textarea
                      id="customSpecs"
                      name="customSpecs"
                      rows={4}
                      placeholder="Specify your preferred GSM weights, organic labeling, button types or pattern details (e.g., We need 180 GSM combed-cotton T-shirts for Kolkata distributing hub...)"
                      value={formData.customSpecs}
                      onChange={handleInputChange}
                      className="w-full bg-[#faf9f6] border border-gray-200 focus:border-tiger-orange focus:ring-1 focus:ring-tiger-orange rounded-xl px-4 py-3.5 text-sm transition-all outline-none resize-none"
                    />
                  </div>

                  <button
                    id="submit-procurement-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-tiger-orange hover:bg-tiger-orange/95 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-tiger-orange/15 hover:shadow-xl flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Transmitting Sourcing Query...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Sourcing & Quote Request</span>
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
