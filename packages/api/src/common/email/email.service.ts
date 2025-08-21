import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

interface BusinessSubmissionEmailData {
  businessName: string;
  businessNameChinese?: string;
  submissionId: string;
  contactEmail?: string;
  locale: 'en' | 'zh';
}

interface AdminNotificationEmailData {
  businessName: string;
  businessNameChinese?: string;
  submissionId: string;
  submitterEmail?: string;
  categories: string[];
  location: string;
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private templates: Map<string, handlebars.TemplateDelegate> = new Map();

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
    this.loadTemplates();
  }

  private initializeTransporter(): void {
    const emailConfig = {
      host: this.configService.get('EMAIL_HOST', 'smtp.gmail.com'),
      port: parseInt(this.configService.get('EMAIL_PORT', '587')),
      secure: this.configService.get('EMAIL_SECURE', 'false') === 'true',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    };

    // For development, use ethereal email if no real email config
    if (!emailConfig.auth.user || !emailConfig.auth.pass) {
      this.logger.warn('No email configuration found. Emails will be logged only.');
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      });
    } else {
      this.transporter = nodemailer.createTransport(emailConfig);
    }
  }

  private loadTemplates(): void {
    try {
      // Load email templates (for now, we'll create them inline)
      this.createInlineTemplates();
    } catch (error) {
      this.logger.error('Failed to load email templates:', error);
    }
  }

  private createInlineTemplates(): void {
    // Business submission confirmation template
    const submissionConfirmationTemplate = handlebars.compile(`
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #DC2626, #D97706); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            .chinese { font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif; }
            .status-badge { display: inline-block; background: #FEF3C7; color: #D97706; padding: 4px 12px; border-radius: 16px; font-size: 14px; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>{{#if (eq locale 'zh')}}提交确认{{else}}Submission Confirmed{{/if}}</h1>
              <p>{{#if (eq locale 'zh')}}凤凰城华人商家目录{{else}}Phoenix Chinese Business Directory{{/if}}</p>
            </div>
            <div class="content">
              {{#if (eq locale 'zh')}}
                <h2>感谢您的提交！</h2>
                <p>我们已收到您的商家信息提交：</p>
                <ul>
                  <li><strong>商家名称：</strong> {{businessName}}{{#if businessNameChinese}} / {{businessNameChinese}}{{/if}}</li>
                  <li><strong>提交编号：</strong> {{submissionId}}</li>
                  <li><strong>状态：</strong> <span class="status-badge">待审核</span></li>
                </ul>
                <h3>下一步</h3>
                <p>我们的团队将在1-3个工作日内审核您的提交。审核完成后，我们会通过邮件通知您结果。</p>
                <p>如果您有任何问题，请随时联系我们。</p>
              {{else}}
                <h2>Thank you for your submission!</h2>
                <p>We have received your business listing submission:</p>
                <ul>
                  <li><strong>Business Name:</strong> {{businessName}}{{#if businessNameChinese}} / {{businessNameChinese}}{{/if}}</li>
                  <li><strong>Submission ID:</strong> {{submissionId}}</li>
                  <li><strong>Status:</strong> <span class="status-badge">Pending Review</span></li>
                </ul>
                <h3>What's Next</h3>
                <p>Our team will review your submission within 1-3 business days. You'll receive an email notification once the review is complete.</p>
                <p>If you have any questions, please don't hesitate to contact us.</p>
              {{/if}}
            </div>
            <div class="footer">
              {{#if (eq locale 'zh')}}
                <p>凤凰城华人商家目录 | 连接华人社区与本地商家</p>
              {{else}}
                <p>Phoenix Chinese Business Directory | Connecting the Chinese Community with Local Businesses</p>
              {{/if}}
            </div>
          </div>
        </body>
      </html>
    `);

    // Admin notification template
    const adminNotificationTemplate = handlebars.compile(`
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: #1F2937; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .info-group { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px; }
            .info-label { font-weight: 600; color: #374151; margin-bottom: 5px; }
            .info-value { color: #6B7280; }
            .action-button { display: inline-block; background: #DC2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Business Submission</h1>
              <p>Phoenix Chinese Business Directory - Admin Dashboard</p>
            </div>
            <div class="content">
              <div class="info-group">
                <div class="info-label">Business Name</div>
                <div class="info-value">{{businessName}}{{#if businessNameChinese}} / {{businessNameChinese}}{{/if}}</div>
              </div>
              
              <div class="info-group">
                <div class="info-label">Submission ID</div>
                <div class="info-value">{{submissionId}}</div>
              </div>
              
              {{#if submitterEmail}}
              <div class="info-group">
                <div class="info-label">Submitter Email</div>
                <div class="info-value">{{submitterEmail}}</div>
              </div>
              {{/if}}
              
              <div class="info-group">
                <div class="info-label">Categories</div>
                <div class="info-value">{{join categories ', '}}</div>
              </div>
              
              <div class="info-group">
                <div class="info-label">Location</div>
                <div class="info-value">{{location}}</div>
              </div>
              
              <div class="info-group">
                <div class="info-label">Contact Information</div>
                <div class="info-value">
                  {{#if contactInfo.phone}}Phone: {{contactInfo.phone}}<br>{{/if}}
                  {{#if contactInfo.email}}Email: {{contactInfo.email}}<br>{{/if}}
                  {{#if contactInfo.website}}Website: {{contactInfo.website}}{{/if}}
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="#" class="action-button">Review Submission</a>
                <a href="#" class="action-button" style="background: #16A34A;">Approve</a>
                <a href="#" class="action-button" style="background: #DC2626;">Reject</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);

    // Register Handlebars helpers
    handlebars.registerHelper('eq', (a, b) => a === b);
    handlebars.registerHelper('join', (array, separator) => array.join(separator));

    this.templates.set('business-submission-confirmation', submissionConfirmationTemplate);
    this.templates.set('admin-new-submission', adminNotificationTemplate);
  }

  async sendBusinessSubmissionConfirmation(
    to: string,
    data: BusinessSubmissionEmailData
  ): Promise<boolean> {
    try {
      const template = this.templates.get('business-submission-confirmation');
      if (!template) {
        throw new Error('Template not found');
      }

      const subject = data.locale === 'zh' 
        ? `提交确认 - ${data.businessName}` 
        : `Submission Confirmed - ${data.businessName}`;

      const html = template(data);

      const mailOptions = {
        from: this.configService.get('EMAIL_FROM', 'Phoenix Chinese Directory <noreply@phoenixcn.directory>'),
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Business submission confirmation sent to: ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send business submission confirmation to ${to}:`, error);
      return false;
    }
  }

  async sendAdminNotification(
    data: AdminNotificationEmailData
  ): Promise<boolean> {
    try {
      const adminEmail = this.configService.get('ADMIN_EMAIL');
      if (!adminEmail) {
        this.logger.warn('No admin email configured, skipping notification');
        return false;
      }

      const template = this.templates.get('admin-new-submission');
      if (!template) {
        throw new Error('Template not found');
      }

      const subject = `New Business Submission: ${data.businessName}`;
      const html = template(data);

      const mailOptions = {
        from: this.configService.get('EMAIL_FROM', 'Phoenix Chinese Directory <noreply@phoenixcn.directory>'),
        to: adminEmail,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Admin notification sent for submission: ${data.submissionId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send admin notification:`, error);
      return false;
    }
  }

  async sendBusinessStatusUpdate(
    to: string,
    businessName: string,
    status: 'APPROVED' | 'REJECTED',
    locale: 'en' | 'zh' = 'en',
    rejectionReason?: string
  ): Promise<boolean> {
    try {
      const isApproved = status === 'APPROVED';
      
      const subject = locale === 'zh'
        ? `${isApproved ? '审核通过' : '审核未通过'} - ${businessName}`
        : `${isApproved ? 'Approved' : 'Rejected'} - ${businessName}`;

      const html = `
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
              .header { background: ${isApproved ? '#16A34A' : '#DC2626'}; color: white; padding: 30px; text-align: center; }
              .content { padding: 30px; }
              .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>${locale === 'zh' ? (isApproved ? '审核通过！' : '审核未通过') : (isApproved ? 'Approved!' : 'Submission Rejected')}</h1>
              </div>
              <div class="content">
                ${isApproved ? (
                  locale === 'zh' 
                    ? `<h2>恭喜！您的商家已成功上线</h2><p><strong>${businessName}</strong> 已通过审核并在我们的目录中上线。</p>`
                    : `<h2>Congratulations! Your business is now live</h2><p><strong>${businessName}</strong> has been approved and is now live in our directory.</p>`
                ) : (
                  locale === 'zh'
                    ? `<h2>很抱歉，您的提交未通过审核</h2><p><strong>${businessName}</strong> 的提交未能通过我们的审核流程。</p>${rejectionReason ? `<p><strong>原因：</strong> ${rejectionReason}</p>` : ''}`
                    : `<h2>We're sorry, but your submission was not approved</h2><p><strong>${businessName}</strong> did not pass our review process.</p>${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}`
                )}
              </div>
              <div class="footer">
                <p>${locale === 'zh' ? '凤凰城华人商家目录' : 'Phoenix Chinese Business Directory'}</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const mailOptions = {
        from: this.configService.get('EMAIL_FROM', 'Phoenix Chinese Directory <noreply@phoenixcn.directory>'),
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Business status update sent to: ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send business status update to ${to}:`, error);
      return false;
    }
  }
}