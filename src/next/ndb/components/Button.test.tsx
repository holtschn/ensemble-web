/**
 * Tests for Button component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
  describe('rendering', () => {
    it('should render with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('should render with default variant and size', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('bg-gray-100');
      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('py-2');
    });

    it('should apply highlighted variant styles', () => {
      render(<Button variant="highlighted">Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('bg-green-100');
      expect(button).toHaveClass('text-green-800');
    });

    it('should apply ghost variant styles', () => {
      render(<Button variant="ghost">Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('bg-transparent');
    });

    it('should apply danger variant styles', () => {
      render(<Button variant="danger">Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('bg-red-100');
      expect(button).toHaveClass('text-red-800');
    });

    it('should apply small size styles', () => {
      render(<Button size="sm">Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('px-3');
      expect(button).toHaveClass('py-1.5');
      expect(button).toHaveClass('text-sm');
    });

    it('should apply large size styles', () => {
      render(<Button size="lg">Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('px-6');
      expect(button).toHaveClass('py-3');
      expect(button).toHaveClass('text-base');
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('bg-gray-100'); // Should still have default classes
    });
  });

  describe('interactions', () => {
    it('should call onClick handler when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<Button onClick={handleClick}>Click me</Button>);

      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<Button onClick={handleClick} disabled>Click me</Button>);

      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Button</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should have disabled:opacity-50 class when disabled', () => {
      render(<Button disabled>Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50');
    });

    it('should have disabled:cursor-not-allowed class when disabled', () => {
      render(<Button disabled>Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('disabled:cursor-not-allowed');
    });
  });

  describe('loading state', () => {
    it('should be disabled when isLoading is true', () => {
      render(<Button isLoading>Button</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should show spinner when isLoading is true', () => {
      render(<Button isLoading>Button</Button>);
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');

      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('animate-spin');
    });

    it('should still show children when loading', () => {
      render(<Button isLoading>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });
  });

  describe('HTML attributes', () => {
    it('should accept and apply type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should accept and apply aria attributes', () => {
      render(<Button aria-label="Close">X</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close');
    });

    it('should accept and apply data attributes', () => {
      render(<Button data-testid="my-button">Button</Button>);
      expect(screen.getByTestId('my-button')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have button role', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should have focus:outline-none class', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('focus:outline-none');
    });

    it('should have focus:ring-2 class for focus indicator', () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole('button')).toHaveClass('focus:ring-2');
    });
  });
});
