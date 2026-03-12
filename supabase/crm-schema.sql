create extension if not exists pgcrypto;

create table if not exists contacts (
  contact_id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  company text,
  service_interest text,
  lead_source text default 'Website',
  created_at timestamptz not null default now()
);

create table if not exists leads (
  lead_id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contacts(contact_id) on delete cascade,
  pipeline text not null default 'Agency Sales',
  stage text not null default 'New Lead',
  lead_score integer not null default 0,
  priority text not null default 'Low',
  created_at timestamptz not null default now()
);

create table if not exists form_submissions (
  form_id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contacts(contact_id) on delete cascade,
  form_name text not null default 'Website Inquiry',
  business_type text,
  service_selected text,
  inquiries_per_week text,
  message text,
  submitted_at timestamptz not null default now()
);

create table if not exists activities (
  activity_id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references contacts(contact_id) on delete cascade,
  type text not null,
  activity_date timestamptz not null default now(),
  outcome text,
  notes text
);

create index if not exists idx_leads_stage on leads(stage);
create index if not exists idx_leads_priority on leads(priority);
create index if not exists idx_leads_created_at on leads(created_at desc);
create index if not exists idx_form_submissions_contact_id on form_submissions(contact_id);
create index if not exists idx_activities_contact_id on activities(contact_id);
create index if not exists idx_activities_activity_date on activities(activity_date desc);
