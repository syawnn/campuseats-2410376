import { CartContext } from './cart-context.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

function CartProvider({ children }) {
  const [cart, setCart] = useLocalStorage('campuseats-cart', [])
  const [orders, setOrders] = useLocalStorage('campuseats-orders', [])

  const count = cart.reduce(
    (sum, line) => sum + line.qty,
    0
  )

  const total = cart.reduce(
    (sum, line) => sum + line.item.price * line.qty,
    0
  )

  function addToCart(item) {
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

  function changeQty(itemId, delta) {
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

  function removeFromCart(itemId) {
    setCart((prevCart) =>
      prevCart.filter((line) => line.item.id !== itemId)
    )
  }

  function placeOrder(details) {
    const order = {
      ...details,
      id: crypto.randomUUID(),
      items: cart,
      total,
    }

    setOrders((prevOrders) => [...prevOrders, order])
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        count,
        total,
        addToCart,
        changeQty,
        removeFromCart,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider