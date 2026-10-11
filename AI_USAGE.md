# AI usage log

Using AI never costs marks; a vague or missing log does.
Add a new section every week, before you tag. Did not use AI? Write "None" under Tool(s).

## Week 1
- Tool(s): ChatGPT
- What I asked for: I asked for guidance to complete the CampusEats Week 1 lab step by step and help troubleshoot a blank page.
- What I kept, changed or rejected, and why: I followed the lab code and used the AI explanations to understand each step. I also tested the components one by one to find the cause of the blank page.
- One thing the AI got wrong and how I fixed it: The first suggested App.jsx resulted in a blank page because there was a problem in my VendorCard component. I tested each component separately and corrected VendorCard.jsx.

## Week 2
- Tool(s): ChatGPT
- What I asked for: I asked for step-by-step guidance to complete the CampusEats Week 2 tasks, including menu data, props, list rendering, vendor switching, state, and the cart count. I also asked for help troubleshooting when the cart count did not appear to increase.
- What I kept, changed or rejected, and why: I followed the lab structure and used the explanations to understand how props, map(), useState, events, and the cart work together. During troubleshooting, I checked each component separately and used the browser Console to confirm that the Add to cart event was working.
- One thing the AI got wrong and how I fixed it: The AI initially suspected that the problem could be in MenuList, MenuItemCard, or Header, but those files were correct. I checked them one by one and used console.log() to trace the event and cart state. After confirming the cart was updating, I removed the temporary debugging code.
