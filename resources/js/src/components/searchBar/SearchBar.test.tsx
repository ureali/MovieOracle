import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from './SearchBar';

/**
 * Stub the router's navigate hook so we can assert on navigation without
 * invoking real routing logic.
 */
const mockNavigate = jest.fn();

jest.mock('@tanstack/react-router', () => {
    const actual = jest.requireActual('@tanstack/react-router');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Silence the CSS import that Vite or CRA would otherwise try to load.
jest.mock('./SearchBar.css', () => ({}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe('SearchBar', () => {
    /** ------------------------------------------------------------------
     * CORE RENDERING & STATE
     * ------------------------------------------------------------------ */
    it('renders the search input and both buttons', () => {
        render(<SearchBar />);

        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filters/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /ask!/i })).toBeInTheDocument();
    });

    it('applies the “focused-input” class while the textarea is focused', () => {
        render(<SearchBar />);
        const textarea = screen.getByRole('textbox');
        const form = textarea.closest('form');

        expect(form).not.toHaveClass('focused-input');

        fireEvent.focus(textarea);
        expect(form).toHaveClass('focused-input');

        fireEvent.blur(textarea);
        expect(form).not.toHaveClass('focused-input');
    });

    /** ------------------------------------------------------------------
     * BASIC SUBMISSION BEHAVIOUR (NO FILTERS)
     * ------------------------------------------------------------------ */
    it('navigates with the plain query text when submitted', async () => {
        render(<SearchBar />);
        const textarea = screen.getByRole('textbox');
        const askButton = screen.getByRole('button', { name: /ask!/i });

        fireEvent.change(textarea, { target: { value: 'test query' } });
        fireEvent.click(askButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({
                to: '/recommend',
                state: { query: 'test query' },
            });
        });
    });

    it('ignores a submission when the query is empty or only whitespace', async () => {
        render(<SearchBar />);
        const askButton = screen.getByRole('button', { name: /ask!/i });

        // Empty string
        fireEvent.click(askButton);
        await new Promise(r => setTimeout(r, 50));
        expect(mockNavigate).not.toHaveBeenCalled();

        // Whitespace only
        fireEvent.change(screen.getByRole('textbox'), { target: { value: '   ' } });
        fireEvent.click(askButton);
        await new Promise(r => setTimeout(r, 50));
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('trims leading/trailing whitespace before navigating', async () => {
        render(<SearchBar />);
        const textarea = screen.getByRole('textbox');
        const askButton = screen.getByRole('button', { name: /ask!/i });

        fireEvent.change(textarea, { target: { value: '  valid query  ' } });
        fireEvent.click(askButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({
                to: '/recommend',
                state: { query: 'valid query' },
            });
        });
    });

    /** ------------------------------------------------------------------
     * QUERY LENGTH & CHARACTER EDGE-CASES
     * ------------------------------------------------------------------ */
    it('submits the maximum length query (512 characters)', async () => {
        render(<SearchBar />);
        const textarea = screen.getByRole('textbox');
        const askButton = screen.getByRole('button', { name: /ask!/i });

        const maxQuery = 'a'.repeat(512);
        fireEvent.change(textarea, { target: { value: maxQuery } });
        fireEvent.click(askButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({
                to: '/recommend',
                state: { query: maxQuery },
            });
        });
    });

    it('the textarea exposes the correct maxLength attribute (512)', () => {
        render(<SearchBar />);
        const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
        expect(textarea.maxLength).toBe(512);
    });

    it('handles special characters in the query', async () => {
        render(<SearchBar />);
        const textarea = screen.getByRole('textbox');
        const askButton = screen.getByRole('button', { name: /ask!/i });

        const special = '!@#$%^&*()_+-={}[]|\\:";\'<>?,./';
        fireEvent.change(textarea, { target: { value: special } });
        fireEvent.click(askButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({
                to: '/recommend',
                state: { query: special },
            });
        });
    });

    /** ------------------------------------------------------------------
     * FILTER MENU VISIBILITY & CONTENTS
     * ------------------------------------------------------------------ */
    it('toggles the filter menu when the Filters button is clicked', () => {
        render(<SearchBar />);
        const filtersButton = screen.getByRole('button', { name: /filters/i });

        expect(screen.queryByText('Filter by:')).not.toBeInTheDocument();
        fireEvent.click(filtersButton);
        expect(screen.getByText('Filter by:')).toBeInTheDocument();
        fireEvent.click(filtersButton);
        expect(screen.queryByText('Filter by:')).not.toBeInTheDocument();
    });

    it('renders every filter category and its exact option set', () => {
        render(<SearchBar />);
        fireEvent.click(screen.getByRole('button', { name: /filters/i }));

        const moodOptions = [
            'Any Mood',
            'Scary',
            'Happy',
            'Sad',
            'Funny',
            'Romantic',
        ];
        expect(Array.from((screen.getByLabelText('Mood') as HTMLSelectElement).options).map(o => o.textContent)).toEqual(
            moodOptions,
        );

        const genreOptions = [
            'Any Genre',
            'Adventure',
            'Animation',
            'Crime',
            'Drama',
            'Family',
            'Romance',
            'Musical',
            'Horror',
            'Comedy',
            'Action',
        ];
        expect(Array.from((screen.getByLabelText('Genre') as HTMLSelectElement).options).map(o => o.textContent)).toEqual(
            genreOptions,
        );

        const releaseOptions = ['Any Release date', 'Last 5 years', 'Last 10 years', 'Last 20 years'];
        expect(
            Array.from((screen.getByLabelText('Release date') as HTMLSelectElement).options).map(o => o.textContent),
        ).toEqual(releaseOptions);

        const ageOptions = ['Any Age rating', 'R', 'PG', 'PG-13'];
        expect(Array.from((screen.getByLabelText('Age rating') as HTMLSelectElement).options).map(o => o.textContent)).toEqual(
            ageOptions,
        );
    });

    /** ------------------------------------------------------------------
     * NAVIGATION WITH FILTERS APPLIED
     * ------------------------------------------------------------------ */
    it('navigates with one filter applied', async () => {
        render(<SearchBar />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'horror movies' } });

        fireEvent.click(screen.getByRole('button', { name: /filters/i }));
        fireEvent.change(screen.getByLabelText('Genre'), { target: { value: 'Horror' } });

        fireEvent.click(screen.getByRole('button', { name: /ask!/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({
                to: '/recommend',
                state: { query: 'horror movies Filters: Genre: Horror' },
            });
        });
    });

    it('navigates with multiple filters applied', async () => {
        render(<SearchBar />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'family movies' } });

        fireEvent.click(screen.getByRole('button', { name: /filters/i }));
        fireEvent.change(screen.getByLabelText('Mood'), { target: { value: 'Happy' } });
        fireEvent.change(screen.getByLabelText('Genre'), { target: { value: 'Comedy' } });
        fireEvent.change(screen.getByLabelText('Release date'), { target: { value: 'Last 10 years' } });
        fireEvent.change(screen.getByLabelText('Age rating'), { target: { value: 'PG' } });

        fireEvent.click(screen.getByRole('button', { name: /ask!/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({
                to: '/recommend',
                state: {
                    query: 'family movies Filters: Mood: Happy, Genre: Comedy, Release date: Last 10 years, Age rating: PG',
                },
            });
        });
    });

    it('navigates with filters only when the query is empty', async () => {
        render(<SearchBar />);

        fireEvent.click(screen.getByRole('button', { name: /filters/i }));
        fireEvent.change(screen.getByLabelText('Genre'), { target: { value: 'Action' } });
        fireEvent.change(screen.getByLabelText('Age rating'), { target: { value: 'PG-13' } });

        fireEvent.click(screen.getByRole('button', { name: /ask!/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({
                to: '/recommend',
                state: { query: 'Filters: Genre: Action, Age rating: PG-13' },
            });
        });
    });

    it('ignores empty filter selections when constructing the query', async () => {
        render(<SearchBar />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test query' } });

        fireEvent.click(screen.getByRole('button', { name: /filters/i }));
        fireEvent.change(screen.getByLabelText('Mood'), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText('Genre'), { target: { value: 'Horror' } });

        fireEvent.click(screen.getByRole('button', { name: /ask!/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({
                to: '/recommend',
                state: { query: 'test query Filters: Genre: Horror' },
            });
        });
    });

    it('maintains the defined filter order in the query string', async () => {
        render(<SearchBar />);
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'movies' } });

        fireEvent.click(screen.getByRole('button', { name: /filters/i }));
        // Select filters out of order
        fireEvent.change(screen.getByLabelText('Age rating'), { target: { value: 'R' } });
        fireEvent.change(screen.getByLabelText('Release date'), { target: { value: 'Last 5 years' } });
        fireEvent.change(screen.getByLabelText('Genre'), { target: { value: 'Horror' } });
        fireEvent.change(screen.getByLabelText('Mood'), { target: { value: 'Scary' } });

        fireEvent.click(screen.getByRole('button', { name: /ask!/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({
                to: '/recommend',
                state: {
                    query: 'movies Filters: Mood: Scary, Genre: Horror, Release date: Last 5 years, Age rating: R',
                },
            });
        });
    });
});
