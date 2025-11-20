import React, { forwardRef } from 'react';
import { AspectRatio, CardData, CardStyle } from '../types';
import { User, Quote } from 'lucide-react';

interface CoverPreviewProps {
  data: CardData;
  ratio: AspectRatio;
  style: CardStyle;
  className?: string;
}

const CoverPreview = forwardRef<HTMLDivElement, CoverPreviewProps>(({ data, ratio, style, className = '' }, ref) => {
  
  // Calculate dimensions style based on aspect ratio
  const getAspectRatioClass = () => {
    switch (ratio) {
      case AspectRatio.Portrait: return 'aspect-[3/4]';
      case AspectRatio.Square: return 'aspect-square';
      case AspectRatio.Story: return 'aspect-[9/16]';
      default: return 'aspect-[3/4]';
    }
  };

  // Default Placeholder if no image
  const bgImage = data.imageUrl || 'https://picsum.photos/800/1000';

  // --- RENDERERS FOR DIFFERENT STYLES ---

  // 1. Editorial (Xiaohongshu Classic)
  const renderEditorial = () => (
    <div className="h-full w-full flex flex-col bg-white overflow-hidden">
      <div className="relative flex-grow-[3] overflow-hidden bg-gray-100">
        <img src={bgImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="flex-grow-[1] p-6 flex flex-col justify-between bg-white relative z-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 leading-tight tracking-tight mb-3 line-clamp-2">
            {data.title || "Add a Title Here"}
          </h1>
          <p className="text-sm text-gray-500 line-clamp-2 font-sans leading-relaxed">
            {data.subtitle || "Add a description or subtitle to provide more context."}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-xs">
               {data.author ? data.author[0].toUpperCase() : <User size={12} />}
             </div>
             <span className="text-xs font-medium text-gray-600">{data.author || "Author"}</span>
          </div>
          {data.footerText && (
            <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-gray-400">|</span>
               <span className="text-xs text-gray-400 tracking-wider uppercase">{data.footerText}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // 2. Overlay Style (Instagram/Stories)
  const renderOverlay = () => (
    <div className="h-full w-full relative overflow-hidden bg-gray-900">
      <img src={bgImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
         <div className="mb-6 border-l-4 border-xhs-red pl-4">
           <h1 className="text-4xl font-bold text-white leading-none mb-2 drop-shadow-lg font-serif">
             {data.title || "Impactful Title"}
           </h1>
           <p className="text-lg text-gray-200 font-light drop-shadow-md">
             {data.subtitle || "Your subtitle goes here."}
           </p>
         </div>

         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 backdrop-blur-md bg-white/20 px-3 py-1.5 rounded-full">
               <User size={14} className="text-white" />
               <span className="text-xs font-medium text-white">{data.author || "@username"}</span>
            </div>
            {data.footerText && (
              <span className="text-xs text-white/80 uppercase tracking-widest border border-white/30 px-2 py-1 rounded">
                {data.footerText}
              </span>
            )}
         </div>
      </div>
    </div>
  );

  // 3. Minimal (Clean Typography Focus)
  const renderMinimal = () => (
    <div className="h-full w-full flex flex-col bg-xhs-gray overflow-hidden p-4">
      <div className="h-full w-full bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-gray-100">
        <div className="relative h-[65%] overflow-hidden m-2 rounded-lg">
          <img src={bgImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
           <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
             {data.footerText || "Cover"}
           </div>
        </div>
        <div className="flex-1 p-5 flex flex-col justify-center">
          <h1 className="text-3xl font-serif font-black text-gray-900 mb-2">
            {data.title || "Minimal Title"}
          </h1>
          <div className="w-12 h-1 bg-xhs-red mb-3"></div>
          <p className="text-sm text-gray-500 leading-relaxed">
             {data.subtitle || "A clean description area."}
          </p>
          <div className="mt-auto pt-4 flex items-center gap-2 opacity-60">
             <div className="w-5 h-5 bg-black rounded-full"></div>
             <span className="text-xs font-mono">{data.author || "Creator"}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // 4. Glass (New) - Frosted effect
  const renderGlass = () => (
    <div className="h-full w-full relative overflow-hidden bg-gray-900">
      {/* Blurred background */}
      <div className="absolute inset-0 scale-110">
        <img src={bgImage} alt="Cover" className="w-full h-full object-cover filter blur-md opacity-60" />
      </div>
      
      {/* Center Card */}
      <div className="absolute inset-6 md:inset-8 bg-white/20 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Image Area inside Glass */}
        <div className="relative flex-1 overflow-hidden m-1 rounded-xl">
           <img src={bgImage} alt="Cover Inner" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        
        {/* Text Area */}
        <div className="p-6 text-white">
           <h1 className="text-2xl font-bold leading-tight mb-2 drop-shadow-sm">
             {data.title || "Glassmorphism"}
           </h1>
           <p className="text-xs text-white/80 mb-4 leading-relaxed">
             {data.subtitle || "A modern, frosted glass aesthetic."}
           </p>
           
           <div className="flex items-center justify-between pt-3 border-t border-white/20">
             <span className="text-[10px] font-mono bg-black/20 px-2 py-1 rounded text-white/90">{data.author || "@user"}</span>
             <span className="text-[10px] uppercase tracking-widest text-white/70">{data.footerText}</span>
           </div>
        </div>
      </div>
    </div>
  );

  // 5. Bold (New) - Neo-brutalist
  const renderBold = () => (
    <div className="h-full w-full flex flex-col bg-[#F3F0FF] p-4 overflow-hidden border-4 border-black">
      <div className="w-full h-full border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        <div className="h-10 bg-black flex items-center px-3 justify-between">
           <div className="flex gap-1.5">
             <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white"></div>
             <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
           </div>
           <span className="text-white font-mono text-xs uppercase font-bold">{data.footerText || "Terminal"}</span>
        </div>
        
        <div className="relative flex-1 border-b-4 border-black">
           <img src={bgImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
           <div className="absolute bottom-4 left-4 bg-white border-2 border-black px-3 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="font-black text-sm uppercase tracking-tighter">Img_Src.jpg</span>
           </div>
        </div>
        
        <div className="p-5 bg-yellow-300">
           <h1 className="text-4xl font-black text-black uppercase leading-[0.9] mb-3 tracking-tighter">
             {data.title || "BOLD STATEMENT"}
           </h1>
           <p className="font-mono text-xs font-bold text-black/80 border-t-2 border-black pt-2">
             {data.subtitle || "Neo-brutalist design for high impact visuals."}
           </p>
        </div>
      </div>
    </div>
  );

  // 6. Zen (New) - Magazine/Focus
  const renderZen = () => (
    <div className="h-full w-full flex flex-col bg-[#f8f5f2] overflow-hidden relative">
      <div className="absolute inset-0 p-8 border-[16px] border-white shadow-inner pointer-events-none z-20"></div>
      
      <div className="h-[60%] w-full relative">
         <img src={bgImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover grayscale-[20%] contrast-125" />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10">
         <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4 block">
           {data.footerText || "Issue 01"}
         </span>
         <h1 className="text-3xl font-serif font-medium text-gray-800 mb-4 italic">
           {data.title || "The Zen Mode"}
         </h1>
         <div className="w-8 h-[1px] bg-gray-300 mb-4"></div>
         <p className="text-xs font-serif text-gray-500 max-w-[80%] leading-loose">
           {data.subtitle || "Focus on typography and whitespace."}
         </p>
         
         <div className="mt-auto pt-6">
           <span className="font-sans text-[10px] font-bold text-gray-900 uppercase tracking-widest">
             {data.author || "Author"}
           </span>
         </div>
      </div>
    </div>
  );

  return (
    <div 
      ref={ref}
      id="preview-card"
      className={`w-full max-w-[450px] mx-auto shadow-2xl rounded-none overflow-hidden transition-all duration-300 ease-in-out select-none ${getAspectRatioClass()} ${className}`}
    >
      {style === CardStyle.Editorial && renderEditorial()}
      {style === CardStyle.Overlay && renderOverlay()}
      {style === CardStyle.Minimal && renderMinimal()}
      {style === CardStyle.Glass && renderGlass()}
      {style === CardStyle.Bold && renderBold()}
      {style === CardStyle.Zen && renderZen()}
    </div>
  );
});

CoverPreview.displayName = 'CoverPreview';

export default CoverPreview;