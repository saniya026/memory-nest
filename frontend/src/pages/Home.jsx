import { useEffect, useState } from 'react';
import api from '../api/axios';
import Hero from '../components/home/Hero';
import { ServicesSection } from '../components/home/HomeSections'; // ✅ LANDING_SERVICES hataya
import ReviewsSection from '../components/reviews/ReviewsSection';
import HomeFeaturesSection from '../components/home/HomeFeaturesSection';

export default function Home() {
  const [services, setServices] = useState([]); // ✅ Empty array se start

  useEffect(() => {
    api
      .get('/services')
      .then((r) => {
        const fromApi = Array.isArray(r.data?.services) ? r.data.services : [];
        setServices(fromApi); // ✅ Sirf API data, koi fallback nahi
      })
      .catch(() => setServices([])); // ✅ Error pe bhi empty
  }, []);

  return (
    <>
      <Hero />
      <HomeFeaturesSection />
      <ServicesSection services={services} />
      <ReviewsSection />
    </>
  );
}