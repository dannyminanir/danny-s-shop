# Danny's Shop: Frontend

React + TypeScript + Vite + Tailwind CSS storefront and admin dashboard for the E-commerce API.

## Features

**Customers**
- Register, log in, log out, forgot / reset password (emailed 6-digit code)
- Browse products with search, category filter, price range, sorting and pagination
- Product details with reviews and average rating
- Cart (add, change quantity, remove, empty) and wishlist (heart button)

**Admin** (`/admin`)
- Separate admin login, dashboard with shop statistics
- Product management: add, edit (with image upload), delete, hide / show

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173. In development, requests to `/api` are forwarded to the hosted backend
by the proxy in `vite.config.ts`. To use a backend running on your computer, change the proxy
`target` to `http://localhost:2000`.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production (`dist/`) |
| `npm run lint` | Check the code with oxlint |

## Deploy (Vercel)

`vercel.json` does two things:
1. Forwards `/api/*` to the Render backend (so the browser never calls another domain and no CORS setup is needed).
2. Sends every other URL to `index.html` so refreshing `/cart` or `/admin` works.

Do **not** set a `VITE_API_URL` variable on Vercel. If the backend ever moves, change the URL in `vercel.json` and `vite.config.ts`.

## Folder structure

```text
src/
  main.tsx                 app entry: router + providers
  App.tsx                  all routes (public, logged-in, admin)
  types/                   TypeScript shapes of the API data
  api/                     one file per backend area (auth, products, cart, wishlist, admin)
  context/                 shared state: auth, cart, wishlist, toast messages
                           (xxx-context.ts = the hook, XxxProvider.tsx = the logic)
  components/              reusable pieces (Navbar, ProductCard, Button, route guards ...)
  pages/                   shop pages
  pages/admin/             admin pages
  utils/format.ts          price and date formatting
```

## Making an admin

Registration always creates a normal user. Promote an account in MongoDB, then log in at `/admin/login`:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```
