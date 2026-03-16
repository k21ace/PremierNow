import sharp from 'sharp'

const svg = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="7" fill="#2d0a4e"/>
  <rect x="4" y="5" width="3" height="22" rx="1.5" fill="#00a8e8"/>
  <rect x="10" y="6" width="2" height="14" fill="white"/>
  <rect x="10" y="6" width="6" height="2" fill="white"/>
  <rect x="10" y="12" width="6" height="2" fill="white"/>
  <rect x="16" y="6" width="2" height="8" rx="1" fill="white"/>
  <rect x="20" y="6" width="2" height="14" fill="white"/>
  <rect x="28" y="6" width="2" height="14" fill="white"/>
  <polygon points="20,6 22,6 30,18 30,20 28,20 20,8" fill="white"/>
</svg>`

await sharp(Buffer.from(svg))
  .resize(32, 32)
  .png()
  .toFile('public/favicon-32.png')

await sharp(Buffer.from(svg))
  .resize(16, 16)
  .png()
  .toFile('public/favicon-16.png')

await sharp(Buffer.from(svg))
  .resize(180, 180)
  .png()
  .toFile('public/apple-touch-icon.png')

console.log('favicon generated!')
