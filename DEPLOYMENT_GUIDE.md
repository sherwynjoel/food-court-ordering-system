# Centralized Food Court Ordering System - Deployment Guide

This document outlines the steps to deploy the system for production.

## 1. Backend Deployment

### SQL Database
1. Provision a MySQL 8.0 instance (e.g., AWS RDS, GCP Cloud SQL).
2. Create a database named `food_court`.
3. Set up environment variables in your production environment:
   - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
   - `JWT_SECRET`

### NestJS Server
1. Clone the repository.
2. Run `npm install --omit=dev`.
3. Run `npm run build`.
4. Use a process manager like **PM2** to run the app:
   ```bash
   pm2 start dist/main.js --name food-court-api
   ```

## 2. Admin & Customer Web Deployment

### Frontend Build
1. Update `baseURL` in `src/services/api.ts` to your production URL.
2. Run `npm install` and `npm run build` in both `admin-web` and `customer-web`.

### Hosting
1. Upload the contents of the `dist/` folders to a static hosting provider (e.g., AWS S3 + CloudFront, Vercel, Netlify, or Nginx).

## 3. Real-time Gateway
Ensure your load balancer or reverse proxy (like Nginx) is configured to handle WebSockets (Sticky sessions might be needed if using multiple backend instances).

## 4. Environment Variables Checklist
- **Backend**: `PORT`, `DB_*`, `JWT_SECRET`.
- **Frontend**: Update the API URL in `api.ts`.
