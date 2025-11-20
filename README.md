# 社交卡片生成器 (Social Card Gen)

这是一个功能强大的 Web 应用，旨在帮助您快速设计和生成精美的社交媒体卡片。结合了 AI 图像生成、灵活的布局选项和实时预览功能，让您的内容更具吸引力。

## ✨ 主要功能

- **✍️ 文本定制**：自由编辑卡片的标题、副标题、作者和页脚标签。
- **🤖 AI 生成图像**：内置 Google Gemini 支持，输入文本提示即可生成独特的背景图像。
- **🖼️ 自定义图片**：除了 AI 生成，您也可以上传自己的本地图片作为背景。
- **🎨 多样化风格**：提供多种预设卡片风格（如经典、覆盖、简约、玻璃等）和宽高比（1:1, 4:5, 9:16），一键切换。
- **👁️ 实时预览**：所有调整都会立即在预览区域显示，所见即所得。
- **🚀 一键下载**：轻松将您完成的设计下载为高质量的 PNG 图片。
- **⚙️ 自动化 API**：提供一个“无头模式”和 Node.js 示例代码，可以通过 URL 参数以编程方式批量生成卡片，非常适合自动化工作流。

## 🛠️ 技术栈

- **前端框架**: React
- **语言**: TypeScript
- **构建工具**: Vite
- **AI 模型**: Google Gemini
- **UI 组件**: shadcn/ui, Radix UI
- **图标**: Lucide React
- **图像/HTML 转换**: html-to-image

## 🚀 快速开始

1.  **克隆仓库**
    ```bash
    git clone <repository-url>
    cd card-project
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置环境变量**

    在项目根目录下创建一个 `.env.local` 文件。为了使用 AI 图像生成功能，您需要一个 Google Gemini API 密钥。

    ```
    VITE_GEMINI_API_KEY="在这里填入您的 Google Gemini API Key"
    ```
    > 你可以从 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取你的 API Key。

4.  **启动开发服务器**
    ```bash
    npm run dev
    ```
    现在，在浏览器中打开 `http://localhost:5173` 即可开始使用。

## 💡 使用方法

1.  **设置 API 密钥**: 首次使用时，在页面右上角的代码图标 `</>` 弹窗中输入您的 Gemini API 密钥。
2.  **编辑内容**: 在左侧面板中填写卡片的标题、描述等文本信息。
3.  **选择视觉元素**:
    - **AI 生成**: 在 "Visual" -> "AI Generate" 标签下，输入描述性提示词，然后点击 "Generate Image"。
    - **上传图片**: 在 "Visual" -> "Upload" 标签下，点击上传区域选择您的本地图片。
4.  **调整风格**: 在 "Style & Layout" 部分选择您喜欢的宽高比和卡片设计风格。
5.  **预览与下载**: 在右侧预览区域确认效果，然后点击右下角的 "Save Cover" 按钮下载您的作品。

## 🤖 自动化指南

本项目支持通过 URL 参数进行自动化。访问 `/?view=headless` 并带上参数，即可渲染一个仅包含卡片的“无头”页面，便于截图工具（如 Playwright 或 Puppeteer）进行自动化处理。

**可用参数**:
- `view=headless`: 激活无头模式。
- `title`: 设置主标题。
- `subtitle`: 设置副标题。
- `author`: 设置作者。
- `footerText`: 设置页脚文本。
- `imageUrl`: 直接提供一个图片 URL 作为背景。
- `style`: 卡片风格 (`classic`, `overlay`, `minimal`, `glass`, `bold`, `zen`)。
- `ratio`: 宽高比 (`1:1`, `4:5`, `9:16`)。

**示例**:
访问以下 URL 将会生成一个预设好所有内容的卡片页面：
```
http://localhost:5173/?view=headless&title=Hello%20Gemini&subtitle=Automated%20Card%20Generation&style=bold&ratio=1:1
```
你可以在开发者弹窗 (`</>`) 中找到生成此 URL 和相关 Node.js 自动化代码的工具。