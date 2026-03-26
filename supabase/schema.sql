-- RedlineOS Database Schema
-- Run this in your Supabase SQL Editor to create all tables

-- Drivers table
create table drivers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  truck_id text,
  status text default 'active', -- 'active' | 'inactive'
  created_at timestamp default now()
);

-- Trucks table
create table trucks (
  id uuid default gen_random_uuid() primary key,
  name text not null,           -- e.g. "z455"
  route text,                   -- e.g. "Healey Route"
  driver_id uuid references drivers(id),
  weekly_revenue numeric default 0,
  fuel_cost numeric default 0,
  other_costs numeric default 0,
  status text default 'active', -- 'active' | 'idle'
  created_at timestamp default now()
);

-- Weekly snapshots (for profit chart)
create table weekly_snapshots (
  id uuid default gen_random_uuid() primary key,
  week_label text not null,     -- e.g. "W1", "W2"
  revenue numeric default 0,
  profit numeric default 0,
  recorded_at timestamp default now()
);

-- Documents table
create table documents (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  folder text not null,         -- 'insurance' | 'drivers' | 'vehicles' | 'payroll'
  file_type text,               -- 'PDF' | 'IMG' | 'DOC'
  uploaded_at timestamp default now()
);

-- Phase tasks table
create table phase_tasks (
  id uuid default gen_random_uuid() primary key,
  phase_id integer not null,    -- 1–5
  label text not null,
  completed boolean default false
);

-- Enable Row Level Security (RLS) on all tables
alter table drivers enable row level security;
alter table trucks enable row level security;
alter table weekly_snapshots enable row level security;
alter table documents enable row level security;
alter table phase_tasks enable row level security;

-- Create policies to allow authenticated users full access
-- (In production, you'd want more granular policies)

create policy "Allow authenticated users full access to drivers"
  on drivers for all
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users full access to trucks"
  on trucks for all
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users full access to weekly_snapshots"
  on weekly_snapshots for all
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users full access to documents"
  on documents for all
  using (auth.role() = 'authenticated');

create policy "Allow authenticated users full access to phase_tasks"
  on phase_tasks for all
  using (auth.role() = 'authenticated');

-- Seed data
-- Drivers (start with zero financial data)
insert into drivers (name, truck_id, status) values
  ('Joseph Pedro', 'z455', 'active'),
  ('Mark Parra',   'z420', 'active');

-- Trucks (zero revenue to start)
insert into trucks (name, route, weekly_revenue, fuel_cost, other_costs, status) values
  ('z455', 'Healey Route', 0, 0, 0, 'active'),
  ('z420', 'Healey Route', 0, 0, 0, 'active');
