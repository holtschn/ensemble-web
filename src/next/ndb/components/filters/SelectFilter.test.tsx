/**
 * Tests for SelectFilter component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectFilter } from './SelectFilter';

describe('SelectFilter Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  describe('rendering', () => {
    it('should render select with options', () => {
      render(<SelectFilter value="" onChange={jest.fn()} options={mockOptions} />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should render with default placeholder option', () => {
      render(<SelectFilter value="" onChange={jest.fn()} options={mockOptions} />);
      expect(screen.getByText('Alle')).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(<SelectFilter value="" onChange={jest.fn()} options={mockOptions} placeholder="Custom" />);
      expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('should show selected value', () => {
      render(<SelectFilter value="option2" onChange={jest.fn()} options={mockOptions} />);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('option2');
    });

    it('should auto-focus select', () => {
      render(<SelectFilter value="" onChange={jest.fn()} options={mockOptions} />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveFocus();
    });
  });

  describe('interactions', () => {
    it('should call onChange when option is selected', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<SelectFilter value="" onChange={handleChange} options={mockOptions} />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'option2');

      expect(handleChange).toHaveBeenCalledWith('option2');
    });

    it('should call onChange with empty string when placeholder is selected', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<SelectFilter value="option1" onChange={handleChange} options={mockOptions} />);

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, '');

      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('should update selected value when props change', () => {
      const { rerender } = render(
        <SelectFilter value="option1" onChange={jest.fn()} options={mockOptions} />
      );
      let select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('option1');

      rerender(<SelectFilter value="option3" onChange={jest.fn()} options={mockOptions} />);
      select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('option3');
    });
  });

  describe('styling', () => {
    it('should have correct CSS classes', () => {
      render(<SelectFilter value="" onChange={jest.fn()} options={mockOptions} />);
      const select = screen.getByRole('combobox');

      expect(select).toHaveClass('input');
      expect(select).toHaveClass('px-2');
      expect(select).toHaveClass('py-1.5');
    });
  });

  describe('with empty options', () => {
    it('should render with only placeholder option', () => {
      render(<SelectFilter value="" onChange={jest.fn()} options={[]} />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(screen.getByText('Alle')).toBeInTheDocument();

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(1);
    });
  });

  describe('accessibility', () => {
    it('should have combobox role', () => {
      render(<SelectFilter value="" onChange={jest.fn()} options={mockOptions} />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should have proper option roles', () => {
      render(<SelectFilter value="" onChange={jest.fn()} options={mockOptions} />);
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(4); // 1 placeholder + 3 options
    });
  });
});
