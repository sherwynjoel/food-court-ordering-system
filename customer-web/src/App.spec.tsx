import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import React from 'react';

// Mock API to prevent actual network calls during tests
vi.mock('./services/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

describe('App Integration Flow', () => {
    it('allows a user to add items to cart and proceed to checkout', async () => {
        render(<App />);

        // 1. Verify Home Page loads and shows menu items (mocked in HomePage)
        // We need to wait for the "mock data" timeout in HomePage
        await waitFor(() => {
            expect(screen.getByText('Classic Burger')).toBeInTheDocument();
        }, { timeout: 2000 });

        // 2. Add item to cart
        const addButtons = screen.getAllByText('Add to Order');
        fireEvent.click(addButtons[0]); // Add Classic Burger

        // 3. Navigate to Cart (Click mock badge or button if accessible, 
        // but easier to click the cart icon button in Header)
        // The header has a shopping cart icon. We can find it by testid or role.
        // MUI icons usually have `data-testid` equal to the icon name if configured, or we can find by svg.
        // In Header.tsx we navigate to '/cart'.

        // Let's rely on text or role. The button container has the badge.
        // Or better, let's verify visual update first.
        // Note: The Header badge count should update.

        // Navigate manually via accessible element if possible, or just click the header icon
        // Finding the cart icon might be tricky without a specific aria-label. 
        // Let's add aria-label to Header.tsx first? 
        // Actually, let's just assume we can find the button by the badge content or similar.
        // For now, let's try to find by specific aria-label if I added one? I didn't.

        // Let's modify the test to just check if "Add to Order" works and updates state, 
        // observing the flow might require more robust querying.

        // Simulating the flow:
        // User is on Home.
        expect(screen.getByText('Hungry?')).toBeInTheDocument();

        // Click Cart Icon (we need to be able to select it)
        // Let's add an aria-label to the cart button in Header.tsx in a separate step or just update it now?
        // I can select by the SVG icon's common name if exported, but rendered HTML is different.
        // I'll try to find by role 'button' that contains the badge or is in the toolbar.

        const buttons = screen.getAllByRole('button');
        // The header usually has: Menu (logo), Cart. 
        // The Cart button is likely the last one or close to end.
        const cartButton = buttons.find(b => b.innerHTML.includes('MuiBadge-badge'));

        if (cartButton) {
            fireEvent.click(cartButton);
        } else {
            // Fallback: try finding by looking for the Badge text if it renders '1'
            fireEvent.click(screen.getByText('1')); // The badge should show 1
        }

        // 4. Verify we are on Cart Page
        await waitFor(() => {
            expect(screen.getByText('Your Order')).toBeInTheDocument();
        });

        expect(screen.getByText('Classic Burger')).toBeInTheDocument();
        expect(screen.getByText('Checkout')).toBeInTheDocument();

        // 5. Click Checkout
        fireEvent.click(screen.getByText('Checkout'));

        // 6. Verify processing and navigation to Order Status
        expect(screen.getByText('Placing Order...')).toBeDisabled();

        await waitFor(() => {
            expect(screen.getByText("We've received your order!")).toBeInTheDocument();
        }, { timeout: 3000 });
    });
});
