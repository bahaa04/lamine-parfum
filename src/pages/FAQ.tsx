import { useLocale } from '../context/LocaleContext';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Accordion from '../components/ui/Accordion';
import { faqItems } from '../data/siteData';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const { t } = useLocale();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-obsidian bg-espresso border-b border-gold/20">
        <div className="section-padding container-luxury py-8">
          <Breadcrumbs items={[{ label: t('nav.home'), href: '/' }, { label: t('page.faq.title') }]} />
          <h1 className="font-serif text-4xl mt-6">{t('page.faq.title')}</h1>
          <p className="text-white/80 mt-2">Find answers to common questions</p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="section-padding container-luxury py-16">
        <div className="max-w-3xl mx-auto">
          <Accordion items={faqItems.map(item => ({
            title: item.question,
            content: item.answer
          }))} />

          {/* Contact CTA */}
          <div className="mt-12 bg-espresso rounded-lg p-8 text-center">
            <h3 className="font-serif text-2xl mb-3">Still Have Questions?</h3>
            <p className="text-white/80 mb-6">
              Our customer service team is here to help
            </p>
            <Link to="/contact" className="btn-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
