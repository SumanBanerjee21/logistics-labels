// Central API URL - reads from Vite env var
// In production (Vercel), set VITE_API_URL to your Render backend URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
