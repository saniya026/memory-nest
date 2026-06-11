import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext' // ✅ Add kar
import toast from 'react-hot-toast'
import { Trash2, ShoppingBag } from 'lucide-react'

export default function Wishlist() {
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { wishlist, loading, removeFromWishlist } = useWishlist() // ✅ Context se le
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
  }, [isAuthenticated, navigate])

  // ❌ fetchWishlist wala useEffect hata de - Context auto fetch kar raha

  const handleRemove = async (designId) => {
    await removeFromWishlist(designId) // ✅ Context ka function use kar
  }

  const handleBookNow = (design) => {
    const serviceData = {
      _id: design._id,
      title: design.title,
      price: design.price || 50,
      image: design.image,
      description: design.description
    }
    
    addToCart(serviceData)
    toast.success('Added to cart!')
    navigate('/cart')
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
            <div key={item._id} className="border rounded-lg overflow-hidden shadow-card hover:shadow-lg transition bg-white">
              <div className="bg-gray-50 h-64 flex items-center justify-center">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-2">{item.category || 'Survivor'}</p>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{item.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-rose font-bold text-xl">₹{item.price || 50}</span>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>

                <button
                  onClick={() => handleBookNow(item)}
                  className="w-full bg-rose text-white py-2 rounded-lg hover:bg-rose-dark transition flex items-center justify-center gap-2 font-semibold"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}