// SearchBar.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from '@tanstack/react-router';
import SearchBar from './SearchBar';
import '@testing-library/jest-dom';

// Mock the router hook
jest.mock('@tanstack/react-router', () => ({
    useNavigate: jest.fn(),
}));

// Mock CSS import
jest.mock('./SearchBar.css', () => ({}));

const mockUseNavigate = jest.mocked(useNavigate);

describe('SearchBar', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseNavigate.mockReturnValue(mockNavigate);
    });

    it('renders search input and button', () => {
        render(<SearchBar />);

        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ask!/i })).toBeInTheDocument();
    });

    it('applies focus styles when input is focused', () => {
        render(<SearchBar />);
        const input = screen.getByRole('textbox');
        const form = input.closest('form');

        // Initially not focused
        expect(form).not.toHaveClass('focused-input');

        fireEvent.focus(input);
        expect(form).toHaveClass('focused-input');

        fireEvent.blur(input);
        expect(form).not.toHaveClass('focused-input');
    });

    it('navigates with query when form is submitted with valid input', async () => {
        render(<SearchBar />);
        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button');

        fireEvent.change(input, { target: { value: 'test query' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({
                to: '/recommend',
                state: { query: 'test query' }
            });
        });
    });

    it('does not navigate when form is submitted with empty query', async () => {
        render(<SearchBar />);
        const button = screen.getByRole('button');

        fireEvent.click(button);

        // Wait a bit to ensure no navigation occurs
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('does not navigate when form is submitted with whitespace-only query', async () => {
        render(<SearchBar />);
        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button');

        fireEvent.change(input, { target: { value: '   ' } });
        fireEvent.click(button);

        await new Promise(resolve => setTimeout(resolve, 100));
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('handles maximum length input', async () => {
        render(<SearchBar />);
        const input = screen.getByRole('textbox') as HTMLInputElement;
        const button = screen.getByRole('button');

        const maxLengthQuery = 'a'.repeat(255);
        fireEvent.change(input, { target: { value: maxLengthQuery } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({
                to: '/recommend',
                state: { query: maxLengthQuery }
            });
        });
    });

    it('respects maxLength attribute', () => {
        render(<SearchBar />);
        const input = screen.getByRole('textbox') as HTMLInputElement;

        expect(input.maxLength).toBe(255);
    });

    it('handles special characters in query', async () => {
        render(<SearchBar />);
        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button');

        const specialQuery = '!@#$%^&*()_+-={}[]|\\:";\'<>?,./';
        fireEvent.change(input, { target: { value: specialQuery } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({
                to: '/recommend',
                state: { query: specialQuery }
            });
        });
    });

    it('toggles focus state on multiple focus/blur events', () => {
        render(<SearchBar />);
        const input = screen.getByRole('textbox');
        const form = input.closest('form');

        // Multiple focus/blur cycles
        fireEvent.focus(input);
        expect(form).toHaveClass('focused-input');

        fireEvent.blur(input);
        expect(form).not.toHaveClass('focused-input');

        fireEvent.focus(input);
        expect(form).toHaveClass('focused-input');
    });

    it('input has correct attributes', () => {
        render(<SearchBar />);
        const input = screen.getByRole('textbox') as HTMLInputElement;

        expect(input.name).toBe('query');
        expect(input.type).toBe('text');
        expect(input.maxLength).toBe(255);
    });

    it('Trims Whitespace', async () => {
        render(<SearchBar />);
        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button');

        fireEvent.change(input, { target: { value: '  valid query  ' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({
                to: '/recommend',
                state: { query: 'valid query' }
            });
        });
    });
});
