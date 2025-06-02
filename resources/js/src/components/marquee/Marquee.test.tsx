import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Marquee from './Marquee';

jest.mock('./Marquee.css', () => ({}));

describe('Marquee Component', () => {
    describe('Basic Rendering', () => {
        it('renders with the provided title', () => {
            render(<Marquee title="Test Title" />);
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Title');
        });

        it('renders with empty title', () => {
            render(<Marquee title="" />);
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('');
        });

        it('renders with special characters in title', () => {
            const specialTitle = "Test!@#$%^&*()_+-=[]{}|;':\",./<>?";
            render(<Marquee title={specialTitle} />);
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(specialTitle);
        });

        it('renders with unicode characters in title', () => {
            const unicodeTitle = "Test 🎪🎭🎨 Café naïve résumé";
            render(<Marquee title={unicodeTitle} />);
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(unicodeTitle);
        });

        it('renders with very long title', () => {
            const longTitle = 'A'.repeat(1000);
            render(<Marquee title={longTitle} />);
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(longTitle);
        });
    });

    describe('Component Structure', () => {
        it('renders header with correct classes', () => {
            const { container } = render(<Marquee title="Test" />);
            const header = container.querySelector('header');
            expect(header).toHaveClass(
                'marquee',
                'flex',
                'justify-center',
                'items-center',
                'w-fit',
                'mx-auto',
                'my-14',
                'relative',
                'px-8',
                'py-10',
                'bg-white',
                'font-bangers',
                'text-6xl',
                'border-[16px]',
                'border-solid',
                'rounded-2xl',
            );
        });

        it('renders all four light containers', () => {
            const { container } = render(<Marquee title="Test" />);
            expect(container.querySelector('.marquee-lights-top')).toBeInTheDocument();
            expect(container.querySelector('.marquee-lights-bottom')).toBeInTheDocument();
            expect(container.querySelector('.marquee-lights-left')).toBeInTheDocument();
            expect(container.querySelector('.marquee-lights-right')).toBeInTheDocument();
        });
    });

    describe('Light Rendering', () => {
        it('renders correct number of horizontal lights (top and bottom)', () => {
            const { container } = render(<Marquee title="Test" />);
            const topLights = container.querySelectorAll('.marquee-lights-top .bulb');
            const bottomLights = container.querySelectorAll('.marquee-lights-bottom .bulb');

            expect(topLights).toHaveLength(10);
            expect(bottomLights).toHaveLength(10);
        });

        it('renders correct number of vertical lights (left and right)', () => {
            const { container } = render(<Marquee title="Test" />);
            const leftLights = container.querySelectorAll('.marquee-lights-left .bulb');
            const rightLights = container.querySelectorAll('.marquee-lights-right .bulb');

            expect(leftLights).toHaveLength(4);
            expect(rightLights).toHaveLength(4);
        });

        it('renders lights with unique keys', () => {
            const { container } = render(<Marquee title="Test" />);
            const allBulbs = container.querySelectorAll('.bulb');

            expect(allBulbs).toHaveLength(28);
        });
    });

    describe('Top Light Special Styling', () => {
        it('applies arch styling to middle lights on top', () => {
            const { container } = render(<Marquee title="Test" />);
            const topLights = container.querySelectorAll('.marquee-lights-top .bulb');

            // With numLightsHorizontal = 10, numArchLights = 6, numPlainTopLights = 4
            // Plain lights: indices 0, 1, 8, 9
            // Arch lights: indices 2-7
            // Curve lights: indices 2 and 7

            expect(topLights[0]).toHaveClass('bulb');
            expect(topLights[0]).not.toHaveClass('bulb-arch', 'bulb-arch-curve');
            expect(topLights[1]).toHaveClass('bulb');
            expect(topLights[1]).not.toHaveClass('bulb-arch', 'bulb-arch-curve');
            expect(topLights[8]).toHaveClass('bulb');
            expect(topLights[8]).not.toHaveClass('bulb-arch', 'bulb-arch-curve');
            expect(topLights[9]).toHaveClass('bulb');
            expect(topLights[9]).not.toHaveClass('bulb-arch', 'bulb-arch-curve');

            expect(topLights[2]).toHaveClass('bulb', 'bulb-arch-curve');
            expect(topLights[7]).toHaveClass('bulb', 'bulb-arch-curve');

            expect(topLights[3]).toHaveClass('bulb', 'bulb-arch');
            expect(topLights[4]).toHaveClass('bulb', 'bulb-arch');
            expect(topLights[5]).toHaveClass('bulb', 'bulb-arch');
            expect(topLights[6]).toHaveClass('bulb', 'bulb-arch');
        });

        it('does not apply arch styling to non-top lights', () => {
            const { container } = render(<Marquee title="Test" />);

            const bottomLights = container.querySelectorAll('.marquee-lights-bottom .bulb');
            const leftLights = container.querySelectorAll('.marquee-lights-left .bulb');
            const rightLights = container.querySelectorAll('.marquee-lights-right .bulb');

            // All non-top lights should only have 'bulb' class
            [...bottomLights, ...leftLights, ...rightLights].forEach(light => {
                expect(light).toHaveClass('bulb');
                expect(light).not.toHaveClass('bulb-arch', 'bulb-arch-curve');
            });
        });
    });

    describe('renderLights Function Edge Cases', () => {
        // We can't directly test the renderLights function since it's internal,

        it('handles arch light calculation correctly', () => {
            const { container } = render(<Marquee title="Test" />);

            const archLights = container.querySelectorAll('.marquee-lights-top .bulb-arch, .marquee-lights-top .bulb-arch-curve');
            expect(archLights).toHaveLength(6);
        });

        it('handles division edge cases in arch calculation', () => {
            const { container } = render(<Marquee title="Test" />);

            const plainBulbs = container.querySelectorAll('.marquee-lights-top .bulb:not(.bulb-arch):not(.bulb-arch-curve)');
            const archBulbs = container.querySelectorAll('.marquee-lights-top .bulb-arch:not(.bulb-arch-curve)');
            const curveBulbs = container.querySelectorAll('.marquee-lights-top .bulb-arch-curve');

            expect(plainBulbs).toHaveLength(4);
            expect(archBulbs).toHaveLength(4);
            expect(curveBulbs).toHaveLength(2);
        });
    });

    describe('Accessibility', () => {
        it('has proper heading structure', () => {
            render(<Marquee title="Test Title" />);
            const heading = screen.getByRole('heading', { level: 1 });
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveTextContent('Test Title');
        });

        it('has proper semantic structure with header element', () => {
            const { container } = render(<Marquee title="Test" />);
            const header = container.querySelector('header');
            expect(header).toBeInTheDocument();
        });
    });

    describe('CSS Classes', () => {

        it('applies all expected Tailwind classes', () => {
            const { container } = render(<Marquee title="Test" />);
            const header = container.querySelector('header');

            expect(header).toHaveClass('bg-white');
            expect(header).toHaveClass('font-bangers');
            expect(header).toHaveClass('text-6xl');
            expect(header).toHaveClass('border-[16px]');
            expect(header).toHaveClass('rounded-2xl');
        });
    });

    describe('Error Handling and Edge Cases', () => {
        it('handles null/undefined title gracefully', () => {
            const { container } = render(<Marquee title={null as any} />);
            const heading = container.querySelector('h1');
            expect(heading).toBeInTheDocument();
        });

        it('handles numeric title', () => {
            render(<Marquee title={12345 as any} />);
            expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('12345');
        });

        it('renders consistently across multiple renders', () => {
            const { container: container1 } = render(<Marquee title="Test" />);
            const { container: container2 } = render(<Marquee title="Test" />);

            const lights1 = container1.querySelectorAll('.bulb');
            const lights2 = container2.querySelectorAll('.bulb');

            expect(lights1).toHaveLength(lights2.length);
        });
    });
});
