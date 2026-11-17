-- Supabase: SQL Editor > New query > paste all of this > Run. Run it once.
create extension if not exists pgcrypto;
create table admins (email text primary key);
create table categories (id uuid primary key default gen_random_uuid(), gender text not null check (gender in ('men','women')), slug text not null, name text not null, shape text not null default 'top', photo_url text, active boolean not null default true, unique (gender, slug));
create table fabrics (id uuid primary key default gen_random_uuid(), name text not null unique, season text not null default 'Summer', active boolean not null default true);
create table brands (id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null, photo_url text, active boolean not null default true);
create table products (id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null, description text not null default '', brand_id uuid not null references brands(id), category_id uuid not null references categories(id), fabric_id uuid references fabrics(id), stitch text not null default 'Stitched', price int not null, was_price int, is_new boolean not null default false, active boolean not null default true, colors jsonb not null default '[]', photos text[] not null default '{}', created_at timestamptz not null default now());
create table stock (product_id uuid not null references products(id) on delete cascade, size text not null, qty int not null default 0 check (qty >= 0), primary key (product_id, size));
create table orders (id uuid primary key default gen_random_uuid(), order_no text not null unique, status text not null default 'new' check (status in ('new','confirmed','shipped','delivered','cancelled')), name text not null, email text, phone text not null, address text not null, city text not null, province text, postal text, payment text not null, total int not null, created_at timestamptz not null default now());
create table order_items (id uuid primary key default gen_random_uuid(), order_id uuid not null references orders(id) on delete cascade, product_id uuid references products(id) on delete set null, name text not null, size text, color text, qty int not null, price int not null, photo text);

create function is_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from admins where email = auth.jwt() ->> 'email') $$;

do $$ declare t text; begin
  foreach t in array array['categories','fabrics','brands','products','stock','orders','order_items','admins'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "admin all" on %I for all using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;
create policy "public read" on categories for select using (active);
create policy "public read" on fabrics for select using (active);
create policy "public read" on brands for select using (active);
create policy "public read" on products for select using (active);
create policy "public read" on stock for select using (true);

-- Customers place orders only through this function (it checks stock and takes prices from the database).
create function place_order(p jsonb) returns text language plpgsql security definer set search_path = public as $$
declare c jsonb := p -> 'customer'; it jsonb; pr products%rowtype; q int; o uuid := gen_random_uuid();
  no text := 'NQ-' || lpad((floor(random() * 900000) + 100000)::int::text, 6, '0'); tot int := 0;
begin
  if jsonb_array_length(p -> 'items') = 0 then raise exception 'EMPTY_CART'; end if;
  insert into orders (id, order_no, name, email, phone, address, city, province, postal, payment, total)
    values (o, no, c ->> 'name', c ->> 'email', c ->> 'phone', c ->> 'address', c ->> 'city', c ->> 'province', c ->> 'postal', p ->> 'payment', 0);
  for it in select * from jsonb_array_elements(p -> 'items') loop
    select * into pr from products where slug = it ->> 'slug' and active;
    if not found then raise exception 'UNAVAILABLE:%', it ->> 'name'; end if;
    q := (it ->> 'qty')::int;
    update stock set qty = qty - q where product_id = pr.id and size = it ->> 'size' and qty >= q;
    if not found then raise exception 'SOLD_OUT:%', pr.name; end if;
    insert into order_items (order_id, product_id, name, size, color, qty, price, photo)
      values (o, pr.id, (select b.name from brands b where b.id = pr.brand_id) || ' - ' || pr.name, it ->> 'size', it ->> 'color', q, pr.price, pr.photos[1]);
    tot := tot + pr.price * q;
  end loop;
  update orders set total = tot where id = o;
  return no;
end $$;
grant execute on function place_order(jsonb) to anon, authenticated;

-- A cancelled order puts its items back in stock.
create function restore_stock() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'cancelled' and old.status <> 'cancelled' then
    update stock s set qty = s.qty + i.qty from order_items i where i.order_id = new.id and s.product_id = i.product_id and s.size = i.size;
  end if;
  return new;
end $$;
create trigger orders_cancel after update of status on orders for each row execute function restore_stock();

-- Photo storage
insert into storage.buckets (id, name, public) values ('photos', 'photos', true) on conflict do nothing;
create policy "photos public read" on storage.objects for select using (bucket_id = 'photos');
create policy "photos admin upload" on storage.objects for insert with check (bucket_id = 'photos' and is_admin());
create policy "photos admin delete" on storage.objects for delete using (bucket_id = 'photos' and is_admin());
