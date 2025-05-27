# MUI Word Slider - React + Vite + GitHub Pages

A React application built with Vite, demonstrating deployment to GitHub Pages with automatic CI/CD.

## 🎯 Purpose

This project demonstrates:

- ✅ React + Vite application deployment to GitHub Pages
- ✅ Automatic build and deployment via GitHub Actions
- ✅ Proper configuration for GitHub Pages subdirectory hosting
- ✅ Modern React development with Vite's fast build system

## 🚀 Live Demo

Once deployed, this site will be available at:
`https://[your-username].github.io/mui-word-slider/`

## 🛠️ Tech Stack

- **React 19** - Modern React with latest features
- **Vite 6** - Fast build tool and dev server
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Static hosting

## 📁 Project Structure

```
mui-word-slider/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── dist/                       # Built files (generated)
├── public/                     # Static assets
├── src/                        # React source code
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## 🔧 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## 🚀 Deployment to GitHub Pages

### Automatic Deployment (Recommended)

1. **Configure Vite**: The `vite.config.js` is already configured with the correct base path:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/mui-word-slider/',
   })
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "GitHub Actions" as the source

3. **Push to Repository**: The workflow will automatically:
   - Install dependencies
   - Build the React app
   - Deploy to GitHub Pages

### Manual Deployment

If you prefer manual deployment:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy dist folder**: Upload the `dist/` folder contents to your hosting provider

## ✅ Build Verification

The build is correctly configured when:

- [x] `vite.config.js` has the correct `base` path
- [x] Built `index.html` references assets with `/mui-word-slider/` prefix
- [x] All assets are in the `dist/assets/` folder
- [x] GitHub Actions workflow builds and deploys successfully

### Current Build Status

```bash
✓ 32 modules transformed.
dist/index.html                   0.51 kB │ gzip:  0.31 kB
dist/assets/react-CHdo91hT.svg    4.13 kB │ gzip:  2.05 kB
dist/assets/index-D8b4DHJx.css    1.39 kB │ gzip:  0.71 kB
dist/assets/index-CYx_iUZg.js   188.09 kB │ gzip: 59.22 kB
✓ built in 351ms
```

## 🔍 Troubleshooting

### Common Issues

1. **404 errors for assets**: Ensure `base` in `vite.config.js` matches your repository name
2. **Blank page**: Check browser console for asset loading errors
3. **Build fails**: Verify all dependencies are installed with `npm ci`

### Asset Path Verification

The built `index.html` should contain paths like:
```html
<script src="/mui-word-slider/assets/index-[hash].js"></script>
<link href="/mui-word-slider/assets/index-[hash].css" rel="stylesheet">
```

## 📊 Performance

- **Bundle size**: ~188KB (59KB gzipped)
- **Build time**: ~351ms
- **Fast refresh**: Enabled in development
- **Tree shaking**: Automatic dead code elimination

## 🛡️ Security

- HTTPS enabled by default on GitHub Pages
- No server-side vulnerabilities (static files only)
- Content Security Policy can be added via meta tags

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test locally: `npm run dev`
5. Build: `npm run build`
6. Commit: `git commit -m 'Add feature'`
7. Push: `git push origin feature-name`
8. Create a Pull Request

## 📄 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

**Build Status**: ✅ Successfully built  
**Deployment**: GitHub Actions → GitHub Pages  
**Asset Paths**: ✅ Correctly configured for subdirectory hosting  
**Status**: Ready for deployment
