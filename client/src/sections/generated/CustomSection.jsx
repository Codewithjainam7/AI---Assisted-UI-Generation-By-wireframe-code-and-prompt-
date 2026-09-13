import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "primereact/button";
import { fetchElementsByIds } from "../../features/cms/cmsSlice";
import { getSectionTextContrastClass } from "../../utils/sectionContrast";
import { getImage, errorImage } from "../../utils/getImage";

// R1: Stable ids map
const ids = {
  heroImage:    "2000000246",
  brandBadge:   "2000000247",
  headlineMain: "2000000248",
  headlineSub:  "2000000249",
  description:  "2000000250",
  statBadges:   "2000000251",
  ctaButton:    "2000000252",
};

// R9: Default stat cards extracted from wireframe
const DEFAULT_STAT_CARDS = [

];

const COLOR_SWATCHES = [
  { name: "Dark Grey Heather", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80" },
  { name: "Oatmeal Grey", image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80" },
  { name: "Jet Black", image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80" },
  { name: "Navy Blue", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80" },
  { name: "Crimson Red", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

// R2: pageName prop
const CustomSection = ({ pageName = "Home" }) => {
  const dispatch = useDispatch();

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // R4: Read from Redux store
  const data    = useSelector((state) => state.cms?.allSections?.[pageName]);
  const cssData = useSelector((state) => state.cms?.allSectionsCss?.[pageName]);
  const rootRef = useRef(null);

  // R9: CMS loop or fallback
  const statBadgesArr =
    Array.isArray(data?.[ids.statBadges]) && data[ids.statBadges].length > 0
      ? data[ids.statBadges]
      : DEFAULT_STAT_CARDS;

  // R3: Dispatch all fieldIds on mount
  useEffect(() => {
    dispatch(fetchElementsByIds({
      elementIds: [
        ids.heroImage, ids.brandBadge, ids.headlineMain, ids.headlineSub,
        ids.description, ids.statBadges, ids.ctaButton,
        
      ],
      pageName,
    }));
  }, [dispatch, pageName]);

  // R10: Apply per-element CSS overrides
  useEffect(() => {
    Object.values(ids).forEach((id) => {
      if (id && cssData?.[id]) {
        const el = document.getElementById(id);
        if (el) el.style.cssText = cssData[id];
      }
    });
  }, [cssData]);

  return (
    <div ref={rootRef} className="relative min-h-screen w-full bg-[#09090b] text-white font-sans antialiased overflow-x-hidden">
      {/* Red accent glow rails */}
      <div className="hidden lg:block absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-red-500 via-orange-500 to-transparent z-20" />
      <div className="hidden lg:block absolute right-0 top-0 h-full w-1.5 bg-gradient-to-b from-red-500 via-orange-500 to-transparent z-20" />

      {/* Top Navigation Bar from Wireframe */}
      <header className="w-full border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-16 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span id={ids.brandBadge} className="dynamicStyle text-xl font-black tracking-wider uppercase text-white hover:text-red-400 transition cursor-pointer" dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "AI STUDIO" }} />
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-300">
              {["Men", "Women", "Boys", "Girls"].map((cat) => (
                <a key={cat} href="#" className="hover:text-white hover:underline transition-colors py-1">{cat}</a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input
                type="search"
                placeholder="search"
                className="dynamicStyle w-48 md:w-64 px-4 py-1.5 pl-9 rounded-full bg-zinc-900/90 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition"
              />
              <span className="absolute left-3 top-2 text-zinc-400 text-xs">🔍</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-400 font-medium">
              <span className="hidden md:inline hover:text-white cursor-pointer transition">Join / Log In</span>
              <span className="hidden md:inline text-zinc-600">|</span>
              <span className="hover:text-white cursor-pointer transition">Help</span>
              <button className="p-2 rounded-full hover:bg-white/10 text-white transition" title="Shopping Cart">
                🛒
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main E-Commerce Product Viewport */}
      <main className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-16 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row items-start gap-10 xl:gap-16">

          {/* Left Column: 2x2 Product Views Gallery (Exactly as drawn in wireframe) */}
          <div className="w-full lg:w-7/12 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Image 1: Main Hero View */}
              <div className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 aspect-square shadow-lg">
                <img
                  id={ids.heroImage}
                  className="dynamicStyle2 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={data?.[ids.heroImage] ? getImage(data[ids.heroImage]) : getImage("https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80")}
                  onError={errorImage}
                  alt="Product view front"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/15">
                  Front
                </span>
              </div>

              {/* Image 2: Angle/Back View */}
              <div className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 aspect-square shadow-lg">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={getImage("https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80")}
                  onError={errorImage}
                  alt="Product view back"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/15">
                  Back
                </span>
              </div>

              {/* Image 3: Detail / Fabric View */}
              <div className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 aspect-square shadow-lg">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={getImage("https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80")}
                  onError={errorImage}
                  alt="Product view detail"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/15">
                  Detail
                </span>
              </div>

              {/* Image 4: Model / Lifestyle View */}
              <div className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 aspect-square shadow-lg">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={getImage("https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80")}
                  onError={errorImage}
                  alt="Product view lifestyle"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-black/60 backdrop-blur-md text-white border border-white/15">
                  Fit
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Details, Size Selector, Swatches, Add to Cart */}
          <div className="w-full lg:w-5/12 flex flex-col space-y-6 lg:pl-2">
            <div>
              <span
                id={ids.brandBadge}
                className="dynamicStyle inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-red-500/15 text-red-400 border border-red-500/20 mb-3"
                dangerouslySetInnerHTML={{ __html: data?.[ids.brandBadge] || "AI STUDIO" }}
              />

              <h1
                id={ids.headlineMain}
                className="dynamicStyle text-3xl sm:text-4xl xl:text-5xl font-black text-white tracking-tight uppercase leading-tight"
                dangerouslySetInnerHTML={{ __html: data?.[ids.headlineMain] || "Cushy Fleece Hoodie" }}
              />

              <h2
                id={ids.headlineSub}
                className="dynamicStyle text-xl sm:text-2xl font-semibold text-zinc-300 mt-2"
                dangerouslySetInnerHTML={{ __html: data?.[ids.headlineSub] || "Men's Pullover Hoodie $45" }}
              />
            </div>

            {/* Color Swatches (5 thumbnails drawn under title) */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-zinc-400 tracking-wider">
                Select Color: <span className="text-white normal-case">{COLOR_SWATCHES[selectedColor].name}</span>
              </span>
              <div className="flex items-center gap-3">
                {COLOR_SWATCHES.map((swatch, idx) => (
                  <button
                    key={swatch.name}
                    onClick={() => setSelectedColor(idx)}
                    className={`w-10 h-10 rounded-xl border-2 transition-all p-0.5 overflow-hidden ${
                      selectedColor === idx
                        ? "border-red-500 scale-110 shadow-glow-red ring-2 ring-red-500/30"
                        : "border-white/20 hover:border-white/50 opacity-80"
                    }`}
                    title={swatch.name}
                  >
                    <img src={swatch.image} alt={swatch.name} className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector (Drawn with XS, S, M, L, XL, 2XL, 3XL) */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs font-bold tracking-wider">
                <span className="text-zinc-400 uppercase">Choose Size</span>
                <button className="text-zinc-400 hover:text-white underline transition">Size Guide</button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 rounded-xl font-bold text-sm transition-all border ${
                      selectedSize === size
                        ? "bg-white text-zinc-950 border-white shadow-md scale-105"
                        : "bg-zinc-900/80 text-zinc-300 border-white/10 hover:border-white/30 hover:bg-zinc-800"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons: Add to Cart + Wishlist */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                id={ids.ctaButton}
                className="dynamicStyle flex-1 py-4 rounded-full font-black text-base uppercase tracking-wider bg-gradient-to-r from-red-600 via-orange-500 to-red-600 hover:shadow-glow-red hover:scale-[1.02] active:scale-[0.98] transition-all border-none"
                severity="danger"
                label={data?.[ids.ctaButton] || "Add To Cart"}
                aria-label="Add to cart"
                onClick={() => {}}
              />
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${
                  isWishlisted
                    ? "bg-red-500/20 border-red-500 text-red-500 shadow-glow-red"
                    : "bg-zinc-900 border-white/20 text-zinc-300 hover:text-white hover:border-white/40"
                }`}
                title="Add to Wishlist"
              >
                {isWishlisted ? "❤️" : "🤍"}
              </button>
            </div>

            {/* Description & Product Specifications */}
            <div className="border-t border-white/10 pt-5 space-y-3">
              <p
                id={ids.description}
                className="dynamicStyle text-zinc-300 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: data?.[ids.description] || "The Acme Cushy Hoodie is made with an ultra-soft interior for everyday comfort.<br /><br />• Shown: Dark Grey Heather/White<br />• Style: 804346-063<br /><br />Read More" }}
              />
              <a href="#" className="inline-block text-xs font-semibold text-zinc-400 hover:text-white underline transition">
                Read More Details
              </a>
            </div>

            {/* Stat Badges / Feature Highlights (R9) */}
            <div id={ids.statBadges} className="dynamicStyle grid grid-cols-3 gap-3 pt-2">
              {statBadgesArr.map((item, idx) => (
                <div key={item.fieldId1 || idx} className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 flex flex-col items-center text-center">
                  <span
                    id={item.fieldId1}
                    className="dynamicStyle text-sm font-extrabold text-white"
                    dangerouslySetInnerHTML={{ __html: data?.[item.fieldId1] || item.field1 }}
                  />
                  <span
                    id={item.fieldId2}
                    className="dynamicStyle text-[10px] text-zinc-400 mt-0.5 leading-tight"
                    dangerouslySetInnerHTML={{ __html: data?.[item.fieldId2] || item.field2 }}
                  />
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>

      {/* Full Website Footer */}
      <footer className="w-full border-t border-white/10 bg-zinc-950/80 mt-16 py-10 px-6 lg:px-16 text-xs text-zinc-400">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <span className="font-bold text-sm tracking-wider uppercase text-white">Acme Athletics</span>
            <p className="text-zinc-500">© 2026 Acme Athletics, Inc. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
            <a href="#" className="hover:text-white transition">Product Guides</a>
            <a href="#" className="hover:text-white transition">Terms of Sale</a>
            <a href="#" className="hover:text-white transition">Terms of Use</a>
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomSection;
