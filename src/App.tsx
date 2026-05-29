/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, FormEvent, TouchEvent, MouseEvent } from 'react';
import {
  Sparkles,
  Calendar,
  ShieldCheck,
  Calculator,
  Clock,
  Phone,
  Mail,
  MapPin,
  User,
  Star,
  ArrowRight,
  Check,
  Trash2,
  Plus,
  Minus,
  Building,
  Home,
  Layers,
  Send,
  Heart,
  Info,
  X,
  ChevronRight,
  FileText,
  BadgePercent,
  ThumbsUp,
  Image as ImageIcon,
  Search,
  Award,
  Briefcase,
  Timer,
  CheckCircle,
  Sun,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';
import { SERVICE_PLANS, TESTIMONIALS, GALLERY_ITEMS, BIOGRAPHY } from './data';
import { ServicePlan, CleaningType, ServiceFrequency, Booking, ContactInquiry, SavedPlan } from './types';

export default function App() {
  // Navigation & Page State
  const [activeTab, setActiveTab] = useState<'home' | 'plans' | 'calculator' | 'gallery' | 'about' | 'contact'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // checkout basket
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([
    {
      id: 'stored-init-1',
      planId: 'plan-basic-pristine',
      planName: 'Standard Brooks Clean',
      price: 149,
      frequency: 'weekly',
      savedAt: new Date().toLocaleDateString()
    }
  ]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  
  // Pricing Calculator State
  const [squareFeet, setSquareFeet] = useState<number>(1800);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [propertyType, setPropertyType] = useState<'house' | 'apartment' | 'office' | 'townhome'>('house');
  const [cleaningType, setCleaningType] = useState<CleaningType>('standard');
  const [serviceFrequency, setServiceFrequency] = useState<ServiceFrequency>('weekly');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(['fridge', 'pet']);

  // Add-ons data (internal config)
  const ADD_ONS = [
    { id: 'fridge', name: 'Interior Refrigerator Sanitation', price: 45, desc: 'Eco-clean shelving & deodorize' },
    { id: 'oven', name: 'Oven Deep Grime Extraction', price: 55, desc: 'High-heat grease dissolution' },
    { id: 'windows', name: 'Interior Glass & Frame Detail', price: 75, desc: 'Smudgeless shine per room' },
    { id: 'pet', name: 'Pet Allergen Deep Treatment', price: 35, desc: 'Dander neutralize on fabrics' },
    { id: 'cabinet', name: 'Inside Cabinets Detail Clean', price: 65, desc: 'Declutter and sanitize shelves' }
  ];

  // Live Calculator Subtotal Calculation
  const calculatedPrice = useMemo(() => {
    // Base cost calculations
    let base = 90;
    
    // Size impact
    base += (squareFeet / 10); // $0.10 per sq ft
    
    // Bed / Bath weighting
    base += bedrooms * 20;
    base += bathrooms * 30;

    // Cleaning Type multipliers
    let multiplier = 1.0;
    if (cleaningType === 'deep') multiplier = 1.4;
    if (cleaningType === 'move_out') multiplier = 1.8;
    if (cleaningType === 'commercial') multiplier = 1.6;

    let subtotal = base * multiplier;

    // Property Type variations
    if (propertyType === 'apartment') subtotal *= 0.95;
    if (propertyType === 'office') subtotal *= 1.15;

    // Add-on extra charges
    const addOnTotal = selectedAddOns.reduce((acc, currentId) => {
      const option = ADD_ONS.find(item => item.id === currentId);
      return acc + (option ? option.price : 0);
    }, 0);

    let finalValue = Math.round(subtotal + addOnTotal);

    // Frequency discounts
    if (serviceFrequency === 'weekly') finalValue = Math.round(finalValue * 0.80); // 20% Off
    if (serviceFrequency === 'biweekly') finalValue = Math.round(finalValue * 0.85); // 15% Off
    if (serviceFrequency === 'monthly') finalValue = Math.round(finalValue * 0.90); // 10% Off

    return finalValue;
  }, [squareFeet, bedrooms, bathrooms, propertyType, cleaningType, serviceFrequency, selectedAddOns]);

  // Booking Form Fields
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [specialRemarks, setSpecialRemarks] = useState('');
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);
  const [confirmedBookingDetails, setConfirmedBookingDetails] = useState<any>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  // Gallery Active Category Filter and Drag/Comparison slider state
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'residential' | 'commercial' | 'detailed'>('all');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isSliding, setIsSliding] = useState(false);

  // Dedicated Page & Real-Time Clock State
  const [footerTime, setFooterTime] = useState<string>('');
  const [footerSubscribedEmail, setFooterSubscribedEmail] = useState('');
  const [footerSubscribedSuccess, setFooterSubscribedSuccess] = useState(false);
  const [gallerySearchQuery, setGallerySearchQuery] = useState('');
  const [selectedGallerySpotlight, setSelectedGallerySpotlight] = useState<string>('g-1');
  
  // Custom interactive slider for each of the 15 photos in the grid
  const [showPhotoBeforeState, setShowPhotoBeforeState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format beautifully in Local/CST time for Silverbrook headquarters (Austin, TX)
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'America/Chicago'
      };
      setFooterTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Contact Form Fields
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('Free Quote Request');
  const [contactMessage, setContactMessage] = useState('');
  const [contactInterest, setContactInterest] = useState('Standard Brooks Clean');
  const [contactSuccessAlert, setContactSuccessAlert] = useState(false);

  // Add plan to Saved Checkout Basket
  const handleSavePlan = (plan: ServicePlan) => {
    // Check if matching already exists
    const exists = savedPlans.some(p => p.planId === plan.id);
    if (!exists) {
      const newSaved: SavedPlan = {
        id: `stored-${Date.now()}`,
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        frequency: 'one-time',
        savedAt: new Date().toLocaleDateString()
      };
      setSavedPlans([...savedPlans, newSaved]);
      setIsCheckoutOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const handleRemoveSavedPlan = (id: string) => {
    setSavedPlans(savedPlans.filter(p => p.id !== id));
  };

  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'FIRSTWEEK20') {
      setAppliedDiscount({ code: 'FIRSTWEEK20', percent: 20 });
      setCouponError('');
    } else if (couponCode.trim().toUpperCase() === 'SILVERBROOK10') {
      setAppliedDiscount({ code: 'SILVERBROOK10', percent: 10 });
      setCouponError('');
    } else {
      setCouponError('Invalid promotion coupon code.');
    }
  };

  // Saved plan calculations
  const savedPlansPriceSummary = useMemo(() => {
    const originalSubtotal = savedPlans.reduce((sum, p) => {
      // Calculate dynamic prices for basket plans if frequency differs
      let multiplier = 1.0;
      if (p.frequency === 'weekly') multiplier = 0.8;
      if (p.frequency === 'biweekly') multiplier = 0.85;
      if (p.frequency === 'monthly') multiplier = 0.9;
      return sum + Math.round(p.price * multiplier);
    }, 0);

    let discountAmt = 0;
    if (appliedDiscount) {
      discountAmt = Math.round(originalSubtotal * (appliedDiscount.percent / 100));
    }

    return {
      subtotal: originalSubtotal,
      discount: discountAmt,
      total: Math.max(0, originalSubtotal - discountAmt)
    };
  }, [savedPlans, appliedDiscount]);

  const handleCheckoutFrequencyChange = (id: string, newFreq: string) => {
    setSavedPlans(savedPlans.map(p => {
      if (p.id === id) {
        return { ...p, frequency: newFreq };
      }
      return p;
    }));
  };

  // Gallery slider mouse drag interactions
  const handleMoveSlider = (clientX: number, containerRect: DOMRect) => {
    const relativeX = clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (relativeX / containerRect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const container = e.currentTarget.getBoundingClientRect();
    if (e.touches[0]) {
      handleMoveSlider(e.touches[0].clientX, container);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (e.buttons === 1 || isSliding) {
      const container = e.currentTarget.getBoundingClientRect();
      handleMoveSlider(e.clientX, container);
    }
  };

  // Dynamic booking state pre-fill from Pricing Calculator
  const triggerBookingFromCalculator = () => {
    setBookingName('');
    setBookingEmail('');
    setBookingPhone('');
    setBookingDate('');
    setBookingTime('');
    setSpecialRemarks(`Calculated Property Booking: Square footage is ${squareFeet} sq ft containing ${bedrooms} bedrooms and ${bathrooms} bathrooms. Clean category chosen is "${cleaningType}". Appended add-ons: ${selectedAddOns.join(', ')}.`);
    
    // Save this temporary calculated config to plans storage
    const calculatedPlanId = 'temp-calculator-pricing';
    const tempPlan: SavedPlan = {
      id: `calc-${Date.now()}`,
      planId: calculatedPlanId,
      planName: `Custom Quote [${cleaningType.toUpperCase()} CLEAN]`,
      price: calculatedPrice,
      frequency: serviceFrequency,
      savedAt: new Date().toLocaleDateString()
    };
    
    // Overwrite calculation item and display basket
    setSavedPlans([tempPlan, ...savedPlans.filter(p => p.planId !== calculatedPlanId)]);
    setIsCheckoutOpen(true);
  };

  // Submit actual Checkout Order
  const submitCheckoutOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingEmail || !bookingPhone) {
      alert('Please fill out essential client details in order to confirm.');
      return;
    }

    const orderId = `SCS-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderReceipt = {
      orderId,
      customer: { name: bookingName, email: bookingEmail, phone: bookingPhone },
      date: bookingDate || 'To be finalized',
      time: bookingTime || 'Contact scheduled',
      plansOrdered: savedPlans.map(p => ({
        name: p.planName,
        basePrice: p.price,
        frequency: p.frequency
      })),
      totalPrice: savedPlansPriceSummary.total,
      remarks: specialRemarks,
      couponApplied: appliedDiscount ? appliedDiscount.code : 'None'
    };

    // Construct highly detailed & well-arranged WhatsApp message for +447535 808015
    const lineDivider = '━━━━━━━━━━━━━━━━━━━━━━';
    let textMessage = `🧹 *SILVERBROOK CLEANING SOLUTIONS* 🧹\n`;
    textMessage += `${lineDivider}\n`;
    textMessage += `✨ *NEW BOOKING CONFIRMATION* ✨\n\n`;
    textMessage += `🆔 *Booking Code:* \`${orderId}\`\n\n`;
    
    textMessage += `👤 *CLIENT DETAILS*\n`;
    textMessage += `• *Full Name:* ${bookingName}\n`;
    textMessage += `• *Phone Number:* ${bookingPhone}\n`;
    textMessage += `• *Email Address:* ${bookingEmail}\n\n`;
    
    textMessage += `📅 *APPOINTMENT SCHEDULE*\n`;
    textMessage += `• *Preferred Date:* ${bookingDate || 'To be finalized'}\n`;
    textMessage += `• *Preferred Time:* ${bookingTime || 'Contact scheduled'}\n\n`;
    
    textMessage += `📌 *REQUESTED PLANS*\n`;
    if (savedPlans.length > 0) {
      savedPlans.forEach((p, idx) => {
        let freqLabel = 'One-Time Clean';
        if (p.frequency === 'weekly') freqLabel = 'Weekly Routine';
        if (p.frequency === 'biweekly') freqLabel = 'Bi-Weekly Routine';
        if (p.frequency === 'monthly') freqLabel = 'Monthly Routine';
        textMessage += `${idx + 1}. *${p.planName}* (${freqLabel})\n`;
      });
    } else {
      textMessage += `• *Custom Service Consultation*\n`;
    }
    
    if (specialRemarks.trim()) {
      textMessage += `\n🛠️ *SPECIAL INSTRUCTIONS / REMARKS*\n`;
      textMessage += `_${specialRemarks.trim()}_\n`;
    }
    
    textMessage += `\n💵 *PRICING SUMMARY*\n`;
    textMessage += `• *Estimated Price:* £${savedPlansPriceSummary.total}\n`;
    if (appliedDiscount) {
      textMessage += `• *Coupon Code Applied:* ${appliedDiscount.code} (${appliedDiscount.percent}% Discount)\n`;
    } else {
      textMessage += `• *Coupon Applied:* None\n`;
    }
    textMessage += `• *Payment Method:* Custom Quote / Discussion on WhatsApp\n\n`;
    
    textMessage += `${lineDivider}\n`;
    textMessage += `_Submitted via Digital Booking System - Silverbrook_`;

    const formattedUrl = `https://wa.me/447535808015?text=${encodeURIComponent(textMessage)}`;
    setWhatsappUrl(formattedUrl);
    setConfirmedBookingDetails(orderReceipt);
    setBookingSuccessModal(true);

    // Deep link redirect to WhatsApp
    try {
      window.open(formattedUrl, '_blank');
    } catch (err) {
      console.error("Popup blocked or failed to redirect automatically: ", err);
    }

    // Reset basket and selections
    setSavedPlans([]);
    setAppliedDiscount(null);
    setCouponCode('');
  };

  // Submit Contact Form
  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      return;
    }
    setContactSuccessAlert(true);
    setTimeout(() => {
      setContactSuccessAlert(false);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
    }, 5000);
  };

  // Scroll handler convenience
  const navigateToSection = (sectionId: string, tabName: any) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      if (['gallery', 'about'].includes(tabName)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }, 50);
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-brand-200 selection:text-brand-800">
      
      {/* Dynamic Checkout Sidebar/Cart Toggle */}
      <button 
        id="btn-sidebar-basket-trigger"
        onClick={() => setIsCheckoutOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-brand-600 hover:bg-brand-500 text-white rounded-full p-4 shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center space-x-2 border-2 border-white/30 cursor-pointer"
        aria-label="View Booking Checkout Basket"
      >
        <div className="relative">
          <Layers className="h-6 w-6" id="icon-saved-layer" />
          {savedPlans.length > 0 && (
            <span id="badge-saved-plans-count" className="absolute -top-3 -right-3 bg-rose-500 text-white text-xs font-bold font-display rounded-full h-5 w-5 flex items-center justify-center border-2 border-white animate-bounce">
              {savedPlans.length}
            </span>
          )}
        </div>
        <span className="text-sm font-semibold tracking-wide pr-1 hidden md:inline">Saved Plans Checkout</span>
      </button>

      {/* Checkout Booking Drawer Overlay */}
      {isCheckoutOpen && (
        <div id="checkout-drawer-backdrop" className="fixed inset-0 bg-brand-950/80 backdrop-blur-xs z-50 flex justify-end transition-opacity duration-300">
          <div id="checkout-drawer-container" className="bg-white w-full max-w-lg h-full shadow-2xl overflow-y-auto flex flex-col relative animate-slide-in">
            
            {/* Drawer Header */}
            <div className="bg-gradient-to-r from-brand-800 to-brand-700 text-white p-6 sticky top-0 z-10 flex justify-between items-center border-b border-brand-600">
              <div>
                <h3 className="font-display font-semibold text-lg flex items-center">
                  <Layers className="mr-2 text-brand-300 h-5 w-5" /> Saved Plans Checkout
                </h3>
                <p className="text-xs text-brand-100 mt-1">Review selected service schedules & finalize free premium quote</p>
              </div>
              <button 
                id="btn-close-checkout-drawer"
                onClick={() => setIsCheckoutOpen(false)}
                className="bg-brand-900/50 hover:bg-brand-900 p-2 rounded-full text-white/80 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Inner Content */}
            <div className="p-6 flex-1 space-y-6">
              
              {/* Basket list */}
              <div>
                <h4 className="font-display font-medium text-brand-800 text-xs uppercase tracking-wider mb-3">Stored Cleaning Plans</h4>
                {savedPlans.length === 0 ? (
                  <div className="bg-brand-50 border border-dashed border-brand-200 rounded-xl p-8 text-center" id="empty-basket-visual">
                    <Sparkles className="h-8 w-8 text-brand-400 mx-auto mb-2 animate-pulse" />
                    <p className="text-sm text-brand-700 font-medium font-sans">No plans saved yet</p>
                    <p className="text-xs text-slate-500 mt-1">Select from our Standard, Deep or Commercial service options to customize your quote.</p>
                    <button
                      id="btn-browse-plans-empty"
                      onClick={() => {
                        setIsCheckoutOpen(false);
                        navigateToSection('section-plans', 'plans');
                      }}
                      className="mt-4 inline-flex items-center text-xs text-brand-600 hover:text-brand-800 font-semibold cursor-pointer"
                    >
                      Browse Premium Plans <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3" id="saved-plans-box-list">
                    {savedPlans.map(plan => {
                      // Adjust price based on configured frequency
                      let discountCoeff = 1.0;
                      if (plan.frequency === 'weekly') discountCoeff = 0.8;
                      if (plan.frequency === 'biweekly') discountCoeff = 0.85;
                      if (plan.frequency === 'monthly') discountCoeff = 0.9;
                      
                      return (
                        <div key={plan.id} id={`saved-item-${plan.id}`} className="border border-slate-100 rounded-xl p-4 bg-slate-50 relative hover:border-brand-200 transition-all">
                          <button 
                            id={`btn-remove-saved-${plan.id}`}
                            onClick={() => handleRemoveSavedPlan(plan.id)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors p-1"
                            title="Remove plan"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          
                          <p className="font-display font-semibold text-brand-800 text-sm leading-snug pr-6">{plan.planName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Estimated Base: To be discussed with client</p>
                          
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60 pt-3">
                            <div>
                              <label className="text-slate-500 text-[10px] uppercase font-semibold">Frequency Selection</label>
                              <select 
                                id={`select-freq-${plan.id}`}
                                value={plan.frequency}
                                onChange={(e) => handleCheckoutFrequencyChange(plan.id, e.target.value)}
                                className="block mt-0.5 text-xs bg-white border border-slate-200 rounded-md py-1 px-1.5 focus:outline-hidden focus:ring-1 focus:ring-brand-500 text-slate-700"
                              >
                                <option value="once">One-Time Clean (Standard)</option>
                                <option value="weekly">Weekly Routine</option>
                                <option value="biweekly">Bi-Weekly Routine</option>
                                <option value="monthly">Monthly Routine</option>
                              </select>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-500 block">Pricing Scheme:</span>
                              <span className="font-display font-semibold text-brand-600 text-[11px]">
                                Bespoke Quote Pending
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {savedPlans.length > 0 && (
                <>
                  {/* Coupon Application */}
                  <form onSubmit={handleApplyCoupon} className="bg-slate-50 rounded-xl p-4 border border-slate-100" id="coupon-form">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Do you have an exclusive coupon code?</label>
                    <div className="flex gap-2">
                      <input 
                        id="input-coupon-code"
                        type="text" 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g. FIRSTWEEK20, SILVERBROOK10"
                        className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs uppercase placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-brand-500 text-slate-700 font-mono"
                      />
                      <button 
                        id="btn-apply-coupon"
                        type="submit"
                        className="bg-brand-600 hover:bg-brand-700 text-white rounded-md px-4 py-1.5 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedDiscount && (
                      <p className="text-brand-600 text-[11px] font-medium mt-1.5 flex items-center" id="coupon-applied-alert">
                        <BadgePercent className="h-3.5 w-3.5 mr-1" /> Coupon &ldquo;{appliedDiscount.code}&rdquo; applied successfully ({appliedDiscount.percent}% discount).
                      </p>
                    )}
                    {couponError && (
                      <p className="text-rose-500 text-[11px] font-medium mt-1.5" id="coupon-error-alert">
                        {couponError}
                      </p>
                    )}
                    <span className="block text-[10px] text-brand-600 mt-2 hover:underline cursor-pointer font-medium" onClick={() => setCouponCode('FIRSTWEEK20')}>
                      💡 Copy coupon &ldquo;FIRSTWEEK20&rdquo; to secure a 20% discount on your final discussed contract!
                    </span>
                  </form>

                  {/* Summary cost sheet */}
                  <div className="bg-brand-50 rounded-xl p-4 border border-brand-100 space-y-2" id="plans-price-summary-sheet">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Accumulated subtotal:</span>
                      <span className="font-semibold text-slate-800">Bespoke Pricing Scheme</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between text-xs text-brand-600">
                        <span>Discount Coupon ({appliedDiscount.percent}%):</span>
                        <span>Linked for review</span>
                      </div>
                    )}
                    <div className="border-t border-brand-200/50 pt-2 flex justify-between text-sm">
                      <span className="font-semibold text-brand-800">Final Budget:</span>
                      <span className="font-display font-bold text-brand-600 text-xs uppercase tracking-wider">Discussed with company</span>
                    </div>
                  </div>

                  {/* Booking Details Check-out Form */}
                  <form onSubmit={submitCheckoutOrder} className="space-y-3 pt-2 border-t border-slate-200" id="checkout-form-details">
                    <h5 className="font-display font-bold text-xs text-brand-800 uppercase tracking-widest">Provide Client Details</h5>
                    
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Your Full Name *</label>
                      <input 
                        id="checkout-client-name"
                        type="text" 
                        required
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="e.g. Evelyn Sterling"
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Your Email *</label>
                        <input 
                          id="checkout-client-email"
                          type="email" 
                          required
                          value={bookingEmail}
                          onChange={(e) => setBookingEmail(e.target.value)}
                          placeholder="e.g. evelyn@gmail.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Phone Number *</label>
                        <input 
                          id="checkout-client-phone"
                          type="tel" 
                          required
                          value={bookingPhone}
                          onChange={(e) => setBookingPhone(e.target.value)}
                          placeholder="e.g. (555) 234-5678"
                          className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Preferred Date</label>
                        <input 
                          id="checkout-preferred-date"
                          type="date" 
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Preferred Start Time</label>
                        <select 
                          id="checkout-preferred-time"
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                        >
                          <option value="">Choose arrival slot</option>
                          <option value="08:00 AM">Morning Slot (08:00 AM)</option>
                          <option value="11:00 AM">Midday Slot (11:00 AM)</option>
                          <option value="02:00 PM">Afternoon Slot (02:00 PM)</option>
                          <option value="05:00 PM">Late Afternoon Slot (05:00 PM)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Special instructions / Access Code</label>
                      <textarea 
                        id="checkout-special-remarks"
                        rows={2}
                        value={specialRemarks}
                        onChange={(e) => setSpecialRemarks(e.target.value)}
                        placeholder="Let us know about key pickups, parking, or custom focuses"
                        className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500 text-left"
                      />
                    </div>

                    <button 
                      id="btn-confirm-checkout-order"
                      type="submit"
                      className="w-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 text-white font-display font-medium rounded-xl py-3 mt-4 text-xs uppercase tracking-widest shadow-lg transform active:scale-98 transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Confirm & Reserve Booking Free quote</span>
                    </button>
                    <p className="text-[10px] text-slate-400 text-center mt-2 font-sans italic">
                      🔒 No immediate debit payment required. Our account executives will call to verify access.
                    </p>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Booking Absolute Success Dialog */}
      {bookingSuccessModal && confirmedBookingDetails && (
        <div id="booking-success-modal" className="fixed inset-0 bg-brand-950/90 backdrop-blur-md z-55 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl relative border border-slate-100 animate-fade-in" id="success-dialog-wrapper">
            <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-200">
              <Sparkles className="h-8 w-8 animate-spin-slow" />
            </div>
            <h3 className="font-display font-bold text-2xl text-brand-800 mb-2">Booking Confirmed!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              Your service plan is registered under booking code <strong className="text-brand-600 font-mono tracking-wider">{confirmedBookingDetails.orderId}</strong>. We have generated your high-priority WhatsApp summary to finalize schedule details.
            </p>

            <div className="bg-slate-50 rounded-2xl p-5 text-left border border-slate-100 space-y-3 text-xs mb-6">
              <p className="font-bold font-display uppercase tracking-widest text-[10px] text-slate-500 border-b border-slate-200 pb-2">Detailed Reservation Statement</p>
              
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Date & TimeSlot:</span>
                <span className="font-medium text-slate-800">{confirmedBookingDetails.date} @ {confirmedBookingDetails.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contact Reference:</span>
                <span className="font-medium text-slate-800">{confirmedBookingDetails.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone Number:</span>
                <span className="font-medium text-slate-800">{confirmedBookingDetails.customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email Address:</span>
                <span className="font-medium text-slate-800">{confirmedBookingDetails.customer.email}</span>
              </div>
              
              <div>
                <span className="text-slate-500 block mb-1">Selected Program Configurations:</span>
                <ul className="space-y-1 pl-3 list-disc text-slate-700 font-medium">
                  {confirmedBookingDetails.plansOrdered.map((po: any, i: number) => {
                    let freqLabel = 'One-Time Clean';
                    if (po.frequency === 'weekly') freqLabel = 'Weekly';
                    if (po.frequency === 'biweekly') freqLabel = 'Bi-Weekly';
                    if (po.frequency === 'monthly') freqLabel = 'Monthly';
                    return (
                      <li key={i}>{po.name} ({freqLabel})</li>
                    );
                  })}
                </ul>
              </div>

              {confirmedBookingDetails.remarks && (
                <div className="border-t border-slate-200 pt-2">
                  <span className="text-slate-500 block mb-1">Access Instructions / Remarks:</span>
                  <p className="text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">{confirmedBookingDetails.remarks}</p>
                </div>
              )}

              <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-semibold text-brand-800">
                <span>Total Estimated Cost:</span>
                <span className="font-display font-bold text-brand-600">£{confirmedBookingDetails.totalPrice}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mb-6 font-sans">
              ⚠️ If you were not automatically redirected to WhatsApp, please tap the button below to send your structured details to <strong className="text-slate-800">+447535 808015</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                id="btn-send-whatsapp-success"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 hover:translate-y-[-1px] text-white font-display font-semibold rounded-xl py-3 text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2"
              >
                <span>📲 Send to WhatsApp</span>
              </a>
              <button 
                id="btn-success-close"
                onClick={() => setBookingSuccessModal(false)}
                className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-display font-semibold rounded-xl py-3 text-xs uppercase tracking-wider transition-all cursor-pointer border border-slate-200"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Header / Premium Navigation System */}
      <header id="nav-header" className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-200/80 z-35 Transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Brand Title */}
            <div 
              id="brand-logo-container" 
              onClick={() => navigateToSection('section-hero', 'home')}
              className="flex items-center cursor-pointer group"
            >
              <img 
                src="https://res.cloudinary.com/progresshenry/image/upload/v1779906017/logos1_qsgoee.png" 
                alt="Silverbrook Cleaning Solutions" 
                className="h-14 w-38 object-contain transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Desktop Nav menu */}
            <nav id="desktop-nav-menu" className="hidden lg:flex items-center space-x-8 font-display">
              <button 
                id="tab-home"
                onClick={() => navigateToSection('section-hero', 'home')}
                className={`text-sm font-medium transition-colors ${activeTab === 'home' ? 'text-brand-600 font-semibold' : 'text-slate-600 hover:text-brand-600'}`}
              >
                Home
              </button>
              <button 
                id="tab-plans"
                onClick={() => navigateToSection('section-plans', 'plans')}
                className={`text-sm font-medium transition-colors ${activeTab === 'plans' ? 'text-brand-600 font-semibold' : 'text-slate-600 hover:text-brand-600'}`}
              >
                Service Plans
              </button>
              <button 
                id="tab-calculator"
                onClick={() => navigateToSection('section-calculator', 'calculator')}
                className={`text-sm font-medium transition-colors ${activeTab === 'calculator' ? 'text-brand-600 font-semibold' : 'text-slate-600 hover:text-brand-600'}`}
              >
                Pricing Calculator
              </button>
              <button 
                id="tab-gallery"
                onClick={() => navigateToSection('section-gallery', 'gallery')}
                className={`text-sm font-medium transition-colors ${activeTab === 'gallery' ? 'text-brand-600 font-semibold' : 'text-slate-600 hover:text-brand-600'}`}
              >
                Photo Gallery
              </button>
              <button 
                id="tab-about"
                onClick={() => navigateToSection('section-about', 'about')}
                className={`text-sm font-medium transition-colors ${activeTab === 'about' ? 'text-brand-600 font-semibold' : 'text-slate-600 hover:text-brand-600'}`}
              >
                About Us
              </button>
              <button 
                id="tab-contact"
                onClick={() => navigateToSection('section-contact', 'contact')}
                className={`text-sm font-medium transition-colors ${activeTab === 'contact' ? 'text-brand-600 font-semibold' : 'text-slate-600 hover:text-brand-600'}`}
              >
                Contact & Free Quotes
              </button>
            </nav>

            {/* Header Right Action Trigger */}
            <div className="hidden lg:flex items-center space-x-4">
              <button 
                id="btn-fast-quote-hdr"
                onClick={() => navigateToSection('section-calculator', 'calculator')}
                className="bg-brand-600 hover:bg-brand-500 text-white font-display text-xs font-semibold uppercase tracking-widest px-5 py-3 rounded-xl transition-all shadow-md shadow-brand-600/5 cursor-pointer"
              >
                Booking Calculator
              </button>
            </div>

            {/* Mobile menu trigger button */}
            <div className="lg:hidden flex items-center space-x-3">
              {savedPlans.length > 0 && (
                <button 
                  id="btn-compact-basket"
                  onClick={() => setIsCheckoutOpen(true)}
                  className="bg-brand-100 hover:bg-brand-200 text-brand-600 p-2.5 rounded-full relative"
                >
                  <Layers className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold rounded-full h-4.5 w-4.5 flex items-center justify-center">
                    {savedPlans.length}
                  </span>
                </button>
              )}
              <button
                id="btn-mobile-menu-trigger"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-brand-600 focus:outline-hidden"
                aria-label="Toggle Mobile Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <div className="space-y-1.5 w-6">
                    <span className="block h-0.5 w-6 bg-slate-700"></span>
                    <span className="block h-0.5 w-5 bg-slate-700 ml-auto"></span>
                    <span className="block h-0.5 w-4 bg-slate-700 ml-auto"></span>
                  </div>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div id="mobile-nav-panel" className="lg:hidden border-t border-slate-100 bg-white shadow-xl animate-fade-in">
            <div className="px-4 pt-4 pb-6 space-y-2">
              <button
                id="mobile-tab-home"
                onClick={() => navigateToSection('section-hero', 'home')}
                className="block w-full text-left py-2.5 px-4 rounded-xl font-display font-medium text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600"
              >
                Home
              </button>
              <button
                id="mobile-tab-plans"
                onClick={() => navigateToSection('section-plans', 'plans')}
                className="block w-full text-left py-2.5 px-4 rounded-xl font-display font-medium text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600"
              >
                Service Plans
              </button>
              <button
                id="mobile-tab-calculator"
                onClick={() => navigateToSection('section-calculator', 'calculator')}
                className="block w-full text-left py-2.5 px-4 rounded-xl font-display font-medium text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600"
              >
                Pricing Calculator & Booking
              </button>
              <button
                id="mobile-tab-gallery"
                onClick={() => navigateToSection('section-gallery', 'gallery')}
                className="block w-full text-left py-2.5 px-4 rounded-xl font-display font-medium text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600"
              >
                Photo Gallery Results
              </button>
              <button
                id="mobile-tab-about"
                onClick={() => navigateToSection('section-about', 'about')}
                className="block w-full text-left py-2.5 px-4 rounded-xl font-display font-medium text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600"
              >
                Our Owner & Story
              </button>
              <button
                id="mobile-tab-contact"
                onClick={() => navigateToSection('section-contact', 'contact')}
                className="block w-full text-left py-2.5 px-4 rounded-xl font-display font-medium text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 animate-pulse"
              >
                Contact For Free Quote
              </button>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between px-4">
                <span className="text-xs text-slate-500">Call Now: (555) 389-4820</span>
                <span className="text-xs font-bold text-brand-600">Premium Rated ★★★★★</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Sections Wrapper */}
      <main className="flex-1">
        {activeTab === 'gallery' ? (
          <div id="page-gallery" className="bg-slate-50 min-h-screen py-12 animate-fade-in font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              
              {/* Page header */}
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <span className="text-[11px] font-display font-bold uppercase tracking-widest text-brand-600 py-1.5 px-4 bg-brand-100/80 rounded-full inline-block">
                  Verified Portfolios of Cleanliness
                </span>
                <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-brand-950 tracking-tight leading-tight">
                  Silverbrook Meticulous <span className="text-brand-500">Photo Archive</span>
                </h1>
                <p className="text-sm text-slate-600">
                  Explore our comprehensive 15-photo showcase. Highlight any project file below to load it in the interactive comparative inspection bay or search specific surfaces in real time.
                </p>
              </div>

              {/* Spotlight Compartment Section */}
              <div className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xs" id="spotlight-bay">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-brand-500">Spotlight Showcase</span>
                      <h3 className="font-display font-bold text-lg text-slate-900 mt-1">
                        {GALLERY_ITEMS.find(g => g.id === selectedGallerySpotlight)?.title || 'Selected Action Highlight'}
                      </h3>
                    </div>
                    <div className="hidden sm:flex text-xs space-x-2 text-slate-500">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md font-mono font-semibold">
                        ID: {selectedGallerySpotlight}
                      </span>
                      <span className="bg-brand-50 text-brand-700 px-2.5 py-1 rounded-md capitalize font-semibold font-display uppercase tracking-wider text-[10px]">
                        {GALLERY_ITEMS.find(g => g.id === selectedGallerySpotlight)?.category}
                      </span>
                    </div>
                  </div>

                  {/* Single beautiful spotlight photo of real cleaner working */}
                  <div 
                    id="page-spotlight-image-container"
                    className="relative h-[250px] sm:h-[450px] rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-150 select-none group"
                  >
                    <img 
                      src={GALLERY_ITEMS.find(g => g.id === selectedGallerySpotlight)?.image || GALLERY_ITEMS[0].image} 
                      alt="Silverbrook professional cleaning staff in action"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-6">
                      <span className="bg-brand-600 text-white font-display text-[10px] sm:text-xs font-semibold tracking-widest py-1.5 px-4 rounded-md border border-white/20 shadow-lg">
                        ✨ SILVERBROOK STANDARDS
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans block text-center max-w-2xl mx-auto">
                    {GALLERY_ITEMS.find(g => g.id === selectedGallerySpotlight)?.description}
                  </p>
                </div>
              </div>

              {/* Main archive layout */}
              <div className="space-y-8">
                
                {/* Search & filter bars wrapper */}
                <div className="bg-white p-5 border border-slate-200/60 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Category filters */}
                  <div className="flex flex-wrap gap-1.5" id="archive-filter-buttons">
                    {[
                      { id: 'all', label: 'All 15 Works' },
                      { id: 'residential', label: 'Residential Care' },
                      { id: 'commercial', label: 'Commercial Corporate' },
                      { id: 'detailed', label: 'Meticulous Details' }
                    ].map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => setGalleryFilter(cat.id as any)}
                        className={`px-3.5 py-2 text-xs font-display font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                          galleryFilter === cat.id 
                            ? 'bg-brand-800 text-white shadow-xs' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Free text search bar */}
                  <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      type="text"
                      value={gallerySearchQuery}
                      onChange={(e) => setGallerySearchQuery(e.target.value)}
                      placeholder="Search surfaces, rooms or files..."
                      className="w-full bg-slate-50 border border-slate-250 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-850 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500 font-sans"
                    />
                    {gallerySearchQuery && (
                      <button 
                        onClick={() => setGallerySearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* 15 photos grid list with reactive toggle */}
                {(() => {
                  const filtered = GALLERY_ITEMS.filter(item => {
                    const matchesCat = galleryFilter === 'all' || item.category === galleryFilter;
                    const matchesSearch = item.title.toLowerCase().includes(gallerySearchQuery.toLowerCase()) || 
                                          item.description.toLowerCase().includes(gallerySearchQuery.toLowerCase());
                    return matchesCat && matchesSearch;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl" id="no-filtered-results">
                        <ImageIcon className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-700 font-display">No matching portfolio records</p>
                        <p className="text-xs text-slate-400 mt-1">Try resetting your category tab filters or text query terms.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="archive-photos-grid">
                      {filtered.map(item => {
                        return (
                          <div 
                            key={item.id}
                            className={`border rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full ${
                              selectedGallerySpotlight === item.id ? 'ring-2 ring-brand-500 border-transparent shadow-md' : 'border-slate-200/80 shadow-xs'
                            }`}
                          >
                            <div className="relative h-56 bg-slate-100 overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />

                              {/* Absolute badges */}
                              <div className="absolute top-3 left-3 flex space-x-1">
                                <span className="bg-brand-900/95 text-white text-[8px] uppercase font-bold px-2 py-0.5 rounded-sm tracking-widest leading-none">
                                  {item.category}
                                </span>
                                <span className="bg-emerald-500 border border-emerald-400 text-white text-[8px] uppercase font-bold px-2 py-0.5 rounded-sm leading-none shadow-xs">
                                  Sparkle Quality
                                </span>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                              <div className="space-y-2">
                                <h4 className="font-display font-bold text-slate-900 text-sm leading-snug">{item.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-sans">{item.description}</p>
                              </div>

                              <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
                                <button 
                                  onClick={() => {
                                    setSelectedGallerySpotlight(item.id);
                                    window.scrollTo({ top: 120, behavior: 'smooth' });
                                  }}
                                  className="text-brand-650 hover:text-brand-800 font-bold transition-colors cursor-pointer flex items-center space-x-1"
                                >
                                  <span>🔍 Inspect in bay</span>
                                </button>
                                
                                <button 
                                  onClick={() => {
                                    if (item.category === 'commercial') {
                                      setPropertyType('office');
                                      setCleaningType('commercial');
                                    } else {
                                      setPropertyType('house');
                                      setCleaningType('deep');
                                    }
                                    navigateToSection('section-calculator', 'calculator');
                                  }}
                                  className="text-slate-600 hover:text-brand-600 font-medium transition-colors cursor-pointer"
                                >
                                  Standard Quote Price &rarr;
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

              </div>

              {/* Instantly try out widget banner */}
              <div className="bg-gradient-to-r from-brand-900 via-brand-950 to-slate-950 text-white rounded-3xl p-8 border border-white/5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2 max-w-2xl">
                  <h3 className="font-display font-bold text-xl text-brand-200">Are You Ready to Experience Silverbrook Standards?</h3>
                  <p className="text-xs text-slate-200 font-sans leading-relaxed">
                    Reserve an organic green-chemistry deep clean with Marcus’s background-vetting cleaning specialists. Fully protected by our legendary, 100% unconditional 24-Hour Sparkle Guarantee.
                  </p>
                </div>
                <button 
                  onClick={() => navigateToSection('section-calculator', 'calculator')}
                  className="bg-brand-500 hover:bg-brand-400 text-white font-display text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-lg whitespace-nowrap cursor-pointer"
                >
                  Configure Custom Quote Now
                </button>
              </div>

            </div>
          </div>
        ) : activeTab === 'about' ? (
          <div id="page-about" className="bg-slate-50 min-h-screen py-12 animate-fade-in font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
              
              {/* Profile Page Header */}
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-[11px] font-display font-bold uppercase tracking-widest text-brand-600 py-1.5 px-4 bg-brand-100/80 rounded-full inline-block">
                  About Silverbrook
                </span>
                <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-brand-950 tracking-tight leading-tight">
                  Guiding Principles & <span className="text-brand-500">Corporate Heritage</span>
                </h1>
                <p className="text-sm text-slate-600">
                  Welcome to leadership details and corporate milestones of families&apos; preferred white-glove space sanitization academy.
                </p>
              </div>

              {/* CEO SECTION: MUST COME FIRST! */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-12 shadow-xs max-w-4xl mx-auto" id="ceo-section-primary">
                {/* CEO Biographical details */}
                <div className="space-y-6" id="ceo-verbal-particulars">
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-bold text-brand-650 font-display tracking-widest block">Executive Leadership Portrait</span>
                    <h2 className="font-display font-extrabold text-3xl text-brand-950">Marcus Silverbrook</h2>
                    <p className="text-slate-500 font-sans text-xs font-semibold">{BIOGRAPHY.ownerTitle}</p>
                    <p className="text-slate-500 italic text-sm font-sans border-l-4 border-brand-500 pl-4 py-1">
                      &ldquo;{BIOGRAPHY.ownerQuote}&rdquo;
                    </p>
                  </div>

                  <div className="space-y-4 text-slate-600 font-sans text-xs leading-relaxed">
                    <p>
                      {BIOGRAPHY.ownerBio}
                    </p>
                    <p>
                      {BIOGRAPHY.detailedCEOStory || 'Marcus Silverbrook brings a lifetime of quality-driven operations management to the service industry. After a decade managing luxury boutique hotel properties where cleanliness and presentation dictate extreme guest luxury standards, he noticed a major gap in the market: residential or corporate cleaning agencies were inconsistent, hurried, and rarely treated customer properties with white-glove fidelity.'}
                    </p>
                    <p>
                      Determined to enforce exceptional standards, Marcus personally operates quality oversight. Every cleaner certified under Silverbrook must fulfill background-vetted credentials. Marcus remains accessible directly to help craft bespoke cleaning coordinates for large luxury estates or commercial floors.
                    </p>
                  </div>

                  {/* CEO Certified checklist block */}
                  <div className="border border-brand-100 bg-brand-50/50 rounded-2xl p-5 space-y-3">
                    <h4 className="font-display font-bold text-xs uppercase text-brand-850 tracking-wider flex items-center">
                      <Award className="h-4.5 w-4.5 text-brand-600 mr-2" /> Founder Standards & Qualifications
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700 font-sans">
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 bg-brand-100 text-brand-700 rounded-full p-0.5 shrink-0" />
                        <span>Meticulous 55-Point Checklist</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 bg-brand-100 text-brand-700 rounded-full p-0.5 shrink-0" />
                        <span>Green Care Bio-Formula Only</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 bg-brand-100 text-brand-700 rounded-full p-0.5 shrink-0" />
                        <span>Background Double-Screen Audits</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Check className="h-4 w-4 bg-brand-100 text-brand-700 rounded-full p-0.5 shrink-0" />
                        <span>Hospitality-Driven Meticulousness</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* COMPANY SECTION: FOLLOWS CEO FIRST! */}
              <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 border border-white/5 shadow-xl" id="company-section-secondary">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Company credentials (Left on lg desktop layout) */}
                  <div className="lg:col-span-7 space-y-6" id="company-story-verbal">
                    <div className="space-y-2">
                      <span className="text-xs uppercase font-extrabold text-brand-300 font-display tracking-widest block">The Foundation Story</span>
                      <h2 className="font-display font-extrabold text-3xl">Silverbrook Cleaning Solutions</h2>
                      <p className="text-slate-300 text-xs font-sans leading-relaxed">
                        {BIOGRAPHY.companyStory}
                      </p>
                    </div>

                    {/* Corporate timeline */}
                    <div className="space-y-4">
                      <h3 className="font-display font-extrabold text-white text-xs uppercase tracking-widest border-b border-white/10 pb-2">Historic Milestone Timeline</h3>
                      <div className="space-y-3">
                        {(BIOGRAPHY.companyMilestones || [
                          { year: '2018', title: 'The Genesis', desc: 'Founded by Marcus with 2 teammates, immediately launching the organic green chemical protocol.' },
                          { year: '2020', title: 'Commercial Expansion', desc: 'Selected as the leading boutique service partner for prominent tech headquarters.' },
                          { year: '2022', title: 'The Cleaning Guild', desc: 'Co-created the elite professional Silverbrook Guild Academy, certifying background-tested personnel.' },
                          { year: '2024', title: 'Carbon Neutral Standard', desc: 'Achieved complete 100% green supply pipeline certification with custom biological formulations.' }
                        ]).map((m, i) => (
                          <div key={i} className="flex gap-4 items-start text-xs font-sans">
                            <span className="bg-brand-500 text-white font-display font-bold px-2 py-0.5 rounded-md shrink-0">
                              {m.year}
                            </span>
                            <div>
                              <p className="font-bold text-slate-100">{m.title}</p>
                              <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">{m.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Company Image & stats grid (Right on lg desktop layout) */}
                  <div className="lg:col-span-12 xl:col-span-5 space-y-6" id="company-image-and-grid">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/15 aspect-[4/3] bg-slate-800">
                      <img 
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" 
                        alt="Corporate Sterling office space cleaned by Silverbrook" 
                        className="w-full h-full object-cover opacity-80"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Stats numeric indicators */}
                    <div className="grid grid-cols-2 gap-4">
                      {BIOGRAPHY.stats.map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl text-center shadow-xs">
                          <span className="font-display font-extrabold text-2xl text-brand-300 block leading-tight">{stat.value}</span>
                          <span className="text-[9px] font-semibold text-slate-400 block uppercase tracking-wider mt-1">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Unconditional 24-Hour Seal of Guarantee Audit Block */}
              <div className="border border-slate-200/80 bg-white p-8 rounded-3xl text-center font-sans space-y-4 max-w-max mx-auto shadow-xs" id="official-audit-seal">
                <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-650 flex items-center justify-center mx-auto border border-brand-100 animate-spin-slow">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-extrabold text-slate-900 text-lg">Official 24-Hour Sparkle Certificate Seal</h4>
                  <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
                    Silverbrook Cleaning Solutions is fully bonded, licensed, and protected with a $2,000,000 comprehensive liability policy. Marcus Silverbrook guarantees same-day re-clean visits if any visual space fails to excite.
                  </p>
                </div>
                <div className="inline-flex items-center space-x-4 text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-100/60 px-4 py-2 rounded-xl">
                  <span>★ Licensed SCS-REG-2018-99</span>
                  <span>★ Bonded & Certified</span>
                  <span>★ Zero-Volatile Safe</span>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <>
            {/* Section 1: Hero Section */}
        <section id="section-hero" className="relative bg-white pt-10 pb-20 md:py-24 overflow-hidden border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column Content */}
              <div className="lg:col-span-7 space-y-6" id="hero-verbal-section">
                
                {/* Micro branding tagline */}
                <div id="hero-pill-info" className="inline-flex items-center space-x-2 bg-brand-50 border border-brand-100 px-3.5 py-1.5 rounded-full text-xs text-brand-700 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-ping"></span>
                  <span>Meticulous Cleaning Craftsmanship</span>
                </div>

                <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-brand-950 tracking-tight leading-[1.1]" id="hero-display-heading">
                  The White-Glove Standard in <span className="text-brand-500 underline decoration-brand-200 decoration-8 underline-offset-4">Space Restoration</span>
                </h1>

                <p className="text-base text-slate-600 leading-relaxed max-w-2xl font-sans" id="hero-supporting-description">
                  Silverbrook Cleaning Solutions delivers elite residential and commercial cleaning of uncompromising quality. Powered by eco-friendly chemistry, rigorously trained guild specialists, and our legendary **24-Hour Sparkle Guarantee**.
                </p>

                {/* Grid boxes on Hero to capture user attention */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-3" id="hero-benefit-grid">
                  <div className="border border-slate-100 bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow" id="benefit-card-1">
                    <ShieldCheck className="text-brand-600 h-6 w-6 mb-2" />
                    <p className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Double-Vetted Guild</p>
                    <p className="text-[11px] text-slate-500 mt-1">Background checked specialists with elite certification</p>
                  </div>
                  <div className="border border-slate-100 bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow" id="benefit-card-2">
                    <Clock className="text-brand-600 h-6 w-6 mb-2" />
                    <p className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Unmatched Reliability</p>
                    <p className="text-[11px] text-slate-500 mt-1">Clockwork punctuality with 24-hr easy re-cleans</p>
                  </div>
                  <div className="col-span-2 lg:col-span-1 border border-slate-100 bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow" id="benefit-card-3">
                    <Sparkles className="text-brand-600 h-6 w-6 mb-2 animate-bounce" />
                    <p className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Eco-Green Active</p>
                    <p className="text-[11px] text-slate-500 mt-1">Child & pet-safe premium chemical solutions</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                  <button 
                    id="btn-hero-instant-booking"
                    onClick={() => navigateToSection('section-calculator', 'calculator')}
                    className="bg-brand-600 hover:bg-brand-500 text-white font-display text-xs font-semibold uppercase tracking-widest px-8 py-4.5 rounded-xl transition-all shadow-lg hover:shadow-brand-500/20 transform active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Instant Booking Calculator</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button 
                    id="btn-hero-view-gallery"
                    onClick={() => navigateToSection('section-gallery', 'gallery')}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-display text-xs font-bold uppercase tracking-widest px-8 py-4.5 rounded-xl border border-slate-200 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>View Result Gallery</span>
                  </button>
                </div>

                <div className="flex items-center space-x-6 pt-3 text-xs text-slate-500 font-sans border-t border-slate-100">
                  <div className="flex -space-x-2">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=60" alt="Customer 1" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=60" alt="Customer 2" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=60" alt="Customer 3" />
                  </div>
                  <div>
                    <div className="flex text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <Star className="h-3.5 w-3.5 fill-current" />
                    </div>
                    <p className="mt-0.5 font-medium text-slate-700">99.8% Client Satisfaction Rate based on 850+ reviews</p>
                  </div>
                </div>

              </div>

              {/* Right Column Visual Graphic */}
              <div className="lg:col-span-5 relative" id="hero-graphic-section">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-square max-w-md mx-auto lg:max-w-none">
                  <div className="absolute inset-0 bg-brand-900/10 z-10 hover:bg-transparent transition-colors duration-500"></div>
                  <img 
                    src="https://res.cloudinary.com/progresshenry/image/upload/v1779906032/branding_2_ilxzbf.jpg" 
                    alt="Pristine residential living room by Silverbrook"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                    id="hero-main-visual-image"
                  />
                  
                  {/* Absolute overlay elements for responsive premium layout */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl z-20 border border-slate-200/50 animate-bounce-slow" id="hero-live-accent-card">
                    <div className="flex items-center space-x-3">
                      <div className="bg-brand-100 text-brand-600 p-2.5 rounded-xl">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] uppercase font-display font-extrabold tracking-widest text-brand-600">Next Slots Available</p>
                        <p className="text-xs font-semibold text-slate-800 font-sans mt-0.5">Today (Saturday) or Monday Morning</p>
                      </div>
                      <div className="bg-brand-500 text-white rounded-md text-[10px] font-bold px-2 py-1 font-display uppercase tracking-wider">
                        Quick Reserve
                      </div>
                    </div>
                  </div>

                  {/* Absolute graphic badging */}
                  <div className="absolute top-6 right-6 bg-brand-600 text-white p-3 rounded-2xl shadow-lg z-20 text-center flex flex-col items-center justify-center aspect-square border border-white/20" id="hero-stamp-badge">
                    <span className="text-xl font-display font-bold">100%</span>
                    <span className="text-[8px] uppercase font-bold tracking-widest">Green Active</span>
                  </div>

                </div>

                {/* Decorative design elements beneath */}
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-brand-100 rounded-3xl -z-10 opacity-60"></div>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-brand-50 rounded-full -z-10"></div>
              </div>

            </div>
          </div>
        </section>


        {/* Section 2: Top-Notch Grid Boxes (Why choose us grid showcase) */}
        <section id="section-benefits" className="py-20 bg-slate-50 border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-[11px] font-display font-bold uppercase tracking-widest text-brand-600 py-1 px-3 bg-brand-100 rounded-full">The Silverbrook Difference</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-950 tracking-tight">Our Five-Star Core Standards</h2>
              <p className="text-sm text-slate-600 font-sans">
                We design cleaning programs that match elite visual standards. Discover how we elevate simple room sweeping into professional hygiene engineering.
              </p>
            </div>

            {/* Top notch grid boxes - highly styled cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" id="benefits-grid-parent">
              
              {/* Card 1 */}
              <div id="grid-box-benefit-1" className="bg-white border border-slate-100 hover:border-brand-200 p-6 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 group">
                <div className="h-12 w-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide mb-2">Double-Vetted Personnel</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Every specialist undergoes background auditing, identity checks, drug diagnostics, and 120 hours of hands-on cleaning certification.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-brand-600 tracking-widest">Secure Care Block</span>
                  <Check className="h-4 w-4 text-brand-600" />
                </div>
              </div>

              {/* Card 2 */}
              <div id="grid-box-benefit-2" className="bg-white border border-slate-100 hover:border-brand-200 p-6 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 group">
                <div className="h-12 w-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <Clock className="h-6 w-6" />
                </div>
                <h4 className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide mb-2">Punctual Reliable Timings</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  We guarantee precise arrivals inside our booked timeframes. If we are late by more than 15 minutes, we deduct an agreed loyalty credit from your custom plan.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-brand-600 tracking-widest">Elite Schedule Care</span>
                  <Check className="h-4 w-4 text-brand-600" />
                </div>
              </div>

              {/* Card 3 */}
              <div id="grid-box-benefit-3" className="bg-white border border-slate-100 hover:border-brand-200 p-6 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 group">
                <div className="h-12 w-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <h4 className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide mb-2">Eco-Friendly Active Chemistry</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Zero volatile petrochemical scents or chlorine residues. Child safe, pet safe, plant allergen neutral formulations only.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-brand-600 tracking-widest">Bio-Green Active</span>
                  <Check className="h-4 w-4 text-brand-600" />
                </div>
              </div>

              {/* Card 4 */}
              <div id="grid-box-benefit-4" className="bg-white border border-slate-100 hover:border-brand-200 p-6 rounded-2xl shadow-xs hover:shadow-lg transition-all duration-300 group">
                <div className="h-12 w-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <ThumbsUp className="h-6 w-6" />
                </div>
                <h4 className="font-display font-bold text-slate-800 text-sm uppercase tracking-wide mb-2">24hr Sparkle Guarantee</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  If any corner isn’t polished to your total expectations, let us know within 24 hours and your dedicated crew returns to re-clean instantly.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-brand-600 tracking-widest">Unconditional Promise</span>
                  <Check className="h-4 w-4 text-brand-600" />
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* Section 3: Professional Client Plans (Grid with checkout additions) */}
        <section id="section-plans" className="py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-[11px] font-display font-bold uppercase tracking-widest text-brand-600 py-1 px-3 bg-brand-100 rounded-full">Premium Programs</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-950 tracking-tight">Select & Store Booking Plans</h2>
              <p className="text-sm text-slate-600 font-sans">
                Save plans dynamically to your **Checkout Stored Basket** below. Customize frequencies for compounding savings on residential, deep, or corporate spaces.
              </p>
            </div>

            {/* Plans grids box layout */}
            <div className="grid lg:grid-cols-3 gap-8" id="plans-card-grid-container">
              {SERVICE_PLANS.map(plan => (
                <div 
                  id={`plan-card-${plan.id}`}
                  key={plan.id}
                  className={`border rounded-3xl p-8 relative flex flex-col justify-between transition-all duration-300 ${
                    plan.popular 
                      ? 'border-brand-500 bg-linear-to-b from-brand-950 to-brand-900 text-white shadow-xl scale-102 lg:-translate-y-2' 
                      : 'border-slate-200 bg-white text-slate-800 hover:border-brand-300 shadow-xs'
                    }`}
                >
                  
                  {/* Badge */}
                  {plan.badge && (
                    <span id={`plan-badge-${plan.id}`} className={`absolute -top-3.5 left-8 px-4 py-1 text-[10px] font-display uppercase tracking-widest font-bold rounded-full ${
                      plan.popular ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-600'
                    }`}>
                      {plan.badge}
                    </span>
                  )}

                  {/* Pricing and core definition */}
                  <div className="space-y-4">
                    <p className={`font-display font-extrabold text-xs uppercase tracking-widest ${plan.popular ? 'text-brand-300' : 'text-brand-600'}`}>
                      {plan.type} Cleaning Program
                    </p>
                    <h3 className="font-display font-bold text-2xl leading-none">{plan.name}</h3>
                    <p className={`text-xs ${plan.popular ? 'text-slate-300' : 'text-slate-500'} font-sans`}>
                      {plan.tagline}
                    </p>
                    
                    <p className={`font-display font-extrabold text-base italic pt-2 ${plan.popular ? 'text-brand-300' : 'text-brand-600'}`}>
                      Pricing discussed with client
                    </p>

                    <p className={`text-[11px] pb-4 border-b ${plan.popular ? 'border-brand-800' : 'border-slate-200/60'}`}>
                      💡 Bespoke schedules, frequency modifiers, and specific chemical selections are customized and agreed on review.
                    </p>

                    {/* Features checklist */}
                    <div className="pt-2 space-y-3">
                      <p className="font-display font-bold text-[10px] uppercase tracking-wider opacity-80">Included Service Spheres:</p>
                      <ul className="space-y-2 text-xs">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className={`p-0.5 rounded-full mr-2.5 mt-0.5 inline-flex items-center justify-center ${
                              plan.popular ? 'bg-brand-500/30 text-brand-300' : 'bg-brand-100 text-brand-600'
                            }`}>
                              <Check className="h-3 w-3" />
                            </span>
                            <span className={plan.popular ? 'text-slate-200' : 'text-slate-600'}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions drawer triggers */}
                  <div className="pt-8 space-y-3">
                    <button 
                      id={`btn-add-checkout-${plan.id}`}
                      onClick={() => handleSavePlan(plan)}
                      className={`w-full py-3 px-4 rounded-xl font-display font-semibold transition-all text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center space-x-2 ${
                        plan.popular 
                          ? 'bg-white text-brand-900 hover:bg-brand-100' 
                          : 'bg-brand-600 text-white hover:bg-brand-500'
                        }`}
                    >
                      <span>Save and Stash to checkout</span>
                      <Plus className="h-4 w-4" />
                    </button>
                    
                    <button 
                      id={`btn-direct-calc-${plan.id}`}
                      onClick={() => {
                        if (plan.id === 'plan-commercial-sparkle') {
                          setPropertyType('office');
                          setCleaningType('commercial');
                          setServiceFrequency('monthly');
                        } else if (plan.id === 'plan-deep-elite') {
                          setCleaningType('deep');
                          setServiceFrequency('biweekly');
                        } else {
                          setCleaningType('standard');
                        }
                        navigateToSection('section-calculator', 'calculator');
                      }}
                      className={`w-full py-2.5 font-display text-xs font-semibold uppercase tracking-wider transition-colors ${
                        plan.popular ? 'text-brand-300 hover:text-white' : 'text-slate-600 hover:text-brand-600'
                      }`}
                    >
                      Tweak properties inside calculator
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>


        {/* Section 4: Interactive Quote & Pricing Calculator System */}
        <section id="section-calculator" className="py-20 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-[11px] font-display font-bold uppercase tracking-widest text-brand-600 py-1 px-3 bg-brand-100 rounded-full">Interactive Tools</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-950 tracking-tight">Custom Premium Pricing Calculator</h2>
              <p className="text-sm text-slate-600 font-sans">
                Adjust property parameters in real time and view instant honest calculations. Seamlessly convert configurations to scheduled checkout quotes.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column Controls */}
              <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xs space-y-6" id="calculator-box-controls">
                
                <h3 className="font-display font-bold text-lg text-brand-900 pb-4 border-b border-slate-100 flex items-center">
                  <Calculator className="mr-2 text-brand-600 h-5 w-5" /> Step 1: Tell us about your space details
                </h3>

                {/* Property Category Toggles */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Residential or Commercial Profile</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" id="property-type-toggles">
                    {[
                      { id: 'house', label: 'Single House', icon: Home },
                      { id: 'apartment', label: 'Apartment/Flat', icon: Home },
                      { id: 'townhome', label: 'Townhouse', icon: Home },
                      { id: 'office', label: 'Office Suite', icon: Building }
                    ].map(type => {
                      const IconComponent = type.icon;
                      return (
                        <button 
                          key={type.id}
                          id={`calc-prop-${type.id}`}
                          type="button"
                          onClick={() => setPropertyType(type.id as any)}
                          className={`p-3.5 border rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                            propertyType === type.id 
                              ? 'border-brand-500 bg-brand-50 text-brand-700 font-semibold ring-1 ring-brand-500' 
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <IconComponent className="h-4.5 w-4.5 mb-1.5" />
                          <span className="text-[11px] font-display leading-tight">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sq Ft slider control */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Approximate Square Footage</label>
                    <span id="sqft-current-label" className="text-brand-600 font-mono text-sm">{squareFeet.toLocaleString()} sq ft</span>
                  </div>
                  <input 
                    id="slider-square-feet"
                    type="range" 
                    min={400} 
                    max={8000} 
                    step={100}
                    value={squareFeet} 
                    onChange={(e) => setSquareFeet(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-650"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>400 sq ft (Studio)</span>
                    <span>4,000 sq ft</span>
                    <span>8,000 sq ft (Large Luxury)</span>
                  </div>
                </div>

                {/* Bedrooms & Bathrooms Grid selection counter */}
                <div className="grid sm:grid-cols-2 gap-4">
                  
                  <div className="border border-slate-100 p-4 rounded-2xl bg-slate-50/60" id="bedroom-selector">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-2">Bedroom Count</label>
                    <div className="flex items-center justify-between">
                      <button 
                        id="btn-beds-decrement"
                        onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                        className="bg-white border border-slate-200 hover:border-slate-300 h-9 w-9 rounded-full flex items-center justify-center text-slate-700 cursor-pointer text-sm font-bold"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span id="beds-current-label" className="font-display font-bold text-lg text-slate-800">{bedrooms} Bed{bedrooms > 1 ? 's' : ''}</span>
                      <button 
                        id="btn-beds-increment"
                        onClick={() => setBedrooms(Math.min(10, bedrooms + 1))}
                        className="bg-white border border-slate-200 hover:border-slate-300 h-9 w-9 rounded-full flex items-center justify-center text-slate-700 cursor-pointer text-sm font-bold"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="border border-slate-100 p-4 rounded-2xl bg-slate-50/60" id="bathroom-selector">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-2">Bathroom Count</label>
                    <div className="flex items-center justify-between">
                      <button 
                        id="btn-baths-decrement"
                        onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                        className="bg-white border border-slate-200 hover:border-slate-300 h-9 w-9 rounded-full flex items-center justify-center text-slate-700 cursor-pointer text-sm font-bold"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span id="baths-current-label" className="font-display font-bold text-lg text-slate-800">{bathrooms} Bath{bathrooms > 1 ? 's' : ''}</span>
                      <button 
                        id="btn-baths-increment"
                        onClick={() => setBathrooms(Math.min(10, bathrooms + 1))}
                        className="bg-white border border-slate-200 hover:border-slate-300 h-9 w-9 rounded-full flex items-center justify-center text-slate-700 cursor-pointer text-sm font-bold"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Cleaning Intensity & Frequencies */}
                <div className="grid sm:grid-cols-2 gap-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Cleaning Intensity Type</label>
                    <select 
                      id="select-cleaning-type"
                      value={cleaningType}
                      onChange={(e) => setCleaningType(e.target.value as CleaningType)}
                      className="block w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 focus:bg-white focus:outline-hidden text-xs text-slate-700"
                    >
                      <option value="standard">Standard Maintenance Clean (Standard Level)</option>
                      <option value="deep">Elite Deep Scrub Reset (Includes Baseboards)</option>
                      <option value="move_out">Move-In / Move-Out Turnkey Clean (Top Meticulous)</option>
                      <option value="commercial">Elite Corporate Sanitation (Heavy Area Detail)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Service Frequency Rate</label>
                    <select 
                      id="select-service-frequency"
                      value={serviceFrequency}
                      onChange={(e) => setServiceFrequency(e.target.value as ServiceFrequency)}
                      className="block w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 focus:bg-white focus:outline-hidden text-xs text-slate-700"
                    >
                      <option value="once">One-Time Premium (Standard Est)</option>
                      <option value="weekly">Weekly Frequency (Save 20% Compounded)</option>
                      <option value="biweekly">Bi-Weekly Frequency (Save 15% Compounded)</option>
                      <option value="monthly">Monthly Frequency (Save 10% Compounded)</option>
                    </select>
                  </div>

                </div>

                {/* Selected Add-ons checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Add-On Luxury Upgrades (Optional)</label>
                  <div className="grid sm:grid-cols-2 gap-2" id="addons-grid-toggles">
                    {ADD_ONS.map(addon => {
                      const isSelected = selectedAddOns.includes(addon.id);
                      return (
                        <div 
                          key={addon.id}
                          id={`addon-card-${addon.id}`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAddOns(selectedAddOns.filter(id => id !== addon.id));
                            } else {
                              setSelectedAddOns([...selectedAddOns, addon.id]);
                            }
                          }}
                          className={`p-3 border rounded-xl flex items-center space-x-3 cursor-pointer select-none transition-all ${
                            isSelected 
                              ? 'border-brand-500 bg-brand-50/50' 
                              : 'border-slate-100 bg-slate-50/30 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`h-4.5 w-4.5 rounded-sm border flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-brand-600 border-brand-600 text-white' 
                              : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 leading-none truncate">{addon.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{addon.desc}</p>
                          </div>
                          <span className="text-xs font-display font-semibold text-brand-600 leading-none">
                            Bespoke Rate
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column Dynamic Invoice Invoice (Calculated Receipt Output) */}
              <div className="lg:col-span-5 bg-gradient-to-b from-brand-900 to-brand-950 text-white p-8 rounded-3xl shadow-xl space-y-6" id="calculator-box-invoice">
                
                <div className="text-center pb-6 border-b border-white/10 space-y-1">
                  <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-brand-300">Live Quote Estimate</span>
                  <h4 className="font-display font-bold text-xl">Silverbrook Sparkle Invoice</h4>
                  <p className="text-[11px] text-brand-100">Guaranteed instant bid based on custom parameters</p>
                </div>

                <div className="space-y-4 text-xs font-sans">
                  
                  <div className="flex justify-between pb-2 border-b border-white/5">
                    <span className="text-slate-300">Space Size Scale:</span>
                    <span className="text-white font-mono">{squareFeet} sq ft ({propertyType.toUpperCase()})</span>
                  </div>

                  <div className="flex justify-between pb-2 border-b border-white/5">
                    <span className="text-slate-300">Beds & Baths Selected:</span>
                    <span className="text-white font-mono">{bedrooms} Bed / {bathrooms} Bath</span>
                  </div>

                  <div className="flex justify-between pb-2 border-b border-white/5">
                    <span className="text-slate-300">Cleaning Type Multiplier:</span>
                    <span className="text-white font-medium capitalize">{cleaningType} clean</span>
                  </div>

                  <div className="flex justify-between pb-2 border-b border-white/5">
                    <span className="text-slate-300">Frequency Schedule Discount:</span>
                    <span className="text-brand-300 font-semibold uppercase font-display">
                      {serviceFrequency === 'once' ? 'None (One-time)' : ''}
                      {serviceFrequency === 'weekly' ? 'Weekly (20% Off Saved)' : ''}
                      {serviceFrequency === 'biweekly' ? 'Bi-Weekly (15% Off Saved)' : ''}
                      {serviceFrequency === 'monthly' ? 'Monthly (10% Off Saved)' : ''}
                    </span>
                  </div>

                  {/* Embedded add-on listing */}
                  {selectedAddOns.length > 0 && (
                    <div className="space-y-1 pb-2 border-b border-white/5">
                      <span className="text-slate-300 block mb-1">Add-On Upgrades Included:</span>
                      <div className="space-y-1 pl-3 font-mono text-[11px] text-brand-200">
                        {selectedAddOns.map(addonId => {
                          const option = ADD_ONS.find(a => a.id === addonId);
                          return (
                            <div key={addonId} className="flex justify-between">
                              <span>↳ {option?.name}:</span>
                              <span className="text-brand-300">Bespoke Custom Rate</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center mt-6">
                    <span className="text-[10px] tracking-widest text-brand-300 uppercase block font-display">Net Visit Quote</span>
                    <span className="font-display font-medium text-white text-xl block mt-1" id="invoice-total-display">
                      Pricing discussed post-submission
                    </span>
                    <span className="text-[10px] text-slate-300 block mt-1 font-sans">
                      Our audit directors will determine a tailored bespoke rate for your exact space parameters
                    </span>
                  </div>

                  {/* Transfer action */}
                  <div className="pt-4 space-y-3">
                    <button 
                      id="btn-confirm-booking-calc"
                      onClick={triggerBookingFromCalculator}
                      className="w-full bg-brand-500 hover:bg-brand-400 text-white font-display font-semibold rounded-xl py-3 text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Save Spec & Direct To Review</span>
                    </button>
                    <p className="text-[10px] text-slate-400 text-center font-sans tracking-wide leading-relaxed">
                      💡 Saving sends your space configuration to your Saved Configurations basket list so you can request reviews for multiple specifications!
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>


        {/* Section 5: Photo Gallery (Residential and Commercial comparison before/after slider) */}
        <section id="section-gallery" className="py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-[11px] font-display font-bold uppercase tracking-widest text-brand-600 py-1 px-3 bg-brand-100 rounded-full">Visual Proof</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-950 tracking-tight">Our High-Quality Pristine Results</h2>
              <p className="text-sm text-slate-600 font-sans">
                Explore real results. Drag the dynamic **Before/After slider** below to verify our meticulous structural finishing and restorative polish.
              </p>
            </div>

            {/* Dynamic interactive feature card */}
            <div className="bg-slate-50 border border-slate-200/60 p-6 md:p-8 rounded-3xl mb-12" id="gallery-interactive-slider-box">
              <div className="max-w-4xl mx-auto">
                
                <div className="text-center mb-6">
                  <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-brand-600">Feature Guild Highlight</span>
                  <p className="text-sm font-semibold text-slate-850 font-sans">Our Cleaners Working in Realistic, Premium Spaces</p>
                </div>

                {/* Main Action Photo Container */}
                <div 
                  id="before-after-comparer"
                  className="relative h-[250px] sm:h-[400px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white select-none group"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=1200" 
                    alt="Silverbrook premium cleaners team cleaning a realistic elegant house"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]" 
                    id="gallery-feature-working-image"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent flex items-end justify-between p-6">
                    <span className="bg-brand-900/90 text-white font-display text-xs font-bold tracking-widest py-1.5 px-3.5 rounded-md border border-white/20">
                      GUILD STANDARDS IN ACTION
                    </span>
                    <span className="bg-emerald-600 text-white font-display text-xs font-semibold tracking-widest py-1.5 px-3.5 rounded-md border border-white/20 shadow-lg">
                      ✨ 100% Sparkle Guarantee
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-center text-xs text-slate-500 font-sans">
                  <span>Our hand-trained local professional cleaners use premium, eco-friendly green chemicals in realistic home settings.</span>
                </div>

              </div>
            </div>

            {/* Filterable gallery grid */}
            <div className="space-y-6">
              
              {/* Category selector */}
              <div className="flex flex-wrap justify-center gap-2" id="gallery-filter-buttons">
                {[
                  { id: 'all', label: 'All Premium Results' },
                  { id: 'residential', label: 'Residential Spaces' },
                  { id: 'commercial', label: 'Corporate & Offices' },
                  { id: 'detailed', label: 'Meticulous Detailing Closeups' }
                ].map(cat => (
                  <button 
                    key={cat.id}
                    id={`btn-filter-gallery-${cat.id}`}
                    onClick={() => setGalleryFilter(cat.id as any)}
                    className={`px-4 py-2 text-xs font-display font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                      galleryFilter === cat.id 
                        ? 'bg-brand-900 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Grid items */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="photo-results-grid">
                {GALLERY_ITEMS.filter(item => galleryFilter === 'all' || item.category === galleryFilter).slice(0, 3).map(item => (
                  <div 
                    id={`gallery-card-${item.id}`}
                    key={item.id} 
                    className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="h-48 relative overflow-hidden bg-slate-100">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-brand-800 text-[9px] uppercase font-bold px-2 py-1 rounded-sm tracking-widest border border-slate-200">
                        {item.category} Sparkle
                      </span>
                    </div>
                    <div className="p-5 space-y-2">
                      <h4 className="font-display font-bold text-slate-900 text-sm leading-snug">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">{item.description}</p>
                      
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-brand-500 flex items-center">
                          <ImageIcon className="h-3 w-3 mr-1" /> Premium Care Finish
                        </span>
                        <button 
                          id={`btn-quote-gallery-${item.id}`}
                          onClick={() => {
                            if (item.category === 'commercial') {
                              setPropertyType('office');
                              setCleaningType('commercial');
                            } else {
                              setPropertyType('house');
                              setCleaningType('deep');
                            }
                            navigateToSection('section-calculator', 'calculator');
                          }}
                          className="text-xs text-brand-600 hover:text-brand-800 font-bold transition-colors cursor-pointer"
                        >
                          Adapt layout price &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All under the grid */}
              <div className="pt-10 text-center" id="gallery-view-all-landing-parent">
                <button
                  id="btn-landing-gallery-view-all"
                  onClick={() => {
                    setActiveTab('gallery');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white font-display text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>View All 15 Meticulous Restorations</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

            </div>

          </div>
        </section>


        {/* Section 6: About Us Section (Owner Marcus and Company Story, Unprecedented 24H guarantee) */}
        <section id="section-about" className="py-20 bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-[11px] font-display font-bold uppercase tracking-widest text-brand-600 py-1 px-3 bg-brand-100 rounded-full">Our Heritage</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-950 tracking-tight">The Silverbrook Integrity Standard</h2>
              <p className="text-sm text-slate-600 font-sans">
                A regional family foundation built on meticulous old-school work ethics. Learn about our founder and active quality guidelines.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8" id="about-us-box-grid">
              
              {/* Story explanation */}
              <div className="space-y-6" id="about-story-verbal-card">
                
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-display font-extrabold text-brand-950 text-sm uppercase tracking-wider flex items-center text-brand-700">
                      <User className="mr-2 text-brand-600 h-4.5 w-4.5" /> {BIOGRAPHY.ownerName}
                    </h4>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">{BIOGRAPHY.ownerTitle}</p>
                  </div>
                  <p className="text-xs text-slate-500 italic font-sans leading-relaxed border-l-4 border-brand-500 pl-4 py-1">
                    &ldquo;{BIOGRAPHY.ownerQuote}&rdquo;
                  </p>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {BIOGRAPHY.ownerBio}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-display font-bold text-2xl text-brand-900">How the Guild was Built</h3>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {BIOGRAPHY.companyStory}
                  </p>
                </div>

                {/* Company stats grids boxes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2" id="about-company-stats-grid">
                  {BIOGRAPHY.stats.map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-100 p-4 rounded-xl text-center shadow-xs">
                      <span className="font-display font-extrabold text-2xl text-brand-600 block leading-tight">{stat.value}</span>
                      <span className="text-[9px] font-bold text-slate-500 block uppercase tracking-wider mt-1">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Unconditional spark assurance banner */}
                <div className="bg-brand-900 text-white rounded-2xl p-5 border border-brand-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" id="assurance-guarantee-card">
                  <div className="space-y-1">
                    <p className="font-display font-extrabold text-xs uppercase text-brand-300 tracking-wider">Unconditional Guarantee</p>
                    <p className="text-[11px] text-slate-200 leading-normal">
                      Marcus Silverbrook&apos;s guarantee: Our specialized crew is fully insured and re-cleans within 24 hours if you aren&apos;t completely thrilled.
                    </p>
                  </div>
                  <div className="bg-brand-500 text-white rounded-md text-[10px] font-bold px-3 py-1.5 uppercase font-display tracking-widest whitespace-nowrap self-stretch sm:self-auto flex items-center justify-center">
                    ★ 24Hr Sparkle Shield
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* Section 7: Testimonial Section */}
        <section id="section-testimonials" className="py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-[11px] font-display font-bold uppercase tracking-widest text-brand-600 py-1 px-3 bg-brand-100 rounded-full">Proven Loyalty</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-950 tracking-tight">Verified Trust Testimonials</h2>
              <p className="text-sm text-slate-600 font-sans">
                Review letters from our residential homeowners and corporate executives regarding the exquisite Silverbrook cleaning guild.
              </p>
            </div>

            {/* Testimonials grid */}
            <div className="grid md:grid-cols-3 gap-8" id="testimonials-card-parent-grid">
              {TESTIMONIALS.map(testimonial => (
                <div 
                  id={`testimonial-card-${testimonial.id}`}
                  key={testimonial.id}
                  className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <div className="space-y-4">
                    {/* Stars */}
                    <div className="flex text-amber-500">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current text-amber-400" />
                      ))}
                    </div>
                    {/* Remarks */}
                    <p className="text-xs text-slate-600 italic font-sans leading-relaxed block text-justify">
                      &ldquo;{testimonial.comment}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center space-x-3.5 pt-5 mt-5 border-t border-slate-200">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="h-10 w-10 rounded-full object-cover border-2 border-brand-50"
                    />
                    <div>
                      <p className="font-display font-bold text-slate-800 text-xs tracking-wide leading-tight">{testimonial.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{testimonial.role}</p>
                      <span className="inline-block mt-1 uppercase text-[8px] tracking-widest font-bold text-brand-600 bg-brand-50 border border-brand-100 px-1.5 py-0.5 rounded-sm">
                        Verified {testimonial.serviceType}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* Section 8: Interactive Contact & Quote Inquiry Form */}
        <section id="section-contact" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-[11px] font-display font-bold uppercase tracking-widest text-brand-600 py-1 px-3 bg-brand-100 rounded-full">Easy Access</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-950 tracking-tight">Initiate Service Inquiries & Quotes</h2>
              <p className="text-sm text-slate-600 font-sans">
                Do you have custom requirements or multiple industrial units? Complete our safe response channels to communicate with Marcus’s office directly.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left column contact vectors */}
              <div className="lg:col-span-5 bg-brand-950 text-white rounded-3xl p-8 shadow-xl space-y-6" id="contact-coordinates-panel">
                
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-lg text-brand-300">Office Coordinates</h3>
                  <p className="text-xs text-brand-100 leading-relaxed font-sans">
                    Silverbrook Cleaning Solutions maintains regional quality branches. Reach us by phone, email, or schedule a free property walk-through appraisal.
                  </p>
                </div>

                <div className="space-y-4 font-sans text-xs">
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-brand-400 mt-0.5" />
                    <div>
                      <p className="font-bold text-white uppercase tracking-wider text-[10px]">Client Hotlines (8AM - 8PM EST)</p>
                      <p className="text-brand-100 mt-0.5">+44 7535 808 015</p>
                      <p className="text-[10px] text-brand-300">Toll-free priority corporate lines also configured</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-brand-400 mt-0.5" />
                    <div>
                      <p className="font-bold text-white uppercase tracking-wider text-[10px]">Accounts & Enquiries Email</p>
                      <p className="text-brand-100 mt-0.5">Info@silverbrookcleaningsolutions.co.uk</p>
                      <p className="text-[10px] text-brand-300">Monitored 24/7 with expedited urgent team dispatches</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-brand-400 mt-0.5" />
                    <div>
                      <p className="font-bold text-white uppercase tracking-wider text-[10px]">Principal Corporate HQ</p>
                      <p className="text-brand-100 mt-0.5">808 Silverbrook Executive Park, Suite 400</p>
                      <p className="text-[10px] text-brand-300">Fully licensed, insured & accredited agency</p>
                    </div>
                  </div>

                </div>

                <div className="border-t border-white/10 pt-6 space-y-3">
                  <p className="font-display font-bold text-xs uppercase tracking-wider text-brand-300">Our Commited Guarantee Standards</p>
                  <ul className="space-y-2 text-xs text-brand-100">
                    <li className="flex items-center">
                      <Check className="h-3.5 w-3.5 text-brand-400 mr-2" /> Double background-audited cleaning guild
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3.5 w-3.5 text-brand-400 mr-2" /> Biodegradable child & pet safe chemistry
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3.5 w-3.5 text-brand-400 mr-2" /> Complimentary comprehensive quote walks
                    </li>
                  </ul>
                </div>

              </div>

              {/* Right column inquiry form */}
              <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xs" id="contact-form-inquiry-panel">
                
                <h3 className="font-display font-bold text-lg text-brand-900 pb-4 border-b border-slate-100 mb-6 flex items-center">
                  <Send className="mr-2 text-brand-600 h-5 w-5" /> Express Inquiry Channels
                </h3>

                {contactSuccessAlert && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-xs font-sans mb-6 gap-2 flex items-center animate-fade-in" id="contact-success-notification">
                    <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Thank you for contacting Silverbrook Cleaning Solutions!</p>
                      <p className="mt-0.5 text-emerald-700">Your custom inquiry regarding &ldquo;{contactInterest}&rdquo; was logged. Marcus’s executive administrator will send your quote via email shortly.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Your Good Name *</label>
                      <input 
                        id="contact-name"
                        type="text" 
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Samuel Henderson"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">E-mail Address *</label>
                      <input 
                        id="contact-email"
                        type="email" 
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g. samuel@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Callback Phone Number</label>
                      <input 
                        id="contact-phone"
                        type="tel" 
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="e.g. (555) 345-6789"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Selected Primary Service Interest</label>
                      <select 
                        id="contact-service-interest"
                        value={contactInterest}
                        onChange={(e) => setContactInterest(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-700 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                      >
                        <option value="Standard Brooks Clean">Standard Brooks Clean (Residential Maintenance)</option>
                        <option value="Deep Clean Elite">Deep Clean Elite (Comprehensive scrub)</option>
                        <option value="Commercial Sparkle Premium">Commercial Sparkle Premium (Corporate workspace)</option>
                        <option value="Move-In / Move-Out Premium">Move-In / Move-Out Service (Turnkey)</option>
                        <option value="Custom Complex Walkthrough Request">Custom Multi-Facility Appraisal Walkthrough</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Choose Inquiry Subject</label>
                    <select 
                      id="contact-subject"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-700 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                    >
                      <option value="Free Quote Request">Request Free Property Quote Review</option>
                      <option value="Corporate Account Appraisal">Establish Ongoing Corporate Account Partnership</option>
                      <option value="Custom Area Detailing Question">Custom Specific Surface Area Inquiries</option>
                      <option value="Employment Options">Join Marcus&apos;s Professional Cleaning Guild</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Explain your requirements or space description *</label>
                    <textarea 
                      id="contact-message"
                      rows={4}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Please let us know your approximate room count, preferred schedules, pet considerations, or detailed request..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-500 text-left"
                    />
                  </div>

                  <button 
                    id="btn-submit-contact-form"
                    type="submit"
                    className="w-full bg-brand-800 hover:bg-brand-700 text-white font-display font-semibold rounded-xl py-3.5 mt-2 text-xs uppercase tracking-widest cursor-pointer shadow-lg transform active:scale-98 transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Secure Message Request</span>
                  </button>

                  <p className="text-[10px] text-slate-400 text-center leading-normal font-sans">
                    🛡️ We value absolute confidentiality. Your coordinates are never shared with third party networks.
                  </p>

                </form>

              </div>

            </div>

          </div>
        </section>
          </>
        )}
      </main>


      {/* Footer system */}
      <footer id="footer-container" className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-900 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Real-time Status and Live Dispatch Dashboard Header Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 grid md:grid-cols-12 gap-6 items-center shadow-lg" id="footer-realtime-dashboard">
            {/* Live Operational Clock */}
            <div className="md:col-span-4 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Austin HQ Local Time</span>
              <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl font-mono text-xs text-brand-400 font-extrabold shadow-inner flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <Clock className="h-4 w-4 animate-pulse text-brand-500" />
                  <span>{footerTime || "Loading time..."}</span>
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-500">CST</span>
              </div>
            </div>

            {/* Dynamic Status Display */}
            <div className="md:col-span-5 space-y-1">
              {(() => {
                const now = new Date();
                const austinTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Chicago' }));
                const hours = austinTime.getHours();
                const isActive = hours >= 7 && hours < 22;
                return (
                  <>
                    <div className={`inline-flex items-center space-x-2 border px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      isActive 
                        ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' 
                        : 'text-amber-400 border-amber-500/20 bg-amber-500/5'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
                      <span>{isActive ? '🟢 SCS Dispatch Active (7AM – 10PM)' : '🟡 SCS Standby Desk (Emergency Call Line)'}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal font-sans">
                      {isActive 
                        ? '14 professional sanitization crews are active on terrain across Greater Austin today.' 
                        : 'Our priority emergency dispatch is open. Direct luxury estate phone line connects instantly.'}
                    </p>
                  </>
                );
              })()}
            </div>

            {/* High Impact Quick Contact Trigger */}
            <div className="md:col-span-3 text-right">
              <span className="text-[9px] uppercase font-bold text-slate-500 block mb-1">Direct HQ Coordinate</span>
              <a 
                href="Info@silverbrookcleaningsolutions.co.uk"
                className="inline-flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white font-display text-[11px] font-bold uppercase tracking-widest py-3 px-5 rounded-xl transition-all shadow-md w-full text-center"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Contact Owner Office</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-900" id="footer-navigation-parent">
            
            {/* Column 1 Logo brand statement */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center">
                <img 
                  src="https://res.cloudinary.com/progresshenry/image/upload/v1779906017/logos2_hivvl3.png" 
                  alt="Silverbrook Cleaning Solutions" 
                  className="h-12 w-38 object-contain brightness-100"
                  referrerPolicy="no-referrer"
                />
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Meticulous hospitality-grade cleaning systems. We empower custom organic chemistry formulations to safely sanitize, clean, and restore your residential or corporate architecture.
              </p>

              <div className="pt-2 text-[10px] text-slate-400 font-sans space-y-1 border-t border-slate-900">
                <p>⚡ Registered License: <strong className="font-mono text-brand-300">SCS-REG-2018-99</strong></p>
                <p>💼 Liability Coverage: <strong className="font-mono text-slate-300">$2,000,000 Comprehensive</strong></p>
              </div>

              <div className="pt-3 border-t border-slate-900 space-y-2">
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Connect on Socials</span>
                <div className="flex items-center gap-2" id="footer-social-links-row">
                  <a href="https://www.facebook.com/share/1A61ebZNnj/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-brand-500 hover:bg-brand-500/10 transition-all shadow-xs shrink-0 block" title="Facebook">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="https://x.com/silverbrookuk?s=21" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-brand-500 hover:bg-brand-500/10 transition-all shadow-xs shrink-0 block" title="Twitter">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="https://www.instagram.com/silverbrookcleaningsolutions?igsh=MTlwZXRjdm8yeXdxbQ%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-brand-500 hover:bg-brand-500/10 transition-all shadow-xs shrink-0 block" title="Instagram">
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a href="https://tiktok.com/@silverbrookclean" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-brand-500 hover:bg-brand-500/10 transition-all shadow-xs shrink-0 block" title="TikTok">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                  </a>
                  <a href="https://youtube.com/@silverbrookcleaningsolutions" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-brand-500 hover:bg-brand-500/10 transition-all shadow-xs shrink-0 block" title="YouTube">
                    <Youtube className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2 Navigation Links */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="font-display font-bold text-xs uppercase tracking-widest text-brand-300">Quick Portal Coordinates</h4>
              <ul className="space-y-2.5 text-xs text-slate-400 font-sans">
                <li>
                  <button 
                    id="foot-nav-home"
                    onClick={() => navigateToSection('section-hero', 'home')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Home Executive Showcase
                  </button>
                </li>
                <li>
                  <button 
                    id="foot-nav-plans"
                    onClick={() => navigateToSection('section-plans', 'plans')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Bespoke Cleaning Plans
                  </button>
                </li>
                <li>
                  <button 
                    id="foot-nav-calculator"
                    onClick={() => navigateToSection('section-calculator', 'calculator')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Dynamic Live Pricing Calculator
                  </button>
                </li>
                <li>
                  <button 
                    id="foot-nav-gallery"
                    onClick={() => navigateToSection('section-gallery', 'gallery')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Before/After Gallery Page (15 Works)
                  </button>
                </li>
                <li>
                  <button 
                    id="foot-nav-about"
                    onClick={() => navigateToSection('section-about', 'about')}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    CEO Biography & Heritage
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3 Real-time working Newsletter Signup */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="font-display font-bold text-xs uppercase tracking-widest text-brand-300">Lock Welcome Coupon (Real-Time Sub)</h4>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Subscribe to receive Marcus’s seasonal safety alerts and lock in a <strong className="text-brand-300">Welcome 10% Discount Code</strong> applied automatically.
              </p>

              {footerSubscribedSuccess ? (
                <div className="bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-xl space-y-2 animate-fade-in" id="newsletter-success-box">
                  <p className="text-xs text-emerald-400 font-bold flex items-center">
                    <Check className="h-4 w-4 mr-2" /> Subscription Saved Successfully!
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Welcome coupon code <strong className="text-emerald-300 font-mono">SCS-WELCOME-10</strong> has been linked. Paste this in the calculator coupon bar!
                  </p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (footerSubscribedEmail) {
                      setFooterSubscribedSuccess(true);
                      setCouponCode('SCS-WELCOME-10'); // Suggest to apply automatically!
                    }
                  }}
                  className="space-y-2"
                  id="newsletter-email-form"
                >
                  <div className="flex gap-2">
                    <input 
                      type="email"
                      required
                      value={footerSubscribedEmail}
                      onChange={(e) => setFooterSubscribedEmail(e.target.value)}
                      placeholder="Enter premium client email..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                    />
                    <button 
                      type="submit"
                      className="bg-brand-600 hover:bg-brand-500 text-white font-display text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-md"
                    >
                      Subscribe
                    </button>
                  </div>
                  <p className="text-[9px] text-slate-500 leading-normal">
                    * No advertising noise. Fully organic notifications and chemical certification bulletins.
                  </p>
                </form>
              )}
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-sans space-y-4 sm:space-y-0" id="footer-sub-bar">
            <p>
              &copy; {new Date().getFullYear()} Silverbrook Cleaning Solutions. All Rights Reserved. Delivered premium.
            </p>
            <p className="flex items-center space-x-1">
              <span>Made with premium care for</span>
              <Heart className="h-3.5 w-3.5 text-rose-500 fill-current animate-pulse" />
              <span>and family spaces.</span>
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}
