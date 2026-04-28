import PubFooter from '@/components/home/pub-footer';
import PubTopbar from '@/components/home/pub-topbar';
import { BRANDS } from '@/components/brands';

type InfoSection = {
  title: string;
  body: string[];
};

type InfoPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: InfoSection[];
};

export default function InfoPage({ eyebrow, title, intro, sections }: InfoPageProps) {
  const brand = BRANDS.find(b => b.id === 'tagesblick')!;

  return (
    <>
      <PubTopbar brand={brand} />
      <main className="info-page">
        <div className="info-wrap">
          <p className="info-eyebrow">{eyebrow}</p>
          <h1 className="info-title">{title}</h1>
          <p className="info-intro">{intro}</p>
          <div className="info-sections">
            {sections.map(section => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.body.map(paragraph => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
      <PubFooter brand={brand} />
    </>
  );
}
