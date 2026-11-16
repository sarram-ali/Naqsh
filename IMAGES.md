# Where the photos live (public/images/)
Every photo has a dummy image that shows its own path. Every path is written out one by one in app/images.js (nothing is built from a pattern).
To use your photo: replace the file at that path (same name, .jpg), OR put your photo anywhere inside public/ (any folder, any name) and change that one path in app/images.js.
- men/banner.jpg and women/banner.jpg ........ poster behind the Men/Women toggle on Home
- men/box-1.jpg to box-3.jpg (and women/) ..... the 3 boxes on the Home hero
- home/eid-banner.jpg ......................... Home banner
- men/categories/<category>/tile.jpg (and women/) ... category tile on Home and Shop
- men/categories/<category>/1.jpg, 2.jpg, 3.jpg ..... product photos for that category (1 = front or model)
- brands/<brand>/photo.jpg .................... brand card on the Brands page (put the logo in the same folder later)
