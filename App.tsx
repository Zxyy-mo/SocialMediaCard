import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Layout, Download, Wand2, Image as ImageIcon, Type, Palette, AlertCircle, Terminal, Code, CheckCircle2, Trash2 } from 'lucide-react';
import { AspectRatio, CardData, CardStyle } from './types';
import CoverPreview from './components/CoverPreview';
import ApiDialog from './components/ApiDialog';
import { generateImage } from './services/geminiService';

const App: React.FC = () => {
  // --- State ---
  const [cardData, setCardData] = useState<CardData>({
    title: 'Claude Code',
    subtitle: 'Zero to Hero: 5 Minute Guide to AI Programming',
    footerText: 'Tutorial',
    author: '@AIProductFree',
    imageUrl: '', 
  });

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.Portrait);
  const [cardStyle, setCardStyle] = useState<CardStyle>(CardStyle.Editorial);
  const [prompt, setPrompt] = useState<string>('A futuristic 3D robot mascot, cute, orange and blue colors, studio lighting, clean background, high detail render');
  
  // Visual Tab State
  const [visualTab, setVisualTab] = useState<'ai' | 'upload'>('ai');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Automation / API State
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isHeadless, setIsHeadless] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  // --- Initialization (URL Hydration) ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Check for headless mode
    if (params.get('view') === 'headless') {
      setIsHeadless(true);
    }

    // Hydrate state from URL params if they exist
    if (params.has('title') || params.has('style')) {
      setCardData(prev => ({
        ...prev,
        title: params.get('title') || prev.title,
        subtitle: params.get('subtitle') || prev.subtitle,
        author: params.get('author') || prev.author,
        footerText: params.get('footerText') || prev.footerText,
        imageUrl: params.get('imageUrl') || prev.imageUrl,
      }));

      if (params.has('style')) {
        const styleParam = params.get('style');
        if (Object.values(CardStyle).includes(styleParam as any)) {
          setCardStyle(styleParam as CardStyle);
        }
      }

      if (params.has('ratio')) {
        const ratioParam = params.get('ratio');
        if (Object.values(AspectRatio).includes(ratioParam as any)) {
          setAspectRatio(ratioParam as AspectRatio);
        }
      }
    }
  }, []);

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCardData(prev => ({ ...prev, imageUrl: result }));
        // Auto switch to upload tab visualization if needed, but we just update state
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAiImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt first.");
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const imageBase64 = await generateImage(prompt);
      // Add to history list
      setGeneratedImages(prev => [imageBase64, ...prev]);
      // Auto-select the new one
      setCardData(prev => ({ ...prev, imageUrl: imageBase64 }));
    } catch (err) {
      console.error(err);
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectHistoryImage = (img: string) => {
    setCardData(prev => ({ ...prev, imageUrl: img }));
  };

  const handleDeleteHistoryImage = (e: React.MouseEvent, indexToDelete: number) => {
    e.stopPropagation();
    setGeneratedImages(prev => prev.filter((_, index) => index !== indexToDelete));
  };

  const handleDownload = useCallback(async () => {
    if (!previewRef.current || !window.htmlToImage) {
      alert("Download functionality requires the libraries to load completely. Please wait a moment.");
      return;
    }

    setIsDownloading(true);
    try {
      const dataUrl = await window.htmlToImage.toPng(previewRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      
      const link = document.createElement('a');
      link.download = `social-card-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
      setError("Could not download image. Try taking a screenshot.");
    } finally {
      setIsDownloading(false);
    }
  }, []);

  // --- RENDER: Headless Mode (for API/Puppeteer) ---
  if (isHeadless) {
    return (
      <div className="min-h-screen min-w-full bg-transparent flex items-start justify-start p-0 overflow-hidden">
        <CoverPreview 
          ref={previewRef}
          data={cardData} 
          ratio={aspectRatio} 
          style={cardStyle}
          className="shadow-none mx-0" // Remove shadows and centering for clean screenshot
        />
      </div>
    );
  }

  // --- RENDER: Application Mode ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800">
      
      {/* API Modal */}
      <ApiDialog 
        isOpen={isApiModalOpen} 
        onClose={() => setIsApiModalOpen(false)} 
        data={cardData}
        style={cardStyle}
        ratio={aspectRatio}
      />

      {/* --- LEFT PANEL: CONTROLS --- */}
      <div className="w-full md:w-[400px] lg:w-[450px] bg-white border-r border-gray-200 h-auto md:h-screen overflow-y-auto flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-20 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-xhs-red to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
              <Layout className="text-xhs-red" />
              Social Card Gen
            </h1>
            <p className="text-xs text-gray-400 mt-1">Design. Generate. Share.</p>
          </div>
          <button 
            onClick={() => setIsApiModalOpen(true)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            title="Developer API / Automation"
          >
            <Code size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Section: Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
              <Type size={16} /> Content
            </div>
            <div className="space-y-3">
               <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                 <input 
                    type="text" 
                    name="title" 
                    value={cardData.title} 
                    onChange={handleInputChange}
                    placeholder="Main Headline"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-xhs-red/20 focus:border-xhs-red outline-none transition-all font-serif"
                 />
               </div>
               <div>
                 <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle / Description</label>
                 <textarea 
                    name="subtitle" 
                    value={cardData.subtitle} 
                    onChange={handleInputChange}
                    placeholder="Short description..."
                    rows={3}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-xhs-red/20 focus:border-xhs-red outline-none transition-all resize-none text-sm"
                 />
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <div>
                   <label className="block text-xs font-medium text-gray-500 mb-1">Author</label>
                   <input 
                      type="text" 
                      name="author" 
                      value={cardData.author} 
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-xhs-red outline-none text-sm"
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-gray-500 mb-1">Footer Tag</label>
                   <input 
                      type="text" 
                      name="footerText" 
                      value={cardData.footerText} 
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-xhs-red outline-none text-sm"
                   />
                 </div>
               </div>
            </div>
          </div>

          {/* Section: Image */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
             <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
              <ImageIcon size={16} /> Visual
            </div>
            
            {/* Tabs for Source */}
            <div className="p-1 bg-gray-100 rounded-lg flex gap-1">
               <button 
                 onClick={() => setVisualTab('ai')}
                 className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${visualTab === 'ai' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:bg-gray-200/50'}`}
               >
                 AI Generate
               </button>
               <button 
                 onClick={() => setVisualTab('upload')}
                 className={`flex-1 py-1.5 text-xs font-medium rounded transition-all ${visualTab === 'upload' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:bg-gray-200/50'}`}
               >
                 Upload
               </button>
            </div>

            {/* --- TAB: AI GENERATE --- */}
            {visualTab === 'ai' && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Prompt (Gemini Nano)</label>
                  <div className="relative">
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full p-3 bg-indigo-50 border border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm text-indigo-900 min-h-[80px]"
                      placeholder="Describe the image..."
                    />
                    <Wand2 className="absolute right-3 bottom-3 text-indigo-400" size={16} />
                  </div>
                </div>
                
                <button 
                  onClick={handleGenerateAiImage}
                  disabled={isGenerating}
                  className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${isGenerating ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg'}`}
                >
                  {isGenerating ? (
                    <span className="animate-pulse">Generating...</span>
                  ) : (
                    <>
                      <Wand2 size={16} /> Generate Image
                    </>
                  )}
                </button>

                {/* Generated History */}
                {generatedImages.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="block text-xs font-medium text-gray-400 mb-2">Generation History</label>
                    <div className="grid grid-cols-3 gap-2">
                      {generatedImages.map((img, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleSelectHistoryImage(img)}
                          className={`relative group aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${cardData.imageUrl === img ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent hover:border-gray-300'}`}
                        >
                          <img src={img} alt={`Generated ${idx}`} className="w-full h-full object-cover" />
                          {cardData.imageUrl === img && (
                            <div className="absolute inset-0 bg-indigo-900/20 flex items-center justify-center">
                              <div className="bg-white rounded-full p-1 shadow-sm">
                                <CheckCircle2 size={12} className="text-indigo-600" />
                              </div>
                            </div>
                          )}
                          <button 
                            onClick={(e) => handleDeleteHistoryImage(e, idx)}
                            className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- TAB: UPLOAD --- */}
            {visualTab === 'upload' && (
              <div className="space-y-3 animate-fade-in pt-2">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors bg-white">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon size={32} className="text-gray-400 mb-2"/>
                    <p className="text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <p className="text-xs text-gray-400 text-center">
                  Images uploaded here are processed locally in your browser.
                </p>
              </div>
            )}

          </div>

          {/* Section: Style & Layout */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
             <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
              <Palette size={16} /> Style & Layout
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {(Object.values(AspectRatio) as AspectRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 text-xs font-medium rounded border transition-all ${aspectRatio === ratio ? 'border-xhs-red bg-xhs-red/5 text-xhs-red' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            {/* Styles Grid */}
            <div className="grid grid-cols-3 gap-2">
               {/* Editorial */}
               <button 
                 onClick={() => setCardStyle(CardStyle.Editorial)}
                 className={`h-20 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all ${cardStyle === CardStyle.Editorial ? 'border-xhs-red ring-1 ring-xhs-red bg-white shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}
               >
                 <div className="w-8 h-8 border border-gray-200 bg-gray-50 flex flex-col shadow-sm overflow-hidden">
                   <div className="h-[70%] bg-gray-300"></div>
                   <div className="h-[30%] bg-white"></div>
                 </div>
                 <span className="text-[10px] font-medium text-gray-600">Classic</span>
               </button>

               {/* Overlay */}
               <button 
                 onClick={() => setCardStyle(CardStyle.Overlay)}
                 className={`h-20 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all ${cardStyle === CardStyle.Overlay ? 'border-xhs-red ring-1 ring-xhs-red bg-white shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}
               >
                 <div className="w-8 h-8 bg-gray-800 relative border border-gray-700 shadow-sm overflow-hidden rounded-sm">
                   <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
                 </div>
                 <span className="text-[10px] font-medium text-gray-600">Overlay</span>
               </button>

               {/* Minimal */}
               <button 
                 onClick={() => setCardStyle(CardStyle.Minimal)}
                 className={`h-20 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all ${cardStyle === CardStyle.Minimal ? 'border-xhs-red ring-1 ring-xhs-red bg-white shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}
               >
                 <div className="w-8 h-8 border border-gray-200 bg-white p-1 shadow-sm flex flex-col justify-center">
                   <div className="w-full h-0.5 bg-gray-300 mb-0.5"></div>
                   <div className="w-2/3 h-0.5 bg-gray-200"></div>
                 </div>
                 <span className="text-[10px] font-medium text-gray-600">Minimal</span>
               </button>

               {/* Glass */}
               <button 
                 onClick={() => setCardStyle(CardStyle.Glass)}
                 className={`h-20 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all ${cardStyle === CardStyle.Glass ? 'border-xhs-red ring-1 ring-xhs-red bg-white shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}
               >
                 <div className="w-8 h-8 bg-gray-300 relative rounded-sm overflow-hidden shadow-sm">
                   <div className="absolute inset-1.5 bg-white/50 backdrop-blur-sm rounded-sm border border-white/60"></div>
                 </div>
                 <span className="text-[10px] font-medium text-gray-600">Glass</span>
               </button>

               {/* Bold */}
               <button 
                 onClick={() => setCardStyle(CardStyle.Bold)}
                 className={`h-20 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all ${cardStyle === CardStyle.Bold ? 'border-xhs-red ring-1 ring-xhs-red bg-white shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}
               >
                 <div className="w-8 h-8 bg-yellow-300 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                   <div className="w-3 h-3 bg-black rounded-full"></div>
                 </div>
                 <span className="text-[10px] font-medium text-gray-600">Bold</span>
               </button>

               {/* Zen */}
               <button 
                 onClick={() => setCardStyle(CardStyle.Zen)}
                 className={`h-20 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all ${cardStyle === CardStyle.Zen ? 'border-xhs-red ring-1 ring-xhs-red bg-white shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}
               >
                 <div className="w-8 h-8 bg-[#f8f5f2] border border-gray-200 flex items-center justify-center relative">
                   <div className="absolute inset-1 border border-gray-300"></div>
                   <span className="font-serif text-[8px] italic">Z</span>
                 </div>
                 <span className="text-[10px] font-medium text-gray-600">Zen</span>
               </button>

            </div>
          </div>
          
           {/* Automate Banner */}
           <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
             <div className="flex items-start gap-3">
               <Terminal className="text-indigo-600 mt-1" size={18} />
               <div>
                 <h4 className="text-sm font-bold text-indigo-900">Automate this?</h4>
                 <p className="text-xs text-indigo-700 mt-1 mb-2">Generate these cards programmatically using our Node.js recipe.</p>
                 <button 
                   onClick={() => setIsApiModalOpen(true)}
                   className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors font-medium"
                 >
                   Get Node.js Code
                 </button>
               </div>
             </div>
           </div>

        </div>

        {/* Mobile Action Bar Spacer */}
        <div className="h-24 md:hidden"></div>
      </div>

      {/* --- RIGHT PANEL: PREVIEW --- */}
      <div className="flex-1 bg-gray-100/50 flex flex-col items-center justify-center p-4 md:p-10 relative overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-3xl"></div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-100 shadow-sm animate-fade-in max-w-md z-20">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* The Card */}
        <div className="relative z-10 w-full transform transition-transform duration-500 hover:scale-[1.01]">
           <CoverPreview 
              ref={previewRef}
              data={cardData} 
              ratio={aspectRatio} 
              style={cardStyle} 
           />
        </div>
        
        <div className="mt-8 text-center z-10">
           <p className="text-sm text-gray-400 mb-2 hidden md:block">Preview updates automatically</p>
        </div>

      </div>

      {/* --- FLOATING ACTION BUTTON (MOBILE & DESKTOP) --- */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
         <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-gray-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:bg-black transition-all hover:scale-105 font-semibold"
         >
            {isDownloading ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Download size={20} />
            )}
            <span>Save Cover</span>
         </button>
      </div>

    </div>
  );
};

export default App;