# Architecture

This project is a Next.js marketing site with server-side lead capture and booking workflows.

Even though the product is primarily a landing page, it still contains backend responsibilities such as:
- contact form submission handling
- Turnstile verification
- Supabase writes
- booking creation
- automation job scheduling
- email notifications

Because of that, the codebase is split into:
- framework/UI code in `src/app` and `src/components`
- server-side business logic in `src/backend`

## High-Level Structure

```txt
src/
  app/
    api/
    blog/
    crm/
    thank-you/
  backend/
    constants/
    controllers/
    infrastructure/
    models/
    repositories/
    services/
  components/
  data/
  images/
  lib/
```

## Layer Responsibilities

### `src/app`

Framework layer only.

Use this for:
- Next.js pages
- layouts
- route handlers
- metadata files like `robots.ts` and `sitemap.ts`

Rules:
- keep route files thin
- do not place database or email workflow logic directly in route files
- route files should delegate to controllers

### `src/backend/controllers`

HTTP orchestration layer.

Use this for:
- reading request payloads
- validating required request fields
- calling the correct service
- returning `NextResponse`

Current examples:
- `contactController.ts`
- `bookingController.ts`

Rules:
- controllers should stay close to request/response logic
- avoid putting direct Supabase query logic here

### `src/backend/services`

Business logic layer.

Use this for:
- lead capture flow
- booking flow
- automation scheduling
- input normalization and scoring
- notification orchestration

Current examples:
- `leadService.ts`
- `bookingService.ts`
- `automationService.ts`
- `contactValidationService.ts`
- `requestSecurityService.ts`
- `notificationService.ts`

Rules:
- services coordinate business workflows
- services should not return raw HTTP responses
- services should use repositories and infrastructure instead of talking directly to every external dependency inline

### `src/backend/repositories`

Persistence layer.

Use this for:
- Supabase queries
- table reads and writes
- booking slot fetches
- automation job persistence

Current examples:
- `contactRepository.ts`
- `leadRepository.ts`
- `submissionRepository.ts`
- `activityRepository.ts`
- `bookingRepository.ts`
- `slotRepository.ts`
- `automationRepository.ts`

Rules:
- table names and query details should mostly live here
- avoid mixing business decision logic into repository functions

### `src/backend/infrastructure`

External integration layer.

Use this for:
- Supabase client setup
- SMTP transport
- Turnstile verification

Current examples:
- `supabase/adminClient.ts`
- `mail/mailTransport.ts`
- `security/turnstile.ts`

Rules:
- infrastructure talks directly to third-party systems
- keep these modules reusable and low-level

### `src/backend/models`

Shared backend types.

Use this for:
- payload types
- normalized input shapes
- booking models
- automation models

Current examples:
- `contact.ts`
- `booking.ts`
- `automation.ts`

### `src/backend/constants`

Static domain values and limits.

Use this for:
- form limits
- booking defaults
- automation rule keys
- timing values
- pipeline/status strings

Current examples:
- `contact.ts`
- `booking.ts`
- `automation.ts`

Rules:
- avoid magic strings and numbers in controllers and services

## Request Flow

Typical lead submission flow:

```txt
POST /api/contact
  -> contact route
  -> contactController
  -> leadService
  -> repositories
  -> automationService
  -> notificationService
```

Typical booking flow:

```txt
POST /api/booking
  -> booking route
  -> bookingController
  -> bookingService
  -> repositories
  -> automationService
```

## Current Intent

This architecture is intentionally pragmatic.

The project is not a separate standalone frontend and backend application.
It is one Next.js app with:
- UI concerns
- server-side workflow concerns

The folder structure makes those responsibilities explicit.

## Why `src/backend` Exists

This repo is not just static UI anymore.

The presence of:
- form submission handling
- booking workflows
- database writes
- email sending
- automation scheduling

means the app has real server-side behavior.

That is why `src/backend` exists.

If needed later, this folder could be renamed to `src/server` without changing the architectural intent.

## What Goes Where

Use this rule of thumb:

- If it returns `NextResponse`, it belongs in a controller.
- If it decides what the business workflow should do, it belongs in a service.
- If it queries Supabase tables, it belongs in a repository.
- If it configures SMTP, Turnstile, or Supabase clients, it belongs in infrastructure.
- If it is a shared backend type, it belongs in models.
- If it is a reusable static value, it belongs in constants.

## Guardrails

When extending this project:

- do not add complex logic directly inside `src/app/api`
- do not reintroduce all-purpose monolithic service files
- prefer small focused services and repositories
- keep controller files thin
- keep constants centralized if reused across modules

## Summary

Main rule:

```txt
app handles framework and page concerns
backend handles server-side business concerns
```

This keeps the landing page easy to evolve even as lead capture and booking logic become more sophisticated.
