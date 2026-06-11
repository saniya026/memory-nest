import { useAuth } from '../context/AuthContext'

export default function DesignGallery() {
  const { isAuthenticated } = useAuth() // ✅ Ye add kar
  const [savedIds, setSavedIds] = useState([])

  const handleSaveForLater = async (design) => {
    if (!isAuthenticated) { // ✅ Token nahi, localStorage nahi - seedha context se check
      toast.error('Please login first')
      navigate('/login')
      return
    }

    try {
      await api.post('/designs/save', { designId: design._id })
      setSavedIds([...savedIds, design._id])
      toast.success('Saved for later!')
    } catch (err) {
      toast.error('Failed to save')
    }
  }
  // ... baaki code same
}