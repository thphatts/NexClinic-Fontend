import { ConceptDictionaryItem, ObsRequest } from '@/types/api';

export type ConceptFormValues = Record<number, string | number | boolean>;

export function serializeObservations(values: ConceptFormValues, concepts: ConceptDictionaryItem[]): ObsRequest[] {
  const byId = new Map(concepts.map((concept) => [concept.conceptId, concept]));
  return Object.entries(values).filter(([, value]) => value !== '').map(([id, value]) => {
    const concept = byId.get(Number(id));
    if (!concept) throw new Error(`Unknown Concept ${id}`);
    return {
      conceptId: concept.conceptId,
      valueNumeric: concept.dataType === 'NUMERIC' ? Number(value) : null,
      valueText: concept.dataType === 'TEXT' ? String(value) : null,
      valueCodedId: concept.dataType === 'CODED' ? Number(value) : null,
      valueDatetime: concept.dataType === 'DATETIME' ? String(value) : null,
      valueBoolean: concept.dataType === 'BOOLEAN' ? value === true : null,
    };
  });
}
