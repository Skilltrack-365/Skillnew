# Contact System Documentation

## Overview

The contact system provides a professional way for users to reach out to your team, specifically configured for Prashanth from Refabs365. It includes form validation, email sending, database storage, and analytics tracking.

## Features

### ✅ **Professional Contact Form**
- Clean, modern design with responsive layout
- Form validation with real-time feedback
- Multiple contact methods (email, phone, location)
- Subject dropdown for better organization
- Success/error status messages

### ✅ **Contact Information Display**
- Team member details (Prashanth)
- Professional contact cards
- Clickable email and phone links
- Location information
- Role and company details

### ✅ **Backend Integration**
- Email service integration (EmailJS, SendGrid, SMTP)
- Database storage for contact requests
- Team notifications (Slack, Discord, Teams)
- Analytics tracking

### ✅ **Form Validation**
- Name validation (minimum 2 characters)
- Email format validation
- Subject validation (minimum 5 characters)
- Message validation (minimum 10 characters)
- Phone number format validation (optional)

## Components

### 1. ContactForm Component
**Location**: `src/components/ContactForm.tsx`

**Features**:
- Professional form design
- Real-time validation
- Loading states
- Success/error handling
- Analytics tracking

**Props**:
```typescript
interface ContactFormProps {
  contactInfo?: ContactInfo;
  onSubmit?: (data: ContactFormData) => void;
  title?: string;
  description?: string;
}
```

### 2. Contact API Service
**Location**: `src/lib/contactApi.ts`

**Features**:
- Email sending via multiple services
- Database storage
- Team notifications
- Form validation
- Analytics tracking

## Configuration

### Email Service Setup

#### Option 1: EmailJS (Recommended for frontend)
```typescript
// In src/lib/contactApi.ts
export const emailConfig = {
  emailJS: {
    serviceId: 'your_emailjs_service_id',
    templateId: 'your_emailjs_template_id',
    userId: 'your_emailjs_user_id'
  }
};
```

#### Option 2: SendGrid
```typescript
export const emailConfig = {
  sendGrid: {
    apiKey: 'your_sendgrid_api_key',
    fromEmail: 'noreply@skilltrack365labs.com',
    fromName: 'Skilltrack-365 Labs'
  }
};
```

#### Option 3: SMTP
```typescript
export const emailConfig = {
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_app_password'
    }
  }
};
```

### Notification Service Setup

#### Slack Integration
```typescript
export const notificationConfig = {
  slack: {
    webhookUrl: 'your_slack_webhook_url',
    channel: '#contact-leads'
  }
};
```

#### Discord Integration
```typescript
export const notificationConfig = {
  discord: {
    webhookUrl: 'your_discord_webhook_url',
    channel: 'contact-leads'
  }
};
```

## Usage Examples

### Basic Usage
```typescript
import ContactForm from './components/ContactForm';

const contactInfo = {
  name: 'Prashanth',
  email: 'Prashanth@refabs365.com',
  phone: '+91 9844543555',
  location: 'Bangalore, IND',
  role: 'Team Lead - Refabs365'
};

<ContactForm 
  contactInfo={contactInfo}
  title="Let's Start a Conversation"
  description="Get in touch with our team to discuss your project requirements."
/>
```

### Custom Submit Handler
```typescript
const handleContactSubmit = async (formData: ContactFormData) => {
  // Custom logic here
  console.log('Contact form submitted:', formData);
  
  // Send to your API
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  return response.ok;
};

<ContactForm 
  contactInfo={contactInfo}
  onSubmit={handleContactSubmit}
/>
```

### API Service Usage
```typescript
import { contactApi } from '../lib/contactApi';

// Submit contact form
const result = await contactApi.submitContactForm({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Project Inquiry',
  message: 'I would like to discuss a project...',
  phone: '+1234567890'
});

if (result.success) {
  console.log('Contact form submitted successfully');
} else {
  console.error('Error:', result.message);
}

// Validate form data
const validation = contactApi.validateContactForm(formData);
if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
}
```

## Contact Information

### Current Configuration
```typescript
const contactInfo = {
  name: 'Prashanth',
  email: 'Prashanth@refabs365.com',
  phone: '+91 9844543555',
  location: 'Bangalore, IND',
  role: 'Team Lead - Refabs365'
};
```

### Adding More Team Members
```typescript
const teamContacts = [
  {
    name: 'Prashanth',
    email: 'Prashanth@refabs365.com',
    phone: '+91 9844543555',
    location: 'Bangalore, IND',
    role: 'Team Lead'
  },
  {
    name: 'Another Team Member',
    email: 'member@refabs365.com',
    phone: '+91 9876543210',
    location: 'Mumbai, IND',
    role: 'Senior Developer'
  }
];
```

## Analytics Integration

### Tracking Contact Form Views
```typescript
import { contactAnalytics } from '../lib/contactApi';

// Track when contact form is viewed
contactAnalytics.trackView();
```

### Tracking Form Submissions
```typescript
// Track successful form submissions
contactAnalytics.trackSubmission({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Project Inquiry',
  message: 'I would like to discuss...'
});
```

## Database Integration

### Store Contact Requests
```typescript
// The contact API automatically stores requests in your database
const result = await contactApi.storeContactRequest(formData);

if (result.success) {
  console.log('Contact request stored:', result.data);
}
```

### Database Schema
```sql
-- Contact requests table (if you want to add it to your schema)
CREATE TABLE contact_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  phone text,
  status text DEFAULT 'new',
  source text DEFAULT 'website_contact_form',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Security Considerations

### Form Validation
- Client-side validation for user experience
- Server-side validation for security
- Input sanitization
- Rate limiting for form submissions

### Data Protection
- Email addresses are validated
- Phone numbers are formatted
- Personal data is handled securely
- GDPR compliance considerations

### Spam Protection
- CAPTCHA integration (optional)
- Rate limiting
- Email validation
- Suspicious content detection

## Customization Options

### Styling
The contact form uses Tailwind CSS and can be customized by modifying the classes in `ContactForm.tsx`.

### Fields
Add or remove form fields by modifying the form structure and validation logic.

### Email Templates
Customize email templates for different types of contact requests.

### Notifications
Configure different notification channels for different team members or request types.

## Troubleshooting

### Common Issues

1. **Email not sending**
   - Check email service configuration
   - Verify API keys and credentials
   - Check network connectivity

2. **Form validation errors**
   - Ensure all required fields are filled
   - Check email format
   - Verify phone number format

3. **Analytics not tracking**
   - Check browser console for errors
   - Verify analytics service configuration
   - Ensure tracking code is loaded

### Debug Mode
Enable debug mode to see detailed logs:
```typescript
// Add to your environment variables
VITE_DEBUG_CONTACT=true
```

## Future Enhancements

### Planned Features
- [ ] File upload support
- [ ] Calendar integration for scheduling
- [ ] Chat widget integration
- [ ] Multi-language support
- [ ] Advanced spam protection
- [ ] Contact request management dashboard

### Integration Ideas
- [ ] CRM integration (Salesforce, HubSpot)
- [ ] Project management tools (Jira, Asana)
- [ ] Customer support platforms (Zendesk, Intercom)
- [ ] Marketing automation (Mailchimp, ConvertKit)

## Support

For technical support or questions about the contact system, please contact:
- **Email**: Prashanth@refabs365.com
- **Phone**: +91 9844543555
- **Location**: Bangalore, IND

---

This contact system provides a professional and reliable way for users to reach out to your team, with comprehensive features for managing and tracking contact requests. 