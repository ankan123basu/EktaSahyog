import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Auth from '../../src/pages/Auth';

describe('Auth Page Component', () => {
    it('renders login form by default', () => {
        render(
            <MemoryRouter>
                <Auth />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText(/example@email.com/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    it('switches to Register form when Create an account button is clicked', () => {
        render(
            <MemoryRouter>
                <Auth />
            </MemoryRouter>
        );

        const registerButton = screen.getByText(/Create an account/i);
        fireEvent.click(registerButton);

        expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    });
});
