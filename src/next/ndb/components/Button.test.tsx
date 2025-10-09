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

      expect(button).toHaveClass('btn-secondary');
      expect(button).toHaveClass('btn-md');
    });

    it('should apply highlighted variant styles', () => {
      render(<Button variant="highlighted">Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('btn-primary');
      expect(button).toHaveClass('btn-md');
    });

    it('should apply ghost variant styles', () => {
      render(<Button variant="ghost">Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('btn-ghost');
      expect(button).toHaveClass('btn-md');
    });

    it('should apply danger variant styles', () => {
      render(<Button variant="danger">Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('btn-danger');
      expect(button).toHaveClass('btn-md');
    });

    it('should apply small size styles', () => {
      render(<Button size="sm">Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('btn-sm');
      expect(button).toHaveClass('btn-secondary');
    });

    it('should apply large size styles', () => {
      render(<Button size="lg">Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('btn-lg');
      expect(button).toHaveClass('btn-secondary');
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('btn-secondary'); // Should still have default classes
      expect(button).toHaveClass('btn-md');
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

    it('should still have semantic classes when disabled', () => {
      render(<Button disabled>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-secondary');
      expect(button).toHaveClass('btn-md');
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

    it('should have semantic button classes for styling', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-secondary');
      expect(button).toHaveClass('btn-md');
    });
  });
});
