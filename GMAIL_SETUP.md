# Gmail Notification Setup Guide

This guide will help you set up Gmail notifications for order confirmations in your EmpireBD application.

## 📧 What You'll Get

Once configured, your application will automatically send:

1. **Customer Order Confirmation** - Professional email to customers with order details
2. **Admin Order Notification** - Alert email to you when new orders are placed

## 🚀 Quick Setup (5 minutes)

### Step 1: Enable Gmail App Passwords

1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. If 2-Step Verification is not enabled, enable it first
4. Scroll down to **App passwords**
5. Click **Select app** → **Other (Custom name)**
6. Enter "EmpireBD Website" as the name
7. Click **Generate**
8. **Copy the 16-character password** (you'll need this)

### Step 2: Configure Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add these variables:

```bash
# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
ADMIN_EMAIL=your-admin-email@gmail.com  # Optional
NEXTAUTH_URL=http://localhost:3001
```

### Step 3: Test the Setup

1. Restart your development server:

   ```bash
   npm run dev
   ```

2. Place a test order through your website
3. Check your email inbox for:
   - Customer confirmation email
   - Admin notification email

## 🔧 Configuration Options

### Environment Variables

| Variable             | Required    | Description                                                  |
| -------------------- | ----------- | ------------------------------------------------------------ |
| `GMAIL_USER`         | ✅ Yes      | Your Gmail address that will send emails                     |
| `GMAIL_APP_PASSWORD` | ✅ Yes      | 16-character app password from Google                        |
| `ADMIN_EMAIL`        | ❌ Optional | Admin email for order notifications (defaults to GMAIL_USER) |
| `NEXTAUTH_URL`       | ✅ Yes      | Your website URL                                             |

### Email Templates

The system includes two professional email templates:

1. **Customer Confirmation Email**
   - Order details and items
   - Shipping address
   - Order number for tracking
   - Professional EmpireBD branding

2. **Admin Notification Email**
   - Urgent alert styling
   - Complete order information
   - Customer contact details
   - Action items checklist

## 🛠️ Troubleshooting

### Common Issues

**❌ "Invalid login" error**

- Make sure you're using the App Password, not your regular Gmail password
- Verify 2-Step Verification is enabled on your Google account

**❌ Emails not sending**

- Check your `.env.local` file has the correct variables
- Restart your development server after adding environment variables
- Check the browser console and server logs for error messages

**❌ "Email service not configured" error**

- Ensure `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set in `.env.local`
- Make sure there are no extra spaces in your environment variables

### Testing Email Configuration

You can test your email configuration by visiting:

```
http://localhost:3001/api/emails/order-confirmation
```

This will show you the configuration status without sending emails.

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use App Passwords** - Never use your main Gmail password
3. **Limit App Password scope** - Create separate app passwords for different applications
4. **Regular rotation** - Consider rotating app passwords periodically

## 📱 Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add the same environment variables to your hosting platform
2. Update `NEXTAUTH_URL` to your production domain
3. Test email functionality after deployment

## 🎨 Customization

To customize email templates, edit:

- `/lib/emailService.js` - Email templates and styling
- `/app/api/emails/order-confirmation/route.js` - Email sending logic

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review server logs for detailed error messages
3. Ensure all environment variables are correctly set

---

**🎉 That's it!** Your customers will now receive professional order confirmations, and you'll get instant notifications for new orders.
