-- RedlineOS Phase 3 Database Schema
-- Run this AFTER Phase 2 schema (schema.sql)
-- Adds: Weekly Checks, Driver Pay, and Private Vault tables

-- Weekly checks table (single source of truth for revenue)
create table weekly_checks (
  id uuid default gen_random_uuid() primary key,
  week_start date not null,              -- Monday of that week
  week_label text not null,              -- e.g. "Mar 24 – Mar 30"
  total_amount numeric not null,
  truck_z455_amount numeric default 0,
  truck_z420_amount numeric default 0,
  notes text,
  created_at timestamp default now()
);

-- Driver pay ledger
create table driver_pay (
  id uuid default gen_random_uuid() primary key,
  week_start date not null,
  week_label text not null,
  driver_id uuid references drivers(id),
  amount numeric not null,
  notes text,
  created_at timestamp default now()
);

-- Vault settings (PIN storage)
create table vault_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  pin_hash text not null,
  created_at timestamp default now(),
  unique(user_id)
);

-- Vault documents
create table vault_documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  name text not null,
  folder text not null,           -- operator-defined category
  file_url text,                  -- Supabase Storage URL
  file_type text,
  uploaded_at timestamp default now()
);

-- Enable Row Level Security
alter table weekly_checks enable row level security;
alter table driver_pay enable row level security;
alter table vault_settings enable row level security;
alter table vault_documents enable row level security;

-- RLS Policies for weekly_checks
create policy "Allow authenticated users full access to weekly_checks"
  on weekly_checks for all
  using (auth.role() = 'authenticated');

-- RLS Policies for driver_pay
create policy "Allow authenticated users full access to driver_pay"
  on driver_pay for all
  using (auth.role() = 'authenticated');

-- RLS Policies for vault_settings (user can only see their own)
create policy "Users can view their own vault settings"
  on vault_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own vault settings"
  on vault_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own vault settings"
  on vault_settings for update
  using (auth.uid() = user_id);

-- RLS Policies for vault_documents (user can only see their own)
create policy "Users can view their own vault documents"
  on vault_documents for select
  using (auth.uid() = user_id);

create policy "Users can insert their own vault documents"
  on vault_documents for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own vault documents"
  on vault_documents for update
  using (auth.uid() = user_id);

create policy "Users can delete their own vault documents"
  on vault_documents for delete
  using (auth.uid() = user_id);

-- Create indexes for better query performance
create index idx_weekly_checks_week_start on weekly_checks(week_start desc);
create index idx_driver_pay_week_start on driver_pay(week_start desc);
create index idx_driver_pay_driver_id on driver_pay(driver_id);
create index idx_vault_documents_user_id on vault_documents(user_id);
create index idx_vault_documents_folder on vault_documents(folder);
