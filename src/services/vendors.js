import { 
    collection, 
    doc, 
    onSnapshot,
    writeBatch,
    query,
    where,
} from 'firebase/firestore'
import { db } from '../firebase.js'

// Listen to all vendors.
export function subscribeToVendors(onData, onError) {
  return onSnapshot(
    collection(db, 'vendors'),
    (snapshot) =>
      onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError,
  )
}

// Listen to one vendor.
export function subscribeToVendor(vendorId, onData, onError) {
  return onSnapshot(
    doc(db, 'vendors', vendorId),
    (snapshot) =>
      onData(
        snapshot.exists()
          ? { id: snapshot.id, ...snapshot.data() }
          : null,
      ),
    onError,
  )
}

export function subscribeToMenu(
  vendorId,
  onData,
  onError,
  selectedTags = [],
) {
  const menuRef = collection(db, 'vendors', vendorId, 'menu')

  const menuQuery = selectedTags.length > 0
    ? query(
        menuRef,
        where('tags', 'array-contains-any', selectedTags.slice(0, 10)),
      )
    : menuRef

  return onSnapshot(
    menuQuery,
    (snapshot) =>
      onData(
        snapshot.docs.map((d) => ({
          id: d.id,
          vendorId,
          ...d.data(),
        })),
      ),
    onError,
  )
}

// Copy vendors and their menus into Firestore.
export async function seedDemoData(vendors) {
  const batch = writeBatch(db)

  for (const { menu, id, ...vendor } of vendors) {
    batch.set(doc(db, 'vendors', id), vendor)

    for (const { id: itemId, ...item } of menu) {
      batch.set(doc(db, 'vendors', id, 'menu', itemId), item)
    }
  }

  await batch.commit()
}