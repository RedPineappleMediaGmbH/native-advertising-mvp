import { describe, it, expect } from 'vitest';
import { toSlug } from './slug';

describe('toSlug', () => {
  it('lowercases and replaces spaces with dashes', () => {
    expect(toSlug('EZB hält an vorsichtiger Zinspolitik fest')).toBe('ezb-halt-an-vorsichtiger-zinspolitik-fest');
  });

  it('transliterates German umlauts', () => {
    expect(toSlug('Fünf europäische Städte Österreich')).toBe('funf-europaische-stadte-osterreich');
  });

  it('handles ß', () => {
    expect(toSlug('Weiße Straße')).toBe('weisse-strasse');
  });

  it('strips punctuation', () => {
    expect(toSlug('Bundesliga: 30. Spieltag — Favoritendämmerung')).toBe('bundesliga-30-spieltag-favoritendammerung');
  });

  it('collapses repeated dashes', () => {
    expect(toSlug('Hello --- world')).toBe('hello-world');
  });

  it('trims leading/trailing dashes', () => {
    expect(toSlug('  -Hello World-  ')).toBe('hello-world');
  });
});
