import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  writeBatch,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase.js'

// Create one order per vendor, saved together.
export async function placeOrders(user, cart, details) {
  const byVendor = new Map()

  for (const line of cart) {
    const vendorId = line.item.vendorId
    const lines = byVendor.get(vendorId) ?? []

    byVendor.set(vendorId, [...lines, line])
  }

  const batch = writeBatch(db)

  for (const [vendorId, lines] of byVendor) {
    const ref = doc(collection(db, 'orders'))

    batch.set(ref, {
      studentUid: user.uid,
      studentName: details.name,
      mahallah: details.mahallah,
      pickupTime: details.pickupTime,
      vendorId,
      vendorName: lines[0].item.vendorName,
      items: lines.map(({ item, qty }) => ({
        itemId: item.id,
        name: item.name,
        price: item.price,
        qty,
      })),
      total: lines.reduce(
        (sum, { item, qty }) => sum + item.price * qty,
        0,
      ),
      status: 'Received',
      createdAt: serverTimestamp(),
    })
  }

  await batch.commit()
}

// Listen only to the logged-in student's orders.
// This completes TODO 3.
export function subscribeToMyOrders(uid, onData, onError) {
  const q = query(
    collection(db, 'orders'),
    where('studentUid', '==', uid),
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))

      orders.sort(
        (a, b) =>
          (b.createdAt?.toMillis?.() ?? Date.now()) -
          (a.createdAt?.toMillis?.() ?? Date.now()),
      )

      onData(orders)
    },
    onError,
  )
}

// Update only the pickup time.
export function changePickupTime(orderId, pickupTime) {
  return updateDoc(doc(db, 'orders', orderId), {
    pickupTime,
  })
}

// Delete the order. This completes TODO 5.
export function cancelOrder(orderId) {
  return deleteDoc(doc(db, 'orders', orderId))
}