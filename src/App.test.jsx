import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

describe('Lyrics alignment builder', () => {
  it('renders the aligned preview for matching stanzas', async () => {
    const user = userEvent.setup();
    render(<App />);

    const ptInput = screen.getByLabelText(/Português/i);
    const deInput = screen.getByLabelText(/Deutsch/i);
    const enInput = screen.getByLabelText(/English/i);

    await user.clear(ptInput);
    await user.clear(deInput);
    await user.clear(enInput);

    await user.type(ptInput, 'First verse\n\nSecond verse');
    await user.type(deInput, 'Erste Strophe\n\nZweite Strophe');
    await user.type(enInput, 'First verse\n\nSecond verse');

    expect(screen.getByText((_, element) => element?.className === 'output-preview' && /First verse/i.test(element.textContent))).toBeInTheDocument();
    expect(screen.getByText((_, element) => element?.className === 'output-preview' && /Erste Strophe/i.test(element.textContent))).toBeInTheDocument();
    expect(screen.queryByText(/warning: the number of stanzas|atenção: o número de estrofes/i)).not.toBeInTheDocument();
  });

  it('renders a projection-style stanza preview for each aligned stanza', async () => {
    const user = userEvent.setup();
    render(<App />);

    const ptInput = screen.getByLabelText(/Português/i);
    const deInput = screen.getByLabelText(/Deutsch/i);
    const enInput = screen.getByLabelText(/English/i);

    await user.clear(ptInput);
    await user.clear(deInput);
    await user.clear(enInput);

    await user.type(ptInput, 'First verse\n\nSecond verse');
    await user.type(deInput, 'Erste Strophe\n\nZweite Strophe');
    await user.type(enInput, 'First verse\n\nSecond verse');

    expect(screen.getByText(/projection preview/i)).toBeInTheDocument();
    expect(screen.getByText('Stanza 1')).toBeInTheDocument();
  });

  it('does not render row numbers in the projection preview cards', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const ptInput = screen.getByLabelText(/Português/i);
    const deInput = screen.getByLabelText(/Deutsch/i);
    const enInput = screen.getByLabelText(/English/i);

    await user.clear(ptInput);
    await user.clear(deInput);
    await user.clear(enInput);

    await user.type(ptInput, 'First verse\n\nSecond verse');
    await user.type(deInput, 'Erste Strophe\n\nZweite Strophe');
    await user.type(enInput, 'First verse\n\nSecond verse');

    expect(container.querySelector('.projection-row-number')).toBeNull();
  });

  it('shows a warning when stanza counts differ', async () => {
    const user = userEvent.setup();
    render(<App />);

    const ptInput = screen.getByLabelText(/Português/i);
    const deInput = screen.getByLabelText(/Deutsch/i);
    const enInput = screen.getByLabelText(/English/i);

    await user.clear(ptInput);
    await user.clear(deInput);
    await user.clear(enInput);

    await user.type(ptInput, 'Verse one\n\nVerse two');
    await user.type(deInput, 'Strophe eins');
    await user.type(enInput, 'Verse one');

    expect(screen.getByText(/warning: the number of stanzas|atenção: o número de estrofes/i)).toBeInTheDocument();
  });
});
