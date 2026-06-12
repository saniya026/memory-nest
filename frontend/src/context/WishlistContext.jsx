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
    if (!user?.token || fetched) return
    setLoading(true)
    try {
      const { data } = await api.get('/api/wishlist')
      setWishlist(Array.isArray(data) ? data : data?.wishlist || [])
      setFetched(true)
    } catch (err) {
      setWishlist([])
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (designId) => {
    if (!user?.token) {
      toast.error('Please login first')
      return false
    }
    try {
      await api.post('/api/wishlist/save', { designId })
      setFetched(false)
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
      await api.delete(`/api/wishlist/${designId}`)
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