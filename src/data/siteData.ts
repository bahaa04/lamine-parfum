import type { AnnouncementMessage, FragranceFamily, Testimonial } from '../types';

export const announcements: AnnouncementMessage[] = [
  { id: '1', text: 'Complimentary delivery on orders over €100' },
  { id: '2', text: 'Discover your signature scent — New arrivals available' },
  { id: '3', text: 'Use code WELCOME10 for 10% off your first order' },
];

export const fragranceFamilies: FragranceFamily[] = [
  {
    name: 'Woody',
    slug: 'woody',
    description:
      'Warm, earthy scents built around sandalwood, cedar, and vetiver that evoke the quiet strength of ancient forests.',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600',
  },
  {
    name: 'Oud',
    slug: 'oud',
    description:
      'Deep, resinous, and richly complex, oud-based fragrances carry the mystique of the Middle East and centuries of aromatic tradition.',
    image: 'https://images.unsplash.com/photo-1594035910387-fbe960c898e8?w=600',
  },
  {
    name: 'Amber',
    slug: 'amber',
    description:
      'Velvety blends of labdanum, benzoin, and vanilla that wrap the wearer in a warm, sensual embrace perfect for evening wear.',
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600',
  },
  {
    name: 'Fresh',
    slug: 'fresh',
    description:
      'Crisp, clean compositions featuring green leaves, aquatic notes, and cool herbs that capture the feeling of a morning breeze.',
    image: 'https://images.unsplash.com/photo-1495543020956-4a3e6e070431?w=600',
  },
  {
    name: 'Floral',
    slug: 'floral',
    description:
      'Elegant arrangements of rose, jasmine, iris, and tuberose that range from airy and romantic to lush and intoxicating.',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600',
  },
  {
    name: 'Citrus',
    slug: 'citrus',
    description:
      'Bright, effervescent openings of bergamot, lemon, and grapefruit that deliver instant energy and an uplifting sense of joy.',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600',
  },
  {
    name: 'Oriental',
    slug: 'oriental',
    description:
      'Exotic, spice-laden blends of cinnamon, cardamom, incense, and precious resins that create an aura of mystery and allure.',
    image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=600',
  },
  {
    name: 'Aromatic',
    slug: 'aromatic',
    description:
      'Herbaceous compositions featuring lavender, rosemary, sage, and thyme that bring a refined, Mediterranean sophistication to any occasion.',
    image: 'https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=600',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Isabelle M.',
    text: "I ordered Baccarat Rouge 540 as a birthday gift to myself and it exceeded every expectation. The packaging was immaculate, and the scent is absolutely mesmerising — sweet, woody, and unlike anything I have ever worn. I receive compliments everywhere I go. LAMINE PARFUM made the whole experience feel truly special.",
    rating: 5,
    product: 'Baccarat Rouge 540',
  },
  {
    id: 'testimonial-2',
    name: 'Thomas L.',
    text: 'Sauvage Elixir has become my everyday signature. The concentration is perfect — just two sprays last well into the next morning. Delivery was fast, the bottle arrived in beautiful gift-ready packaging, and the price was better than what I found anywhere on the high street. Will definitely be ordering again.',
    rating: 5,
    product: 'Sauvage Elixir',
  },
  {
    id: 'testimonial-3',
    name: 'Amélie D.',
    text: "I was nervous about buying fragrance online without testing it first, but the detailed scent descriptions on the site were so accurate that I felt confident choosing Libre. It smells exactly as described — warm, bold lavender with creamy vanilla — and it is now firmly in my top three. Wonderful customer service too; they answered all my questions within an hour.",
    rating: 4,
    product: 'Libre Eau de Parfum',
  },
  {
    id: 'testimonial-4',
    name: 'James W.',
    text: "I have been collecting niche fragrances for over a decade, and LAMINE PARFUM is by far the most trustworthy online retailer I have used in Europe. Every bottle is guaranteed authentic, the selection rivals any department store, and the loyalty programme has saved me hundreds. My latest purchase — Aventus — arrived in perfect condition.",
    rating: 5,
    product: 'Aventus',
  },
  {
    id: 'testimonial-5',
    name: 'Sofia R.',
    text: 'I picked up Santal 33 after reading so many glowing reviews, and I can see why it has a cult following. The smoky, leathery drydown is incredibly addictive. Shipping to Milan took only three days, and the complimentary samples they included were a lovely touch — one of them might be my next full bottle.',
    rating: 5,
    product: 'Santal 33',
  },
  {
    id: 'testimonial-6',
    name: 'Marc B.',
    text: "This was my first time shopping here and I could not be happier. I ordered the 100 ml Bleu de Chanel Parfum during the weekend sale and saved quite a bit compared to the boutique price. The site is elegant and easy to navigate, checkout was smooth, and the fragrance itself is pure class — versatile enough for the office yet refined enough for a formal dinner.",
    rating: 4,
    product: 'Bleu de Chanel Parfum',
  },
];

export const heroData = {
  headline: 'A Fragrance That Defines You',
  subheadline:
    "Discover exceptional fragrances from the world's finest perfume houses. Each scent, a masterpiece of artistry and emotion.",
  primaryCta: 'Explore the Collection',
  secondaryCta: 'Discover Our Bestsellers',
  image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1600',
};

export const aboutContent = {
  title: 'The Art of Fragrance',
  subtitle: 'Our Story',
  paragraphs: [
    'At LAMINE PARFUM, we believe that fragrance is the most intimate form of self-expression. A single scent can transport you to a sun-drenched terrace on the Amalfi Coast, a midnight garden in Marrakech, or a rain-soaked forest in Kyoto. Since our founding in Paris, we have dedicated ourselves to curating the world’s most extraordinary perfumes and making them accessible to discerning enthusiasts everywhere.',
    'Our journey began with a simple conviction: that every person deserves to find a fragrance that feels uniquely their own. We partner directly with the most revered perfume houses — from the heritage ateliers of Grasse to visionary independent creators in New York and beyond — to bring you an unparalleled selection of authentic, luxury scents.',
    'Every fragrance in our collection is chosen by our team of experts, each with decades of experience in the world of fine perfumery. We evaluate hundreds of compositions each season, but only those that demonstrate exceptional quality, originality, and emotional resonance earn a place on our shelves. When you shop with us, you can trust that every bottle is 100 percent genuine and sourced through authorised channels.',
    'Beyond commerce, we see ourselves as storytellers. Each product page is a window into the art, history, and craft behind the scent — the rare ingredients, the creative vision of the perfumer, and the emotions the fragrance is designed to evoke. We want you to feel the same wonder opening a package from LAMINE PARFUM as you would stepping into the grandest perfumery on the Champs-Élysées.',
  ],
  philosophy:
    'We curate only the finest fragrances from houses that share our passion for craftsmanship, sustainability, and emotional storytelling. Every scent in our collection has been personally evaluated and approved by our in-house panel, ensuring that what reaches you is nothing short of extraordinary.',
  values: [
    {
      title: 'Authenticity',
      description:
        'Every fragrance is sourced directly from authorised distributors. We guarantee that each product is genuine, sealed, and stored under optimal conditions.',
    },
    {
      title: 'Expertise',
      description:
        'Our team includes certified fragrance professionals who guide our curation and are always available to help you discover your perfect scent.',
    },
    {
      title: 'Sustainability',
      description:
        'We prioritise houses that champion responsible sourcing and eco-conscious production, and our own packaging is made entirely from recyclable materials.',
    },
  ],
};

export const faqItems = [
  {
    question: 'How do I choose the right fragrance?',
    answer:
      'Choosing a fragrance is a deeply personal journey. Start by identifying the scent families you are naturally drawn to — woody, floral, fresh, or oriental. Consider the occasions you will wear it for and the seasons you prefer. Our product pages include detailed note breakdowns and occasion recommendations to help narrow your search. If you are still unsure, our customer service team offers personalised consultations and can suggest options based on your preferences.',
  },
  {
    question: 'What is the difference between Eau de Toilette, Eau de Parfum, and Parfum?',
    answer:
      'The main difference lies in the concentration of fragrance oils. Eau de Toilette (EDT) typically contains 5–15% oils, offering a lighter scent that lasts 3–5 hours. Eau de Parfum (EDP) contains 15–20% oils and lasts 5–8 hours, striking a balance between longevity and projection. Parfum (or Extrait de Parfum) contains 20–40% oils, delivering the richest, longest-lasting experience — often 10 hours or more. Higher concentrations tend to sit closer to the skin, creating a more intimate scent bubble.',
  },
  {
    question: 'What sizes are available?',
    answer:
      'Most fragrances in our collection are available in multiple sizes to suit different needs. Common options include 30 ml (ideal for travel or trying a new scent), 50 ml (our most popular choice for everyday wear), and 100 ml (best value per millilitre for a signature scent you love). Some houses also offer 75 ml, 125 ml, or 200 ml formats. The available sizes are listed on each product page with their corresponding prices.',
  },
  {
    question: 'How does shipping and delivery work?',
    answer:
      'We offer complimentary standard delivery on all orders over €100. Standard shipping within the EU typically takes 3–5 business days. Express delivery (1–2 business days) is available for a flat fee of €9.95. All packages are carefully wrapped in our signature packaging to ensure your fragrance arrives in perfect condition. International shipping outside the EU is available to select countries — please refer to our shipping page for rates and estimated delivery times.',
  },
  {
    question: 'What is your returns and exchanges policy?',
    answer:
      'We want you to be completely satisfied with your purchase. Unopened and sealed products may be returned within 30 days of delivery for a full refund. If a product arrives damaged or is not as described, please contact us within 48 hours and we will arrange a free replacement or refund. For hygiene reasons, we are unable to accept returns on fragrances that have been opened or used. Please include your order number and photos of the item when contacting our support team.',
  },
  {
    question: 'How can I track my order?',
    answer:
      'Once your order has been dispatched, you will receive a confirmation email containing your tracking number and a link to the carrier’s tracking page. You can also log in to your account on our website and view real-time tracking updates under “My Orders.” If your tracking information has not updated within 48 hours of receiving the dispatch notification, please reach out to our customer service team and we will investigate immediately.',
  },
  {
    question: 'How do I contact customer support?',
    answer:
      'Our customer support team is available Monday to Saturday from 10:00 to 19:00 (CET). You can reach us by phone at 07 82 54 55 18 For urgent matters.',
  },
  {
    question: 'How should I store my fragrances?',
    answer:
      'To preserve the quality of your fragrance, store it in a cool, dry place away from direct sunlight and extreme temperature fluctuations. A bedroom drawer or a closed cabinet is ideal. Avoid keeping perfumes in the bathroom, as heat and humidity can degrade the composition over time. When stored properly, most fragrances maintain their quality for three to five years, though richer, amber-based scents can age beautifully for even longer.',
  },
  {
    question: 'Do you offer gift wrapping and gift options?',
    answer:
      'Absolutely. We offer complimentary gift wrapping on all orders — simply select the gift wrap option at checkout. Each gift order is presented in our signature matte-black box with a hand-tied ribbon and a personalised message card. We also offer curated gift sets throughout the year, featuring bestselling fragrances paired with travel-size companions, making them the perfect present for any occasion.',
  },
  {
    question: 'Are all products on the site authentic?',
    answer:
      'Yes, without exception. Every fragrance sold on LAMINE PARFUM is 100% authentic and sourced exclusively through authorised channels. We work directly with brands and their official distributors to guarantee the provenance and quality of every product. We never sell grey-market, counterfeit, or unverified stock. Your trust is the foundation of our business, and we take authenticity extremely seriously.',
  },
];

export const contactInfo = {
  email: 'contact@lamineparfum.dz',
  phone: '+213 782 545 518',
  address: 'Algiers, Algeria',
  hours: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
};
