import { useState } from 'react'
import {
  changePickupTime,
  cancelOrder,
} from '../services/orders.js'

function OrderActions({ order }) {
  const [pickupTime, setPickupTime] = useState(order.pickupTime)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSaveTime(event) {
    event.preventDefault()
    setError('')

    if (
      !pickupTime ||
      pickupTime < '07:00' ||
      pickupTime > '22:00'
    ) {
      setError('Choose a pickup time between 07:00 and 22:00.')
      return
    }

    setBusy(true)

    try {
      await changePickupTime(order.id, pickupTime)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleCancel() {
    if (!window.confirm('Cancel this order?')) return

    setError('')
    setBusy(true)

    try {
      await cancelOrder(order.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="order-actions">
        
      <form onSubmit={handleSaveTime}>
        <label htmlFor={`pickup-${order.id}`}>
          Change pickup time
        </label>

        <input
          id={`pickup-${order.id}`}
          type="time"
          min="07:00"
          max="22:00"
          required
          value={pickupTime}
          onChange={(event) => setPickupTime(event.target.value)}
          disabled={busy}
        />

        <button type="submit" className="btn" disabled={busy}>
          Save time
        </button>
      </form>

      <button
        type="button"
        className="btn"
        onClick={handleCancel}
        disabled={busy}
      >
        Cancel order
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  )
}

export default OrderActions