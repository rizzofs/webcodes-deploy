-- Add unique constraint to email column to prevent duplicate registrations
ALTER TABLE workshop_registrations ADD CONSTRAINT workshop_registrations_email_key UNIQUE (email);
