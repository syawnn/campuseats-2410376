import { useEffect, useState } from 'react'
import {
  subscribeToVendor,
  subscribeToMenu,
} from '../services/vendors.js'

export function useVendor(vendorId, selectedTags = []) {
  const [vendor, setVendor] = useState(undefined)
  const [menu, setMenu] = useState([])
  const [error, setError] = useState(null)

  const tagsKey = JSON.stringify(selectedTags)

  useEffect(() => {
    const stopVendor = subscribeToVendor(
      vendorId,
      setVendor,
      (err) => setError(err.message),
    )

    return stopVendor
  }, [vendorId])

  useEffect(() => {
    const tags = JSON.parse(tagsKey)

    const stopMenu = subscribeToMenu(
      vendorId,
      setMenu,
      (err) => setError(err.message),
      tags,
    )

    return stopMenu
  }, [vendorId, tagsKey])

  return {
    vendor,
    menu,
    loading: vendor === undefined && !error,
    error,
  }
}