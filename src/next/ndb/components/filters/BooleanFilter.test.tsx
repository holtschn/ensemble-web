/**
 * Tests for BooleanFilter component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BooleanFilter } from './BooleanFilter';

describe('BooleanFilter Component', () => {
  describe('rendering', () => {
    it('should render with default labels', () => {
      render(<BooleanFilter value={true} onChange={jest.fn()} />);

      expect(screen.getByText('Ja')).toBeInTheDocument();
      expect(screen.getByText('Nein')).toBeInTheDocument();
    });

    it('should render with custom labels', () => {
      render(<BooleanFilter value={true} onChange={jest.fn()} trueLabel="Vorhanden" falseLabel="Nicht vorhanden" />);

      expect(screen.getByText('Vorhanden')).toBeInTheDocument();
      expect(screen.getByText('Nicht vorhanden')).toBeInTheDocument();
    });

    it('should render two radio buttons', () => {
      render(<BooleanFilter value={true} onChange={jest.fn()} />);

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(2);
    });

    it('should check true radio when value is true', () => {
      render(<BooleanFilter value={true} onChange={jest.fn()} />);

      const radios = screen.getAllByRole('radio');
      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });

    it('should check false radio when value is false', () => {
      render(<BooleanFilter value={false} onChange={jest.fn()} />);

      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
    });

    it('should have no radio checked when value is null', () => {
      render(<BooleanFilter value={null as any} onChange={jest.fn()} />);

      const radios = screen.getAllByRole('radio');
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });
  });

  describe('interactions', () => {
    it('should call onChange with true when true option is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<BooleanFilter value={false} onChange={handleChange} />);

      const trueRadio = screen.getAllByRole('radio')[0];
      await user.click(trueRadio);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should call onChange with false when false option is clicked', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<BooleanFilter value={true} onChange={handleChange} />);

      const falseRadio = screen.getAllByRole('radio')[1];
      await user.click(falseRadio);

      expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('should allow clicking on labels', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<BooleanFilter value={false} onChange={handleChange} />);

      const trueLabel = screen.getByText('Ja');
      await user.click(trueLabel);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should update when value prop changes', () => {
      const { rerender } = render(<BooleanFilter value={true} onChange={jest.fn()} />);

      let radios = screen.getAllByRole('radio');
      expect(radios[0]).toBeChecked();

      rerender(<BooleanFilter value={false} onChange={jest.fn()} />);

      radios = screen.getAllByRole('radio');
      expect(radios[1]).toBeChecked();
    });
  });

  describe('styling', () => {
    it('should have correct spacing classes', () => {
      const { container } = render(<BooleanFilter value={true} onChange={jest.fn()} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('space-y-2');
    });

    it('should have cursor-pointer on labels', () => {
      const { container } = render(<BooleanFilter value={true} onChange={jest.fn()} />);

      const labels = container.querySelectorAll('label');
      labels.forEach((label) => {
        expect(label).toHaveClass('cursor-pointer');
      });
    });

    it('should have correct radio button size', () => {
      render(<BooleanFilter value={true} onChange={jest.fn()} />);

      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toHaveClass('w-4');
        expect(radio).toHaveClass('h-4');
      });
    });
  });

  describe('accessibility', () => {
    it('should have radio role for inputs', () => {
      render(<BooleanFilter value={true} onChange={jest.fn()} />);

      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(2);
    });

    it('should associate labels with radio buttons', () => {
      render(<BooleanFilter value={true} onChange={jest.fn()} />);

      const trueLabel = screen.getByText('Ja').closest('label');
      const falseLabel = screen.getByText('Nein').closest('label');

      expect(trueLabel).toBeInTheDocument();
      expect(falseLabel).toBeInTheDocument();

      expect(trueLabel?.querySelector('input[type="radio"]')).toBeInTheDocument();
      expect(falseLabel?.querySelector('input[type="radio"]')).toBeInTheDocument();
    });
  });
});
