import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
// ❌ useLocation hata diya
import api from '../api/axios'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth() // ✅ user le lo
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchWishlist = async () => {
    // ✅ Token nahi hai to kuch mat karo
    if (!user?.token) {
      setWishlist([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const { data } = await api.get('/wishlist')
      setWishlist(Array.isArray(data) ? data : [])
    } catch (err) {
      console.log('Wishlist fetch error:', err)
      setWishlist([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // ✅ Sirf jab token mile tabhi call kar
    if (user?.token) {
      fetchWishlist()
    } else {
      setWishlist([])
      setLoading(false)
    }
  }, [user?.token]) // ✅ Bas token pe depend karo

  const addToWishlist = async (designId) => {
    if (!user?.token) {
      toast.error('Please login first')
      return false
    }
    try {
      await api.post('/wishlist/save', { designId })
      await fetchWishlist()
      toast.success('Saved to wishlist!')
      return true
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
      return false
    }
  }

  const removeFromWishlist = async (designId) => {
    try {
      await api.delete(`/wishlist/${designId}`)
      setWishlist(prev => prev.filter(item => item._id !== designId))
      toast.success('Removed from wishlist')
      return true
    } catch (err) {
      toast.error('Failed to remove')
      return false
    }
  }

  const isInWishlist = (designId) => {
    return wishlist.some(item => item._id === designId)
  }

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      fetchWishlist,
      count: wishlist.length
    }}>
      {children}
    </WishlistContext.Provider>
  )
}