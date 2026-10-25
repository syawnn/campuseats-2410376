import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import VendorCard from './components/VendorCard.jsx'
import MenuList from './components/MenuList.jsx'
import Footer from './components/Footer.jsx'
import { Loading, ErrorMessage } from './components/Status.jsx'
import CartPage from './components/CartPage.jsx'

function App() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [selectedVendorId, setSelectedVendorId] = useState(null)
  const [cart, setCart] = useState([])

  const [view, setView] = useState('menu')

  const [lastOrder, setLastOrder] = useState(null)

  const [selectedTags, setSelectedTags] = useState([])

  useEffect(() => {
    const controller = new AbortController()

    setLoading(true)
    setError(null)

    fetch('/api/vendors.json', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (controller.signal.aborted) return

        setVendors(data)
        setSelectedVendorId(data[0]?.id ?? null)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [reloadKey])

  const selectedVendor = vendors.find(
    (vendor) => vendor.id === selectedVendorId
  )

  const filteredMenu = (selectedVendor?.menu ?? []).filter((item) =>
    selectedTags.every((tag) => (item.tags ?? []).includes(tag))
  )

  function handleAddToCart(item) {
  setCart((prevCart) => {
    const existingLine = prevCart.find(
      (line) => line.item.id === item.id
    )

    if (existingLine) {
      return prevCart.map((line) =>
        line.item.id === item.id
          ? { ...line, qty: line.qty + 1 }
          : line
      )
    }

    return [...prevCart, { item, qty: 1 }]
  })
}

function handleChangeQty(itemId, delta) {
  setCart((prevCart) =>
    prevCart
      .map((line) =>
        line.item.id === itemId
          ? { ...line, qty: line.qty + delta }
          : line
      )
      .filter((line) => line.qty > 0)
  )
}

function handleRemove(itemId) {
  setCart((prevCart) =>
    prevCart.filter((line) => line.item.id !== itemId)
  )
}

function handlePlaceOrder(details) {
  const total = cart.reduce(
    (sum, line) => sum + line.item.price * line.qty,
    0
  )

  setLastOrder({ ...details, total })
  setCart([])
  setView('done')
}

  const cartCount = cart.reduce(
    (total, line) => total + line.qty,
   0
  )

  function handleTagChange(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag)
       ? prev.filter((value) => value !== tag)
       : [...prev, tag]
    )
  }

  let content

  if (view === 'cart') {
  content = (
    <CartPage
      cart={cart}
      onChangeQty={handleChangeQty}
      onRemove={handleRemove}
      onPlaceOrder={handlePlaceOrder}
    />
  )
  } else if (view === 'done' && lastOrder) {
  content = (
    <div className="card">
      <h2>Order placed!</h2>
      <p>Thank you, {lastOrder.name}.</p>
      <p>Mahallah: {lastOrder.mahallah}</p>
      <p>Pickup time: {lastOrder.pickupTime}</p>
      <p>Total: RM {lastOrder.total.toFixed(2)}</p>

      <button
        type="button"
        className="btn"
        onClick={() => setView('menu')}
      >
        Back to menu
      </button>
    </div>
  )
  } else if (loading) {
    content = <Loading />
  } else if (error) {
    content = (
      <ErrorMessage
        message={error}
        onRetry={() => setReloadKey((key) => key + 1)}
      />
    )
  } else if (!selectedVendor) {
    content = <p className="muted">No vendors available.</p>
  } else {
    content = (
      <>
        <section>
          <h2 className="section-title">Choose a vendor</h2>

          <div className="vendor-grid">
            {vendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                isSelected={vendor.id === selectedVendorId}
                onSelect={setSelectedVendorId}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">
            Menu: {selectedVendor.name}
          </h2>

        <div>
          <p>Dietary filters:</p>

          {['Vegetarian', 'Dairy-free'].map((tag) => (
            <label key={tag}>
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagChange(tag)}
              />
              {tag}{' '}
            </label>
          ))}
        </div>

          <MenuList
            items={filteredMenu}
            onAdd={handleAddToCart}
          />
        </section>
      </>
    )
  }

  return (
    <>
      <Header
        cartCount={cartCount}
        onShowMenu={() => setView('menu')}
        onShowCart={() => setView('cart')}
      />

      <main className="container">{content}</main>

      <Footer />
    </>
  )
}

export default App