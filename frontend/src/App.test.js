import { render, screen } from '@testing-library/react';
import App from './App';

test('renders contact book title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Contact Book/i);
  expect(linkElement).toBeInTheDocument();
});
