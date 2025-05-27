# React MUI TypeScript Project

A modern React application built with TypeScript, Material-UI, and Vite, featuring word learning functionality with a
beautiful dark theme.

## Features

- 🎨 **Material-UI Dark Theme** - Beautiful Darcula-inspired design
- 📱 **Responsive Layout** - Works on desktop and mobile
- 🔄 **State Management** - Zustand for efficient state handling
- 📝 **Form Management** - Formik with Yup validation
- 🎠 **Interactive Slider** - Word learning carousel with auto-play
- 📤 **File Upload** - JSON word pairs upload with validation
- 🔔 **Notifications** - Auto-dismissing snackbar notifications
- 🧭 **Routing** - React Router for navigation

## Tech Stack

- **React 19** with TypeScript
- **Material-UI (MUI)** for components and theming
- **Vite** for fast development and building
- **Zustand** for state management
- **React Router** for navigation
- **Formik + Yup** for form handling
- **React Slick** for carousel functionality
- **React Markdown** with syntax highlighting

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check

# Run both linting and format check
npm run check

# Fix both linting and formatting
npm run fix
```

## Code Quality

This project uses ESLint and Prettier for code quality and consistency:

### ESLint Configuration

- **TypeScript support** with `@typescript-eslint`
- **React hooks rules** for proper hook usage
- **React best practices** with `eslint-plugin-react`
- **Prettier integration** for consistent formatting
- **Modern flat config** format (eslint.config.js)

### Prettier Configuration

- **2-space indentation**
- **Single quotes** for strings
- **Trailing commas** where valid
- **100 character** line width
- **Semicolons** always
- **LF line endings**

### VS Code Integration

The project includes VS Code settings for:

- **Format on save** with Prettier
- **Auto-fix ESLint** issues on save
- **TypeScript** auto-imports
- **Recommended extensions** for optimal development experience

### Recommended VS Code Extensions

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- TypeScript (`ms-vscode.vscode-typescript-next`)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Menu)
│   ├── upload/         # Upload page components
│   └── word-pair/      # Word learning components
├── pages/              # Page components
├── stores/             # Zustand stores
├── theme/              # MUI theme configuration
├── types/              # TypeScript type definitions
└── services/           # API and external services
```

## Usage

1. **Learning Mode**: Navigate to the main page to see word pairs in an interactive slider
2. **Upload Mode**: Use the upload page to add new word pairs via JSON format
3. **Navigation**: Use the header menu to switch between modes

### JSON Upload Format

```json
[
  {
    "id": "1",
    "sourceWord": "Hello",
    "targetWord": "Hola"
  },
  {
    "id": "2",
    "sourceWord": "World",
    "targetWord": "Mundo"
  }
]
```
