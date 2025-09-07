#!/usr/bin/env node

/**
 * Script d'extraction d'assets pour création de CV sur Canva
 * Extrait les icônes SVG et images du portfolio
 */

const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_DIR = './cv-assets';
const ICONS_DIR = path.join(OUTPUT_DIR, 'icons');
const IMAGES_DIR = path.join(OUTPUT_DIR, 'images');

// Icônes Lucide React utilisées
const REQUIRED_ICONS = [
  'Mail',
  'Linkedin', 
  'MapPin',
  'Github',
  'Code',
  'Palette',
  'Zap',
  'Users',
  'ArrowDown',
  'ExternalLink',
  'GraduationCap',
  'Building'
];

// Création des dossiers
function createDirectories() {
  [OUTPUT_DIR, ICONS_DIR, IMAGES_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Dossier créé: ${dir}`);
    }
  });
}

// Extraction des couleurs CSS
function extractColors() {
  const colorsInfo = `
## 🎨 Palette de couleurs (CSS Variables)

### Variables principales :
- --primary : Couleur d'accent principal
- --background : Arrière-plan principal  
- --foreground : Texte principal
- --muted-foreground : Texte secondaire
- --border : Bordures
- --muted : Arrière-plan secondaire

### Gradient Hero :
background: linear-gradient(to bottom right, var(--background), var(--muted) 20%);

### Classes Tailwind importantes :
- bg-primary/10 : Arrière-plan icônes (primary à 10% opacité)
- text-primary : Couleur des icônes
- text-muted-foreground : Texte secondaire
- border-border : Bordures
  `;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'colors.md'), colorsInfo);
  console.log('✅ Couleurs extraites vers colors.md');
}

// Copie des images
function copyImages() {
  const imageDir = './src/img';
  if (!fs.existsSync(imageDir)) {
    console.log('❌ Dossier src/img introuvable');
    return;
  }

  const images = fs.readdirSync(imageDir);
  images.forEach(image => {
    const src = path.join(imageDir, image);
    const dest = path.join(IMAGES_DIR, image);
    fs.copyFileSync(src, dest);
    console.log(`✅ Image copiée: ${image}`);
  });
}

// Génération des SVG Lucide
function generateIconsSVGs() {
  const iconSVGs = {
    Mail: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    
    Linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
    
    MapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    
    Github: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5 0-1.2-.5-2.4-1.3-3.4.1-.3.6-1.6-.1-3.1 0 0-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 6.2 5.4 6.5 5.4 6.5c-.7 1.5-.2 2.8-.1 3.1C4.5 10.6 4 11.8 4 13c0 3.5 3 5.5 6 5.5-.4.6-.8 1.4-1 2.3V22"/><path d="M9 18c-4.3 2-4.3-2-6-2"/></svg>`,
    
    Code: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg>`,
    
    Palette: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
    
    Zap: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
    
    Users: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m22 21-3-3m-1.5 1.5a3.5 3.5 0 1 0-7 0 3.5 3.5 0 0 0 7 0z"/></svg>`,

    GraduationCap: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>`,

    Building: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`
  };

  Object.entries(iconSVGs).forEach(([name, svg]) => {
    const filename = `${name.toLowerCase()}.svg`;
    fs.writeFileSync(path.join(ICONS_DIR, filename), svg);
    console.log(`✅ Icône SVG créée: ${filename}`);
  });
}

// Génération du guide d'utilisation
function generateGuide() {
  const guide = `
# 📚 Guide d'utilisation des assets extraits

## Structure des dossiers :
- \`icons/\` : Icônes SVG pour votre CV
- \`images/\` : Images du portfolio  
- \`colors.md\` : Palette de couleurs

## 🎨 Utilisation sur Canva :

### Icônes :
1. Uploadez les fichiers .svg dans Canva
2. Changez la couleur pour correspondre à votre palette
3. Utilisez pour les sections contact, compétences, etc.

### Images :
- Images de projets disponibles
- Photo de profil : blancblanc.png

### Couleurs recommandées :
- Couleur principale : Utilisez un bleu moderne (#3B82F6)
- Texte secondaire : Gris (#64748B) 
- Arrière-plan : Blanc (#FFFFFF)
- Accents : Bleu clair (#EFF6FF)

## 📋 Sections suggérées pour le CV :
1. **En-tête** : Photo + Nom + Titre
2. **Contact** : mail.svg + linkedin.svg + mappin.svg
3. **À propos** : Texte de présentation
4. **Compétences** : code.svg + palette.svg + zap.svg
5. **Expérience** : building.svg pour les entreprises
6. **Éducation** : graduationcap.svg
7. **Projets** : github.svg + images de projets
  `;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), guide);
  console.log('✅ Guide créé: README.md');
}

// Exécution principale
function main() {
  console.log('🚀 Début de l\'extraction des assets...\n');
  
  createDirectories();
  copyImages();
  generateIconsSVGs();
  extractColors();
  generateGuide();
  
  console.log(`\n✅ Extraction terminée! Assets disponibles dans: ${OUTPUT_DIR}`);
  console.log('👉 Consultez le fichier README.md pour les instructions d\'utilisation');
}

main();