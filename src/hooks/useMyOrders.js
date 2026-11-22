import { useEffect, useState } from 'react'
import { useAuth } from './useAuth.js'
import { subscribeToMyOrders } from '../services/orders.js'

export function useMyOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return

    return subscribeToMyOrders(
      user.uid,
      (data) => {
        setOrders(data)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )
  }, [user])

  return { orders, loading, error }
}