import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { Heart } from 'lucide-react'

export default function DesignGallery() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [designs, setDesigns] = useState([])
  const [savedIds, setSavedIds] = useState([])
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

  // Wishlist fetch kar - ✅ FIXED
  useEffect(() => {
    if (!isAuthenticated) return

    const fetchWishlist = async () => {
      try {
        const { data } = await api.get('/wishlist')
        // ✅ Backend populated designs bhejta hai, to item._id use kar
        setSavedIds(data.map(item => item._id))
      } catch (err) {
        console.log('Wishlist error:', err)
        setSavedIds([])
      }
    }
    fetchWishlist()
  }, [isAuthenticated])

  // Save/Remove toggle - ✅ FIXED
  const handleSaveForLater = async (design) => {
    if (!isAuthenticated) {
      toast.error('Please login first')
      navigate('/login')
      return
    }

    const isSaved = savedIds.includes(design._id)

    try {
      if (isSaved) {
        // Remove from wishlist
        await api.delete(`/wishlist/${design._id}`)
        setSavedIds(savedIds.filter(id => id!== design._id))
        toast.success('Removed from wishlist')
      } else {
        // Add to wishlist - ✅ /wishlist/save use kar
        await api.post('/wishlist/save', { designId: design._id })
        setSavedIds([...savedIds, design._id])
        toast.success('Saved to wishlist!')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update wishlist')
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
            <div key={design._id} className="border rounded-lg overflow-hidden shadow-card hover:shadow-lg transition">
              <img
                src={design.image}
                alt={design.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{design.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{design.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-rose font-bold">₹{design.price}</span>
                  <button
                    onClick={() => handleSaveForLater(design)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                      savedIds.includes(design._id)
                       ? 'bg-rose text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${savedIds.includes(design._id)? 'fill-current' : ''}`}
                    />
                    {savedIds.includes(design._id)? 'Saved' : 'Save'}
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