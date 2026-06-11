import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

export default function CustomizeForm({ service }) {
  const [photos, setPhotos] = useState([]);
  const [style, setStyle] = useState('Pastel Pink');
  const [color, setColor] = useState('Rose Pink');
  const [customColor, setCustomColor] = useState('');
  const [useCustomColor, setUseCustomColor] = useState(false);
  const [message, setMessage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const colorOptions = [
    'Rose Pink',
    'Lavender',
    'Sky Blue',
    'Mint Green',
    'Royal Gold',
    'Classic Black',
    'Pure White',
    'Custom' // Ye select karne pe input khulega
  ];

  const finalColor = useCustomColor ? customColor : color;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photos.length) return toast.error('Please upload at least 1 photo');
    if (useCustomColor && !customColor.trim()) return toast.error('Please enter your custom color');
    
    setLoading(true);
    try {
      const formData = new FormData();
      photos.forEach(file => formData.append('photos', file));
      formData.append('serviceId', service._id);
      formData.append('style', style);
      formData.append('color', finalColor); // Final color bhej rahe
      formData.append('message', message);
      formData.append('instructions', instructions);
      
      // API call yaha
      addToCart({ 
        ...service, 
        customData: { style, color: finalColor, message, instructions } 
      });
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (e) => {
    const val = e.target.value;
    if (val === 'Custom') {
      setUseCustomColor(true);
      setColor('Custom');
    } else {
      setUseCustomColor(false);
      setColor(val);
      setCustomColor('');
    }
  };

  return (
    <div className="card p-6">
      <h3 className="mb-4 text-xl font-bold">Customize Your Memory</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold">Upload Photos</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setPhotos([...e.target.files])}
            className="input w-full"
          />
          {photos.length > 0 && (
            <p className="mt-1 text-xs text-gray-500">{photos.length} files selected</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Visual style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="input w-full"
          >
            <option>Pastel Pink</option>
            <option>Vintage Sepia</option>
            <option>Modern Minimal</option>
            <option>Royal Gold</option>
            <option>Black & White</option>
          </select>
        </div>

        {/* ✅ Color Options - Dropdown + Custom Input */}
        <div>
          <label className="mb-2 block text-sm font-semibold">Frame/Theme Color</label>
          <select
            value={color}
            onChange={handleColorChange}
            className="input w-full"
          >
            {colorOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          
          {useCustomColor && (
            <input
              type="text"
              placeholder="Type your color - e.g. #FF5733 or Royal Blue"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="input mt-2 w-full"
              required
            />
          )}
          {useCustomColor && customColor && (
            <div className="mt-2 flex items-center gap-2">
              <div 
                className="h-6 w-6 rounded border border-gray-300" 
                style={{ backgroundColor: customColor }}
              />
              <span className="text-xs text-gray-600">Preview: {customColor}</span>
            </div>
          )}
        </div>

        <div>
          <textarea
            placeholder="Your message / story"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="input w-full"
          />
        </div>

        <div>
          <textarea
            placeholder="Special instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={2}
            className="input w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add to Cart & Continue'}
        </button>
      </form>
    </div>
  );
}