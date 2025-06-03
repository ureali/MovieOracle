import React, { useState as originalUseState } from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loading from './Loading';

describe('Loading Component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    test('renders initial state correctly', () => {
        render(<Loading />);

        const image = screen.getByRole('img', { name: /monkey/i });
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('alt', 'Monkey');
        expect(image).toHaveAttribute('loading', 'lazy');
        expect(image).toHaveClass('w-1/4', 'oracle-pondering');

        const loadingTextElement = screen.getByText('Thinking');
        expect(loadingTextElement).toBeInTheDocument();
        expect(loadingTextElement.tagName).toBe('H2');
        expect(loadingTextElement).toHaveClass(
            'loading',
            'text-3xl',
            'max-lg:text-lg',
            'max-md:text-sm',
            'mt-8'
        );

        const { container } = render(<Loading />);
        expect(container.firstChild).toHaveClass(
            'h-dvh',
            'flex',
            'flex-col',
            'justify-center',
            'items-center'
        );
    });

    test('loading text changes after 7 seconds', () => {
        render(<Loading />);

        expect(screen.getByText('Thinking')).toBeInTheDocument();
        expect(screen.queryByText('Oracle is taking longer than usual. Hang tight')).not.toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(6999);
        });

        expect(screen.getByText('Thinking')).toBeInTheDocument();
        expect(screen.queryByText('Oracle is taking longer than usual. Hang tight')).not.toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(1);
        });

        expect(screen.queryByText('Thinking')).not.toBeInTheDocument();
        expect(screen.getByText('Oracle is taking longer than usual. Hang tight')).toBeInTheDocument();
    });

    test('further advancing time does not change the text again', () => {
        render(<Loading />);

        act(() => {
            jest.advanceTimersByTime(7000);
        });

        expect(screen.getByText('Oracle is taking longer than usual. Hang tight')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(10000);
        });

        expect(screen.getByText('Oracle is taking longer than usual. Hang tight')).toBeInTheDocument();
        expect(screen.queryByText('Thinking')).not.toBeInTheDocument();
    });

    test('clears the timer on unmount', () => {
        const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
        const { unmount } = render(<Loading />);

        expect(clearTimeoutSpy).not.toHaveBeenCalled();

        unmount();

        expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);

        clearTimeoutSpy.mockRestore();
    });

    test('timer does not fire if component unmounts before 7 seconds', () => {
        const mockSetLoadingText = jest.fn();
        const useStateSpy = jest.spyOn(React, 'useState') as unknown as jest.SpyInstance<ReturnType<typeof originalUseState>, [string]>;

        // @ts-ignore
        useStateSpy.mockImplementation((initialValue: string): [string, React.Dispatch<React.SetStateAction<string>>] => {
            if (initialValue === "Thinking") {
                return [initialValue, mockSetLoadingText as React.Dispatch<React.SetStateAction<string>>];
            }
            return originalUseState(initialValue);
        });

        const { unmount } = render(<Loading />);
        expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'h2' && content.startsWith('Thinking'))).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        unmount();

        act(() => {
            jest.advanceTimersByTime(5000);
        });

        expect(mockSetLoadingText).not.toHaveBeenCalled();

        useStateSpy.mockRestore();
    });

    test('re-renders do not reset the timer unnecessarily', () => {
        const { rerender } = render(<Loading />);

        expect(screen.getByText('Thinking')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        rerender(<Loading />);

        expect(screen.getByText('Thinking')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(3999);
        });
        expect(screen.getByText('Thinking')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(1);
        });
        expect(screen.getByText('Oracle is taking longer than usual. Hang tight')).toBeInTheDocument();
    });
});
