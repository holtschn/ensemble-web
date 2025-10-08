import React, { useState, useEffect } from 'react';
import { Instrumentation, toInstrumentation } from '@/next/ndb/utils/instrumentation';

interface InstrumentationEditorProps {
  value: string;
  withPercussion: boolean;
  withOrgan: boolean;
  onChange: (instrumentation: string, withPercussion: boolean, withOrgan: boolean) => void;
  disabled?: boolean;
}

const InstrumentationEditor: React.FC<InstrumentationEditorProps> = ({
  value,
  withPercussion,
  withOrgan,
  onChange,
  disabled = false,
}) => {
  const [instrumentation, setInstrumentation] = useState<Instrumentation>(() => toInstrumentation(value));

  useEffect(() => {
    setInstrumentation(toInstrumentation(value));
  }, [value]);

  const handleInstrumentChange = (newInstrumentation: Instrumentation) => {
    setInstrumentation(newInstrumentation);
    onChange(newInstrumentation.renderValue(), withPercussion, withOrgan);
  };

  const handlePercussionChange = (checked: boolean) => {
    onChange(instrumentation.renderValue(), checked, withOrgan);
  };

  const handleOrganChange = (checked: boolean) => {
    onChange(instrumentation.renderValue(), withPercussion, checked);
  };

  const handlePreset = (preset: string) => {
    const newInstrumentation = toInstrumentation(preset);
    handleInstrumentChange(newInstrumentation);
  };

  const instruments = [
    {
      label: 'Trp.',
      value: instrumentation.numTrumpets(),
      onChange: (val: number) => handleInstrumentChange(instrumentation.withTrumpets(val)),
    },
    {
      label: 'Hrn.',
      value: instrumentation.numHorns(),
      onChange: (val: number) => handleInstrumentChange(instrumentation.withHorns(val)),
    },
    {
      label: 'Pos.',
      value: instrumentation.numTrombones(),
      onChange: (val: number) => handleInstrumentChange(instrumentation.withTrombones(val)),
    },
    {
      label: 'Tub.',
      value: instrumentation.numTubas(),
      onChange: (val: number) => handleInstrumentChange(instrumentation.withTubas(val)),
    },
    {
      label: 'Euph.',
      value: instrumentation.numEuphoniums(),
      onChange: (val: number) => handleInstrumentChange(instrumentation.withEuphoniums(val)),
    },
  ];

  const presets = [
    { name: 'Quintett', value: '21101' },
    { name: 'Philip Jones', value: '41401' },
    { name: 'German Brass', value: '42301' },
    { name: 'BlechConTakt', value: '42401' },
  ];

  return (
    <div className="space-y-4 mb-4">
      {/* Instrument Number Inputs */}
      <div className="flex flex-wrap gap-4">
        {instruments.map((instrument) => (
          <div key={instrument.label} className="flex items-center gap-2">
            <label className="ndb-profex-label min-w-[3rem]">{instrument.label}</label>
            <input
              type="number"
              min="0"
              max="9"
              value={instrument.value}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                if (val >= 0 && val <= 9) {
                  instrument.onChange(val);
                }
              }}
              disabled={disabled}
              className="w-12 px-2 py-1 text-center border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed"
            />
          </div>
        ))}
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={withPercussion}
            onChange={(e) => handlePercussionChange(e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 rounded border-neutral-300 focus:ring-2 disabled:cursor-not-allowed"
            style={{ accentColor: 'var(--color-primary-500)' }}
          />
          <span className="text-sm">mit Schlagzeug</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={withOrgan}
            onChange={(e) => handleOrganChange(e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 rounded border-neutral-300 focus:ring-2 disabled:cursor-not-allowed"
            style={{ accentColor: 'var(--color-primary-500)' }}
          />
          <span className="text-sm">mit Orgel</span>
        </label>
      </div>

      {/* Preset Buttons */}
      {!disabled && (
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handlePreset(preset.value)}
              className="btn-secondary btn-sm"
            >
              {preset.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstrumentationEditor;
