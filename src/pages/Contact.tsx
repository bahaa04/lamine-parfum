import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLocale } from '../context/LocaleContext';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { useToastStore } from '../context/toastStore';
import { contactInfo } from '../data/siteData';

export default function Contact() {
  const { t } = useLocale();
  const addToast = useToastStore(state => state.addToast);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      addToast('error', t('common.error'));
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      addToast('success', t('common.success'));
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-obsidian bg-espresso border-b border-gold/20">
        <div className="section-padding container-luxury py-8">
          <Breadcrumbs items={[{ label: t('nav.home'), href: '/' }, { label: t('page.contact.title') }]} />
          <h1 className="font-serif text-4xl mt-6">{t('page.contact.title')}</h1>
          <p className="text-white/80 mt-2">We'd love to hear from you</p>
        </div>
      </div>

      <div className="section-padding container-luxury py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-obsidian rounded-lg p-8">
              <h2 className="font-serif text-2xl mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gold/30 rounded focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gold/30 rounded focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-2 border border-gold/30 rounded focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gold/30 rounded focus:outline-none focus:border-gold resize-none"
                  />
                </div>

                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <p className="text-xs text-ivory">
                    <strong>Demo Contact Form:</strong> This is a demonstration. Your message will not be actually sent.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-obsidian rounded-lg p-6">
              <h2 className="font-serif text-2xl mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="text-gold flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-ivory mb-1">Email</p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-white/80 hover:text-gold transition-colors text-sm"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-gold flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-ivory mb-1">Phone</p>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-white/80 hover:text-gold transition-colors text-sm"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-gold flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-medium text-ivory mb-1">Address</p>
                    <p className="text-white/80 text-sm">{contactInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-obsidian rounded-lg p-6">
              <h3 className="font-medium text-ivory mb-3">Business Hours</h3>
              <p className="text-white/80 text-sm">{contactInfo.hours}</p>
            </div>

            <div className="bg-gold/10 rounded-lg p-6">
              <h3 className="font-medium text-ivory mb-3">Quick Help</h3>
              <p className="text-white/80 text-sm mb-4">
                Looking for answers? Check our FAQ section first.
              </p>
              <a href="/faq" className="text-gold hover:text-ivory font-medium text-sm transition-colors">
                View FAQ →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
