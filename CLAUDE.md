# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Social Card Generator is a React-based web application that enables users to create social media cards with AI-generated images, custom uploads, and various styling options. The application supports both interactive UI mode and headless automation mode for programmatic card generation.

## Commands and Development

### Setup
- `npm install` - Install dependencies
- Configure environment variable: `VITE_GEMINI_API_KEY` in `.env.local` file to use AI image generation

### Running the Application
- `npm run dev` - Start development server (runs on port 3000 by default)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Automation Mode
- Access headless mode with `/?view=headless` URL parameter
- Available parameters: `title`, `subtitle`, `author`, `footerText`, `imageUrl`, `style` (classic, overlay, minimal, glass, bold, zen), `ratio` (1:1, 4:5, 9:16)

## Architecture

### Core Components
- `App.tsx`: Main application with state management for card data, styles, and UI controls
- `CoverPreview.tsx`: Renders the social card with different styles and aspect ratios
- `ApiDialog.tsx`: Modal for API automation code generation
- `geminiService.ts`: Handles AI image generation via Google Gemini API

### Data Structure
- `types.ts`: Defines enums for `AspectRatio` (Portrait, Square, Story) and `CardStyle` (Editorial, Overlay, Minimal, Glass, Bold, Zen)
- `CardData` interface: Contains title, subtitle, footerText, author, and imageUrl

### Key Features
- AI image generation with Google Gemini integration
- Image upload functionality with local processing
- Multiple card styles and aspect ratios
- Real-time preview with live updates
- PNG export functionality using html-to-image library
- Headless mode for automation via Puppeteer/Playwright

### UI Architecture
- Left panel: Controls for content, visual elements, and styling
- Right panel: Real-time card preview
- Mobile-responsive layout with fixed download button
- Tabbed interface for AI generation vs upload
- Generation history with ability to select/reuse previous images

### State Management
- Card data stored in React state with `useState`
- URL parameter hydration for headless mode
- Generated image history management
- Visual tab state (AI vs Upload)
- Error handling for image generation and download operations