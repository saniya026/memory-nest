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
        const fromApi = Array.isArray(r.data?.services) ? r.data.services : [];
        setServices(fromApi.length > 0 ? fromApi : LANDING_SERVICES);
      })
      .catch(() => setServices(LANDING_SERVICES));
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
