import React, { useState, useEffect } from 'react';

import { ScoreItem, ScoreItemWithUploads } from '@/next/ndb/types';
import { FIELD_LABELS, GENRE_CHOICES, DIFFICULTY_CHOICES, DEFAULT_INSTRUMENTATION } from '@/next/ndb/constants';
import { Instrumentation, toInstrumentation } from '@/next/ndb/utils/instrumentation';

import TextField from '@/next/ndb/components/TextField';
import TextAreaField from '@/next/ndb/components/TextAreaField';
import SelectField from '@/next/ndb/components/SelectField';
import Icon from '@/next/ndb/components/Icon';

interface ScoreEditFormProps {
  score: ScoreItem | null;
  onSave: (scoreData: ScoreItemWithUploads) => Promise<void>;
  isSaving: boolean;
  onHasChanges: (hasChanges: boolean) => void;
  submitRef: React.MutableRefObject<(() => void) | null>;
}

const DetailRow: React.FC<{ label: string; children: React.ReactNode; fullWidth?: boolean }> = ({
  label,
  children,
  fullWidth = false,
}) => {
  if (fullWidth) {
    return (
      <>
        <dt className="mt-4 col-span-full ndb-profex-label">{label}</dt>
        <dd className="mb-4 col-span-full">{children}</dd>
      </>
    );
  }
  return (
    <>
      <dt className="mt-1 ndb-profex-label">{label}</dt>
      <dd className="mb-4">{children}</dd>
    </>
  );
};

const InstrumentationDisplay: React.FC<{
  instrumentation: Instrumentation;
  withPercussion: boolean;
  withOrgan: boolean;
}> = ({ instrumentation, withPercussion, withOrgan }) => {
  const instruments = [
    { label: 'Trp.', count: instrumentation.numTrumpets() },
    { label: 'Hrn.', count: instrumentation.numHorns() },
    { label: 'Pos.', count: instrumentation.numTrombones() },
    { label: 'Tub.', count: instrumentation.numTubas() },
    { label: 'Euph.', count: instrumentation.numEuphoniums() },
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {instruments
          .filter((inst) => inst.count > 0)
          .map((inst) => (
            <div key={inst.label} className="flex items-baseline gap-1">
              <span>{inst.count}</span>
              <span className="ndb-profex-label">{inst.label}</span>
            </div>
          ))}
      </div>
      <div className="flex flex-wrap gap-x-4">
        <div className="flex items-center gap-1.5">
          {withPercussion ? (
            <Icon name="check" alt="Ja" className="h-4 w-4" />
          ) : (
            <Icon name="cross" alt="Nein" className="h-4 w-4" />
          )}
          <span className="ndb-profex-label">Percussion</span>
        </div>
        <div className="flex items-center gap-1.5">
          {withOrgan ? <Icon name="check" alt="Ja" className="h-4 w-4" /> : <Icon name="cross" alt="Nein" className="h-4 w-4" />}
          <span className="ndb-profex-label">Orgel</span>
        </div>
      </div>
    </div>
  );
};

const ScoreEditForm: React.FC<ScoreEditFormProps> = ({ score, onSave, isSaving, onHasChanges, submitRef }) => {
  // Initialize form state with default values or existing score data
  const [formData, setFormData] = useState<ScoreItemWithUploads>(() => ({
    id: score?.id ?? 0,
    title: score?.title ?? '',
    composer: score?.composer ?? '',
    arranger: score?.arranger ?? '',
    genre: score?.genre ?? '',
    publisher: score?.publisher ?? '',
    difficulty: score?.difficulty ?? '',
    instrumentation: score?.instrumentation ?? DEFAULT_INSTRUMENTATION,
    withOrgan: score?.withOrgan ?? false,
    withPercussion: score?.withPercussion ?? false,
    comment: score?.comment ?? '',
    moderation: score?.moderation ?? '',
    parts: score?.parts ?? null,
    fullScore: score?.fullScore ?? null,
    audioMidi: score?.audioMidi ?? null,
    audioMp3: score?.audioMp3 ?? null,
    partsUploadS3Key: null,
    fullScoreUploadS3Key: null,
    audioMidiUploadS3Key: null,
    audioMp3UploadS3Key: null,
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Update form data when score prop changes
  useEffect(() => {
    if (score) {
      setFormData({
        id: score.id,
        title: score.title,
        composer: score.composer,
        arranger: score.arranger ?? '',
        genre: score.genre ?? '',
        publisher: score.publisher ?? '',
        difficulty: score.difficulty ?? '',
        instrumentation: score.instrumentation,
        withOrgan: score.withOrgan,
        withPercussion: score.withPercussion,
        comment: score.comment ?? '',
        moderation: score.moderation ?? '',
        parts: score.parts,
        fullScore: score.fullScore,
        audioMidi: score.audioMidi,
        audioMp3: score.audioMp3,
        partsUploadS3Key: null,
        fullScoreUploadS3Key: null,
        audioMidiUploadS3Key: null,
        audioMp3UploadS3Key: null,
      });
      setHasChanges(false);
      onHasChanges(false);
    }
  }, [score, onHasChanges]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const newHasChanges = true;
    setHasChanges(newHasChanges);
    onHasChanges(newHasChanges);
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Titel ist erforderlich';
    }
    if (!formData.composer?.trim()) {
      newErrors.composer = 'Komponist ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validate()) {
      await onSave(formData);
    }
  };

  // Expose submit function to parent via ref
  React.useEffect(() => {
    submitRef.current = () => handleSubmit();
  }, [formData, submitRef]);

  const instrumentation = toInstrumentation(formData.instrumentation);

  return (
    <form onSubmit={handleSubmit}>
      <dl className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-x-4 gap-y-0">
        <DetailRow label={FIELD_LABELS.title}>
          <TextField
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
            disabled={isSaving}
            placeholder="Titel der Komposition"
          />
        </DetailRow>

        <DetailRow label={FIELD_LABELS.composer}>
          <TextField
            name="composer"
            value={formData.composer}
            onChange={handleChange}
            error={errors.composer}
            required
            disabled={isSaving}
            placeholder="Name des Komponisten"
          />
        </DetailRow>

        <DetailRow label={FIELD_LABELS.arranger}>
          <TextField
            name="arranger"
            value={formData.arranger ?? ''}
            onChange={handleChange}
            disabled={isSaving}
            placeholder="Name des Arrangeurs (optional)"
          />
        </DetailRow>

        <DetailRow label={FIELD_LABELS.instrumentation}>
          {/* TODO: Replace with InstrumentationEditor component */}
          <InstrumentationDisplay
            instrumentation={instrumentation}
            withPercussion={formData.withPercussion}
            withOrgan={formData.withOrgan}
          />
        </DetailRow>

        <DetailRow label={FIELD_LABELS.genre}>
          <SelectField
            name="genre"
            value={formData.genre ?? ''}
            onChange={handleChange}
            options={GENRE_CHOICES}
            disabled={isSaving}
          />
        </DetailRow>

        <DetailRow label={FIELD_LABELS.publisher}>
          <TextField
            name="publisher"
            value={formData.publisher ?? ''}
            onChange={handleChange}
            disabled={isSaving}
            placeholder="Verlagsname (optional)"
          />
        </DetailRow>

        <DetailRow label={FIELD_LABELS.difficulty}>
          <SelectField
            name="difficulty"
            value={formData.difficulty ?? ''}
            onChange={handleChange}
            options={DIFFICULTY_CHOICES}
            disabled={isSaving}
          />
        </DetailRow>

        <DetailRow label={FIELD_LABELS.comment} fullWidth>
          <TextAreaField
            name="comment"
            value={formData.comment ?? ''}
            onChange={handleChange}
            disabled={isSaving}
            placeholder="Kommentare oder Anmerkungen (optional)"
            rows={3}
          />
        </DetailRow>

        <DetailRow label={FIELD_LABELS.moderation} fullWidth>
          <TextAreaField
            name="moderation"
            value={formData.moderation ?? ''}
            onChange={handleChange}
            disabled={isSaving}
            placeholder="Moderationstext (optional)"
            rows={3}
          />
        </DetailRow>
      </dl>

      {hasChanges && (
        <div className="mt-4 p-3 rounded-md bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Sie haben ungespeicherte Änderungen. Bitte speichern oder verwerfen Sie diese.
          </p>
        </div>
      )}
    </form>
  );
};

export default ScoreEditForm;
