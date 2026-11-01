import { useCart } from '../hooks/useCart.js'

function OrdersPage() {
  const { orders } = useCart()

  if (orders.length === 0) {
    return <p className="muted">No orders yet.</p>
  }

  return (
    <section>
      <h2 className="section-title">Your orders</h2>

      {orders.map((order) => (
        <div key={order.id} className="card">
          <h3>Order placed</h3>

          <p>Name: {order.name}</p>
          <p>Mahallah: {order.mahallah}</p>
          <p>Pickup time: {order.pickupTime}</p>

          <ul>
            {order.items.map((line) => (
              <li key={line.item.id}>
                {line.item.name} × {line.qty}
                {' — '}
                RM {(line.item.price * line.qty).toFixed(2)}
              </li>
            ))}
          </ul>

          <p className="cart-total">
            Total: RM {order.total.toFixed(2)}
          </p>
        </div>
      ))}
    </section>
  )
}

export default OrdersPage