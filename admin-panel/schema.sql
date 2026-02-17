-- Admin Panel Database Schema (PostgreSQL)

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Login logs
CREATE TABLE IF NOT EXISTS login_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  user_email VARCHAR(255),
  action VARCHAR(50),
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Error logs
CREATE TABLE IF NOT EXISTS error_logs (
  id SERIAL PRIMARY KEY,
  level VARCHAR(50),
  message TEXT,
  source VARCHAR(255),
  stack_trace TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Templates
CREATE TABLE IF NOT EXISTS templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  code TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DevOps Projects
CREATE TABLE IF NOT EXISTS devops_projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  github_url TEXT,
  description TEXT,
  tags JSONB,
  difficulty VARCHAR(50),
  icon VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAQ
CREATE TABLE IF NOT EXISTS faq (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT,
  category VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: admin123)
-- Password hash for 'admin123': $2a$10$rZ5qKvZxKxKxKxKxKxKxKOqKxKxKxKxKxKxKxKxKxKxKxKxKxKxKx
INSERT INTO admins (name, email, password_hash, role) 
VALUES ('Super Admin', 'admin@terraai.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Sample templates
INSERT INTO templates (name, description, code) VALUES
('VPC Template', 'Production-ready VPC with public and private subnets', 'resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support = true
  tags = {
    Name = "production-vpc"
  }
}'),
('EC2 Template', 'Basic EC2 instance with security group', 'resource "aws_instance" "web" {
  ami = var.ami_id
  instance_type = var.instance_type
  tags = {
    Name = "web-server"
  }
}')
ON CONFLICT DO NOTHING;

-- Sample DevOps projects
INSERT INTO devops_projects (name, github_url, description, difficulty, icon) VALUES
('Kubernetes Multi-Cluster', 'https://github.com/example/k8s-cluster', 'Production-ready Kubernetes setup', 'Advanced', '☸️'),
('CI/CD Pipeline', 'https://github.com/example/cicd', 'Jenkins-based CI/CD pipeline', 'Intermediate', '🔄'),
('Docker Microservices', 'https://github.com/example/docker-ms', 'Microservices with Docker Compose', 'Beginner', '🐳')
ON CONFLICT DO NOTHING;

-- Sample FAQ
INSERT INTO faq (question, answer, category) VALUES
('How to deploy EC2 instance?', 'Use the EC2 template and configure your variables.', 'AWS'),
('What is VPC?', 'Virtual Private Cloud - isolated network in AWS.', 'AWS'),
('How to configure RDS?', 'Use RDS template with proper security groups.', 'Database')
ON CONFLICT DO NOTHING;
