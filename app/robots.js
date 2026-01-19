// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/session/'], // Don't index your session or API routes
    },
    sitemap: 'https://mary-immaculate.vercel.app/sitemap.xml',
  }
}