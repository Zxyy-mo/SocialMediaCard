export enum AspectRatio {
  Portrait = '3:4',
  Square = '1:1',
  Story = '9:16',
}

export enum CardStyle {
  Editorial = 'editorial', // Image top, text bottom (classic XHS)
  Overlay = 'overlay',     // Image background, text over
  Minimal = 'minimal',     // Clean, bordered
  Glass = 'glass',         // Frosted glass effect
  Bold = 'bold',           // Neo-brutalist, high contrast
  Zen = 'zen',             // Centered, magazine style
}

export interface CardData {
  title: string;
  subtitle: string;
  footerText: string;
  author: string;
  imageUrl: string;
}

// Declaration for the window.htmlToImage library loaded via CDN
declare global {
  interface Window {
    htmlToImage: {
      // Update: toPng now accepts an options object as the second argument
      toPng: (node: HTMLElement, options?: any) => Promise<string>;
      toJpeg: (node: HTMLElement, options?: any) => Promise<string>;
      toSvg: (node: HTMLElement, options?: any) => Promise<string>;
    };
  }
}