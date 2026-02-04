# Forsyth Games Portal - Deployment Guide

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```
Visit http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

## 📦 Vercel Deployment

This project is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

3. Environment Variables: None required (all games are static files)

4. Deploy! 🎉

## 🎯 Features

- ✅ Next.js 14+ with App Router
- ✅ Dark mode by default (black background #050505)
- ✅ 112 games organized by category
- ✅ 4 utilities
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Search functionality
- ✅ Premium animations with Framer Motion
- ✅ TypeScript throughout

## 📁 File Structure

```
portal/
├── app/              # Next.js pages
├── components/       # React components
├── data/            # Game & utility data
├── lib/             # Utilities & types
├── games/           # Static game files (preserved)
└── utilities/       # Static utility files (preserved)
```

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to change:
- Primary cyan: `#00eeff`
- Secondary purple: `#8b5cf6`
- Background: `#050505`

### Games
Add new games in `data/games.ts`:
```typescript
{
  id: 'game-slug',
  name: 'Game Name',
  category: 'ACTION',
  iconUrl: '/games/game-slug/favicon.png',
  iframeSrc: '/games/game-slug/'
}
```

## 🔧 Troubleshooting

### Build fails with font error
- Check internet connection for Google Fonts
- Or use local fonts in `app/layout.tsx`

### Games not loading
- Ensure game files are in `/public/games/` or `/games/`
- Check `next.config.js` for static file serving

## 📊 Performance

Build output:
- Home: 153 KB First Load JS
- Games: 156 KB First Load JS
- Utilities: 153 KB First Load JS
- Settings: 140 KB First Load JS
- Play: 143 KB First Load JS (dynamic)

## 🎉 Success!

Your premium gaming portal is ready to deploy!
