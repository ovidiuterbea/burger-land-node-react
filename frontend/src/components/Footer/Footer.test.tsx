import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  test('renders with current year and correct text', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();

    const copyElement = screen.getByText(
      new RegExp(
        `©\\s*${currentYear}\\s*Burger Land\\. All rights reserved\\.`,
        'i'
      )
    );
    expect(copyElement).toBeInTheDocument();
  });
});
