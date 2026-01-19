export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Example: block admin or private routes
    },
    sitemap: 'https://mary-immaculate.vercel.app/sitemap.xml',
  }
}