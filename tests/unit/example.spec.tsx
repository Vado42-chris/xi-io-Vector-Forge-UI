/**
 * Example Unit Test
 * Verifies Jest setup is working
 * 
 * #hashtag: testing jest-example
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

function Hello() {
  return <div>Hello, Xibalba!</div>;
}

describe('Example Test', () => {
  test('renders hello message', () => {
    render(<Hello />);
    expect(screen.getByText('Hello, Xibalba!')).toBeInTheDocument();
  });

  test('Jest is configured correctly', () => {
    expect(true).toBe(true);
  });
});

