# Markie Cadag Fashion Website

Markie Cadag Fashion is a Node.js and Express-based fashion brand website for brand visibility, client engagement, and sales conversion. It presents the business profile, collection pages, RTW selling flow, couture consultation booking, legal policy pages, and customer support entry points.

## Current Scope

The website currently includes:

- Company profile and brand story
- Product showcase for:
  - Ready-to-Wear
  - Barong and Filipiniana
  - Kids and Teen
  - Custom Couture
  - Other Services
- Proof-of-selling pages through cart and checkout flow
- Featured client sections
- SEC, BIR, and Mayor's Permit compliance visibility
- VIP membership toggle with 75% RTW discount behavior
- Face-to-face consultation booking form for couture services
- Courier and payment method selection in checkout
- Terms and Conditions
- Privacy Policy
- Shipping Policy
- Customer support chat intake panel

## Tech Stack

- Node.js
- Express
- MySQL via `mysql2`
- HTML, CSS, and vanilla JavaScript

## Project Structure

```text
markie-cadag-web/
|- db/
|- middleware/
|- public/
|  |- css/
|  |- images/
|  |- js/
|- routes/
|- views/
|- server.js
|- package.json
```

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=markiecadag_db
PORT=3307
JWT_SECRET=your_secret_here
```

3. Start the server:

```bash
npm start
```

4. Open the website:

```text
http://localhost:3307
```

## Key Routes

- `/` - Homepage
- `/about` - Company profile
- `/custom` - Couture consultation booking
- `/rtw` - Ready-to-Wear collection
- `/filipiniana` - Barong and Filipiniana collection
- `/kidsandteens` - Kids and Teen collection
- `/santo` - Other services
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/login` - Sign in
- `/register` - Create account
- `/terms` - Terms and Conditions
- `/privacy` - Privacy Policy
- `/shipping` - Shipping Policy

## Current Behavior Notes

- The visible storefront flow currently uses `localStorage` for:
  - cart items
  - VIP membership state
  - appointment requests
  - checkout order capture
  - support chat state
- Existing backend API routes for auth, products, cart validation, and orders are still present.
- The frontend no longer depends on the database for the basic storefront demonstration pages.

## Next Recommended Improvements

- Connect RTW cart and checkout fully to MySQL-backed product and order records
- Persist VIP membership in the customer database
- Persist consultation bookings in the database
- Connect support chat to a real messaging or CRM service
- Replace text-based compliance badges with official uploaded permit/logo assets
- Add admin product and inventory management

## Author

Project prepared for Markie Cadag Fashion website development and storefront validation.
