# Food Court Customer Web App

A modern, responsive web application for customers to browse menus, add items to cart, and track their orders in a centralized food court.

## Features

- **Menu Browsing**: View items from multiple kitchens/branches.
- **Cart Management**: Add/remove items, adjust quantities.
- **Order Tracking**: Real-time status updates (Order Placed -> Preparing -> Ready -> Completed).
- **Dark Mode UI**: Premium aesthetic using Material UI.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Library**: Material UI (MUI), Framer Motion
- **State Management**: React Context API (CartContext)
- **Testing**: Vitest, React Testing Library

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Run Tests**:
   ```bash
   npm test
   ```

## Project Structure

- `/src/components`: Reusable UI components (Header, etc.)
- `/src/context`: Global state management (CartContext)
- `/src/pages`: Main application pages (Home, Cart, OrderStatus)
- `/src/theme`: Custom MUI theme configuration
