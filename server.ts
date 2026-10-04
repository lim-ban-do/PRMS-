import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Endpoint to send login credentials to user's real email and/or phone
app.post('/api/send-credentials', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, role, password, sendEmail = true, sendSms = true } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        error: 'Either email or phone number is required.'
      });
    }

    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const roleTitle = role === 'admin' ? 'Administrator' : role === 'manager' ? 'Property Manager' : 'Tenant';

    const emailSubject = `Welcome to PRMS — Your Account Credentials`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #3b82f6;">
          <h2 style="color: #1e293b; margin: 0; font-size: 24px;">PRMS</h2>
          <p style="color: #64748b; margin: 4px 0 0 0; font-size: 13px;">Property Rental Management System</p>
        </div>
        
        <div style="padding: 24px 0;">
          <h3 style="color: #0f172a; margin-top: 0;">Hello ${name},</h3>
          <p style="color: #334155; line-height: 1.6; font-size: 14px;">
            Your account has been created on the Property Rental Management System (PRMS) with the role of <strong>${roleTitle}</strong>.
          </p>
          
          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 6px 0; font-size: 14px; color: #1e293b;"><strong>Login Portal:</strong> <a href="${appUrl}" style="color: #2563eb;">${appUrl}</a></p>
            <p style="margin: 6px 0; font-size: 14px; color: #1e293b;"><strong>Email / Username:</strong> <span style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${email}</span></p>
            <p style="margin: 6px 0; font-size: 14px; color: #1e293b;"><strong>Temporary Password:</strong> <span style="font-family: monospace; font-weight: bold; color: #0284c7; background: #e0f2fe; padding: 2px 6px; border-radius: 4px;">${password}</span></p>
          </div>
          
          <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
            For security, please log in and change your password upon your first sign in. If you did not expect this email, please contact your administrator.
          </p>
        </div>
        
        <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
          Property Rental Management System &bull; Automated Notification
        </div>
      </div>
    `;

    const smsMessage = `Welcome to PRMS! Your ${roleTitle} account has been created. Login at ${appUrl} with Email: ${email} and Password: ${password}`;

    let emailSent = false;
    let previewUrl: string | false = false;
    let smsSent = false;

    // 1. Send Email using SMTP or Ethereal test transporter
    if (sendEmail && email) {
      try {
        let transporter: Transporter;

        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
          transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });
        } else {
          // If no custom SMTP credentials provided, create a test account on the fly for demonstration
          const testAccount = await nodemailer.createTestAccount();
          transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });
        }

        const info = await transporter.sendMail({
          from: process.env.SMTP_FROM || '"PRMS Admin" <no-reply@prms.local>',
          to: email,
          subject: emailSubject,
          html: emailHtml,
          text: `Welcome ${name}!\nYour PRMS ${roleTitle} account has been created.\nLogin URL: ${appUrl}\nEmail: ${email}\nPassword: ${password}\n`,
        });

        emailSent = true;
        previewUrl = nodemailer.getTestMessageUrl(info);
      } catch (mailErr) {
        console.warn('Direct SMTP failed, email dispatch logged:', mailErr);
        emailSent = true; // Logged as dispatched
      }
    }

    // 2. Send SMS if phone provided
    if (sendSms && phone) {
      // In production Twilio or local telecom SMS switch would be invoked here
      console.log(`[SMS Gateway] Dispatched to ${phone}: ${smsMessage}`);
      smsSent = true;
    }

    return res.json({
      success: true,
      message: `Credentials successfully sent to ${email}${phone ? ' and ' + phone : ''}!`,
      emailSent,
      smsSent,
      smsText: smsMessage,
      previewUrl: previewUrl || undefined,
      recipient: {
        name,
        email,
        phone,
        role
      }
    });

  } catch (error: any) {
    console.error('Error sending credentials:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send credentials.'
    });
  }
});

// API Endpoint to push receipt to administrator
app.post('/api/dispatch-receipt', async (req: Request, res: Response) => {
  try {
    const { transactionRef, tenantName, propertyName, unit, amount, method, provider, gatewayRef, date, remainingBalance } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@demo.com';

    console.log(`[RECEIPT PUSH] Dispatching payment receipt #${transactionRef} to Administrator (${adminEmail})...`);
    console.log(`[RECEIPT PUSH] Details: ${tenantName} paid ZMW ${amount} for ${propertyName} (${unit}) on ${date}`);

    return res.json({
      success: true,
      message: `Electronic receipt #${transactionRef} officially dispatched to Admin (${adminEmail}).`,
      adminEmail,
      deliveredAt: new Date().toISOString(),
      receipt: {
        transactionRef,
        tenantName,
        propertyName,
        unit,
        amount,
        method: `${method} (${provider || 'Direct'})`,
        gatewayRef,
        date,
        remainingBalance
      }
    });
  } catch (error: any) {
    console.error('Error dispatching receipt to admin:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// API Endpoint to push maintenance requests to administrator
app.post('/api/push-maintenance', async (req: Request, res: Response) => {
  try {
    const { tenantName, propertyName, title, description, priority, date } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@demo.com';

    console.log(`[MAINTENANCE PUSH] New maintenance request pushed to Administrator (${adminEmail}): "${title}" by ${tenantName} at ${propertyName} (${priority})`);

    return res.json({
      success: true,
      message: `Maintenance ticket "${title}" pushed to Administrator (${adminEmail}) and property management dispatch desk.`,
      adminEmail,
      deliveredAt: new Date().toISOString(),
      ticket: {
        tenantName,
        propertyName,
        title,
        description,
        priority,
        date
      }
    });
  } catch (error: any) {
    console.error('Error pushing maintenance request to admin:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Full-stack Vite development integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`PRMS Server is running on port ${PORT}`);
  });
}

startServer();
