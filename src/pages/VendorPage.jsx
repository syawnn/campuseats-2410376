import { useParams, useSearchParams } from 'react-router'
import { useVendor } from '../hooks/useVendor.js'
import MenuList from '../components/MenuList.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'
import DietaryFilters from '../components/DietaryFilters.jsx'
import { useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth.js'


function VendorPage() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedTags = searchParams.getAll('tag')

  const { vendor, menu, loading, error } = useVendor(id, selectedTags)

  const { user, loading: authLoading } = useAuth()
const restoredFor = useRef(null)

useEffect(() => {
  if (authLoading) return

  const identity = user?.uid ?? 'guest'

  if (restoredFor.current === identity) return
  restoredFor.current = identity

  // Guests do not load saved preferences.
  if (!user) return

  // Keep filters from a shared URL when present.
  if (searchParams.has('tag')) return

  try {
    const savedTags = JSON.parse(
      localStorage.getItem(`ce-diet-${user.uid}`) ?? '[]'
    )

    if (
      !Array.isArray(savedTags) ||
      !savedTags.every((tag) => typeof tag === 'string') ||
      savedTags.length === 0
    ) {
      return
    }

    const nextParams = new URLSearchParams(searchParams)

    savedTags.forEach((tag) => {
      nextParams.append('tag', tag)
    })

    setSearchParams(nextParams, { replace: true })
  } catch {
    // Leave the filters usable if saved data cannot be read.
  }
}, [authLoading, user, searchParams, setSearchParams])

  

  function handleTagChange(tag) {
    const nextTags = selectedTags.includes(tag)
        ? selectedTags.filter((value) => value !== tag)
        : [...selectedTags, tag]

    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('tag')

    nextTags.forEach((value) => {
        nextParams.append('tag', value)
    })

    setSearchParams(nextParams)

    if (user) {
  try {
    localStorage.setItem(
      `ce-diet-${user.uid}`,
      JSON.stringify(nextTags)
    )
  } catch {
    // Filtering still works if browser storage is unavailable.
  }
}
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
  return (
    <ErrorMessage
      message={error}
      onRetry={() => window.location.reload()}
    />
  )
}

  if (!vendor) {
    return <p className="muted">Vendor not found.</p>
  }

  const filteredMenu = menu.map((item) => ({
  ...item,
  vendorName: vendor.name,
}))
   .filter((item) =>
     selectedTags.every((tag) => (item.tags ?? []).includes(tag))
   )

  return (
  <section>
    <h2 className="section-title">Menu: {vendor.name}</h2>

    <DietaryFilters
      selectedTags={selectedTags}
      onTagChange={handleTagChange}
    />

    <MenuList items={filteredMenu} />
  </section>
)
}

export default VendorPage