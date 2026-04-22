const UMLAUT_MAP: Record<string, string> = {
  ä: 'a', ö: 'o', ü: 'u', Ä: 'a', Ö: 'o', Ü: 'u', ß: 'ss',
};

export function toSlug(input: string): string {
  const transliterated = input
    .split('')
    .map(c => UMLAUT_MAP[c] ?? c)
    .join('');

  return transliterated
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
