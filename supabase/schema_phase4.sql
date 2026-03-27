-- Phase 4: Driver documents, payments, truck invoices, and truck notes

-- ============================================
-- MANUAL SUPABASE SETUP REQUIRED
-- ============================================
-- 1. Go to Supabase Dashboard → Storage
-- 2. Create bucket named: vault-private
--    - Toggle: Private (NOT public)
--    - Click Create
-- 3. Create bucket named: redlineos-docs  
--    - Toggle: Private (NOT public)
--    - Click Create
-- 4. Go to Storage → Policies
-- 5. For BOTH buckets add these policies:
--
--    Policy 1 - INSERT (upload):
--    Name: "Users can upload their own files"
--    Target: authenticated
--    Expression: (auth.uid()::text = (storage.foldername(name))[1])
--
--    Policy 2 - SELECT (download/view):
--    Name: "Users can view their own files"
--    Target: authenticated  
--    Expression: (auth.uid()::text = (storage.foldername(name))[1])
--
--    Policy 3 - DELETE:
--    Name: "Users can delete their own files"
--    Target: authenticated
--    Expression: (auth.uid()::text = (storage.foldername(name))[1])
-- ============================================

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

-- Ensure vault_documents table has user_id column
alter table vault_documents add column if not exists user_id uuid references auth.users(id);

-- Ensure documents table has user_id column
alter table documents add column if not exists user_id uuid references auth.users(id);

-- Add AI allocation column to weekly_checks for storing calculator results
alter table weekly_checks add column if not exists ai_allocation jsonb;
