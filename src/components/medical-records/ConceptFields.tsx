'use client';

import { ConceptDictionaryItem } from '@/types/api';
import { ConceptFormValues } from '@/lib/observations';

export function ConceptFields({ concepts, values, onChange }: {
  concepts: ConceptDictionaryItem[];
  values: ConceptFormValues;
  onChange: (conceptId: number, value: string | number | boolean) => void;
}) {
  return <div className="grid gap-4 sm:grid-cols-2">
    {concepts.map((concept) => <label key={concept.conceptId} className="space-y-1.5 text-sm font-medium text-slate-700">
      <span>{concept.name}{concept.required && <span className="ml-1 text-rose-600">*</span>}</span>
      {concept.dataType === 'CODED' ? <select required={concept.required} value={String(values[concept.conceptId] ?? '')} onChange={(event) => onChange(concept.conceptId, Number(event.target.value))} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
        <option value="">Chọn giá trị</option>{concept.answers.map((answer) => <option key={answer.answerConceptId} value={answer.answerConceptId}>{answer.name}</option>)}
      </select> : concept.dataType === 'BOOLEAN' ? <input type="checkbox" checked={values[concept.conceptId] === true} onChange={(event) => onChange(concept.conceptId, event.target.checked)} className="h-4 w-4 accent-teal-700" /> : <div className="flex items-center gap-2">
        <input required={concept.required} type={concept.dataType === 'NUMERIC' ? 'number' : concept.dataType === 'DATETIME' ? 'datetime-local' : 'text'} min={concept.minValue ?? undefined} max={concept.maxValue ?? undefined} value={String(values[concept.conceptId] ?? '')} onChange={(event) => onChange(concept.conceptId, concept.dataType === 'NUMERIC' ? Number(event.target.value) : event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        {concept.unit && <span className="shrink-0 text-xs text-slate-500">{concept.unit}</span>}
      </div>}
      {concept.minValue != null || concept.maxValue != null ? <span className="block text-xs text-slate-400">Khoảng giá trị: {concept.minValue ?? '—'} – {concept.maxValue ?? '—'} {concept.unit || ''}</span> : null}
    </label>)}
  </div>;
}
