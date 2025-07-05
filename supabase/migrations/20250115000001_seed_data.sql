/*
  # Seed Data for Skilltrack-365 Labs
  
  This migration populates the database with sample data for:
  - Services and categories
  - Courses and modules
  - Labs and lab categories
  - Sample users and profiles
  - Reviews and ratings
  - System settings
*/

-- Insert sample services
INSERT INTO services (slug, title, description, icon, image_url, color, featured, sort_order) VALUES
('ai-machine-learning', 'AI & Machine Learning', 'Master artificial intelligence and machine learning with hands-on projects and real-world applications.', 'Brain', 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600', '#ff6b6b', true, 1),
('software-development', 'Software Development', 'Master modern software development practices with full-stack technologies and best practices.', 'Code', 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600', '#6c5ce7', true, 2),
('cloud-solutions', 'Cloud Solutions', 'Learn cloud computing with AWS, Azure, and Google Cloud Platform for scalable applications.', 'Cloud', 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600', '#74b9ff', true, 3),
('cybersecurity', 'Cybersecurity', 'Master security concepts, ethical hacking, and defensive strategies for modern threats.', 'Shield', 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=600', '#2c3e50', false, 4),
('data-science', 'Data Science', 'Learn data analysis, visualization, and statistical modeling for business intelligence.', 'BarChart3', 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600', '#00b894', false, 5),
('devops', 'DevOps & Automation', 'Master CI/CD, containerization, and infrastructure as code for modern development.', 'GitBranch', 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600', '#fdcb6e', false, 6);

-- Insert sample lab categories
INSERT INTO lab_categories (slug, name, description, icon, lab_count) VALUES
('cloud-computing', 'Cloud Computing', 'Hands-on labs for AWS, Azure, and Google Cloud', 'Cloud', 45),
('devops', 'DevOps', 'CI/CD, Docker, Kubernetes, and automation', 'GitBranch', 32),
('cybersecurity', 'Cybersecurity', 'Security testing, penetration testing, and compliance', 'Shield', 28),
('data-science', 'Data Science', 'Machine learning, analytics, and big data', 'BarChart3', 38),
('web-development', 'Web Development', 'Frontend, backend, and full-stack development', 'Code', 42),
('mobile-development', 'Mobile Development', 'iOS, Android, and cross-platform development', 'Smartphone', 25),
('blockchain', 'Blockchain', 'Smart contracts, DeFi, and cryptocurrency', 'Link', 18),
('ai-ml', 'AI & Machine Learning', 'Deep learning, NLP, and computer vision', 'Brain', 35);

-- Insert sample courses
INSERT INTO courses (service_id, slug, title, description, duration, level, price, instructor_id, rating, student_count, image_url, features, objectives, prerequisites, is_published) 
SELECT 
  s.id,
  'ml-fundamentals',
  'Machine Learning Fundamentals',
  'Learn the core concepts of machine learning including supervised and unsupervised learning algorithms.',
  '8 weeks',
  'Beginner',
  299,
  NULL,
  4.8,
  1250,
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['Linear Regression', 'Decision Trees', 'Neural Networks', 'Model Evaluation'],
  ARRAY['Understand machine learning fundamentals', 'Implement supervised learning algorithms', 'Evaluate model performance', 'Apply ML to real-world problems'],
  ARRAY['Basic Python programming', 'High school mathematics', 'Familiarity with data analysis'],
  true
FROM services s WHERE s.slug = 'ai-machine-learning';

INSERT INTO courses (service_id, slug, title, description, duration, level, price, instructor_id, rating, student_count, image_url, features, objectives, prerequisites, is_published)
SELECT 
  s.id,
  'deep-learning',
  'Deep Learning with TensorFlow',
  'Build and deploy deep neural networks using TensorFlow for image recognition and NLP tasks.',
  '12 weeks',
  'Intermediate',
  499,
  NULL,
  4.9,
  890,
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['CNNs', 'RNNs', 'Transfer Learning', 'Model Deployment'],
  ARRAY['Build convolutional neural networks', 'Implement recurrent neural networks', 'Apply transfer learning techniques', 'Deploy models to production'],
  ARRAY['Machine Learning Fundamentals', 'Python programming', 'Linear algebra basics'],
  true
FROM services s WHERE s.slug = 'ai-machine-learning';

INSERT INTO courses (service_id, slug, title, description, duration, level, price, instructor_id, rating, student_count, image_url, features, objectives, prerequisites, is_published)
SELECT 
  s.id,
  'fullstack-javascript',
  'Full-Stack JavaScript Development',
  'Build complete web applications using React, Node.js, and modern JavaScript frameworks.',
  '16 weeks',
  'Intermediate',
  699,
  NULL,
  4.9,
  1500,
  'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['React.js', 'Node.js', 'MongoDB', 'REST APIs'],
  ARRAY['Build modern React applications', 'Create RESTful APIs with Node.js', 'Design database schemas', 'Deploy full-stack applications'],
  ARRAY['Basic JavaScript knowledge', 'HTML and CSS fundamentals', 'Understanding of web development'],
  true
FROM services s WHERE s.slug = 'software-development';

INSERT INTO courses (service_id, slug, title, description, duration, level, price, instructor_id, rating, student_count, image_url, features, objectives, prerequisites, is_published)
SELECT 
  s.id,
  'aws-fundamentals',
  'AWS Cloud Fundamentals',
  'Master Amazon Web Services core services including EC2, S3, RDS, and Lambda.',
  '10 weeks',
  'Beginner',
  449,
  NULL,
  4.8,
  1300,
  'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['EC2', 'S3', 'RDS', 'Lambda Functions'],
  ARRAY['Deploy applications on EC2', 'Store and manage data in S3', 'Set up relational databases', 'Create serverless functions'],
  ARRAY['Basic IT knowledge', 'Understanding of networking', 'Familiarity with command line'],
  true
FROM services s WHERE s.slug = 'cloud-solutions';

-- Insert sample labs
INSERT INTO labs (category_id, slug, title, description, difficulty, duration, technology, provider, rating, student_count, image_url, features, objectives, prerequisites, is_popular, is_free, is_published)
SELECT 
  lc.id,
  'aws-ec2-setup',
  'AWS EC2 Instance Setup and Configuration',
  'Learn to launch, configure, and manage EC2 instances with security groups and key pairs.',
  'Beginner',
  '45 minutes',
  ARRAY['AWS', 'EC2', 'Linux', 'SSH'],
  'AWS',
  4.8,
  12500,
  'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['Live AWS Environment', 'Step-by-step Guide', 'Real-world Scenarios'],
  ARRAY['Launch and configure EC2 instances', 'Set up security groups and network access', 'Connect to instances using SSH', 'Understand AWS pricing and billing'],
  ARRAY['Basic understanding of cloud computing', 'Familiarity with command line'],
  true,
  false,
  true
FROM lab_categories lc WHERE lc.slug = 'cloud-computing';

INSERT INTO labs (category_id, slug, title, description, difficulty, duration, technology, provider, rating, student_count, image_url, features, objectives, prerequisites, is_popular, is_free, is_published)
SELECT 
  lc.id,
  'docker-containerization',
  'Docker Containerization Fundamentals',
  'Master Docker containers, images, and orchestration with hands-on practice.',
  'Intermediate',
  '90 minutes',
  ARRAY['Docker', 'Linux', 'Container', 'DevOps'],
  'Docker',
  4.9,
  8900,
  'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['Interactive Terminal', 'Pre-configured Environment', 'Real Applications'],
  ARRAY['Create and manage Docker containers', 'Build custom Docker images', 'Understand Docker networking', 'Deploy multi-container applications'],
  ARRAY['Basic Linux knowledge', 'Understanding of virtualization'],
  true,
  true,
  true
FROM lab_categories lc WHERE lc.slug = 'devops';

INSERT INTO labs (category_id, slug, title, description, difficulty, duration, technology, provider, rating, student_count, image_url, features, objectives, prerequisites, is_popular, is_free, is_published)
SELECT 
  lc.id,
  'kubernetes-deployment',
  'Kubernetes Cluster Deployment',
  'Deploy and manage applications on Kubernetes clusters with pods, services, and ingress.',
  'Advanced',
  '120 minutes',
  ARRAY['Kubernetes', 'Docker', 'YAML', 'kubectl'],
  'Kubernetes',
  4.7,
  6200,
  'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['Live K8s Cluster', 'Production Scenarios', 'Troubleshooting Guide'],
  ARRAY['Deploy applications to Kubernetes', 'Configure services and ingress', 'Manage persistent storage', 'Monitor and troubleshoot deployments'],
  ARRAY['Docker experience', 'YAML knowledge', 'Container orchestration basics'],
  false,
  false,
  true
FROM lab_categories lc WHERE lc.slug = 'devops';

INSERT INTO labs (category_id, slug, title, description, difficulty, duration, technology, provider, rating, student_count, image_url, features, objectives, prerequisites, is_popular, is_free, is_published)
SELECT 
  lc.id,
  'ethical-hacking-basics',
  'Ethical Hacking and Penetration Testing',
  'Learn ethical hacking techniques and conduct security assessments in a safe environment.',
  'Intermediate',
  '150 minutes',
  ARRAY['Kali Linux', 'Nmap', 'Metasploit', 'Wireshark'],
  'Security Labs',
  4.8,
  9800,
  'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['Isolated Lab Environment', 'Real Vulnerabilities', 'Legal Framework'],
  ARRAY['Perform network reconnaissance', 'Identify security vulnerabilities', 'Exploit common weaknesses', 'Document findings and recommendations'],
  ARRAY['Network fundamentals', 'Linux command line', 'Security awareness'],
  true,
  false,
  true
FROM lab_categories lc WHERE lc.slug = 'cybersecurity';

INSERT INTO labs (category_id, slug, title, description, difficulty, duration, technology, provider, rating, student_count, image_url, features, objectives, prerequisites, is_popular, is_free, is_published)
SELECT 
  lc.id,
  'machine-learning-python',
  'Machine Learning with Python and Scikit-learn',
  'Build and train machine learning models using Python, pandas, and scikit-learn.',
  'Intermediate',
  '180 minutes',
  ARRAY['Python', 'Scikit-learn', 'Pandas', 'Jupyter'],
  'Data Labs',
  4.9,
  11200,
  'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
  ARRAY['Jupyter Notebooks', 'Real Datasets', 'Model Evaluation'],
  ARRAY['Prepare and clean datasets', 'Train classification and regression models', 'Evaluate model performance', 'Deploy models for prediction'],
  ARRAY['Python programming', 'Statistics basics', 'Data analysis concepts'],
  true,
  false,
  true
FROM lab_categories lc WHERE lc.slug = 'data-science';

-- Insert course modules
INSERT INTO course_modules (course_id, title, description, duration_minutes, sort_order, is_published)
SELECT 
  c.id,
  'Introduction to Machine Learning',
  'Learn the fundamentals of machine learning and its applications.',
  120,
  1,
  true
FROM courses c WHERE c.slug = 'ml-fundamentals';

INSERT INTO course_modules (course_id, title, description, duration_minutes, sort_order, is_published)
SELECT 
  c.id,
  'Supervised Learning',
  'Master supervised learning algorithms including linear regression and classification.',
  180,
  2,
  true
FROM courses c WHERE c.slug = 'ml-fundamentals';

INSERT INTO course_modules (course_id, title, description, duration_minutes, sort_order, is_published)
SELECT 
  c.id,
  'Unsupervised Learning',
  'Explore clustering and dimensionality reduction techniques.',
  150,
  3,
  true
FROM courses c WHERE c.slug = 'ml-fundamentals';

-- Insert course lessons
INSERT INTO course_lessons (module_id, title, description, content_type, content_url, duration_minutes, sort_order, is_published)
SELECT 
  cm.id,
  'What is Machine Learning?',
  'Introduction to the concept of machine learning and its types.',
  'video',
  'https://example.com/videos/ml-intro.mp4',
  30,
  1,
  true
FROM course_modules cm 
JOIN courses c ON c.id = cm.course_id 
WHERE c.slug = 'ml-fundamentals' AND cm.sort_order = 1;

INSERT INTO course_lessons (module_id, title, description, content_type, content_url, duration_minutes, sort_order, is_published)
SELECT 
  cm.id,
  'Types of Machine Learning',
  'Overview of supervised, unsupervised, and reinforcement learning.',
  'video',
  'https://example.com/videos/ml-types.mp4',
  45,
  2,
  true
FROM course_modules cm 
JOIN courses c ON c.id = cm.course_id 
WHERE c.slug = 'ml-fundamentals' AND cm.sort_order = 1;

INSERT INTO course_lessons (module_id, title, description, content_type, content_url, duration_minutes, sort_order, is_published)
SELECT 
  cm.id,
  'Linear Regression Lab',
  'Hands-on lab implementing linear regression from scratch.',
  'lab',
  'lab://linear-regression-basics',
  60,
  1,
  true
FROM course_modules cm 
JOIN courses c ON c.id = cm.course_id 
WHERE c.slug = 'ml-fundamentals' AND cm.sort_order = 2;

-- Insert sample course reviews
INSERT INTO course_reviews (user_id, course_id, rating, review_text, is_verified_purchase, helpful_votes)
SELECT 
  p.id,
  c.id,
  5,
  'Excellent course! The hands-on labs really helped me understand the concepts. Highly recommended for beginners.',
  true,
  12
FROM courses c, profiles p 
WHERE c.slug = 'ml-fundamentals' 
LIMIT 1;

INSERT INTO course_reviews (user_id, course_id, rating, review_text, is_verified_purchase, helpful_votes)
SELECT 
  p.id,
  c.id,
  4,
  'Great content and well-structured. The instructor explains complex topics clearly.',
  true,
  8
FROM courses c, profiles p 
WHERE c.slug = 'ml-fundamentals' 
LIMIT 1;

INSERT INTO course_reviews (user_id, course_id, rating, review_text, is_verified_purchase, helpful_votes)
SELECT 
  p.id,
  c.id,
  5,
  'Amazing course! I learned so much about AWS services. The practical exercises were very helpful.',
  true,
  15
FROM courses c, profiles p 
WHERE c.slug = 'aws-fundamentals' 
LIMIT 1;

-- Insert sample lab reviews
INSERT INTO lab_reviews (user_id, lab_id, rating, review_text, difficulty_rating, time_accuracy_rating, helpful_votes)
SELECT 
  p.id,
  l.id,
  5,
  'Perfect lab for learning Docker! The environment was well-configured and instructions were clear.',
  3,
  5,
  20
FROM labs l, profiles p 
WHERE l.slug = 'docker-containerization' 
LIMIT 1;

INSERT INTO lab_reviews (user_id, lab_id, rating, review_text, difficulty_rating, time_accuracy_rating, helpful_votes)
SELECT 
  p.id,
  l.id,
  4,
  'Great hands-on experience with AWS EC2. The lab covered all the essential concepts.',
  2,
  4,
  14
FROM labs l, profiles p 
WHERE l.slug = 'aws-ec2-setup' 
LIMIT 1;

-- Insert sample user bookmarks
INSERT INTO user_bookmarks (user_id, entity_type, entity_id)
SELECT 
  p.id,
  'course',
  c.id
FROM courses c, profiles p 
WHERE c.slug = 'ml-fundamentals' 
LIMIT 1;

INSERT INTO user_bookmarks (user_id, entity_type, entity_id)
SELECT 
  p.id,
  'lab',
  l.id
FROM labs l, profiles p 
WHERE l.slug = 'docker-containerization' 
LIMIT 1;

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, notification_type, entity_type, entity_id)
SELECT 
  p.id,
  'Welcome to Skilltrack-365 Labs!',
  'Thank you for joining our platform. Start exploring our courses and labs to enhance your skills.',
  'in_app',
  NULL,
  NULL
FROM profiles p 
LIMIT 1;

INSERT INTO notifications (user_id, title, message, notification_type, entity_type, entity_id)
SELECT 
  p.id,
  'New Course Available',
  'Check out our new Machine Learning Fundamentals course!',
  'email',
  'course',
  c.id
FROM courses c, profiles p 
WHERE c.slug = 'ml-fundamentals' 
LIMIT 1;

-- Insert sample user activities
INSERT INTO user_activities (user_id, activity_type, entity_type, entity_id, metadata)
SELECT 
  p.id,
  'login',
  NULL,
  NULL,
  '{"ip": "192.168.1.1", "user_agent": "Mozilla/5.0..."}'
FROM profiles p 
LIMIT 1;

INSERT INTO user_activities (user_id, activity_type, entity_type, entity_id, metadata)
SELECT 
  p.id,
  'course_start',
  'course',
  c.id,
  '{"progress": 0}'
FROM courses c, profiles p 
WHERE c.slug = 'ml-fundamentals' 
LIMIT 1;

INSERT INTO user_activities (user_id, activity_type, entity_type, entity_id, metadata)
SELECT 
  p.id,
  'lab_start',
  'lab',
  l.id,
  '{"environment": "docker-basic"}'
FROM labs l, profiles p 
WHERE l.slug = 'docker-containerization' 
LIMIT 1;

-- Insert sample system settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('platform_name', '"Skilltrack-365 Labs"', 'Platform display name', true),
('max_lab_duration_hours', '4', 'Maximum lab session duration in hours', true),
('auto_save_interval_minutes', '5', 'Auto-save interval for cloud environments', true),
('max_concurrent_labs_per_user', '3', 'Maximum concurrent lab sessions per user', true),
('default_environment_template', '"ubuntu-22.04"', 'Default cloud environment template', true),
('maintenance_mode', 'false', 'Platform maintenance mode', true),
('registration_enabled', 'true', 'User registration enabled', true),
('email_verification_required', 'true', 'Email verification required for registration', true),
('free_tier_lab_limit', '5', 'Number of free labs per month', true),
('premium_tier_lab_limit', '50', 'Number of premium labs per month', true),
('support_email', '"support@skilltrack365.com"', 'Platform support email', true),
('max_file_upload_size_mb', '100', 'Maximum file upload size in MB', true);

-- Insert sample course tags
INSERT INTO course_tags (name, description, color) VALUES
('JavaScript', 'JavaScript programming language', '#f7df1e'),
('Python', 'Python programming language', '#3776ab'),
('React', 'React.js framework', '#61dafb'),
('Node.js', 'Node.js runtime', '#339933'),
('AWS', 'Amazon Web Services', '#ff9900'),
('Docker', 'Containerization technology', '#2496ed'),
('Kubernetes', 'Container orchestration', '#326ce5'),
('Machine Learning', 'Machine learning and AI', '#ff6b6b'),
('Cybersecurity', 'Security and ethical hacking', '#2c3e50'),
('DevOps', 'Development operations', '#6c5ce7'),
('Data Science', 'Data analysis and visualization', '#00b894'),
('Cloud Computing', 'Cloud platforms and services', '#74b9ff'),
('Web Development', 'Frontend and backend development', '#fd79a8'),
('Mobile Development', 'iOS and Android development', '#fdcb6e'),
('Blockchain', 'Blockchain and cryptocurrency', '#e17055');

-- Link course tags to courses
INSERT INTO course_tag_relationships (course_id, tag_id)
SELECT c.id, ct.id
FROM courses c, course_tags ct
WHERE c.slug = 'ml-fundamentals' AND ct.name IN ('Python', 'Machine Learning', 'Data Science');

INSERT INTO course_tag_relationships (course_id, tag_id)
SELECT c.id, ct.id
FROM courses c, course_tags ct
WHERE c.slug = 'deep-learning' AND ct.name IN ('Python', 'Machine Learning', 'Data Science');

INSERT INTO course_tag_relationships (course_id, tag_id)
SELECT c.id, ct.id
FROM courses c, course_tags ct
WHERE c.slug = 'fullstack-javascript' AND ct.name IN ('JavaScript', 'React', 'Node.js', 'Web Development');

INSERT INTO course_tag_relationships (course_id, tag_id)
SELECT c.id, ct.id
FROM courses c, course_tags ct
WHERE c.slug = 'aws-fundamentals' AND ct.name IN ('AWS', 'Cloud Computing', 'DevOps');

-- Update service counts
UPDATE services SET 
  course_count = (SELECT COUNT(*) FROM courses WHERE service_id = services.id),
  student_count = (SELECT COALESCE(SUM(student_count), 0) FROM courses WHERE service_id = services.id);

-- Update lab category counts
UPDATE lab_categories SET 
  lab_count = (SELECT COUNT(*) FROM labs WHERE category_id = lab_categories.id);

-- Insert sample analytics events
INSERT INTO analytics_events (user_id, event_name, event_data, session_id, page_url)
SELECT 
  p.id,
  'page_view',
  '{"page": "/courses", "referrer": "/"}',
  'session_123',
  '/courses'
FROM profiles p 
LIMIT 1;

INSERT INTO analytics_events (user_id, event_name, event_data, session_id, page_url)
SELECT 
  p.id,
  'course_view',
  '{"course_id": "' || c.id || '", "course_title": "' || c.title || '"}',
  'session_123',
  '/courses/' || c.slug
FROM courses c, profiles p 
WHERE c.slug = 'ml-fundamentals' 
LIMIT 1;

INSERT INTO analytics_events (user_id, event_name, event_data, session_id, page_url)
SELECT 
  p.id,
  'lab_view',
  '{"lab_id": "' || l.id || '", "lab_title": "' || l.title || '"}',
  'session_123',
  '/labs/' || l.slug
FROM labs l, profiles p 
WHERE l.slug = 'docker-containerization' 
LIMIT 1; 