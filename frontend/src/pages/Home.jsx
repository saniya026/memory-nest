import { useEffect, useState } from 'react';
import api from '../api/axios';
import Hero from '../components/home/Hero';
import {
  ContactSection,
  PortfolioSection,
  PricingSection,
  ServicesSection,
  TestimonialsSection,
  LANDING_SERVICES,
} from '../components/home/HomeSections';
import ReviewsSection from '../components/reviews/ReviewsSection';
import HomeFeaturesSection from '../components/home/HomeFeaturesSection';

export default function Home() {
  const [services, setServices] = useState(LANDING_SERVICES);

  useEffect(() => {
    api
      .get('/services')
      .then((r) => {
        if (r.data.services?.length) setServices(r.data.services);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <Hero />
      <HomeFeaturesSection />
      <ServicesSection services={services} />
      <PortfolioSection />
      <TestimonialsSection />
      <ReviewsSection />
      <PricingSection />
      <ContactSection />
    </>
  );
}
