# Banerjee Services - Label Printing Web App

A responsive React web application built for logistics label printing, featuring a secure login, a free tier of 10 pages, subscription plans, and print preview generation.

## Features Built
1. **Secure Login**: Access protected dashboard (Demo credentials: `admin` / `admin123`).
2. **Dashboard**: Form to input docket details and total boxes. Tracks free prints (up to 10).
3. **Print Preview**: Generates labels based on user input, formatted perfectly for 3"x4" prints. Includes a print button which connects to system printers.
4. **Subscription Wall**: Automatically redirects to subscription page after 10 prints unless subscribed.
5. **Payment Integration**: Shows the uploaded UPI QR Code for ₹299 and ₹999 plans. 

## Technology Stack
- HTML, CSS, JavaScript
- React (Vite)
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons

## How to run locally
1. Ensure you have Node.js installed.
2. Open terminal in the `frontend` directory.
3. Run `npm install`
4. Run `npm run dev`
5. Open the provided `http://localhost:5173` link in your browser.

## Deployment to Vercel/Render
1. Create a GitHub repository and push this `frontend` folder.
2. Go to [Vercel](https://vercel.com) or [Render](https://render.com).
3. Connect your GitHub repository.
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. Click deploy! The platform will automatically provision a secure HTTPS environment for your app.

## Next Steps (For Production)
- Replace the dummy `AuthContext` login with a real backend (e.g., Firebase, Node.js + MongoDB) for secure credential verification.
- Integrate the official Razorpay SDK (`react-razorpay`) in `Subscription.jsx` to process actual payments instead of just showing the static QR.
