import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../../apiCall/userApi'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../store/userSlice'

function ProtectedRoute({ children }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      setLoading(false)
      navigate('/login')
      return
    }

    const checkAuth = async () => {
      try {
        const currentUserResponse = await getCurrentUser()
        if (currentUserResponse.data.success === false) {

          localStorage.removeItem('token')
          setLoading(false)
          navigate('/login')
          alert('session expired')
          return;
        }

        dispatch(
          setUser({
            user: currentUserResponse.data.userData, // or .data.userData -- depends on getCurrentUser's return shape
          })
        )
      } catch (error) {
        localStorage.removeItem('token')
        navigate('/login')
        alert('session expired')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])


  if (loading) {
    return <div>Loading...</div> // swap for a spinner/skeleton if you have one
  }
  return children
}

export default ProtectedRoute