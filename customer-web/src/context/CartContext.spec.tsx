import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CartProvider, useCart } from '../context/CartContext';
import React from 'react';

const TestComponent = () => {
    const { items, addToCart, removeFromCart, total, itemCount } = useCart();
    return (
        <div>
            <div data-testid="count">{itemCount}</div>
            <div data-testid="total">{total}</div>
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        {item.name} - {item.quantity}
                        <button onClick={() => removeFromCart(item.id)}>Remove</button>
                    </li>
                ))}
            </ul>
            <button onClick={() => addToCart({ id: '1', name: 'Test Item', price: 10, kitchen_name: 'Test Kitchen' })}>
                Add Item
            </button>
        </div>
    );
};

describe('CartContext', () => {
    it('provides cart functionality', () => {
        render(
            <CartProvider>
                <TestComponent />
            </CartProvider>
        );

        // Initial state
        expect(screen.getByTestId('count')).toHaveTextContent('0');
        expect(screen.getByTestId('total')).toHaveTextContent('0');

        // Add item
        fireEvent.click(screen.getByText('Add Item'));
        expect(screen.getByTestId('count')).toHaveTextContent('1');
        expect(screen.getByTestId('total')).toHaveTextContent('10');
        expect(screen.getByText('Test Item - 1')).toBeInTheDocument();

        // Add same item again (quantity increase)
        fireEvent.click(screen.getByText('Add Item'));
        expect(screen.getByTestId('count')).toHaveTextContent('2');
        expect(screen.getByTestId('total')).toHaveTextContent('20');
        expect(screen.getByText('Test Item - 2')).toBeInTheDocument();

        // Remove item
        fireEvent.click(screen.getByText('Remove'));
        expect(screen.getByTestId('count')).toHaveTextContent('0');
        expect(screen.getByTestId('total')).toHaveTextContent('0');
    });
});
