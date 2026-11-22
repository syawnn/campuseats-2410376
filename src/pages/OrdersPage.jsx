import { useMyOrders } from '../hooks/useMyOrders.js'
import { Loading, ErrorMessage } from '../components/Status.jsx'
import OrderActions from '../components/OrderActions.jsx'

const STATUSES = ['Received', 'Preparing', 'Ready', 'Collected']

function OrdersPage() {
  const { orders, loading, error } = useMyOrders()

  if (loading) return <Loading />

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <section className="orders-page">
      <h2 className="orders-heading">My orders</h2>
      <p className="orders-subtitle">
        Status updates appear here live.
      </p>

      {orders.length === 0 && (
        <p className="muted">No orders yet.</p>
      )}

      <div className="orders-list">
        {orders.map((order) => {
          const currentStep = STATUSES.indexOf(order.status)

          return (
            <article key={order.id} className="order-card">
              <h3 className="order-heading">
                {order.vendorName} · pickup {order.pickupTime}
              </h3>

              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.itemId}>
                    {item.qty}× {item.name}
                  </li>
                ))}
              </ul>

              <p className="order-date">
                Placed{' '}
                {order.createdAt
                  ? order.createdAt.toDate().toLocaleString('en-MY', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })
                  : 'just now'}
              </p>

              <p className="order-total">
                RM {order.total.toFixed(2)}
              </p>

              <ol
                className="order-status-track"
                aria-label={`Order status: ${order.status}`}
              >
                {STATUSES.map((status, index) => (
                  <li
                    key={status}
                    className={`order-status-badge ${
                      index <= currentStep ? 'is-reached' : ''
                    }`}
                    aria-current={
                      status === order.status ? 'step' : undefined
                    }
                  >
                    {status}
                  </li>
                ))}
              </ol>

              {order.status === 'Received' && (
                <OrderActions order={order} />
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default OrdersPage