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
