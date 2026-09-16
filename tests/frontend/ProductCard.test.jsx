import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from '../../src/Components/features/ProductCard';

describe('ProductCard Component', () => {
    const mockProduct = {
        _id: '123',
        title: 'Handloom Cotton Saree',
        price: 3500,
        artisan: 'Weavers Collective',
        region: 'West Bengal',
        image: 'http://example.com/saree.jpg',
        pointsPrice: 5000
    };

    it('renders product details correctly', () => {
        render(
            <ProductCard
                product={mockProduct}
                onAddToCart={vi.fn()}
                onMessage={vi.fn()}
                onBuyWithPoints={vi.fn()}
            />
        );

        expect(screen.getByText('Handloom Cotton Saree')).toBeInTheDocument();
        expect(screen.getByText('by Weavers Collective')).toBeInTheDocument();
        expect(screen.getByText('₹3500')).toBeInTheDocument();
    });

    it('calls onAddToCart handler when Add to Cart button is clicked', () => {
        const handleAddToCart = vi.fn();
        render(
            <ProductCard
                product={mockProduct}
                onAddToCart={handleAddToCart}
                onMessage={vi.fn()}
                onBuyWithPoints={vi.fn()}
            />
        );

        const addButton = screen.getByText(/Add to Cart/i);
        fireEvent.click(addButton);

        expect(handleAddToCart).toHaveBeenCalledWith(mockProduct);
    });
});
