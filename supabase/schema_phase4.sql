-- Phase 4: Driver documents, payments, truck invoices, and truck notes

-- MANUAL STEPS REQUIRED IN SUPABASE BEFORE DEPLOYING:
-- 1. Run the weekly_checks table SQL below
-- 2. Create storage bucket: vault-private (private, authenticated access only)
-- 3. Create storage bucket: redlineos-docs (private, authenticated access only)
-- 4. Set storage policies to allow authenticated users to upload/download/delete their own files

-- Weekly checks table with new payment breakdown fields
drop table if exists weekly_checks;
create table weekly_checks (
  id uuid default gen_random_uuid() primary key,
  week_start date not null,
  week_label text not null,
  client text default 'Healey',
  total_amount numeric not null,
  driver_pay numeric default 0,
  insurance numeric default 0,
  fuel_expenses numeric default 0,
  net_profit numeric generated always as (total_amount - driver_pay - insurance - fuel_expenses) stored,
  notes text,
  created_at timestamp default now()
);

-- Driver documents table
create table driver_documents (
  id uuid default gen_random_uuid() primary key,
  driver_id uuid references drivers(id) on delete cascade,
  name text not null,
  category text not null,
  file_url text,
  uploaded_at timestamp default now()
);

-- Driver payments table
create table driver_payments (
  id uuid default gen_random_uuid() primary key,
  driver_id uuid references drivers(id) on delete cascade,
  amount numeric not null,
  payment_date date not null,
  notes text,
  created_at timestamp default now()
);

-- Truck invoices table
create table truck_invoices (
  id uuid default gen_random_uuid() primary key,
  truck_id text not null,
  name text not null,
  invoice_number text,
  amount numeric default 0,
  invoice_date date not null,
  description text,
  status text default 'pending',
  file_url text,
  created_at timestamp default now()
);

-- Truck notes table
create table truck_notes (
  id uuid default gen_random_uuid() primary key,
  truck_id text not null,
  author text not null default 'James',
  content text not null,
  created_at timestamp default now()
);

-- Enable RLS
alter table driver_documents enable row level security;
alter table driver_payments enable row level security;
alter table truck_invoices enable row level security;
alter table truck_notes enable row level security;

-- RLS policies (authenticated users can read, owner can write)
create policy "Authenticated users can view driver documents"
  on driver_documents for select
  using (auth.role() = 'authenticated');

create policy "Owner can manage driver documents"
  on driver_documents for all
  using (auth.email() = 'james@prushlogistics.com');

create policy "Authenticated users can view driver payments"
  on driver_payments for select
  using (auth.role() = 'authenticated');

create policy "Owner can manage driver payments"
  on driver_payments for all
  using (auth.email() = 'james@prushlogistics.com');

create policy "Authenticated users can view truck invoices"
  on truck_invoices for select
  using (auth.role() = 'authenticated');

create policy "Owner can manage truck invoices"
  on truck_invoices for all
  using (auth.email() = 'james@prushlogistics.com');

create policy "Authenticated users can view truck notes"
  on truck_notes for select
  using (auth.role() = 'authenticated');

create policy "Owner can manage truck notes"
  on truck_notes for all
  using (auth.email() = 'james@prushlogistics.com');
