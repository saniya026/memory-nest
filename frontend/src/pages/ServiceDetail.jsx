import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import CustomizeForm from '../components/CustomizeForm';
import toast from 'react-hot-toast';

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/services/${id}`)
    .then(res => {
        setService(res.data);
        setLoading(false);
      })
    .catch(() => {
        toast.error('Service not found');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!service) return <div className="text-center p-10">Service not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <img
            src={service.image || service.thumbnail}
            alt={service.title}
            className="rounded-xl w-full"
          />
          <h1 className="mt-4 text-3xl font-bold">{service.title}</h1>
          <p className="mt-2 text-gray-600">{service.description || service.category}</p>
          <p className="mt-4 text-2xl font-bold text-rose-500">₹{service.price}</p>
        </div>

        <CustomizeForm service={service} />
      </div>
    </div>
  );
}