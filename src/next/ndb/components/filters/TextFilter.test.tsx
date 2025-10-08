/**
 * Tests for TextFilter component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextFilter } from './TextFilter';

describe('TextFilter Component', () => {
  describe('rendering', () => {
    it('should render input with default placeholder', () => {
      render(<TextFilter value="" onChange={jest.fn()} />);
      expect(screen.getByPlaceholderText('Filtern...')).toBeInTheDocument();
    });

    it('should render input with custom placeholder', () => {
      render(<TextFilter value="" onChange={jest.fn()} placeholder="Custom placeholder" />);
      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
    });

    it('should render input with value', () => {
      render(<TextFilter value="test value" onChange={jest.fn()} />);
      expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
    });

    it('should auto-focus input', () => {
      render(<TextFilter value="" onChange={jest.fn()} />);
      const input = screen.getByPlaceholderText('Filtern...');
      expect(input).toHaveFocus();
    });
  });

  describe('interactions', () => {
    it('should call onChange when user types', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<TextFilter value="" onChange={handleChange} />);

      const input = screen.getByPlaceholderText('Filtern...');
      await user.type(input, 'test');

      // User types each character, so onChange is called 4 times (t, e, s, t)
      expect(handleChange).toHaveBeenCalledTimes(4);
      expect(handleChange).toHaveBeenNthCalledWith(1, 't');
      expect(handleChange).toHaveBeenNthCalledWith(2, 'e');
      expect(handleChange).toHaveBeenNthCalledWith(3, 's');
      expect(handleChange).toHaveBeenNthCalledWith(4, 't');
    });

    it('should call onChange with empty string when cleared', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<TextFilter value="test" onChange={handleChange} />);

      const input = screen.getByDisplayValue('test');
      await user.clear(input);

      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('should update value when props change', () => {
      const { rerender } = render(<TextFilter value="initial" onChange={jest.fn()} />);
      expect(screen.getByDisplayValue('initial')).toBeInTheDocument();

      rerender(<TextFilter value="updated" onChange={jest.fn()} />);
      expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have correct CSS classes', () => {
      render(<TextFilter value="" onChange={jest.fn()} />);
      const input = screen.getByPlaceholderText('Filtern...');

      expect(input).toHaveClass('w-full');
      expect(input).toHaveClass('px-2');
      expect(input).toHaveClass('py-1.5');
      expect(input).toHaveClass('text-sm');
      expect(input).toHaveClass('border');
      expect(input).toHaveClass('rounded');
    });

    it('should have focus styles', () => {
      render(<TextFilter value="" onChange={jest.fn()} />);
      const input = screen.getByPlaceholderText('Filtern...');

      expect(input).toHaveClass('focus:outline-none');
      expect(input).toHaveClass('focus:ring-2');
      expect(input).toHaveClass('focus:ring-blue-500');
    });
  });

  describe('accessibility', () => {
    it('should have text input type', () => {
      render(<TextFilter value="" onChange={jest.fn()} />);
      const input = screen.getByPlaceholderText('Filtern...');
      expect(input).toHaveAttribute('type', 'text');
    });
  });
});
