import { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetched, setFetched] = useState(false)

  const fetchWishlist = async () => {
    if (!user || fetched) return
    setLoading(true)
    try {
      const { data } = await api.get('/wishlist') // ← /api hata diya
      setWishlist(Array.isArray(data)? data : data?.wishlist || [])
      setFetched(true)
    } catch (err) {
      setWishlist([])
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (designId) => {
    try {
      await api.post('/wishlist/save', { designId }) // ← /api hata diya
      setFetched(false)
      await fetchWishlist()
      toast.success('Saved to wishlist!')
      return true
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Please login first')
        return false
      }
      toast.error(err.response?.data?.message || 'Failed to save')
      return false
    }
  }

  const removeFromWishlist = async (designId) => {
    try {
      await api.delete(`/wishlist/${designId}`) // ← /api hata diya
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