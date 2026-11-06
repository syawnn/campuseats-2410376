import { useParams, useSearchParams } from 'react-router'
import { useVendors } from '../hooks/useVendors.js'
import MenuList from '../components/MenuList.jsx'
import { Loading, ErrorMessage } from '../components/Status.jsx'
import DietaryFilters from '../components/DietaryFilters.jsx'

function VendorPage() {
  const { id } = useParams()
  const { vendors, loading, error, reload } = useVendors()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedTags = searchParams.getAll('tag')

  const vendor = vendors.find((vendor) => vendor.id === id)

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
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={reload} />
  }

  if (!vendor) {
    return <p className="muted">Vendor not found.</p>
  }

  const filteredMenu = vendor.menu.filter((item) =>
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