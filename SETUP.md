# Setting up the admin page (Supabase)
1. Go to supabase.com, make a free account, click "New project". Choose a region near Pakistan if you can (for example Singapore or Mumbai) and save the database password.
2. In the project: SQL Editor > New query. Paste all of supabase/schema.sql, click Run. Then a new query with supabase/seed.sql, Run (this adds the starting categories and fabrics).
3. Authentication > Users > Add user: type your email and a password (tick "auto confirm"). This is your admin login.
4. SQL Editor > new query, run this with YOUR email: insert into admins (email) values ('you@example.com');
5. Project Settings > API: copy "Project URL" and the "anon public" key.
6. In this project folder, copy .env.example to a new file named .env.local and paste the two values after the = signs. THIS is where the API keys go. Never share the file or put it online.
7. npm install, then npm run dev. Open http://localhost:3000/admin and sign in.
8. In the admin page: add Brands first, then Products (the categories and fabrics are already there). Photos you upload are saved in Supabase.
Putting the site online (Vercel): add the same two values as Environment Variables in the Vercel project settings. Without them the site shows the demo products.
Without the keys the site still works in demo mode with the demo products.
