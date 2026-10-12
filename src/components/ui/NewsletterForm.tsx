import { useState } from 'react';
import { useToastStore } from '../../context/toastStore';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const addToast = useToastStore(state => state.addToast);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      addToast('error', 'Please enter a valid email address');
      return;
    }

    // Mock submission
    setIsSubmitted(true);
    addToast('success', 'Thank you for subscribing to our newsletter!');

    setTimeout(() => {
      setEmail('');
      setIsSubmitted(false);
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-4">
        <p className="text-gold font-medium">Thank you for subscribing!</p>
        <p className="text-white/60 text-sm mt-1">Check your inbox for exclusive offers.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-white/80 text-sm">
        Subscribe to receive updates on new arrivals and exclusive offers
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 px-4 py-2 rounded text-sm text-ivory focus:outline-none focus:ring-2 focus:ring-gold"
          required
        />
        <button
          type="submit"
          className="btn-gold whitespace-nowrap"
        >
          Subscribe
        </button>
      </div>
    </form>
  );
}
