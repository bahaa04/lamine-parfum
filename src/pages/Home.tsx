import { Link } from 'react-router-dom';
import { heroData, fragranceFamilies, testimonials } from '../data/siteData';
import { getBestsellers, getNewArrivals } from '../data/products';
import { getFeaturedBrands } from '../data/brands';
import { useLocale } from '../context/LocaleContext';
import SectionHeading from '../components/ui/SectionHeading';
import ProductGrid from '../components/product/ProductGrid';
import BrandCard from '../components/ui/BrandCard';

export default function Home() {
  const { t } = useLocale();
  const bestsellers = getBestsellers().slice(0, 8);
  const newArrivals = getNewArrivals().slice(0, 4);
  const featuredBrands = getFeaturedBrands().slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroData.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/50 to-obsidian/70" />
        <div className="container-luxury relative z-10 text-center text-white px-4">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            {t('page.home.hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            {t('page.home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="btn-primary px-8 py-4 text-base md:text-lg"
            >
              {t('common.shopNow')}
            </Link>
            <a
              href="#bestsellers"
              className="btn-secondary px-8 py-4 text-base md:text-lg bg-obsidian/10 border-white text-white hover:bg-obsidian hover:text-ivory"
            >
              {t('common.explore')}
            </a>
          </div>
        </div>
      </section>

      {/* Shop by Collection */}
      <section className="section-padding bg-espresso py-16">
        <div className="container-luxury">
          <SectionHeading
            title={t('page.home.shopCollection')}
            subtitle={t('page.home.shopCollection.subtitle')}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                title: t('page.home.menFragrances'),
                link: '/collections/men',
                image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800',
              },
              {
                title: t('page.home.womenFragrances'),
                link: '/collections/women',
                image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800',
              },
              {
                title: t('page.home.unisexFragrances'),
                link: '/collections/unisex',
                image: 'https://images.unsplash.com/photo-1594035910387-fea081ae7aec?w=800',
              },
            ].map((collection) => (
              <Link
                key={collection.link}
                to={collection.link}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/5] relative">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-serif text-2xl md:text-3xl mb-2">
                      {collection.title}
                    </h3>
                    <span className="inline-flex items-center text-gold hover:text-gold/80 transition-colors">
                      {t('common.shopNow')}
                      <svg
                        className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="section-padding bg-obsidian">
        <div className="container-luxury">
          <SectionHeading
            title={t('page.home.featuredBrands')}
            subtitle="Discover the world's most prestigious perfume houses"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {featuredBrands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/brands" className="btn-secondary">
              {t('common.shopAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section id="bestsellers" className="section-padding bg-espresso">
        <div className="container-luxury">
          <SectionHeading
            title={t('page.home.bestsellers')}
            subtitle="The most-loved fragrances, chosen by our community"
          />
          <div className="mt-12">
            <ProductGrid products={bestsellers} columns={4} />
          </div>
          <div className="text-center mt-10">
            <Link to="/shop" className="btn-primary">
              {t('common.shopAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section-padding bg-obsidian">
        <div className="container-luxury">
          <SectionHeading
            title={t('page.home.newArrivals')}
            subtitle="Explore the latest additions to our curated collection"
          />
          <div className="mt-12">
            <ProductGrid products={newArrivals} columns={4} />
          </div>
          <div className="text-center mt-10">
            <Link to="/shop?filter=new" className="btn-secondary">
              {t('common.explore')}
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="section-padding bg-espresso text-white">
        <div className="container-luxury text-center max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl mb-6">
            The Art of Niche Perfumery
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
          <p className="text-lg md:text-xl text-white/90 mb-4 leading-relaxed">
            Beyond mainstream fragrance lies a world of artisanal craftsmanship, rare
            ingredients, and uncompromising vision. Niche perfumery is where creativity
            knows no bounds and each bottle tells a story as unique as the person who
            wears it.
          </p>
          <p className="text-base md:text-lg text-white/80 mb-8 leading-relaxed">
            We partner with the world's most respected independent perfume houses —
            from the storied ateliers of Grasse to visionary creators in New York,
            Stockholm, and beyond — to bring you fragrances that transcend trends and
            speak directly to the soul.
          </p>
          <Link to="/brands" className="btn-secondary bg-obsidian text-espresso hover:bg-gold hover:text-ivory border-white">
            Explore Niche Brands
          </Link>
        </div>
      </section>

      {/* Shop by Fragrance Family */}
      <section className="section-padding bg-espresso">
        <div className="container-luxury">
          <SectionHeading
            title="Shop by Fragrance Family"
            subtitle="Find your signature scent by exploring the notes that resonate with you"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {fragranceFamilies.map((family) => (
              <Link
                key={family.slug}
                to={`/shop?family=${family.slug}`}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={family.image}
                    alt={family.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h3 className="font-serif text-xl md:text-2xl mb-1 group-hover:text-gold transition-colors">
                      {family.name}
                    </h3>
                    <p className="text-sm text-white/80 line-clamp-2">
                      {family.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="section-padding bg-obsidian">
        <div className="container-luxury max-w-3xl mx-auto text-center">
          <SectionHeading
            title="LAMINE PARFUM"
            subtitle="Where Passion Meets Perfumery"
          />
          <div className="mt-8 space-y-4 text-white/80 leading-relaxed text-base md:text-lg">
            <p>
              At LAMINE PARFUM, we believe that fragrance is the most intimate form of
              self-expression. A single scent can transport you to a sun-drenched
              terrace on the Amalfi Coast, a midnight garden in Marrakech, or a
              rain-soaked forest in Kyoto.
            </p>
            <p>
              Since our founding in Paris, we have dedicated ourselves to curating the
              world's most extraordinary perfumes and making them accessible to
              discerning enthusiasts everywhere. Every fragrance in our collection is
              chosen by our team of experts, each with decades of experience in the
              world of fine perfumery.
            </p>
            <p className="text-ivory font-semibold">
              When you shop with us, you can trust that every bottle is 100% genuine and
              sourced through authorised channels.
            </p>
          </div>
          <div className="mt-10">
            <Link to="/about" className="btn-primary">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-espresso">
        <div className="container-luxury">
          <SectionHeading
            title="What Our Customers Say"
            subtitle="Trusted by fragrance lovers across Europe"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-obsidian rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={index}
                      className={`w-5 h-5 ${
                        index < testimonial.rating
                          ? 'text-gold fill-current'
                          : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/80 italic mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-gold/20 pt-4">
                  <p className="font-semibold text-ivory">{testimonial.name}</p>
                  <p className="text-sm text-white/80/80">{testimonial.product}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
