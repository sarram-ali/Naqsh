# Section names (use these when asking for changes)
- Header: app/Header.js (logo, tabs, sub menu: Men, Women, New Arrivals, Sale, Abaya/Gown/Hijab, cart)
- Home: app/Home.js (Hero + toggle, Brand strip, Categories, Fabrics, Featured, Banner, Trust row)
- Shop filters: app/shop/page.js (Gender switch, Category row, dropdown bar: Fabric, Season, Stitching, Brand)
- Runway: app/Runway.js (Stage, Price + Add to cart + View details on the left, Photo boxes on the right, Prev/Next)
- Quick add button: app/QuickAdd.js (the + on cards, Add to cart on the Runway)
- Product page: app/product/[slug]/Buy.js
- Checkout: app/cart/page.js (steps: Cart, Information, Shipping, Payment, Thank you)
- About: app/about/page.js
- Footer: app/Footer.js
- Back link: app/BackLink.js
- Photos: public/images/ (folders listed in IMAGES.md, paths in app/images.js)
- Data: app/catalog.js (brands, categories, fabrics, seasons, new/sale flags, products, photos map IMAGES)
Older versions live in app/_archive/. To restore one, copy it over the current file and fix its imports.
