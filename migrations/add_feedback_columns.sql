-- Add new columns to the feedback table
ALTER TABLE "feedback" ADD COLUMN IF NOT EXISTS "name" text;
ALTER TABLE "feedback" ADD COLUMN IF NOT EXISTS "email" text;
ALTER TABLE "feedback" ADD COLUMN IF NOT EXISTS "message" text;

-- Update existing records to extract structured data if possible
UPDATE "feedback"
SET 
  "name" = CASE 
    WHEN "feedback" ~ 'Name/Username:\s*(.+?)(?=\n|$)' 
    THEN regexp_replace("feedback", '.*Name/Username:\s*(.+?)(?=\n|$).*', '\1', 'g')
    ELSE NULL
  END,
  "email" = CASE 
    WHEN "feedback" ~ 'Email:\s*(.+?)(?=\n|$)' 
    THEN regexp_replace("feedback", '.*Email:\s*(.+?)(?=\n|$).*', '\1', 'g')
    ELSE NULL
  END,
  "message" = CASE 
    WHEN "feedback" ~ 'Message:\s*(.+?)(?=\n|$)' 
    THEN regexp_replace("feedback", '.*Message:\s*(.+?)(?=\n|$).*', '\1', 'g')
    ELSE NULL
  END
WHERE "feedback" LIKE '%Name/Username:%' OR "feedback" LIKE '%Email:%' OR "feedback" LIKE '%Message:%'; 