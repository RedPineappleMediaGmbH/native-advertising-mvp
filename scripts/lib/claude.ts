import Anthropic from '@anthropic-ai/sdk';

const CATEGORIES = ['Wirtschaft', 'Panorama', 'Digital', 'Sport', 'Reise', 'Eilmeldung'] as const;
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

function client(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');
  return new Anthropic({ apiKey });
}

const TOPIC_MODEL = process.env.ANTHROPIC_TOPIC_MODEL ?? 'claude-haiku-4-5';
const TEXT_MODEL = process.env.ANTHROPIC_TEXT_MODEL ?? 'claude-sonnet-4-6';

export async function pickTopics(count: number, dateSeed: string): Promise<TopicSpec[]> {
  const anthropic = client();
  const prompt = `Du bist Redakteur bei der deutschen Online-Zeitung Tagesblick. Erzeuge ${count} plausible, aktuelle Nachrichtenthemen für heute (${dateSeed}), je eines pro Kategorie. Wähle aus: ${CATEGORIES.join(', ')}.

Regeln:
- Themen müssen plausibel klingen und aktuell wirken, aber KEINE realen Ereignisse oder reale Personen erfinden, die nicht existieren
- Jedes Thema muss eine andere Kategorie haben
- Vermeide wiederkehrende Themen wie "KI" oder "Bitcoin" es sei denn der Blickwinkel ist frisch
- Der Blickwinkel (angle) muss konkret sein, nicht generisch

Antworte ausschließlich als JSON-Array in dieser Form:
[{"category":"Wirtschaft","topic":"kurze Themenbezeichnung","angle":"konkreter journalistischer Blickwinkel in einem Satz"}]`;

  const response = await anthropic.messages.create({
    model: TOPIC_MODEL,
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content.filter(b => b.type === 'text').map(b => (b as { text: string }).text).join('');
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`Topic response had no JSON array:\n${text}`);

  const parsed = JSON.parse(match[0]) as TopicSpec[];
  return parsed.slice(0, count);
}

export async function writeArticle(spec: TopicSpec): Promise<GeneratedArticle> {
  const anthropic = client();
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

  const response = await anthropic.messages.create({
    model: TEXT_MODEL,
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content.filter(b => b.type === 'text').map(b => (b as { text: string }).text).join('');
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`Article response had no JSON:\n${text}`);

  const parsed = JSON.parse(match[0]) as GeneratedArticle;
  if (!parsed.title || !parsed.dek || !parsed.body) {
    throw new Error(`Article response missing fields: ${JSON.stringify(parsed)}`);
  }
  return parsed;
}
