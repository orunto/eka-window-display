# Eka Fashion

Eka Fashion is a Vite and React storefront for luxury fashion, accessories, and bespoke services.

## Local Development

```sh
npm install
npm run dev
```

The development server runs on port `8080`.

## Production Build

```sh
npm run build
npm run preview
```

## Deployment

The app is configured for Vercel. Build with `npm run build`; Vercel serves the generated `dist` directory and uses the SPA rewrite in `vercel.json` for client-side routes.

## Routes

- `/` - Home
- `/collections` - Collections
- `/collection/:slug` - Collection details
- `/categories` and `/products` - Product categories
- `/category/:category` - Category details
- `/product/:slug` - Product details
- `/about` - About Eka
- `/bespoke` - Bespoke services
- `/register` - Registration
- `/profile` - Customer profile
- `/orders` - Customer orders
- `/delivery` - Delivery details
- `/checkout` - Checkout
- `/admin` - Admin dashboard
