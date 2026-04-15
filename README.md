# Nouhayla Darbali — Portfolio

Personal portfolio of Darbali Nouhayla · CS Student & AI/ML Builder  
Live at: `DarbaliNouhyla-portfolio.vercel.app`

## Stack
Vanilla HTML / CSS / JS — zero frameworks, zero build step  
Three.js (CDN) for the 3D hero scene  
Deployed on Vercel

## Structure
```
nd-portfolio/
├── index.html          # entry point — shell + imports only
├── css/
│   ├── main.css        # global vars, reset, typography
│   ├── nav.css         # navbar + custom cursor
│   ├── hero.css        # hero overlay text + konami bar
│   ├── projects.css    # cards, tags, hover effects
│   ├── about.css       # bio, stack grid, interest tags
│   └── contact.css     # buttons, footer
├── js/
│   ├── hero3d.js       # entire Three.js 3D scene
│   ├── cursor.js       # custom cursor logic
│   ├── animations.js   # scroll reveals, navbar state
│   ├── analytics.js    # free visitor counter (countapi)
│   └── easter-egg.js   # Konami code → outfit change
├── public/
│   ├── resume.pdf
│   ├── favicon.png
│   └── og-image.png
├── vercel.json
└── .gitignore
```

## Local dev
```bash
# Option 1 — open directly
open index.html

# Option 2 — local server (recommended)
npx serve .
```

## Deploy
```bash
git init
git add .
git commit -m "🚀 launch"
git remote add origin <your-github-url>
git push -u origin main
# then import repo on vercel.com — no build config needed
```

## Easter egg
Type ↑↑↓↓←→←→BA on the keyboard — her outfit changes 🎨
