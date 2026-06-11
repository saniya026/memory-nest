import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext' // ✅ Add kar
import api from '../api/axios'
import toast from 'react-hot-toast'
import { Heart } from 'lucide-react'

export default function DesignGallery() {
  const { isAuthenticated } = useAuth()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist() // ✅ Context use kar
  const navigate = useNavigate()
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)

  // Designs load kar
  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const { data } = await api.get('/designs')
        setDesigns(Array.isArray(data)? data : data.designs || [])
      } catch (err) {
        console.log('Designs fetch error:', err)
        toast.error('Failed to load designs')
        setDesigns([])
      } finally {
        setLoading(false)
      }
    }
    fetchDesigns()
  }, [])

  // ❌ Wishlist fetch wala useEffect hata de - Context automatically handle karega

  // Save/Remove toggle - ✅ Context se
  const handleSaveForLater = async (design) => {
    if (!isAuthenticated) {
      toast.error('Please login first')
      navigate('/login')
      return
    }

    const saved = isInWishlist(design._id)

    if (saved) {
      await removeFromWishlist(design._id)
    } else {
      await addToWishlist(design._id)
    }
  }

  if (loading) return <div className="text-center p-8">Loading designs...</div>

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Design Gallery</h1>

      {designs.length === 0? (
        <p className="text-center text-gray-500">No designs found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map(design => (
            <div key={design._id} className="border rounded-lg overflow-hidden shadow-card hover:shadow-lg transition bg-white">
              {/* ✅ Image wrapper for better control */}
              <div className="bg-gray-50 h-48 flex items-center justify-center">
                <img
                  src={design.image}
                  alt={design.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{design.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{design.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-rose font-bold text-lg">₹{design.price || 50}</span>
                  <button
                    onClick={() => handleSaveForLater(design)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      isInWishlist(design._id)
                       ? 'bg-rose text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${isInWishlist(design._id)? 'fill-current' : ''}`}
                    />
                    {isInWishlist(design._id)? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}