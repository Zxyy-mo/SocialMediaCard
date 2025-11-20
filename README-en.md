# Social Card Gen

This is a powerful web application designed to help you quickly design and generate beautiful social media cards. It combines AI image generation, flexible layout options, and a real-time preview to make your content more engaging.

## ✨ Key Features

- **✍️ Text Customization**: Freely edit the card's title, subtitle, author, and footer text.
- **🤖 AI Image Generation**: Built-in support for Google Gemini allows you to generate unique background images from text prompts.
- **🖼️ Custom Image Upload**: In addition to AI generation, you can also upload your own local images to use as backgrounds.
- **🎨 Diverse Styles**: Choose from multiple preset card styles (e.g., Classic, Overlay, Minimal, Glass) and aspect ratios (1:1, 4:5, 9:16) with a single click.
- **👁️ Real-Time Preview**: All adjustments are immediately reflected in the preview area, giving you a "what you see is what you get" experience.
- **🚀 One-Click Download**: Easily download your finished design as a high-quality PNG image.
- **⚙️ Automation API**: Provides a "headless mode" and a Node.js code snippet to programmatically generate cards via URL parameters, perfect for automating workflows.

## 🛠️ Tech Stack

- **Frontend Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **AI Model**: Google Gemini
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **HTML-to-Image**: html-to-image

## 🚀 Getting Started

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd card-project
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**

    Create a `.env.local` file in the project root. To use the AI image generation feature, you'll need a Google Gemini API key.

    ```
    VITE_GEMINI_API_KEY="Your Google Gemini API Key Here"
    ```
    > You can get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

4.  **Start the Development Server**
    ```bash
    npm run dev
    ```
    Now, open `http://localhost:5173` in your browser to start creating.

## 💡 How to Use

1.  **Set API Key**: On first use, enter your Gemini API key in the dialog that appears after clicking the `</>` code icon in the top-right corner.
2.  **Edit Content**: Fill in the card's title, description, and other text fields in the left-side panel.
3.  **Choose Visuals**:
    - **AI Generate**: Under the "Visual" -> "AI Generate" tab, enter a descriptive prompt and click "Generate Image".
    - **Upload Image**: Under the "Visual" -> "Upload" tab, click the upload area to select a local image.
4.  **Adjust Style**: In the "Style & Layout" section, select your preferred aspect ratio and card design.
5.  **Preview and Download**: Confirm the result in the right-side preview area, then click the "Save Cover" button in the bottom-right to download your work.

## 🤖 Automation Guide

This project supports automation via URL parameters. By visiting `/?view=headless` along with other parameters, you can render a "headless" page containing only the card, making it easy for screenshot tools like Playwright or Puppeteer to process automatically.

**Available Parameters**:
- `view=headless`: Activates headless mode.
- `title`: Sets the main title.
- `subtitle`: Sets the subtitle.
- `author`: Sets the author.
- `footerText`: Sets the footer text.
- `imageUrl`: Provides a direct image URL for the background.
- `style`: The card style (`classic`, `overlay`, `minimal`, `glass`, `bold`, `zen`).
- `ratio`: The aspect ratio (`1:1`, `4:5`, `9:16`).

**Example**:
Visiting the following URL will generate a card page with all content pre-filled:
```
http://localhost:5173/?view=headless&title=Hello%20Gemini&subtitle=Automated%20Card%20Generation&style=bold&ratio=1:1
```
You can find a tool to generate this URL and the corresponding Node.js automation code in the developer dialog (`</>`).
