import type { Case } from '../data/cases.ts';

/** Preserve editorial order and leave the supplied collection untouched. */
export function casesForItem(cases: readonly Case[], itemName: string): Case[] {
  return cases.filter((purchaseCase) => purchaseCase.item === itemName);
}
