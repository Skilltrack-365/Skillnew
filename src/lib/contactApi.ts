/*
  # Contact API Service
  
  This service handles contact form submissions and can integrate with
  various email services and backend APIs.
*/

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Email service integration (example with EmailJS)
export const contactApi = {
  // Send contact form via EmailJS
  async sendViaEmailJS(formData: ContactFormData): Promise<ContactResponse> {
    try {
      // You can integrate with EmailJS, SendGrid, or any email service
      // For now, we'll simulate the API call
      
      const emailData = {
        to_email: 'Prashanth@refabs365.com',
        from_name: formData.name,
        from_email: formData.email,
        subject: `Contact Form: ${formData.subject}`,
        message: `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Subject: ${formData.subject}

Message:
${formData.message}
        `,
        timestamp: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Contact form submitted:', emailData);
      
      return {
        success: true,
        message: 'Thank you! Your message has been sent successfully.',
        data: emailData
      };
    } catch (error) {
      console.error('Contact API error:', error);
      return {
        success: false,
        message: 'Sorry, there was an error sending your message. Please try again.'
      };
    }
  },

  // Store contact request in database
  async storeContactRequest(formData: ContactFormData): Promise<ContactResponse> {
    try {
      // You can store contact requests in your database
      const contactRequest = {
        id: `contact_${Date.now()}`,
        ...formData,
        status: 'new',
        created_at: new Date().toISOString(),
        source: 'website_contact_form'
      };

      // Simulate database storage
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Contact request stored:', contactRequest);
      
      return {
        success: true,
        message: 'Contact request stored successfully.',
        data: contactRequest
      };
    } catch (error) {
      console.error('Database storage error:', error);
      return {
        success: false,
        message: 'Error storing contact request.'
      };
    }
  },

  // Send notification to team (Slack, Discord, etc.)
  async sendTeamNotification(formData: ContactFormData): Promise<ContactResponse> {
    try {
      const notification = {
        channel: '#contact-leads',
        text: `New contact form submission from ${formData.name} (${formData.email})`,
        attachments: [
          {
            title: formData.subject,
            text: formData.message,
            fields: [
              {
                title: 'Name',
                value: formData.name,
                short: true
              },
              {
                title: 'Email',
                value: formData.email,
                short: true
              },
              {
                title: 'Phone',
                value: formData.phone || 'Not provided',
                short: true
              }
            ]
          }
        ]
      };

      // Simulate notification sending
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Team notification sent:', notification);
      
      return {
        success: true,
        message: 'Team notification sent.',
        data: notification
      };
    } catch (error) {
      console.error('Notification error:', error);
      return {
        success: false,
        message: 'Error sending team notification.'
      };
    }
  },

  // Main contact form handler
  async submitContactForm(formData: ContactFormData): Promise<ContactResponse> {
    try {
      // Send email
      const emailResult = await this.sendViaEmailJS(formData);
      if (!emailResult.success) {
        return emailResult;
      }

      // Store in database
      const storageResult = await this.storeContactRequest(formData);
      if (!storageResult.success) {
        console.warn('Failed to store contact request:', storageResult.message);
      }

      // Send team notification
      const notificationResult = await this.sendTeamNotification(formData);
      if (!notificationResult.success) {
        console.warn('Failed to send team notification:', notificationResult.message);
      }

      return {
        success: true,
        message: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.',
        data: {
          email: emailResult.data,
          storage: storageResult.data,
          notification: notificationResult.data
        }
      };
    } catch (error) {
      console.error('Contact form submission error:', error);
      return {
        success: false,
        message: 'Sorry, there was an error processing your request. Please try again or contact us directly.'
      };
    }
  },

  // Validate contact form data
  validateContactForm(formData: ContactFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!formData.name || formData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!formData.subject || formData.subject.trim().length < 5) {
      errors.push('Subject must be at least 5 characters long');
    }

    if (!formData.message || formData.message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.push('Please enter a valid phone number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Email service configurations
export const emailConfig = {
  // Easy setup for frontend-only applications
  emailJS: {
    serviceId: 'your_emailjs_service_id',
    templateId: 'your_emailjs_template_id',
    userId: 'your_emailjs_user_id'
  },

  // Professional email service
  sendGrid: {
    apiKey: 'your_sendgrid_api_key',
    fromEmail: 'noreply@skilltrack365labs.com',
    fromName: 'Skilltrack-365 Labs'
  },

  // Direct SMTP connection
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_app_password'
    }
  }
};

// Notification service configurations
export const notificationConfig = {
  // Slack configuration
  slack: {
    webhookUrl: 'your_slack_webhook_url',
    channel: '#contact-leads'
  },

  // Discord configuration
  discord: {
    webhookUrl: 'your_discord_webhook_url',
    channel: 'contact-leads'
  },

  // Microsoft Teams configuration
  teams: {
    webhookUrl: 'your_teams_webhook_url'
  }
};

// Contact form analytics
export const contactAnalytics = {
  // Track contact form submissions
  trackSubmission(formData: ContactFormData) {
    // You can integrate with Google Analytics, Mixpanel, etc.
    const event = {
      event: 'contact_form_submitted',
      properties: {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        hasPhone: !!formData.phone,
        timestamp: new Date().toISOString()
      }
    };

    console.log('Contact analytics event:', event);
    
    // Example: Send to analytics service
    // analytics.track('contact_form_submitted', event.properties);
  },

  // Track contact form views
  trackView() {
    const event = {
      event: 'contact_form_viewed',
      properties: {
        timestamp: new Date().toISOString(),
        page: window.location.pathname
      }
    };

    console.log('Contact form view tracked:', event);
    
    // Example: Send to analytics service
    // analytics.track('contact_form_viewed', event.properties);
  }
}; 