-- WARNING: This schema is for context only and is not meant to be run as a full reset.
-- It reflects the shared Supabase structure used by the website and CRM apps.

CREATE TABLE public.activities (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  contact_id bigint NOT NULL,
  type text NOT NULL,
  activity_date timestamp with time zone DEFAULT now(),
  outcome text,
  notes text,
  created_by uuid,
  booking_id bigint,
  CONSTRAINT activities_pkey PRIMARY KEY (id),
  CONSTRAINT activities_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id),
  CONSTRAINT activities_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.user_profiles(id),
  CONSTRAINT activities_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id)
);

CREATE TABLE public.availability_rules (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid,
  day_of_week integer NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  slot_duration integer DEFAULT 30,
  buffer_minutes integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT availability_rules_pkey PRIMARY KEY (id),
  CONSTRAINT availability_rules_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);

CREATE TABLE public.available_slots (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  rule_id bigint,
  slot_date date NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  is_booked boolean DEFAULT false,
  booking_id bigint,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT available_slots_pkey PRIMARY KEY (id),
  CONSTRAINT available_slots_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES public.availability_rules(id)
);

CREATE TABLE public.bookings (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  contact_id bigint NOT NULL,
  form_submission_id bigint,
  slot_id bigint NOT NULL,
  meeting_link text,
  status text DEFAULT 'scheduled'::text,
  reminder_sent boolean DEFAULT false,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id),
  CONSTRAINT bookings_form_submission_id_fkey FOREIGN KEY (form_submission_id) REFERENCES public.form_submissions(id),
  CONSTRAINT bookings_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.available_slots(id)
);

CREATE TABLE public.contacts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  company text,
  service_interest text,
  lead_source text DEFAULT 'Website'::text,
  created_at timestamp with time zone DEFAULT now(),
  name text,
  CONSTRAINT contacts_pkey PRIMARY KEY (id)
);

CREATE TABLE public.form_submissions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  contact_id bigint NOT NULL,
  form_name text DEFAULT 'Website Inquiry'::text,
  business_type text,
  inquiries_per_week text,
  message text,
  submitted_at timestamp with time zone DEFAULT now(),
  service_selected text,
  CONSTRAINT form_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT form_submissions_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id)
);

CREATE TABLE public.leads (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  contact_id bigint NOT NULL,
  pipeline text DEFAULT 'Agency Sales'::text,
  stage text DEFAULT 'New Lead'::text,
  lead_score integer DEFAULT 0,
  priority text DEFAULT 'Medium'::text,
  created_at timestamp with time zone DEFAULT now(),
  assigned_to uuid,
  CONSTRAINT leads_pkey PRIMARY KEY (id),
  CONSTRAINT leads_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id),
  CONSTRAINT leads_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.user_profiles(id)
);

CREATE TABLE public.roles (
  id bigint NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);

CREATE TABLE public.user_profiles (
  id uuid NOT NULL,
  role_id bigint,
  full_name text,
  email text UNIQUE,
  status text NOT NULL DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT user_profiles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id)
);

CREATE TABLE public.automation_rules (
  key text NOT NULL,
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  channel text NOT NULL DEFAULT 'email'::text,
  delay_minutes integer NOT NULL DEFAULT 0,
  template_key text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT automation_rules_pkey PRIMARY KEY (key)
);

CREATE TABLE public.automation_jobs (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  rule_key text NOT NULL,
  contact_id bigint NOT NULL,
  lead_id bigint,
  booking_id bigint,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'processing'::text, 'sent'::text, 'failed'::text, 'cancelled'::text])),
  scheduled_for timestamp with time zone NOT NULL,
  sent_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  last_error text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  dedupe_key text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT automation_jobs_pkey PRIMARY KEY (id),
  CONSTRAINT automation_jobs_rule_key_fkey FOREIGN KEY (rule_key) REFERENCES public.automation_rules(key),
  CONSTRAINT automation_jobs_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON DELETE CASCADE,
  CONSTRAINT automation_jobs_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE,
  CONSTRAINT automation_jobs_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE,
  CONSTRAINT automation_jobs_dedupe_key_key UNIQUE (dedupe_key)
);

CREATE INDEX idx_leads_stage ON public.leads USING btree (stage);
CREATE INDEX idx_leads_priority ON public.leads USING btree (priority);
CREATE INDEX idx_leads_created_at ON public.leads USING btree (created_at DESC);
CREATE INDEX idx_form_submissions_contact_id ON public.form_submissions USING btree (contact_id);
CREATE INDEX idx_activities_contact_id ON public.activities USING btree (contact_id);
CREATE INDEX idx_activities_activity_date ON public.activities USING btree (activity_date DESC);
CREATE INDEX idx_automation_jobs_status_scheduled_for ON public.automation_jobs USING btree (status, scheduled_for);
CREATE INDEX idx_automation_jobs_contact_id ON public.automation_jobs USING btree (contact_id);
CREATE INDEX idx_automation_jobs_lead_id ON public.automation_jobs USING btree (lead_id);
CREATE INDEX idx_automation_jobs_booking_id ON public.automation_jobs USING btree (booking_id);

INSERT INTO public.automation_rules (key, name, is_active, channel, delay_minutes, template_key)
VALUES
  ('lead_instant_reply', 'Lead Instant Reply', true, 'email', 0, 'lead_instant_reply'),
  ('lead_no_booking_24h', 'Lead No Booking 24h', true, 'email', 1440, 'lead_no_booking_24h'),
  ('booking_confirmation', 'Booking Confirmation', true, 'email', 0, 'booking_confirmation'),
  ('booking_reminder_24h', 'Booking Reminder 24h', true, 'email', 0, 'booking_reminder_24h'),
  ('booking_reminder_1h', 'Booking Reminder 1h', true, 'email', 0, 'booking_reminder_1h')
ON CONFLICT (key) DO UPDATE
SET
  name = EXCLUDED.name,
  is_active = EXCLUDED.is_active,
  channel = EXCLUDED.channel,
  delay_minutes = EXCLUDED.delay_minutes,
  template_key = EXCLUDED.template_key;
