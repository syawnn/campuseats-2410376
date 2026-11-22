# Week 1 reflection

Answer each question in 1–3 sentences, in your own words.

1. What is the difference between building a UI imperatively (plain DOM code) and declaratively (React)?

In plain DOM code, we need to tell the browser step by step how to change the UI. In React, we describe what the UI should look like using components and JSX.

2. Why must a component name start with a capital letter?

A React component name must start with a capital letter so React can recognize it as a custom component. Lowercase names are treated as normal HTML elements.

3. What does a fragment <>...</> do, and why not just use a <div>?

A fragment <>...</> groups multiple elements together without adding an extra HTML element to the page. It is useful when we need one wrapper but do not need an additional <div>.

4. Name one benefit of splitting the UI into small components.

Splitting the UI into small components makes the code easier to understand and manage. Each component can focus on a specific part of the page, such as the Header, VendorCard, or Footer.



# Week 6 Reflection

1. Explain, step by step, what happens from the moment you click Place order until the new order appears on your Orders page. Name the functions in your own code that run, and say why you never call setOrders yourself

CheckoutForm validates the form and calls handlePlaceOrder() in CartPage.
The handler calls placeOrders(user, cart, details) which groups the cart
items by vendor. It creates one order per vendor and saves all orders
together using a Firestore batch. After saving succeeds, clearCart()
empties the cart and navigate('/orders') opens the Orders page.
The useMyOrders hook calls subscribeToMyOrders() which listens to the
current user's orders using onSnapshot(). The listener calls setOrders()
when data arrives so I do not manually add the new order to state in
the checkout handler.

2. Why is orders a top-level collection, and why does each order copy vendorName and each item’s name and price instead of storing only IDs?

Orders are stored in a top-level collection so the app can query a
student's orders across all vendors using studentUid. Each order also
stores vendorId to identify the shop. The order copies vendorName and
each item's name and price to keep a record of what was purchased.
If the shop later changes its menu names or prices, the saved order
still shows the original purchase details. This also lets the Orders
page display the information without reading every menu document.

3. Your personal feature: which Firestore path and fields hold its data, and which line of your code reads it? Paste that line.

My personal feature is the dietary tags filter. Each menu item's tags
are stored in a tags array at vendors/{vendorId}/menu/{itemId}.
For my shop, vendorId is 2410376-wani-cafe. The subscribeToMenu()
function in src/services/vendors.js filters the menu using this line:

where('tags', 'array-contains-any', selectedTags.slice(0, 10))

The onSnapshot() listener returns matching items and updates the menu
when Firestore data changes. When no tags are selected, the query
reads all menu items.