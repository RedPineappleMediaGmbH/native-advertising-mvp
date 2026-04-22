import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export const CATEGORIES = ['Wirtschaft', 'Panorama', 'Digital', 'Sport', 'Reise', 'Eilmeldung'] as const;
export type Category = typeof CATEGORIES[number];

export interface TopicSpec {
  category: Category;
  topic: string;
  angle: string;
}

export interface GeneratedArticle {
  title: string;
  dek: string;
  body: string;
}

async function claudePrompt(prompt: string, timeoutMs = 120_000): Promise<string> {
  const { stdout } = await execFileAsync(
    'claude',
    ['-p', prompt],
    { maxBuffer: 10 * 1024 * 1024, timeout: timeoutMs }
  );
  return stdout.trim();
}

export async function pickTopics(count: number, dateSeed: string): Promise<TopicSpec[]> {
  const prompt = `Du bist Redakteur bei der deutschen Online-Zeitung Tagesblick. Erzeuge ${count} plausible, aktuelle Nachrichtenthemen für heute (${dateSeed}), je eines pro Kategorie. Wähle aus: ${CATEGORIES.join(', ')}.

Regeln:
- Themen müssen plausibel klingen und aktuell wirken, aber KEINE realen Ereignisse oder reale Personen erfinden, die nicht existieren
- Jedes Thema muss eine andere Kategorie haben
- Vermeide wiederkehrende Themen wie "KI" oder "Bitcoin" es sei denn der Blickwinkel ist frisch
- Der Blickwinkel (angle) muss konkret sein, nicht generisch

Antworte ausschließlich als JSON-Array in dieser Form:
[{"category":"Wirtschaft","topic":"kurze Themenbezeichnung","angle":"konkreter journalistischer Blickwinkel in einem Satz"}]`;

  const text = await claudePrompt(prompt);
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`Topic response had no JSON array:\n${text}`);

  let parsed: unknown;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    throw new Error(`Topic response contained invalid JSON:\n${match[0]}`);
  }
  if (!Array.isArray(parsed)) throw new Error('Topic response was not a JSON array');
  const valid = (parsed as TopicSpec[]).filter(t =>
    typeof t.category === 'string' &&
    CATEGORIES.includes(t.category as Category) &&
    typeof t.topic === 'string' && t.topic &&
    typeof t.angle === 'string' && t.angle
  );
  if (valid.length === 0) throw new Error(`No valid topics in response: ${JSON.stringify(parsed)}`);
  return valid.slice(0, count);
}

export async function writeArticle(spec: TopicSpec): Promise<GeneratedArticle> {
  const prompt = `Du schreibst einen redaktionellen Artikel für die deutsche Online-Zeitung Tagesblick.

Kategorie: ${spec.category}
Thema: ${spec.topic}
Blickwinkel: ${spec.angle}

Regeln:
- Sprache: Deutsch
- Tonfall: neutral, sachlich, seriös — wie FAZ, Zeit, Tagesspiegel
- Länge: 400-600 Wörter im Fließtext (ohne Titel und Teaser)
- Struktur: Einleitungsabsatz (kein H2), dann 2-3 Zwischenüberschriften (## markdown) mit je 1-2 Absätzen
- KEINE erfundenen konkreten Zahlen, Quellen oder Zitate realer Personen. Wenn eine Aussage einer Quelle bedarf, formuliere allgemein ("Branchenbeobachter", "Marktteilnehmer")
- KEINE KI-Floskeln ("In der heutigen schnelllebigen Welt...", "Es ist wichtig zu beachten...")
- KEINE Emojis, keine Bulletpoint-Listen (außer wenn inhaltlich zwingend)

Antworte als JSON:
{
  "title": "prägnanter Titel, max. 90 Zeichen",
  "dek": "ein Satz Teaser für die Startseite, max. 140 Zeichen",
  "body": "Markdown-Fließtext mit ## Zwischenüberschriften"
}`;

  const text = await claudePrompt(prompt, 300_000);
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`Article response had no JSON:\n${text}`);

  let parsed: GeneratedArticle;
  try {
    parsed = JSON.parse(match[0]) as GeneratedArticle;
  } catch {
    throw new Error(`Article response contained invalid JSON:\n${match[0]}`);
  }
  if (!parsed.title || !parsed.dek || !parsed.body) {
    throw new Error(`Article response missing fields: ${JSON.stringify(parsed)}`);
  }
  return parsed;
}
