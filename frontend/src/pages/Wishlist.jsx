import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'

export default function Wishlist() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const fetchWishlist = async () => {
      try {
        const { data } = await api.get('/wishlist')
        setWishlist(data)
      } catch (err) {
        console.log('Wishlist error:', err)
        toast.error('Failed to load wishlist')
        setWishlist([])
      } finally {
        setLoading(false)
      }
    }
    fetchWishlist()
  }, [isAuthenticated, navigate])

  const handleRemove = async (designId) => {
    try {
      await api.delete(`/wishlist/${designId}`)
      setWishlist(wishlist.filter(item => item._id!== designId))
      toast.success('Removed from wishlist')
    } catch (err) {
      toast.error('Failed to remove')
    }
  }

  if (loading) return <div className="text-center p-8">Loading wishlist...</div>

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Saved Designs ❤️</h1>
      
      {wishlist.length === 0? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No saved designs yet</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-rose text-white px-6 py-2 rounded-lg hover:bg-rose-dark"
          >
            Browse Designs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(item => (
            <div key={item._id} className="border rounded-lg overflow-hidden shadow-card hover:shadow-lg transition">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-rose font-bold">₹{item.price}</span>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
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