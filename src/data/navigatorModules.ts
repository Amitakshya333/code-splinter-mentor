// Comprehensive Navigator Module Data Structure

export interface NavigatorStepData {
  id: string;
  title: string;
  instruction: string;
  action: string;
  tip?: string;
  warning?: string;
}

export interface NavigatorModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  steps: NavigatorStepData[];
}

export interface NavigatorSubCategory {
  id: string;
  name: string;
  modules: NavigatorModule[];
}

export interface NavigatorCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  subCategories: NavigatorSubCategory[];
}

// ==================== AWS NAVIGATOR ====================
const awsCategory: NavigatorCategory = {
  id: 'aws',
  name: 'AWS',
  icon: 'Cloud',
  color: 'orange',
  subCategories: [
    {
      id: 'aws-compute',
      name: 'Compute',
      modules: [
        {
          id: 'ec2-management',
          name: 'EC2 Management',
          description: 'Launch and manage virtual servers',
          icon: 'Server',
          steps: [
            { id: '1', title: 'Open AWS Console', instruction: 'Navigate to EC2 Dashboard', action: 'open-console', tip: 'Bookmark the EC2 dashboard for quick access' },
            { id: '2', title: 'Launch Instance', instruction: 'Click the orange "Launch Instance" button', action: 'click-launch' },
            { id: '3', title: 'Name Your Instance', instruction: 'Enter a descriptive name for your server', action: 'name-instance' },
            { id: '4', title: 'Select AMI', instruction: 'Choose Amazon Linux 2023 AMI (Free tier eligible)', action: 'select-ami', tip: 'Amazon Linux is optimized for AWS' },
            { id: '5', title: 'Choose Instance Type', instruction: 'Select t2.micro (Free tier eligible)', action: 'select-type', warning: 'Other instance types may incur charges' },
            { id: '6', title: 'Create Key Pair', instruction: 'Create or select an existing key pair for SSH access', action: 'create-keypair', tip: 'Download and save your .pem file securely' },
            { id: '7', title: 'Configure Security Group', instruction: 'Allow SSH (port 22) from your IP', action: 'configure-security', warning: 'Never allow 0.0.0.0/0 for SSH in production' },
            { id: '8', title: 'Configure Storage', instruction: 'Set root volume to 8 GiB (Free tier eligible)', action: 'configure-storage' },
            { id: '9', title: 'Review & Launch', instruction: 'Review all settings and click Launch', action: 'review-launch' },
            { id: '10', title: 'Connect to Instance', instruction: 'Use EC2 Instance Connect or SSH', action: 'connect-instance' },
          ]
        },
        {
          id: 'lambda-functions',
          name: 'Lambda Functions',
          description: 'Run serverless code',
          icon: 'Zap',
          steps: [
            { id: '1', title: 'Open Lambda Console', instruction: 'Navigate to AWS Lambda service', action: 'open-lambda' },
            { id: '2', title: 'Create Function', instruction: 'Click "Create function" button', action: 'create-function' },
            { id: '3', title: 'Choose Blueprint', instruction: 'Select "Author from scratch"', action: 'choose-blueprint' },
            { id: '4', title: 'Configure Function', instruction: 'Name your function and select runtime (Node.js/Python)', action: 'configure-function' },
            { id: '5', title: 'Set Permissions', instruction: 'Create new role with basic Lambda permissions', action: 'set-permissions' },
            { id: '6', title: 'Write Code', instruction: 'Add your function code in the editor', action: 'write-code', tip: 'Start with the hello world template' },
            { id: '7', title: 'Configure Trigger', instruction: 'Add API Gateway or other event source', action: 'add-trigger' },
            { id: '8', title: 'Test Function', instruction: 'Create test event and run function', action: 'test-function' },
            { id: '9', title: 'View Logs', instruction: 'Check CloudWatch logs for output', action: 'view-logs' },
            { id: '10', title: 'Deploy', instruction: 'Deploy your function to production', action: 'deploy-function' },
          ]
        },
        {
          id: 'auto-scaling',
          name: 'Auto Scaling',
          description: 'Automatically scale EC2 capacity',
          icon: 'TrendingUp',
          steps: [
            { id: '1', title: 'Create Launch Template', instruction: 'Define instance configuration template', action: 'create-template' },
            { id: '2', title: 'Open Auto Scaling', instruction: 'Navigate to EC2 Auto Scaling Groups', action: 'open-asg' },
            { id: '3', title: 'Create ASG', instruction: 'Click "Create Auto Scaling group"', action: 'create-asg' },
            { id: '4', title: 'Select Template', instruction: 'Choose your launch template', action: 'select-template' },
            { id: '5', title: 'Configure Network', instruction: 'Select VPC and availability zones', action: 'configure-network' },
            { id: '6', title: 'Set Capacity', instruction: 'Define min, max, and desired capacity', action: 'set-capacity', tip: 'Start with min=1, max=3 for testing' },
            { id: '7', title: 'Configure Scaling', instruction: 'Set up scaling policies (target tracking)', action: 'configure-scaling' },
            { id: '8', title: 'Add Notifications', instruction: 'Configure SNS notifications for scaling events', action: 'add-notifications' },
            { id: '9', title: 'Review & Create', instruction: 'Review settings and create ASG', action: 'review-create' },
          ]
        },
        {
          id: 'ecs-fargate',
          name: 'ECS / Fargate',
          description: 'Run containerized applications',
          icon: 'Container',
          steps: [
            { id: '1', title: 'Open ECS Console', instruction: 'Navigate to Amazon ECS', action: 'open-ecs' },
            { id: '2', title: 'Create Cluster', instruction: 'Click "Create Cluster"', action: 'create-cluster' },
            { id: '3', title: 'Select Fargate', instruction: 'Choose "AWS Fargate" as infrastructure', action: 'select-fargate', tip: 'Fargate is serverless - no EC2 management needed' },
            { id: '4', title: 'Create Task Definition', instruction: 'Define your container configuration', action: 'create-task-def' },
            { id: '5', title: 'Configure Container', instruction: 'Set image, port mappings, and resources', action: 'configure-container' },
            { id: '6', title: 'Create Service', instruction: 'Deploy task as a service', action: 'create-service' },
            { id: '7', title: 'Configure Load Balancer', instruction: 'Attach ALB for traffic distribution', action: 'configure-lb' },
            { id: '8', title: 'Set Scaling', instruction: 'Configure service auto-scaling', action: 'set-scaling' },
            { id: '9', title: 'Deploy', instruction: 'Launch your containerized application', action: 'deploy-service' },
          ]
        },
        {
          id: 'eks-basics',
          name: 'EKS Basics',
          description: 'Managed Kubernetes service',
          icon: 'Boxes',
          steps: [
            { id: '1', title: 'Open EKS Console', instruction: 'Navigate to Amazon EKS', action: 'open-eks' },
            { id: '2', title: 'Create Cluster', instruction: 'Click "Create cluster"', action: 'create-eks-cluster' },
            { id: '3', title: 'Configure Cluster', instruction: 'Name cluster and select Kubernetes version', action: 'configure-cluster' },
            { id: '4', title: 'Set IAM Role', instruction: 'Create or select EKS cluster role', action: 'set-iam-role' },
            { id: '5', title: 'Configure Networking', instruction: 'Select VPC, subnets, and security groups', action: 'configure-networking' },
            { id: '6', title: 'Add Node Group', instruction: 'Create managed node group for worker nodes', action: 'add-node-group' },
            { id: '7', title: 'Install kubectl', instruction: 'Set up kubectl and update kubeconfig', action: 'install-kubectl' },
            { id: '8', title: 'Deploy Application', instruction: 'Deploy your first app with kubectl', action: 'deploy-app' },
          ]
        },
      ]
    },
    {
      id: 'aws-networking',
      name: 'Networking',
      modules: [
        {
          id: 'vpc-setup',
          name: 'VPC Setup',
          description: 'Create isolated virtual networks',
          icon: 'Network',
          steps: [
            { id: '1', title: 'Open VPC Console', instruction: 'Navigate to VPC Dashboard', action: 'open-vpc' },
            { id: '2', title: 'Create VPC', instruction: 'Click "Create VPC"', action: 'create-vpc' },
            { id: '3', title: 'Configure VPC', instruction: 'Set CIDR block (e.g., 10.0.0.0/16)', action: 'configure-vpc', tip: '/16 gives you 65,536 IP addresses' },
            { id: '4', title: 'Enable DNS', instruction: 'Enable DNS hostnames and resolution', action: 'enable-dns' },
            { id: '5', title: 'Create Subnets', instruction: 'Create public and private subnets', action: 'create-subnets' },
            { id: '6', title: 'Create Internet Gateway', instruction: 'Create and attach IGW to VPC', action: 'create-igw' },
            { id: '7', title: 'Configure Route Tables', instruction: 'Create routes for public/private subnets', action: 'configure-routes' },
            { id: '8', title: 'Create NAT Gateway', instruction: 'Enable private subnet internet access', action: 'create-nat', warning: 'NAT Gateway has hourly charges' },
          ]
        },
        {
          id: 'subnets',
          name: 'Subnets',
          description: 'Segment your VPC',
          icon: 'LayoutGrid',
          steps: [
            { id: '1', title: 'Open Subnets', instruction: 'Navigate to VPC > Subnets', action: 'open-subnets' },
            { id: '2', title: 'Create Subnet', instruction: 'Click "Create subnet"', action: 'create-subnet' },
            { id: '3', title: 'Select VPC', instruction: 'Choose your target VPC', action: 'select-vpc' },
            { id: '4', title: 'Configure Public Subnet', instruction: 'Set CIDR (e.g., 10.0.1.0/24) in AZ-a', action: 'configure-public' },
            { id: '5', title: 'Configure Private Subnet', instruction: 'Set CIDR (e.g., 10.0.2.0/24) in AZ-a', action: 'configure-private' },
            { id: '6', title: 'Enable Auto-assign IP', instruction: 'Enable for public subnets only', action: 'enable-auto-ip' },
            { id: '7', title: 'Associate Route Table', instruction: 'Link subnets to appropriate route tables', action: 'associate-routes' },
          ]
        },
        {
          id: 'igw-nat',
          name: 'Internet Gateway / NAT',
          description: 'Connect VPC to internet',
          icon: 'Globe',
          steps: [
            { id: '1', title: 'Create Internet Gateway', instruction: 'Navigate to VPC > Internet Gateways', action: 'create-igw' },
            { id: '2', title: 'Attach to VPC', instruction: 'Attach IGW to your VPC', action: 'attach-igw' },
            { id: '3', title: 'Update Route Table', instruction: 'Add 0.0.0.0/0 route to IGW', action: 'update-routes' },
            { id: '4', title: 'Allocate Elastic IP', instruction: 'Allocate EIP for NAT Gateway', action: 'allocate-eip' },
            { id: '5', title: 'Create NAT Gateway', instruction: 'Create NAT in public subnet', action: 'create-nat' },
            { id: '6', title: 'Update Private Routes', instruction: 'Route private subnet traffic through NAT', action: 'update-private-routes' },
          ]
        },
        {
          id: 'route53',
          name: 'Route 53 Basics',
          description: 'DNS and domain management',
          icon: 'MapPin',
          steps: [
            { id: '1', title: 'Open Route 53', instruction: 'Navigate to Route 53 console', action: 'open-route53' },
            { id: '2', title: 'Register Domain', instruction: 'Register or transfer a domain', action: 'register-domain' },
            { id: '3', title: 'Create Hosted Zone', instruction: 'Create public hosted zone', action: 'create-hosted-zone' },
            { id: '4', title: 'Create A Record', instruction: 'Point domain to your resource', action: 'create-a-record' },
            { id: '5', title: 'Create CNAME', instruction: 'Create alias for subdomains', action: 'create-cname' },
            { id: '6', title: 'Configure Health Check', instruction: 'Set up endpoint health monitoring', action: 'configure-health' },
            { id: '7', title: 'Test DNS', instruction: 'Verify DNS resolution', action: 'test-dns' },
          ]
        },
        {
          id: 'load-balancing',
          name: 'Load Balancing',
          description: 'Distribute traffic with ELB/ALB',
          icon: 'Share2',
          steps: [
            { id: '1', title: 'Open EC2 Load Balancers', instruction: 'Navigate to EC2 > Load Balancers', action: 'open-lb' },
            { id: '2', title: 'Create ALB', instruction: 'Click "Create Load Balancer" > Application', action: 'create-alb' },
            { id: '3', title: 'Configure Basic', instruction: 'Name LB and select internet-facing', action: 'configure-basic' },
            { id: '4', title: 'Configure Listeners', instruction: 'Set up HTTP (80) and HTTPS (443)', action: 'configure-listeners' },
            { id: '5', title: 'Select Subnets', instruction: 'Choose availability zones', action: 'select-subnets' },
            { id: '6', title: 'Configure Security', instruction: 'Select or create security group', action: 'configure-security' },
            { id: '7', title: 'Create Target Group', instruction: 'Define health checks and targets', action: 'create-target-group' },
            { id: '8', title: 'Register Targets', instruction: 'Add EC2 instances to target group', action: 'register-targets' },
            { id: '9', title: 'Review & Create', instruction: 'Launch load balancer', action: 'review-create' },
          ]
        },
      ]
    },
    {
      id: 'aws-database',
      name: 'Database',
      modules: [
        {
          id: 'rds-setup',
          name: 'RDS Setup',
          description: 'Managed relational databases',
          icon: 'Database',
          steps: [
            { id: '1', title: 'Open RDS Console', instruction: 'Navigate to Amazon RDS', action: 'open-rds' },
            { id: '2', title: 'Create Database', instruction: 'Click "Create database"', action: 'create-db' },
            { id: '3', title: 'Choose Engine', instruction: 'Select MySQL, PostgreSQL, or other', action: 'choose-engine' },
            { id: '4', title: 'Select Template', instruction: 'Choose Free tier for testing', action: 'select-template', tip: 'Free tier includes 750 hours/month' },
            { id: '5', title: 'Configure Instance', instruction: 'Set DB instance identifier and credentials', action: 'configure-instance' },
            { id: '6', title: 'Choose Instance Class', instruction: 'Select db.t3.micro for free tier', action: 'choose-class' },
            { id: '7', title: 'Configure Storage', instruction: 'Set storage type and size', action: 'configure-storage' },
            { id: '8', title: 'Configure Connectivity', instruction: 'Select VPC and security group', action: 'configure-connectivity' },
            { id: '9', title: 'Create Database', instruction: 'Review and create RDS instance', action: 'create-rds' },
            { id: '10', title: 'Connect', instruction: 'Use endpoint to connect from application', action: 'connect-db' },
          ]
        },
        {
          id: 'dynamodb-basics',
          name: 'DynamoDB Basics',
          description: 'NoSQL database service',
          icon: 'Table',
          steps: [
            { id: '1', title: 'Open DynamoDB', instruction: 'Navigate to DynamoDB console', action: 'open-dynamodb' },
            { id: '2', title: 'Create Table', instruction: 'Click "Create table"', action: 'create-table' },
            { id: '3', title: 'Define Table', instruction: 'Set table name and partition key', action: 'define-table' },
            { id: '4', title: 'Add Sort Key', instruction: 'Optionally add sort key for queries', action: 'add-sort-key', tip: 'Sort keys enable range queries' },
            { id: '5', title: 'Configure Settings', instruction: 'Choose on-demand or provisioned capacity', action: 'configure-settings' },
            { id: '6', title: 'Create Table', instruction: 'Review and create table', action: 'create-dynamodb' },
            { id: '7', title: 'Create Item', instruction: 'Add your first item to table', action: 'create-item' },
            { id: '8', title: 'Query Data', instruction: 'Run queries using partition key', action: 'query-data' },
          ]
        },
        {
          id: 'aurora-intro',
          name: 'Aurora Intro',
          description: 'High-performance cloud database',
          icon: 'Sparkles',
          steps: [
            { id: '1', title: 'Open RDS Console', instruction: 'Navigate to Amazon RDS', action: 'open-rds' },
            { id: '2', title: 'Create Aurora', instruction: 'Select Amazon Aurora engine', action: 'create-aurora' },
            { id: '3', title: 'Choose Compatibility', instruction: 'Select MySQL or PostgreSQL compatible', action: 'choose-compat' },
            { id: '4', title: 'Select Serverless v2', instruction: 'Choose Aurora Serverless for auto-scaling', action: 'select-serverless' },
            { id: '5', title: 'Configure Capacity', instruction: 'Set min/max ACU for scaling', action: 'configure-capacity' },
            { id: '6', title: 'Create Cluster', instruction: 'Launch Aurora cluster', action: 'create-cluster' },
          ]
        },
        {
          id: 'elasticache',
          name: 'ElastiCache',
          description: 'In-memory caching',
          icon: 'Zap',
          steps: [
            { id: '1', title: 'Open ElastiCache', instruction: 'Navigate to ElastiCache console', action: 'open-elasticache' },
            { id: '2', title: 'Choose Engine', instruction: 'Select Redis or Memcached', action: 'choose-engine' },
            { id: '3', title: 'Create Cluster', instruction: 'Click "Create cluster"', action: 'create-cache' },
            { id: '4', title: 'Configure Node', instruction: 'Select node type and count', action: 'configure-node' },
            { id: '5', title: 'Configure Network', instruction: 'Select subnet group and security', action: 'configure-network' },
            { id: '6', title: 'Launch Cluster', instruction: 'Create ElastiCache cluster', action: 'launch-cluster' },
          ]
        },
      ]
    },
    {
      id: 'aws-storage',
      name: 'Storage',
      modules: [
        {
          id: 's3-buckets',
          name: 'S3 Buckets',
          description: 'Object storage in the cloud',
          icon: 'HardDrive',
          steps: [
            { id: '1', title: 'Open S3 Console', instruction: 'Navigate to Amazon S3', action: 'open-s3' },
            { id: '2', title: 'Create Bucket', instruction: 'Click "Create bucket"', action: 'create-bucket' },
            { id: '3', title: 'Name Bucket', instruction: 'Enter globally unique bucket name', action: 'name-bucket', tip: 'Bucket names must be globally unique' },
            { id: '4', title: 'Select Region', instruction: 'Choose AWS region for bucket', action: 'select-region' },
            { id: '5', title: 'Block Public Access', instruction: 'Keep public access blocked', action: 'block-public', warning: 'Only enable public access if required' },
            { id: '6', title: 'Enable Versioning', instruction: 'Turn on versioning for backups', action: 'enable-versioning' },
            { id: '7', title: 'Create Bucket', instruction: 'Review and create bucket', action: 'create-s3' },
            { id: '8', title: 'Upload Object', instruction: 'Upload your first file', action: 'upload-object' },
            { id: '9', title: 'Set Permissions', instruction: 'Configure bucket policy if needed', action: 'set-permissions' },
          ]
        },
        {
          id: 'ebs',
          name: 'EBS',
          description: 'Block storage for EC2',
          icon: 'HardDrive',
          steps: [
            { id: '1', title: 'Open EC2 Volumes', instruction: 'Navigate to EC2 > Elastic Block Store', action: 'open-ebs' },
            { id: '2', title: 'Create Volume', instruction: 'Click "Create volume"', action: 'create-volume' },
            { id: '3', title: 'Select Type', instruction: 'Choose gp3 (General Purpose SSD)', action: 'select-type' },
            { id: '4', title: 'Configure Size', instruction: 'Set volume size in GiB', action: 'configure-size' },
            { id: '5', title: 'Select AZ', instruction: 'Must match EC2 instance AZ', action: 'select-az', warning: 'Volume must be in same AZ as instance' },
            { id: '6', title: 'Create Volume', instruction: 'Launch EBS volume', action: 'create-ebs' },
            { id: '7', title: 'Attach Volume', instruction: 'Attach to EC2 instance', action: 'attach-volume' },
            { id: '8', title: 'Mount Volume', instruction: 'SSH and mount the volume', action: 'mount-volume' },
          ]
        },
        {
          id: 'efs',
          name: 'EFS',
          description: 'Shared file storage',
          icon: 'FolderSync',
          steps: [
            { id: '1', title: 'Open EFS Console', instruction: 'Navigate to Amazon EFS', action: 'open-efs' },
            { id: '2', title: 'Create File System', instruction: 'Click "Create file system"', action: 'create-fs' },
            { id: '3', title: 'Configure Storage', instruction: 'Choose standard or one-zone', action: 'configure-storage' },
            { id: '4', title: 'Configure Network', instruction: 'Select VPC and mount targets', action: 'configure-network' },
            { id: '5', title: 'Set Security', instruction: 'Configure security groups', action: 'set-security' },
            { id: '6', title: 'Create EFS', instruction: 'Launch file system', action: 'create-efs' },
            { id: '7', title: 'Mount on EC2', instruction: 'Install EFS utils and mount', action: 'mount-efs' },
          ]
        },
        {
          id: 'glacier',
          name: 'Glacier',
          description: 'Archive storage',
          icon: 'Archive',
          steps: [
            { id: '1', title: 'Open S3 Console', instruction: 'Glacier is accessed via S3', action: 'open-s3' },
            { id: '2', title: 'Create Lifecycle Rule', instruction: 'Navigate to bucket management', action: 'create-lifecycle' },
            { id: '3', title: 'Configure Transitions', instruction: 'Set transition to Glacier after X days', action: 'configure-transition' },
            { id: '4', title: 'Set Expiration', instruction: 'Optionally expire objects', action: 'set-expiration' },
            { id: '5', title: 'Save Rule', instruction: 'Apply lifecycle rule to bucket', action: 'save-rule' },
          ]
        },
      ]
    },
    {
      id: 'aws-security',
      name: 'Security & Identity',
      modules: [
        {
          id: 'iam-users',
          name: 'IAM Users',
          description: 'Create and manage users',
          icon: 'User',
          steps: [
            { id: '1', title: 'Open IAM Console', instruction: 'Navigate to IAM service', action: 'open-iam' },
            { id: '2', title: 'Go to Users', instruction: 'Click "Users" in sidebar', action: 'go-users' },
            { id: '3', title: 'Create User', instruction: 'Click "Create user"', action: 'create-user' },
            { id: '4', title: 'Set Username', instruction: 'Enter username for new user', action: 'set-username' },
            { id: '5', title: 'Set Access Type', instruction: 'Enable console and/or programmatic access', action: 'set-access' },
            { id: '6', title: 'Attach Policies', instruction: 'Add permissions via policies', action: 'attach-policies' },
            { id: '7', title: 'Create User', instruction: 'Review and create user', action: 'create-iam-user' },
            { id: '8', title: 'Download Credentials', instruction: 'Save access key and secret', action: 'download-creds', warning: 'This is your only chance to save the secret key' },
          ]
        },
        {
          id: 'iam-roles',
          name: 'IAM Roles',
          description: 'Create roles for services',
          icon: 'Shield',
          steps: [
            { id: '1', title: 'Open IAM Roles', instruction: 'Navigate to IAM > Roles', action: 'open-roles' },
            { id: '2', title: 'Create Role', instruction: 'Click "Create role"', action: 'create-role' },
            { id: '3', title: 'Select Entity', instruction: 'Choose AWS service (e.g., EC2, Lambda)', action: 'select-entity' },
            { id: '4', title: 'Attach Policies', instruction: 'Add required permissions', action: 'attach-policies' },
            { id: '5', title: 'Name Role', instruction: 'Provide descriptive role name', action: 'name-role' },
            { id: '6', title: 'Create Role', instruction: 'Review and create role', action: 'create-iam-role' },
          ]
        },
        {
          id: 'iam-policies',
          name: 'IAM Policies',
          description: 'Define permissions',
          icon: 'FileCheck',
          steps: [
            { id: '1', title: 'Open IAM Policies', instruction: 'Navigate to IAM > Policies', action: 'open-policies' },
            { id: '2', title: 'Create Policy', instruction: 'Click "Create policy"', action: 'create-policy' },
            { id: '3', title: 'Choose Editor', instruction: 'Use visual or JSON editor', action: 'choose-editor' },
            { id: '4', title: 'Define Actions', instruction: 'Select service and allowed actions', action: 'define-actions' },
            { id: '5', title: 'Specify Resources', instruction: 'Define which resources policy applies to', action: 'specify-resources' },
            { id: '6', title: 'Add Conditions', instruction: 'Optionally add conditions', action: 'add-conditions' },
            { id: '7', title: 'Review Policy', instruction: 'Check JSON and create policy', action: 'review-policy' },
          ]
        },
        {
          id: 'secrets-manager',
          name: 'Secrets Manager',
          description: 'Store secrets securely',
          icon: 'Key',
          steps: [
            { id: '1', title: 'Open Secrets Manager', instruction: 'Navigate to Secrets Manager', action: 'open-secrets' },
            { id: '2', title: 'Store Secret', instruction: 'Click "Store a new secret"', action: 'store-secret' },
            { id: '3', title: 'Choose Type', instruction: 'Select secret type (credentials, API key)', action: 'choose-type' },
            { id: '4', title: 'Enter Secret', instruction: 'Input your secret key-value pairs', action: 'enter-secret' },
            { id: '5', title: 'Name Secret', instruction: 'Provide descriptive name', action: 'name-secret' },
            { id: '6', title: 'Configure Rotation', instruction: 'Optionally enable automatic rotation', action: 'configure-rotation' },
            { id: '7', title: 'Store Secret', instruction: 'Review and store secret', action: 'store' },
          ]
        },
        {
          id: 'guardduty',
          name: 'GuardDuty',
          description: 'Threat detection service',
          icon: 'ShieldAlert',
          steps: [
            { id: '1', title: 'Open GuardDuty', instruction: 'Navigate to GuardDuty', action: 'open-guardduty' },
            { id: '2', title: 'Enable GuardDuty', instruction: 'Click "Get Started"', action: 'enable-guardduty' },
            { id: '3', title: 'Configure Findings', instruction: 'Review finding severity settings', action: 'configure-findings' },
            { id: '4', title: 'Set Up Notifications', instruction: 'Create CloudWatch event rule', action: 'setup-notifications' },
            { id: '5', title: 'Review Dashboard', instruction: 'Monitor security findings', action: 'review-dashboard' },
          ]
        },
        {
          id: 'kms',
          name: 'KMS',
          description: 'Key management service',
          icon: 'Lock',
          steps: [
            { id: '1', title: 'Open KMS Console', instruction: 'Navigate to Key Management Service', action: 'open-kms' },
            { id: '2', title: 'Create Key', instruction: 'Click "Create key"', action: 'create-key' },
            { id: '3', title: 'Configure Key', instruction: 'Select symmetric or asymmetric', action: 'configure-key' },
            { id: '4', title: 'Define Administrators', instruction: 'Set who can manage key', action: 'define-admins' },
            { id: '5', title: 'Define Usage', instruction: 'Set who can use key', action: 'define-usage' },
            { id: '6', title: 'Create Key', instruction: 'Review and create KMS key', action: 'create-kms' },
          ]
        },
      ]
    },
    {
      id: 'aws-monitoring',
      name: 'Monitoring',
      modules: [
        {
          id: 'cloudwatch-metrics',
          name: 'CloudWatch Metrics',
          description: 'Monitor AWS resources',
          icon: 'BarChart',
          steps: [
            { id: '1', title: 'Open CloudWatch', instruction: 'Navigate to CloudWatch', action: 'open-cloudwatch' },
            { id: '2', title: 'View Metrics', instruction: 'Click "All metrics"', action: 'view-metrics' },
            { id: '3', title: 'Select Namespace', instruction: 'Choose service (EC2, RDS, etc.)', action: 'select-namespace' },
            { id: '4', title: 'Select Metric', instruction: 'Pick specific metric to monitor', action: 'select-metric' },
            { id: '5', title: 'Create Graph', instruction: 'Add metric to graph view', action: 'create-graph' },
            { id: '6', title: 'Add to Dashboard', instruction: 'Save to CloudWatch dashboard', action: 'add-dashboard' },
          ]
        },
        {
          id: 'cloudwatch-logs',
          name: 'CloudWatch Logs',
          description: 'Centralized logging',
          icon: 'FileText',
          steps: [
            { id: '1', title: 'Open Log Groups', instruction: 'Navigate to CloudWatch > Log groups', action: 'open-logs' },
            { id: '2', title: 'Create Log Group', instruction: 'Click "Create log group"', action: 'create-log-group' },
            { id: '3', title: 'Configure Retention', instruction: 'Set log retention period', action: 'configure-retention' },
            { id: '4', title: 'View Log Streams', instruction: 'Explore log streams in group', action: 'view-streams' },
            { id: '5', title: 'Search Logs', instruction: 'Use filter patterns to search', action: 'search-logs' },
            { id: '6', title: 'Create Metric Filter', instruction: 'Convert log patterns to metrics', action: 'create-metric-filter' },
          ]
        },
        {
          id: 'log-insights',
          name: 'Log Insights',
          description: 'Query and analyze logs',
          icon: 'Search',
          steps: [
            { id: '1', title: 'Open Log Insights', instruction: 'Navigate to CloudWatch > Log Insights', action: 'open-insights' },
            { id: '2', title: 'Select Log Groups', instruction: 'Choose log groups to query', action: 'select-groups' },
            { id: '3', title: 'Write Query', instruction: 'Use Log Insights query syntax', action: 'write-query' },
            { id: '4', title: 'Run Query', instruction: 'Execute query and view results', action: 'run-query' },
            { id: '5', title: 'Visualize Results', instruction: 'View as table or chart', action: 'visualize' },
            { id: '6', title: 'Save Query', instruction: 'Save frequently used queries', action: 'save-query' },
          ]
        },
        {
          id: 'alerting',
          name: 'Alerting',
          description: 'Set up CloudWatch alarms',
          icon: 'Bell',
          steps: [
            { id: '1', title: 'Open Alarms', instruction: 'Navigate to CloudWatch > Alarms', action: 'open-alarms' },
            { id: '2', title: 'Create Alarm', instruction: 'Click "Create alarm"', action: 'create-alarm' },
            { id: '3', title: 'Select Metric', instruction: 'Choose metric to monitor', action: 'select-metric' },
            { id: '4', title: 'Set Threshold', instruction: 'Define alarm condition', action: 'set-threshold' },
            { id: '5', title: 'Configure Actions', instruction: 'Set SNS notification', action: 'configure-actions' },
            { id: '6', title: 'Create Alarm', instruction: 'Review and create alarm', action: 'create-cw-alarm' },
          ]
        },
      ]
    },
  ]
};

// ==================== DEVOPS TOOLS NAVIGATOR ====================
const devopsCategory: NavigatorCategory = {
  id: 'devops',
  name: 'DevOps',
  icon: 'Workflow',
  color: 'blue',
  subCategories: [
    {
      id: 'cicd-tools',
      name: 'CI/CD Tools',
      modules: [
        {
          id: 'github-actions',
          name: 'GitHub Actions',
          description: 'Automate workflows in GitHub',
          icon: 'GitBranch',
          steps: [
            { id: '1', title: 'Open Repository', instruction: 'Navigate to your GitHub repo', action: 'open-repo' },
            { id: '2', title: 'Go to Actions', instruction: 'Click "Actions" tab', action: 'go-actions' },
            { id: '3', title: 'Create Workflow', instruction: 'Click "New workflow"', action: 'create-workflow' },
            { id: '4', title: 'Choose Template', instruction: 'Select starter workflow or blank', action: 'choose-template' },
            { id: '5', title: 'Define Triggers', instruction: 'Set on: push, pull_request, etc.', action: 'define-triggers' },
            { id: '6', title: 'Add Jobs', instruction: 'Define jobs and steps', action: 'add-jobs' },
            { id: '7', title: 'Configure Runner', instruction: 'Select runs-on: ubuntu-latest', action: 'configure-runner' },
            { id: '8', title: 'Add Steps', instruction: 'Add checkout, build, test steps', action: 'add-steps' },
            { id: '9', title: 'Commit Workflow', instruction: 'Save to .github/workflows/', action: 'commit-workflow' },
            { id: '10', title: 'Monitor Run', instruction: 'Watch workflow execution', action: 'monitor-run' },
          ]
        },
        {
          id: 'jenkins',
          name: 'Jenkins',
          description: 'Open-source automation server',
          icon: 'Server',
          steps: [
            { id: '1', title: 'Access Jenkins', instruction: 'Open Jenkins web interface', action: 'access-jenkins' },
            { id: '2', title: 'Create Job', instruction: 'Click "New Item"', action: 'create-job' },
            { id: '3', title: 'Select Pipeline', instruction: 'Choose "Pipeline" type', action: 'select-pipeline' },
            { id: '4', title: 'Configure SCM', instruction: 'Connect to Git repository', action: 'configure-scm' },
            { id: '5', title: 'Write Jenkinsfile', instruction: 'Define pipeline stages', action: 'write-jenkinsfile' },
            { id: '6', title: 'Add Build Stage', instruction: 'Define build commands', action: 'add-build' },
            { id: '7', title: 'Add Test Stage', instruction: 'Configure test execution', action: 'add-test' },
            { id: '8', title: 'Add Deploy Stage', instruction: 'Set up deployment', action: 'add-deploy' },
            { id: '9', title: 'Configure Triggers', instruction: 'Set build triggers', action: 'configure-triggers' },
            { id: '10', title: 'Run Pipeline', instruction: 'Execute and monitor', action: 'run-pipeline' },
          ]
        },
        {
          id: 'gitlab-ci',
          name: 'GitLab CI',
          description: 'Built-in CI/CD for GitLab',
          icon: 'GitMerge',
          steps: [
            { id: '1', title: 'Open Project', instruction: 'Navigate to GitLab project', action: 'open-project' },
            { id: '2', title: 'Create .gitlab-ci.yml', instruction: 'Add CI config file', action: 'create-config' },
            { id: '3', title: 'Define Stages', instruction: 'Set stages: build, test, deploy', action: 'define-stages' },
            { id: '4', title: 'Add Build Job', instruction: 'Configure build job', action: 'add-build-job' },
            { id: '5', title: 'Add Test Job', instruction: 'Configure test job', action: 'add-test-job' },
            { id: '6', title: 'Add Deploy Job', instruction: 'Configure deployment', action: 'add-deploy-job' },
            { id: '7', title: 'Configure Variables', instruction: 'Set CI/CD variables', action: 'configure-vars' },
            { id: '8', title: 'View Pipeline', instruction: 'Monitor in CI/CD > Pipelines', action: 'view-pipeline' },
          ]
        },
        {
          id: 'circleci',
          name: 'CircleCI',
          description: 'Cloud-native CI/CD platform',
          icon: 'Circle',
          steps: [
            { id: '1', title: 'Connect Repository', instruction: 'Link GitHub/GitLab repo', action: 'connect-repo' },
            { id: '2', title: 'Create Config', instruction: 'Add .circleci/config.yml', action: 'create-config' },
            { id: '3', title: 'Define Version', instruction: 'Set version: 2.1', action: 'define-version' },
            { id: '4', title: 'Add Executors', instruction: 'Define execution environment', action: 'add-executors' },
            { id: '5', title: 'Define Jobs', instruction: 'Create build and test jobs', action: 'define-jobs' },
            { id: '6', title: 'Add Workflows', instruction: 'Orchestrate job execution', action: 'add-workflows' },
            { id: '7', title: 'Configure Caching', instruction: 'Set up dependency caching', action: 'configure-cache' },
            { id: '8', title: 'Trigger Pipeline', instruction: 'Push code to trigger', action: 'trigger-pipeline' },
          ]
        },
        {
          id: 'travis-ci',
          name: 'Travis CI',
          description: 'Continuous integration service',
          icon: 'Play',
          steps: [
            { id: '1', title: 'Sign Up', instruction: 'Connect with GitHub account', action: 'sign-up' },
            { id: '2', title: 'Enable Repository', instruction: 'Activate repo in Travis', action: 'enable-repo' },
            { id: '3', title: 'Create .travis.yml', instruction: 'Add config file to repo', action: 'create-travis' },
            { id: '4', title: 'Set Language', instruction: 'Specify language and version', action: 'set-language' },
            { id: '5', title: 'Add Scripts', instruction: 'Define install and script steps', action: 'add-scripts' },
            { id: '6', title: 'Configure Notifications', instruction: 'Set up email/Slack alerts', action: 'configure-notify' },
            { id: '7', title: 'Push and Build', instruction: 'Commit to trigger build', action: 'push-build' },
          ]
        },
      ]
    },
    {
      id: 'aws-devops',
      name: 'AWS DevOps',
      modules: [
        {
          id: 'codepipeline',
          name: 'CodePipeline',
          description: 'AWS continuous delivery service',
          icon: 'GitBranch',
          steps: [
            { id: '1', title: 'Open CodePipeline', instruction: 'Navigate to AWS CodePipeline', action: 'open-codepipeline' },
            { id: '2', title: 'Create Pipeline', instruction: 'Click "Create pipeline"', action: 'create-pipeline' },
            { id: '3', title: 'Configure Settings', instruction: 'Name pipeline and set service role', action: 'configure-settings' },
            { id: '4', title: 'Add Source', instruction: 'Connect GitHub/CodeCommit', action: 'add-source' },
            { id: '5', title: 'Add Build', instruction: 'Configure CodeBuild stage', action: 'add-build' },
            { id: '6', title: 'Add Deploy', instruction: 'Set deployment target', action: 'add-deploy' },
            { id: '7', title: 'Review & Create', instruction: 'Launch pipeline', action: 'review-create' },
            { id: '8', title: 'Monitor Execution', instruction: 'View pipeline runs', action: 'monitor' },
          ]
        },
        {
          id: 'codedeploy',
          name: 'CodeDeploy',
          description: 'Automated deployments',
          icon: 'Upload',
          steps: [
            { id: '1', title: 'Open CodeDeploy', instruction: 'Navigate to CodeDeploy', action: 'open-codedeploy' },
            { id: '2', title: 'Create Application', instruction: 'Define application name', action: 'create-app' },
            { id: '3', title: 'Choose Platform', instruction: 'Select EC2, Lambda, or ECS', action: 'choose-platform' },
            { id: '4', title: 'Create Deployment Group', instruction: 'Define target instances', action: 'create-group' },
            { id: '5', title: 'Configure AppSpec', instruction: 'Create appspec.yml file', action: 'configure-appspec' },
            { id: '6', title: 'Create Deployment', instruction: 'Deploy your application', action: 'create-deployment' },
            { id: '7', title: 'Monitor Status', instruction: 'Track deployment progress', action: 'monitor-status' },
          ]
        },
        {
          id: 'codebuild',
          name: 'CodeBuild',
          description: 'Build and test code',
          icon: 'Hammer',
          steps: [
            { id: '1', title: 'Open CodeBuild', instruction: 'Navigate to CodeBuild', action: 'open-codebuild' },
            { id: '2', title: 'Create Project', instruction: 'Click "Create build project"', action: 'create-project' },
            { id: '3', title: 'Configure Source', instruction: 'Connect to repository', action: 'configure-source' },
            { id: '4', title: 'Select Environment', instruction: 'Choose build environment image', action: 'select-env' },
            { id: '5', title: 'Create Buildspec', instruction: 'Define buildspec.yml', action: 'create-buildspec' },
            { id: '6', title: 'Configure Artifacts', instruction: 'Set output artifacts location', action: 'configure-artifacts' },
            { id: '7', title: 'Create Project', instruction: 'Save build project', action: 'save-project' },
            { id: '8', title: 'Start Build', instruction: 'Trigger manual build', action: 'start-build' },
          ]
        },
      ]
    },
  ]
};

// ==================== CONTAINERS NAVIGATOR ====================
const containersCategory: NavigatorCategory = {
  id: 'containers',
  name: 'Containers',
  icon: 'Container',
  color: 'cyan',
  subCategories: [
    {
      id: 'docker',
      name: 'Docker',
      modules: [
        {
          id: 'docker-engine',
          name: 'Docker Engine',
          description: 'Container runtime basics',
          icon: 'Container',
          steps: [
            { id: '1', title: 'Install Docker', instruction: 'Install Docker Desktop or Engine', action: 'install-docker' },
            { id: '2', title: 'Verify Installation', instruction: 'Run docker --version', action: 'verify-install' },
            { id: '3', title: 'Run Hello World', instruction: 'Execute docker run hello-world', action: 'run-hello' },
            { id: '4', title: 'Pull Image', instruction: 'Download image with docker pull', action: 'pull-image' },
            { id: '5', title: 'List Images', instruction: 'View images with docker images', action: 'list-images' },
            { id: '6', title: 'Run Container', instruction: 'Start container with docker run', action: 'run-container' },
            { id: '7', title: 'List Containers', instruction: 'View with docker ps -a', action: 'list-containers' },
            { id: '8', title: 'Stop Container', instruction: 'Stop with docker stop', action: 'stop-container' },
            { id: '9', title: 'Remove Container', instruction: 'Clean up with docker rm', action: 'remove-container' },
          ]
        },
        {
          id: 'docker-compose',
          name: 'Docker Compose',
          description: 'Multi-container applications',
          icon: 'Layers',
          steps: [
            { id: '1', title: 'Create docker-compose.yml', instruction: 'Define services in YAML', action: 'create-compose' },
            { id: '2', title: 'Define Services', instruction: 'Add web and db services', action: 'define-services' },
            { id: '3', title: 'Configure Networks', instruction: 'Set up container networking', action: 'configure-networks' },
            { id: '4', title: 'Define Volumes', instruction: 'Add persistent storage', action: 'define-volumes' },
            { id: '5', title: 'Set Environment', instruction: 'Add environment variables', action: 'set-env' },
            { id: '6', title: 'Build Images', instruction: 'Run docker-compose build', action: 'build-images' },
            { id: '7', title: 'Start Services', instruction: 'Run docker-compose up -d', action: 'start-services' },
            { id: '8', title: 'View Logs', instruction: 'Check docker-compose logs', action: 'view-logs' },
            { id: '9', title: 'Stop Services', instruction: 'Run docker-compose down', action: 'stop-services' },
          ]
        },
      ]
    },
    {
      id: 'kubernetes',
      name: 'Kubernetes',
      modules: [
        {
          id: 'kubernetes-basics',
          name: 'Kubernetes Basics',
          description: 'Container orchestration',
          icon: 'Boxes',
          steps: [
            { id: '1', title: 'Install kubectl', instruction: 'Install Kubernetes CLI', action: 'install-kubectl' },
            { id: '2', title: 'Connect to Cluster', instruction: 'Configure kubeconfig', action: 'connect-cluster' },
            { id: '3', title: 'View Nodes', instruction: 'Run kubectl get nodes', action: 'view-nodes' },
            { id: '4', title: 'Create Deployment', instruction: 'Deploy app with kubectl', action: 'create-deployment' },
            { id: '5', title: 'Expose Service', instruction: 'Create service for deployment', action: 'expose-service' },
            { id: '6', title: 'Scale Deployment', instruction: 'Adjust replica count', action: 'scale-deployment' },
            { id: '7', title: 'View Pods', instruction: 'Run kubectl get pods', action: 'view-pods' },
            { id: '8', title: 'Check Logs', instruction: 'View pod logs', action: 'check-logs' },
          ]
        },
        {
          id: 'minikube',
          name: 'Minikube',
          description: 'Local Kubernetes cluster',
          icon: 'Laptop',
          steps: [
            { id: '1', title: 'Install Minikube', instruction: 'Download and install Minikube', action: 'install-minikube' },
            { id: '2', title: 'Start Cluster', instruction: 'Run minikube start', action: 'start-cluster' },
            { id: '3', title: 'Verify Status', instruction: 'Check minikube status', action: 'verify-status' },
            { id: '4', title: 'Enable Addons', instruction: 'Enable dashboard, metrics', action: 'enable-addons' },
            { id: '5', title: 'Open Dashboard', instruction: 'Run minikube dashboard', action: 'open-dashboard' },
            { id: '6', title: 'Deploy App', instruction: 'Deploy to local cluster', action: 'deploy-app' },
            { id: '7', title: 'Access Service', instruction: 'Get service URL', action: 'access-service' },
          ]
        },
        {
          id: 'helm',
          name: 'Helm',
          description: 'Kubernetes package manager',
          icon: 'Package',
          steps: [
            { id: '1', title: 'Install Helm', instruction: 'Download and install Helm CLI', action: 'install-helm' },
            { id: '2', title: 'Add Repository', instruction: 'Add Helm chart repository', action: 'add-repo' },
            { id: '3', title: 'Search Charts', instruction: 'Find available charts', action: 'search-charts' },
            { id: '4', title: 'Install Chart', instruction: 'Deploy with helm install', action: 'install-chart' },
            { id: '5', title: 'Customize Values', instruction: 'Override default values', action: 'customize-values' },
            { id: '6', title: 'List Releases', instruction: 'View installed releases', action: 'list-releases' },
            { id: '7', title: 'Upgrade Release', instruction: 'Update with helm upgrade', action: 'upgrade-release' },
            { id: '8', title: 'Rollback', instruction: 'Rollback with helm rollback', action: 'rollback' },
          ]
        },
      ]
    },
  ]
};

// ==================== MONITORING NAVIGATOR ====================
const monitoringCategory: NavigatorCategory = {
  id: 'monitoring',
  name: 'Monitoring',
  icon: 'Activity',
  color: 'green',
  subCategories: [
    {
      id: 'observability',
      name: 'Observability',
      modules: [
        {
          id: 'datadog',
          name: 'Datadog',
          description: 'Cloud monitoring platform',
          icon: 'BarChart',
          steps: [
            { id: '1', title: 'Create Account', instruction: 'Sign up for Datadog', action: 'create-account' },
            { id: '2', title: 'Install Agent', instruction: 'Deploy Datadog agent', action: 'install-agent' },
            { id: '3', title: 'Configure Integration', instruction: 'Enable AWS/Docker integration', action: 'configure-integration' },
            { id: '4', title: 'Create Dashboard', instruction: 'Build custom dashboard', action: 'create-dashboard' },
            { id: '5', title: 'Set Up Monitors', instruction: 'Create alerting monitors', action: 'setup-monitors' },
            { id: '6', title: 'Configure APM', instruction: 'Enable application tracing', action: 'configure-apm' },
            { id: '7', title: 'View Logs', instruction: 'Access centralized logs', action: 'view-logs' },
          ]
        },
        {
          id: 'grafana',
          name: 'Grafana',
          description: 'Open-source visualization',
          icon: 'LineChart',
          steps: [
            { id: '1', title: 'Install Grafana', instruction: 'Deploy Grafana server', action: 'install-grafana' },
            { id: '2', title: 'Access UI', instruction: 'Open Grafana web interface', action: 'access-ui' },
            { id: '3', title: 'Add Data Source', instruction: 'Connect Prometheus/InfluxDB', action: 'add-datasource' },
            { id: '4', title: 'Create Dashboard', instruction: 'Build visualization dashboard', action: 'create-dashboard' },
            { id: '5', title: 'Add Panels', instruction: 'Add graphs and metrics', action: 'add-panels' },
            { id: '6', title: 'Configure Alerts', instruction: 'Set up alerting rules', action: 'configure-alerts' },
            { id: '7', title: 'Save Dashboard', instruction: 'Save and share dashboard', action: 'save-dashboard' },
          ]
        },
        {
          id: 'prometheus',
          name: 'Prometheus',
          description: 'Metrics collection',
          icon: 'Gauge',
          steps: [
            { id: '1', title: 'Install Prometheus', instruction: 'Deploy Prometheus server', action: 'install-prometheus' },
            { id: '2', title: 'Configure Scraping', instruction: 'Define scrape targets', action: 'configure-scraping' },
            { id: '3', title: 'Add Exporters', instruction: 'Install node exporter', action: 'add-exporters' },
            { id: '4', title: 'Write PromQL', instruction: 'Query metrics with PromQL', action: 'write-promql' },
            { id: '5', title: 'Create Rules', instruction: 'Define alerting rules', action: 'create-rules' },
            { id: '6', title: 'Set Up Alertmanager', instruction: 'Configure alert routing', action: 'setup-alertmanager' },
          ]
        },
        {
          id: 'elk-stack',
          name: 'ELK Stack',
          description: 'Elasticsearch, Logstash, Kibana',
          icon: 'Search',
          steps: [
            { id: '1', title: 'Install Elasticsearch', instruction: 'Deploy Elasticsearch cluster', action: 'install-elastic' },
            { id: '2', title: 'Configure Logstash', instruction: 'Set up log ingestion', action: 'configure-logstash' },
            { id: '3', title: 'Define Pipelines', instruction: 'Create Logstash pipelines', action: 'define-pipelines' },
            { id: '4', title: 'Install Kibana', instruction: 'Deploy Kibana interface', action: 'install-kibana' },
            { id: '5', title: 'Create Index Pattern', instruction: 'Define Kibana index pattern', action: 'create-index' },
            { id: '6', title: 'Build Visualizations', instruction: 'Create Kibana visualizations', action: 'build-viz' },
            { id: '7', title: 'Create Dashboard', instruction: 'Assemble dashboard', action: 'create-dashboard' },
          ]
        },
        {
          id: 'sentry',
          name: 'Sentry',
          description: 'Error tracking and monitoring',
          icon: 'AlertTriangle',
          steps: [
            { id: '1', title: 'Create Project', instruction: 'Set up Sentry project', action: 'create-project' },
            { id: '2', title: 'Install SDK', instruction: 'Add Sentry SDK to app', action: 'install-sdk' },
            { id: '3', title: 'Configure DSN', instruction: 'Add Sentry DSN to config', action: 'configure-dsn' },
            { id: '4', title: 'Test Integration', instruction: 'Trigger test error', action: 'test-integration' },
            { id: '5', title: 'Set Up Alerts', instruction: 'Configure error alerts', action: 'setup-alerts' },
            { id: '6', title: 'Review Issues', instruction: 'Triage and resolve issues', action: 'review-issues' },
          ]
        },
      ]
    },
  ]
};

// ==================== SECURITY NAVIGATOR ====================
const securityCategory: NavigatorCategory = {
  id: 'security',
  name: 'Security',
  icon: 'Shield',
  color: 'red',
  subCategories: [
    {
      id: 'security-scanning',
      name: 'Security Scanning',
      modules: [
        {
          id: 'vulnerability-scanning',
          name: 'Vulnerability Scanning',
          description: 'Find security vulnerabilities',
          icon: 'Search',
          steps: [
            { id: '1', title: 'Choose Scanner', instruction: 'Select vulnerability scanner tool', action: 'choose-scanner' },
            { id: '2', title: 'Configure Scope', instruction: 'Define scan targets', action: 'configure-scope' },
            { id: '3', title: 'Run Scan', instruction: 'Execute vulnerability scan', action: 'run-scan' },
            { id: '4', title: 'Review Results', instruction: 'Analyze findings', action: 'review-results' },
            { id: '5', title: 'Prioritize Issues', instruction: 'Rank by severity', action: 'prioritize' },
            { id: '6', title: 'Remediate', instruction: 'Fix vulnerabilities', action: 'remediate' },
            { id: '7', title: 'Verify Fixes', instruction: 'Re-scan to confirm', action: 'verify' },
          ]
        },
        {
          id: 'owasp-top-10',
          name: 'OWASP Top 10',
          description: 'Web application security risks',
          icon: 'ShieldAlert',
          steps: [
            { id: '1', title: 'Injection Prevention', instruction: 'Learn SQL/NoSQL injection', action: 'injection' },
            { id: '2', title: 'Broken Authentication', instruction: 'Secure auth mechanisms', action: 'auth' },
            { id: '3', title: 'Sensitive Data', instruction: 'Protect sensitive data', action: 'data' },
            { id: '4', title: 'XXE Prevention', instruction: 'Prevent XML attacks', action: 'xxe' },
            { id: '5', title: 'Access Control', instruction: 'Implement proper access', action: 'access' },
            { id: '6', title: 'Security Config', instruction: 'Secure configurations', action: 'config' },
            { id: '7', title: 'XSS Prevention', instruction: 'Prevent cross-site scripting', action: 'xss' },
            { id: '8', title: 'Deserialization', instruction: 'Secure deserialization', action: 'deserial' },
            { id: '9', title: 'Components', instruction: 'Manage dependencies', action: 'components' },
            { id: '10', title: 'Logging', instruction: 'Implement security logging', action: 'logging' },
          ]
        },
        {
          id: 'snyk',
          name: 'Snyk Workflow',
          description: 'Dependency security scanning',
          icon: 'Package',
          steps: [
            { id: '1', title: 'Install Snyk', instruction: 'Install Snyk CLI', action: 'install-snyk' },
            { id: '2', title: 'Authenticate', instruction: 'Login to Snyk', action: 'authenticate' },
            { id: '3', title: 'Test Project', instruction: 'Run snyk test', action: 'test-project' },
            { id: '4', title: 'Review Vulnerabilities', instruction: 'Analyze findings', action: 'review-vulns' },
            { id: '5', title: 'Fix Issues', instruction: 'Run snyk wizard', action: 'fix-issues' },
            { id: '6', title: 'Monitor', instruction: 'Enable continuous monitoring', action: 'monitor' },
          ]
        },
        {
          id: 'api-security',
          name: 'API Security',
          description: 'Secure your APIs',
          icon: 'Lock',
          steps: [
            { id: '1', title: 'Authentication', instruction: 'Implement API authentication', action: 'api-auth' },
            { id: '2', title: 'Authorization', instruction: 'Set up RBAC/ABAC', action: 'api-authz' },
            { id: '3', title: 'Rate Limiting', instruction: 'Configure rate limits', action: 'rate-limit' },
            { id: '4', title: 'Input Validation', instruction: 'Validate all inputs', action: 'input-validation' },
            { id: '5', title: 'HTTPS/TLS', instruction: 'Enforce encryption', action: 'https' },
            { id: '6', title: 'API Gateway', instruction: 'Configure security gateway', action: 'api-gateway' },
          ]
        },
      ]
    },
  ]
};

// ==================== GIT NAVIGATOR ====================
const gitCategory: NavigatorCategory = {
  id: 'git',
  name: 'Git & Version Control',
  icon: 'GitBranch',
  color: 'purple',
  subCategories: [
    {
      id: 'git-basics',
      name: 'Git Basics',
      modules: [
        {
          id: 'git-init',
          name: 'Initialize Repository',
          description: 'Create a new Git repo',
          icon: 'FolderGit',
          steps: [
            { id: '1', title: 'Create Directory', instruction: 'Create project folder', action: 'create-dir' },
            { id: '2', title: 'Initialize Git', instruction: 'Run git init', action: 'git-init' },
            { id: '3', title: 'Create .gitignore', instruction: 'Add ignore patterns', action: 'create-gitignore' },
            { id: '4', title: 'Add Files', instruction: 'Stage with git add .', action: 'git-add' },
            { id: '5', title: 'First Commit', instruction: 'Run git commit -m "Initial"', action: 'first-commit' },
            { id: '6', title: 'Add Remote', instruction: 'Link to GitHub/GitLab', action: 'add-remote' },
            { id: '7', title: 'Push', instruction: 'Push to remote', action: 'git-push' },
          ]
        },
        {
          id: 'git-branching',
          name: 'Branching',
          description: 'Work with branches',
          icon: 'GitBranch',
          steps: [
            { id: '1', title: 'View Branches', instruction: 'Run git branch', action: 'view-branches' },
            { id: '2', title: 'Create Branch', instruction: 'Run git checkout -b feature', action: 'create-branch' },
            { id: '3', title: 'Switch Branch', instruction: 'Run git checkout main', action: 'switch-branch' },
            { id: '4', title: 'Make Changes', instruction: 'Edit files on branch', action: 'make-changes' },
            { id: '5', title: 'Commit Changes', instruction: 'Stage and commit', action: 'commit-changes' },
            { id: '6', title: 'Push Branch', instruction: 'Push to remote', action: 'push-branch' },
          ]
        },
        {
          id: 'git-commits',
          name: 'Commits',
          description: 'Commit and push changes',
          icon: 'GitCommit',
          steps: [
            { id: '1', title: 'Check Status', instruction: 'Run git status', action: 'check-status' },
            { id: '2', title: 'View Diff', instruction: 'Run git diff', action: 'view-diff' },
            { id: '3', title: 'Stage Files', instruction: 'Run git add <file>', action: 'stage-files' },
            { id: '4', title: 'Write Message', instruction: 'Write clear commit message', action: 'write-message', tip: 'Use conventional commits format' },
            { id: '5', title: 'Commit', instruction: 'Run git commit -m "msg"', action: 'commit' },
            { id: '6', title: 'Push', instruction: 'Run git push', action: 'push' },
          ]
        },
        {
          id: 'git-merge-conflict',
          name: 'Merge Conflicts',
          description: 'Resolve merge conflicts',
          icon: 'GitMerge',
          steps: [
            { id: '1', title: 'Pull Latest', instruction: 'Run git pull origin main', action: 'pull-latest' },
            { id: '2', title: 'Identify Conflicts', instruction: 'Check conflict markers', action: 'identify-conflicts' },
            { id: '3', title: 'Open Files', instruction: 'Open conflicted files', action: 'open-files' },
            { id: '4', title: 'Resolve Conflicts', instruction: 'Edit to resolve', action: 'resolve' },
            { id: '5', title: 'Stage Resolved', instruction: 'Run git add <file>', action: 'stage-resolved' },
            { id: '6', title: 'Complete Merge', instruction: 'Run git commit', action: 'complete-merge' },
          ]
        },
        {
          id: 'git-pr',
          name: 'Pull Requests',
          description: 'Create and review PRs',
          icon: 'GitPullRequest',
          steps: [
            { id: '1', title: 'Push Branch', instruction: 'Push feature branch', action: 'push-branch' },
            { id: '2', title: 'Open PR', instruction: 'Create pull request', action: 'open-pr' },
            { id: '3', title: 'Write Description', instruction: 'Describe changes', action: 'write-desc' },
            { id: '4', title: 'Request Review', instruction: 'Assign reviewers', action: 'request-review' },
            { id: '5', title: 'Address Feedback', instruction: 'Make requested changes', action: 'address-feedback' },
            { id: '6', title: 'Merge PR', instruction: 'Merge after approval', action: 'merge-pr' },
          ]
        },
        {
          id: 'git-tags',
          name: 'Tags & Releases',
          description: 'Version tagging',
          icon: 'Tag',
          steps: [
            { id: '1', title: 'View Tags', instruction: 'Run git tag', action: 'view-tags' },
            { id: '2', title: 'Create Tag', instruction: 'Run git tag v1.0.0', action: 'create-tag' },
            { id: '3', title: 'Annotated Tag', instruction: 'Add tag message', action: 'annotated-tag' },
            { id: '4', title: 'Push Tags', instruction: 'Run git push --tags', action: 'push-tags' },
            { id: '5', title: 'Create Release', instruction: 'Create GitHub release', action: 'create-release' },
          ]
        },
      ]
    },
    {
      id: 'github-gitlab',
      name: 'GitHub/GitLab',
      modules: [
        {
          id: 'repo-creation',
          name: 'Repository Creation',
          description: 'Create and configure repos',
          icon: 'FolderGit',
          steps: [
            { id: '1', title: 'New Repository', instruction: 'Click "New repository"', action: 'new-repo' },
            { id: '2', title: 'Configure Settings', instruction: 'Set name, visibility', action: 'configure' },
            { id: '3', title: 'Initialize README', instruction: 'Add README file', action: 'init-readme' },
            { id: '4', title: 'Add License', instruction: 'Choose license type', action: 'add-license' },
            { id: '5', title: 'Clone Repository', instruction: 'Clone to local machine', action: 'clone' },
          ]
        },
        {
          id: 'issue-tracking',
          name: 'Issue Tracking',
          description: 'Manage project issues',
          icon: 'CircleDot',
          steps: [
            { id: '1', title: 'Create Issue', instruction: 'Click "New issue"', action: 'create-issue' },
            { id: '2', title: 'Add Labels', instruction: 'Apply relevant labels', action: 'add-labels' },
            { id: '3', title: 'Assign Members', instruction: 'Assign to team members', action: 'assign' },
            { id: '4', title: 'Add Milestone', instruction: 'Link to milestone', action: 'add-milestone' },
            { id: '5', title: 'Track Progress', instruction: 'Update issue status', action: 'track' },
            { id: '6', title: 'Close Issue', instruction: 'Close when resolved', action: 'close' },
          ]
        },
        {
          id: 'workflow-automation',
          name: 'Workflow Automation',
          description: 'Automate with Actions/CI',
          icon: 'Workflow',
          steps: [
            { id: '1', title: 'Create Workflow File', instruction: 'Add .github/workflows/', action: 'create-workflow' },
            { id: '2', title: 'Define Trigger', instruction: 'Set workflow triggers', action: 'define-trigger' },
            { id: '3', title: 'Add Jobs', instruction: 'Define workflow jobs', action: 'add-jobs' },
            { id: '4', title: 'Configure Steps', instruction: 'Add action steps', action: 'configure-steps' },
            { id: '5', title: 'Add Secrets', instruction: 'Configure secrets', action: 'add-secrets' },
            { id: '6', title: 'Test Workflow', instruction: 'Trigger and verify', action: 'test' },
          ]
        },
      ]
    },
  ]
};

// ==================== DATABASES NAVIGATOR ====================
const databasesCategory: NavigatorCategory = {
  id: 'databases',
  name: 'Databases',
  icon: 'Database',
  color: 'yellow',
  subCategories: [
    {
      id: 'relational',
      name: 'Relational Databases',
      modules: [
        {
          id: 'postgresql',
          name: 'PostgreSQL',
          description: 'Advanced open-source SQL',
          icon: 'Database',
          steps: [
            { id: '1', title: 'Install PostgreSQL', instruction: 'Install Postgres server', action: 'install-pg' },
            { id: '2', title: 'Start Service', instruction: 'Start PostgreSQL service', action: 'start-service' },
            { id: '3', title: 'Connect', instruction: 'Connect with psql', action: 'connect' },
            { id: '4', title: 'Create Database', instruction: 'CREATE DATABASE myapp;', action: 'create-db' },
            { id: '5', title: 'Create Table', instruction: 'Define table schema', action: 'create-table' },
            { id: '6', title: 'Insert Data', instruction: 'Add sample records', action: 'insert-data' },
            { id: '7', title: 'Query Data', instruction: 'Run SELECT queries', action: 'query-data' },
          ]
        },
        {
          id: 'mysql',
          name: 'MySQL',
          description: 'Popular relational database',
          icon: 'Database',
          steps: [
            { id: '1', title: 'Install MySQL', instruction: 'Install MySQL server', action: 'install-mysql' },
            { id: '2', title: 'Secure Installation', instruction: 'Run mysql_secure_installation', action: 'secure' },
            { id: '3', title: 'Connect', instruction: 'Connect with mysql client', action: 'connect' },
            { id: '4', title: 'Create Database', instruction: 'CREATE DATABASE myapp;', action: 'create-db' },
            { id: '5', title: 'Create User', instruction: 'Create database user', action: 'create-user' },
            { id: '6', title: 'Grant Permissions', instruction: 'Grant user privileges', action: 'grant' },
            { id: '7', title: 'Create Tables', instruction: 'Define schema', action: 'create-tables' },
          ]
        },
      ]
    },
    {
      id: 'nosql',
      name: 'NoSQL Databases',
      modules: [
        {
          id: 'mongodb',
          name: 'MongoDB',
          description: 'Document database',
          icon: 'Leaf',
          steps: [
            { id: '1', title: 'Install MongoDB', instruction: 'Install MongoDB server', action: 'install-mongo' },
            { id: '2', title: 'Start Service', instruction: 'Start mongod service', action: 'start-service' },
            { id: '3', title: 'Connect', instruction: 'Connect with mongosh', action: 'connect' },
            { id: '4', title: 'Create Database', instruction: 'use myapp', action: 'create-db' },
            { id: '5', title: 'Insert Document', instruction: 'db.collection.insertOne()', action: 'insert' },
            { id: '6', title: 'Query Documents', instruction: 'db.collection.find()', action: 'query' },
            { id: '7', title: 'Create Index', instruction: 'Add indexes for performance', action: 'create-index' },
          ]
        },
        {
          id: 'redis',
          name: 'Redis',
          description: 'In-memory data store',
          icon: 'Zap',
          steps: [
            { id: '1', title: 'Install Redis', instruction: 'Install Redis server', action: 'install-redis' },
            { id: '2', title: 'Start Server', instruction: 'Start redis-server', action: 'start-server' },
            { id: '3', title: 'Connect', instruction: 'Connect with redis-cli', action: 'connect' },
            { id: '4', title: 'Set Key', instruction: 'SET key value', action: 'set-key' },
            { id: '5', title: 'Get Key', instruction: 'GET key', action: 'get-key' },
            { id: '6', title: 'Use Data Structures', instruction: 'Lists, sets, hashes', action: 'data-structures' },
          ]
        },
      ]
    },
  ]
};

// ==================== INFRASTRUCTURE AS CODE ====================
const iacCategory: NavigatorCategory = {
  id: 'iac',
  name: 'Infrastructure as Code',
  icon: 'FileCode',
  color: 'indigo',
  subCategories: [
    {
      id: 'iac-tools',
      name: 'IaC Tools',
      modules: [
        {
          id: 'terraform',
          name: 'Terraform',
          description: 'Infrastructure provisioning',
          icon: 'Blocks',
          steps: [
            { id: '1', title: 'Install Terraform', instruction: 'Download and install Terraform CLI', action: 'install-terraform' },
            { id: '2', title: 'Create Config', instruction: 'Create main.tf file', action: 'create-config' },
            { id: '3', title: 'Configure Provider', instruction: 'Set up AWS/Azure provider', action: 'configure-provider' },
            { id: '4', title: 'Define Resources', instruction: 'Add resource blocks', action: 'define-resources' },
            { id: '5', title: 'Initialize', instruction: 'Run terraform init', action: 'terraform-init' },
            { id: '6', title: 'Plan', instruction: 'Run terraform plan', action: 'terraform-plan' },
            { id: '7', title: 'Apply', instruction: 'Run terraform apply', action: 'terraform-apply' },
            { id: '8', title: 'Destroy', instruction: 'Clean up with terraform destroy', action: 'terraform-destroy' },
          ]
        },
        {
          id: 'cloudformation',
          name: 'CloudFormation',
          description: 'AWS infrastructure templates',
          icon: 'Cloud',
          steps: [
            { id: '1', title: 'Open CloudFormation', instruction: 'Navigate to CloudFormation', action: 'open-cfn' },
            { id: '2', title: 'Create Stack', instruction: 'Click "Create stack"', action: 'create-stack' },
            { id: '3', title: 'Upload Template', instruction: 'Upload YAML/JSON template', action: 'upload-template' },
            { id: '4', title: 'Configure Parameters', instruction: 'Set stack parameters', action: 'configure-params' },
            { id: '5', title: 'Review', instruction: 'Review stack configuration', action: 'review' },
            { id: '6', title: 'Create', instruction: 'Launch stack creation', action: 'create' },
            { id: '7', title: 'Monitor', instruction: 'Watch stack events', action: 'monitor' },
          ]
        },
        {
          id: 'ansible',
          name: 'Ansible',
          description: 'Configuration management',
          icon: 'Settings',
          steps: [
            { id: '1', title: 'Install Ansible', instruction: 'Install Ansible package', action: 'install-ansible' },
            { id: '2', title: 'Create Inventory', instruction: 'Define hosts inventory', action: 'create-inventory' },
            { id: '3', title: 'Write Playbook', instruction: 'Create YAML playbook', action: 'write-playbook' },
            { id: '4', title: 'Define Tasks', instruction: 'Add task modules', action: 'define-tasks' },
            { id: '5', title: 'Run Playbook', instruction: 'Execute ansible-playbook', action: 'run-playbook' },
            { id: '6', title: 'Use Roles', instruction: 'Organize with roles', action: 'use-roles' },
          ]
        },
      ]
    },
  ]
};

// Export all categories
export const navigatorCategories: NavigatorCategory[] = [
  awsCategory,
  devopsCategory,
  containersCategory,
  monitoringCategory,
  securityCategory,
  gitCategory,
  databasesCategory,
  iacCategory,
];

// Helper function to get category by ID
export const getCategoryById = (id: string): NavigatorCategory | undefined => {
  return navigatorCategories.find(c => c.id === id);
};

// Helper function to get module by ID within a category
export const getModuleById = (categoryId: string, moduleId: string): NavigatorModule | undefined => {
  const category = getCategoryById(categoryId);
  if (!category) return undefined;
  
  for (const subCat of category.subCategories) {
    const module = subCat.modules.find(m => m.id === moduleId);
    if (module) return module;
  }
  return undefined;
};

// Helper to get all modules for a category
export const getAllModulesForCategory = (categoryId: string): NavigatorModule[] => {
  const category = getCategoryById(categoryId);
  if (!category) return [];
  
  return category.subCategories.flatMap(sc => sc.modules);
};
