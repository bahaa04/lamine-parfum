import { Link } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SectionHeading from '../components/ui/SectionHeading';
import { aboutContent } from '../data/siteData';

export default function About() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-obsidian bg-espresso border-b border-gold/20">
        <div className="section-padding container-luxury py-8">
          <Breadcrumbs items={[{ label: t('nav.home'), href: '/' }, { label: t('page.about.title') }]} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="section-padding container-luxury py-16">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading
            title={aboutContent.title}
            subtitle={aboutContent.subtitle}
            align="center"
          />
        </div>
      </div>

      {/* Story */}
      <div className="section-padding container-luxury pb-16">
        <div className="max-w-3xl mx-auto space-y-6 text-white/80 leading-relaxed">
          {aboutContent.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Philosophy */}
      <div className="bg-espresso text-white py-16">
        <div className="section-padding container-luxury">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl mb-6">{t('page.about.philosophy')}</h2>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              {aboutContent.philosophy}
            </p>
            <Link to="/brands" className="btn-gold">
              {t('page.about.discoverBrands')}
            </Link>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="section-padding container-luxury py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl text-center mb-12">{t('page.about.whyChoose')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-2xl text-gold">1</span>
              </div>
              <h3 className="font-serif text-xl mb-3">{t('page.about.curatedSelection')}</h3>
              <p className="text-white/80 text-sm">
                {t('page.about.curatedDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-2xl text-gold">2</span>
              </div>
              <h3 className="font-serif text-xl mb-3">{t('page.about.expertGuidance')}</h3>
              <p className="text-white/80 text-sm">
                {t('page.about.expertDesc')}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="font-serif text-2xl text-gold">3</span>
              </div>
              <h3 className="font-serif text-xl mb-3">{t('page.about.luxuryExperience')}</h3>
              <p className="text-white/80 text-sm">
                {t('page.about.luxuryDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-espresso py-16">
        <div className="section-padding container-luxury text-center">
          <h2 className="font-serif text-3xl mb-4">{t('page.about.startJourney')}</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            {t('page.about.journeyDesc')}
          </p>
          <Link to="/shop" className="btn-primary">
            {t('common.shopNow')}
          </Link>
        </div>
      </div>
    </div>
  );
}
