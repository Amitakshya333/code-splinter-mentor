-- Seed AWS EC2 workflow with all 10 steps
-- Maps data from navigatorModules.ts to database schema

-- Insert the EC2 Management workflow
INSERT INTO public.workflows (name, platform, description, estimated_time, difficulty, total_steps)
VALUES (
  'EC2 Management',
  'aws',
  'Launch and manage virtual servers',
  30,
  'beginner',
  10
)
ON CONFLICT DO NOTHING;

-- Get the workflow ID (assuming it was just created or already exists)
DO $$
DECLARE
  workflow_uuid UUID;
BEGIN
  -- Get or create workflow ID
  SELECT id INTO workflow_uuid
  FROM public.workflows
  WHERE name = 'EC2 Management' AND platform = 'aws'
  LIMIT 1;

  -- If workflow doesn't exist, create it
  IF workflow_uuid IS NULL THEN
    INSERT INTO public.workflows (name, platform, description, estimated_time, difficulty, total_steps)
    VALUES ('EC2 Management', 'aws', 'Launch and manage virtual servers', 30, 'beginner', 10)
    RETURNING id INTO workflow_uuid;
  END IF;

  -- Insert all 10 steps
  INSERT INTO public.steps (workflow_id, order_number, title, description, action_type, ai_context)
  VALUES
    (workflow_uuid, 1, 'Open AWS Console', 'Navigate to EC2 Dashboard', 'open-console', 'User needs to access AWS Console and navigate to EC2 service. This is the first step in launching an EC2 instance.'),
    (workflow_uuid, 2, 'Launch Instance', 'Click the orange "Launch Instance" button', 'click-launch', 'User should click the Launch Instance button in the EC2 dashboard to start the instance creation wizard.'),
    (workflow_uuid, 3, 'Name Your Instance', 'Enter a descriptive name for your server', 'name-instance', 'User should provide a meaningful name for their EC2 instance. This helps with organization and identification later.'),
    (workflow_uuid, 4, 'Select AMI', 'Choose Amazon Linux 2023 AMI (Free tier eligible)', 'select-ami', 'User should select Amazon Linux 2023 AMI which is free tier eligible. Amazon Linux is optimized for AWS services.'),
    (workflow_uuid, 5, 'Choose Instance Type', 'Select t2.micro (Free tier eligible)', 'select-type', 'User should select t2.micro instance type which is free tier eligible. Other instance types may incur charges.'),
    (workflow_uuid, 6, 'Create Key Pair', 'Create or select an existing key pair for SSH access', 'create-keypair', 'User needs to create or select a key pair for SSH access. They must download and save the .pem file securely as it cannot be retrieved later.'),
    (workflow_uuid, 7, 'Configure Security Group', 'Allow SSH (port 22) from your IP', 'configure-security', 'User should configure security group to allow SSH access from their IP address. Never allow 0.0.0.0/0 for SSH in production as it exposes the instance to the entire internet.'),
    (workflow_uuid, 8, 'Configure Storage', 'Set root volume to 8 GiB (Free tier eligible)', 'configure-storage', 'User should set the root volume size to 8 GiB which is within the free tier limits. Additional storage may incur charges.'),
    (workflow_uuid, 9, 'Review & Launch', 'Review all settings and click Launch', 'review-launch', 'User should carefully review all settings before launching. Once launched, the instance will start and may incur charges if not within free tier.'),
    (workflow_uuid, 10, 'Connect to Instance', 'Use EC2 Instance Connect or SSH', 'connect-instance', 'User can connect to their instance using EC2 Instance Connect (browser-based) or SSH using the key pair they created. They need the public IP or DNS name of the instance.')
  ON CONFLICT (workflow_id, order_number) DO NOTHING;
END $$;

