import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code2 } from 'lucide-react';
import { CardData, CardStyle, AspectRatio } from '../types';

interface ApiDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: CardData;
  style: CardStyle;
  ratio: AspectRatio;
}

const ApiDialog: React.FC<ApiDialogProps> = ({ isOpen, onClose, data, style, ratio }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Helper to construct the URL based on current state
  const getHeadlessUrl = () => {
    const params = new URLSearchParams();
    params.set('view', 'headless');
    params.set('title', data.title);
    params.set('subtitle', data.subtitle);
    params.set('author', data.author);
    params.set('footerText', data.footerText);
    params.set('style', style);
    params.set('ratio', ratio);
    
    // Only append imageUrl if it's not a huge base64 string to avoid URL length limits
    if (data.imageUrl && data.imageUrl.startsWith('http')) {
      params.set('imageUrl', data.imageUrl);
    }

    return `${window.location.origin}/?${params.toString()}`;
  };

  const headlessUrl = getHeadlessUrl();

  const nodeCode = `
const puppeteer = require('puppeteer');

async function generateSocialCard() {
  // 1. Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 2. Define your card configuration
  const config = {
    title: "${data.title}",
    subtitle: "${data.subtitle.replace(/\n/g, ' ')}",
    author: "${data.author}",
    footerText: "${data.footerText}",
    style: "${style}",
    ratio: "${ratio}",
    view: "headless", // Important: activates clean render mode
    // Use a public URL for the image
    imageUrl: "${data.imageUrl && data.imageUrl.startsWith('http') ? data.imageUrl : 'https://images.unsplash.com/photo-1535378437327-b71013b86852?auto=format&fit=crop&w=1000&q=80'}" 
  };

  // 3. Construct URL
  const baseUrl = "${window.location.origin}/";
  const params = new URLSearchParams(config).toString();
  const targetUrl = \`\${baseUrl}?\${params}\`;

  console.log("Generating card from:", targetUrl);

  // 4. Set viewport to match target ratio (approximate width 450px)
  await page.setViewport({ width: 450, height: 800, deviceScaleFactor: 2 });

  // 5. Navigate and wait for network to be idle
  await page.goto(targetUrl, { waitUntil: 'networkidle0' });

  // 6. Take screenshot
  await page.screenshot({ path: 'social-card.png', omitBackground: true });
  
  console.log("Card saved to social-card.png");
  await browser.close();
}

generateSocialCard().catch(console.error);
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(nodeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <Terminal className="text-gray-700" size={20} />
            <h3 className="font-bold text-gray-800">Developer API & Automation</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <p className="text-sm text-gray-600 mb-6">
            You can use this application as a <strong>Headless Generation Service</strong>. 
            Use the code snippet below in your Node.js workflow (n8n, Zapier, or custom script) to programmatically generate cards.
          </p>

          <div className="space-y-6">
            {/* Step 1: The Endpoint */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">1. Headless Endpoint</h4>
              <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 break-all font-mono text-xs text-gray-600">
                {headlessUrl}
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Appending <code>&view=headless</code> to the URL renders only the card component.
              </p>
            </div>

            {/* Step 2: The Code */}
            <div>
              <div className="flex items-center justify-between mb-2">
                 <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">2. Node.js (Puppeteer) Script</h4>
                 <button 
                   onClick={handleCopy}
                   className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                 >
                   {copied ? <Check size={14} /> : <Copy size={14} />}
                   {copied ? 'Copied!' : 'Copy Code'}
                 </button>
              </div>
              
              <div className="relative group">
                <pre className="bg-[#1e1e1e] text-gray-300 p-4 rounded-lg text-xs overflow-x-auto border border-gray-800 font-mono leading-relaxed">
                  <code>{nodeCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
           <button 
             onClick={onClose}
             className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
           >
             Done
           </button>
        </div>
      </div>
    </div>
  );
};

export default ApiDialog;
