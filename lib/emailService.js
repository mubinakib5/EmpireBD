import nodemailer from 'nodemailer'

// Create transporter for Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD // Gmail App Password (not regular password)
    }
  })
}

// Email templates
const emailTemplates = {
  orderReceived: (orderData) => {
    const { orderNumber, customerName, customerEmail, total, items, shippingAddress } = orderData
    
    return {
      subject: `Order Received - ${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Received</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2d5a27; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .total { font-weight: bold; font-size: 18px; color: #2d5a27; }
            .footer { text-align: center; padding: 20px; color: #666; }
            .status-notice { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>EmpireBD</h1>
              <h2>Order Received</h2>
            </div>
            
            <div class="content">
              <p>Dear ${customerName},</p>
              <p>Thank you for your order! We've successfully received your order and it's currently being reviewed.</p>
              
              <div class="status-notice">
                <p><strong>📋 Order Status: Pending Review</strong></p>
                <p>Your order is currently being reviewed by our team. You will receive another email with order confirmation once we verify the details and confirm availability.</p>
              </div>
              
              <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
                
                <h4>Items Ordered:</h4>
                ${items.map(item => `
                  <div class="item" style="display: flex; align-items: flex-start; gap: 15px; padding: 15px 0; border-bottom: 1px solid #eee;">
                    ${item.productImage ? `
                      <div style="flex-shrink: 0; width: 80px;">
                        <img src="${item.productImage}" alt="${item.productName || 'Product'}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; display: block;">
                      </div>
                    ` : ''}
                    <div style="flex-grow: 1; min-width: 0;">
                      <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px; color: #333;">${item.productName || 'Product'}</p>
                      <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">Quantity: ${item.quantity}</p>
                      <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">Price: ৳${item.price}</p>
                      ${item.size ? `<p style="margin: 0; color: #666; font-size: 14px;">Size: ${item.size}</p>` : ''}
                    </div>
                    <div style="flex-shrink: 0; text-align: right;">
                      <p style="margin: 0; font-weight: bold; font-size: 16px; color: #2d5a27;">৳${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                `).join('')}
                
                <div class="total" style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #2d5a27;">
                  <p style="margin: 0; text-align: right; font-weight: bold; font-size: 20px; color: #2d5a27;">Total: ৳${total}</p>
                </div>
              </div>
              
              <div class="order-details">
                <h3>Shipping Address</h3>
                <p>${shippingAddress.street}<br>
                ${shippingAddress.policeStation ? `P.S: ${shippingAddress.policeStation}<br>` : ''}
                ${shippingAddress.city}${shippingAddress.postalCode ? ` ${shippingAddress.postalCode}` : ''}<br>
                ${shippingAddress.country}</p>
              </div>
              
              <p>We'll send you another email with order confirmation once we verify the details and confirm availability. If you have any questions, please contact our customer service.</p>
            </div>
            
            <div class="footer">
              <p>Thank you for shopping with EmpireBD!</p>
              <p>Visit us at: <a href="https://empirebd.com">empirebd.com</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Order Received - ${orderNumber}
        
        Dear ${customerName},
        
        Thank you for your order! We've successfully received your order and it's currently being reviewed.
        
        Order Status: Pending Review
        Your order is currently being reviewed by our team. You will receive another email with order confirmation once we verify the details and confirm availability.
        
        Order Details:
        Order Number: ${orderNumber}
        Order Date: ${new Date().toLocaleDateString()}
        
        Items Ordered:
        ${items.map(item => `- ${item.productName || 'Product'} (Qty: ${item.quantity}, Price: ৳${item.price}${item.size ? `, Size: ${item.size}` : ''})`).join('\n')}
        
        Total: ৳${total}
        
        Shipping Address:
        ${shippingAddress.street}
        ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}
        ${shippingAddress.country}
        
        We'll send you another email with order confirmation once we verify the details and confirm availability.
        
        Thank you for shopping with EmpireBD!
        Visit us at: https://empirebd.com
      `
    }
  },

  orderConfirmation: (orderData) => {
    const { orderNumber, customerName, customerEmail, total, items, shippingAddress } = orderData
    
    return {
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2d5a27; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .total { font-weight: bold; font-size: 18px; color: #2d5a27; }
            .footer { text-align: center; padding: 20px; color: #666; }
            .confirmation-notice { background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>EmpireBD</h1>
              <h2>Order Confirmation</h2>
            </div>
            
            <div class="content">
              <p>Dear ${customerName},</p>
              <p>Great news! Your order has been confirmed and is now being prepared for shipment.</p>
              
              <div class="confirmation-notice">
                <p><strong>✅ Order Status: Confirmed</strong></p>
                <p>Your order has been verified and confirmed. We're now preparing your items for shipment and you'll receive tracking information once your order ships.</p>
              </div>
              
              <div class="order-details">
                <h3>Order Details</h3>
                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
                
                <h4>Items Ordered:</h4>
                ${items.map(item => `
                  <div class="item" style="display: flex; align-items: flex-start; gap: 15px; padding: 15px 0; border-bottom: 1px solid #eee;">
                    ${item.productImage ? `
                      <div style="flex-shrink: 0; width: 80px;">
                        <img src="${item.productImage}" alt="${item.productName || 'Product'}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; display: block;">
                      </div>
                    ` : ''}
                    <div style="flex-grow: 1; min-width: 0;">
                      <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px; color: #333;">${item.productName || 'Product'}</p>
                      <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">Quantity: ${item.quantity}</p>
                      <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">Price: ৳${item.price}</p>
                      ${item.size ? `<p style="margin: 0; color: #666; font-size: 14px;">Size: ${item.size}</p>` : ''}
                    </div>
                    <div style="flex-shrink: 0; text-align: right;">
                      <p style="margin: 0; font-weight: bold; font-size: 16px; color: #2d5a27;">৳${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                `).join('')}
                
                <div class="total" style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #2d5a27;">
                  <p style="margin: 0; text-align: right; font-weight: bold; font-size: 20px; color: #2d5a27;">Total: ৳${total}</p>
                </div>
              </div>
              
              <div class="order-details">
                <h3>Shipping Address</h3>
                <p>${shippingAddress.street}<br>
                ${shippingAddress.policeStation ? `P.S: ${shippingAddress.policeStation}<br>` : ''}
                ${shippingAddress.city}${shippingAddress.postalCode ? ` ${shippingAddress.postalCode}` : ''}<br>
                ${shippingAddress.country}</p>
              </div>
              
              <p>We'll send you tracking information once your order ships. Thank you for choosing EmpireBD!</p>
            </div>
            
            <div class="footer">
              <p>Thank you for shopping with EmpireBD!</p>
              <p>Visit us at: <a href="https://empirebd.com">empirebd.com</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Order Confirmation - ${orderNumber}
        
        Dear ${customerName},
        
        Great news! Your order has been confirmed and is now being prepared for shipment.
        
        Order Status: Confirmed
        Your order has been verified and confirmed. We're now preparing your items for shipment and you'll receive tracking information once your order ships.
        
        Order Details:
        Order Number: ${orderNumber}
        Order Date: ${new Date().toLocaleDateString()}
        
        Items Ordered:
        ${items.map(item => `- ${item.productName || 'Product'} (Qty: ${item.quantity}, Price: ৳${item.price}${item.size ? `, Size: ${item.size}` : ''})`).join('\n')}
        
        Total: ৳${total}
        
        Shipping Address:
        ${shippingAddress.street}
        ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}
        ${shippingAddress.country}
        
        We'll send you tracking information once your order ships. Thank you for choosing EmpireBD!
        
        Thank you for shopping with EmpireBD!
        Visit us at: https://empirebd.com
      `
    }
  },

  passwordReset: (resetData) => {
    const { name, resetUrl } = resetData
    
    return {
      subject: 'Password Reset Request - EmpireBD',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2d5a27; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .reset-box { background-color: white; padding: 20px; margin: 15px 0; border-radius: 5px; text-align: center; }
            .reset-button { display: inline-block; background-color: #2d5a27; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .reset-button:hover { background-color: #1e3d1a; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>EmpireBD</h1>
              <h2>Password Reset Request</h2>
            </div>
            
            <div class="content">
              <p>Hello ${name},</p>
              <p>We received a request to reset your password for your EmpireBD account.</p>
              
              <div class="reset-box">
                <h3>Reset Your Password</h3>
                <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
              </div>
              
              <div class="warning">
                <strong>Security Notice:</strong>
                <ul style="text-align: left; margin: 10px 0;">
                  <li>If you didn't request this password reset, please ignore this email</li>
                  <li>This link will expire in 1 hour for security reasons</li>
                  <li>Never share this link with anyone</li>
                </ul>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 3px; font-family: monospace;">${resetUrl}</p>
            </div>
            
            <div class="footer">
              <p>This email was sent by EmpireBD</p>
              <p>If you have any questions, please contact our support team</p>
            </div>
          </div>
        </body>
        </html>
      `
    }
  },

  adminOrderNotification: (orderData) => {
    const { orderNumber, customerName, customerEmail, customerPhone, total, items, shippingAddress } = orderData
    
    return {
      subject: `New Order Received - ${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Order Notification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .order-details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .total { font-weight: bold; font-size: 18px; color: #dc2626; }
            .urgent { background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 10px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 New Order Alert</h1>
              <h2>EmpireBD Admin</h2>
            </div>
            
            <div class="content">
              <div class="urgent">
                <p><strong>⚡ Action Required:</strong> A new order has been placed and requires processing.</p>
              </div>
              
              <div class="order-details">
                <h3>Order Information</h3>
                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Order Value:</strong> ৳${total}</p>
              </div>
              
              <div class="order-details">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> ${customerName}</p>
                <p><strong>Email:</strong> ${customerEmail}</p>
                <p><strong>Phone:</strong> ${customerPhone || 'Not provided'}</p>
              </div>
              
              <div class="order-details">
                <h3>Items Ordered</h3>
                ${items.map(item => `
                  <div class="item" style="display: flex; align-items: flex-start; gap: 15px; padding: 15px 0; border-bottom: 1px solid #eee;">
                    ${item.productImage ? `
                      <div style="flex-shrink: 0; width: 80px;">
                        <img src="${item.productImage}" alt="${item.productName || 'Product'}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; display: block;">
                      </div>
                    ` : ''}
                    <div style="flex-grow: 1; min-width: 0;">
                      <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px; color: #333;">${item.productName || 'Product'}</p>
                      <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">Quantity: ${item.quantity}</p>
                      <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">Price: ৳${item.price}</p>
                      ${item.size ? `<p style="margin: 0; color: #666; font-size: 14px;">Size: ${item.size}</p>` : ''}
                    </div>
                    <div style="flex-shrink: 0; text-align: right;">
                      <p style="margin: 0; font-weight: bold; font-size: 16px; color: #dc2626;">৳${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                `).join('')}
                
                <div class="total" style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #dc2626;">
                  <p style="margin: 0; text-align: right; font-weight: bold; font-size: 20px; color: #dc2626;">Total: ৳${total}</p>
                </div>
              </div>
              
              <div class="order-details">
                <h3>Shipping Address</h3>
                <p>${shippingAddress.street}<br>
                ${shippingAddress.policeStation ? `P.S: ${shippingAddress.policeStation}<br>` : ''}
                ${shippingAddress.city}${shippingAddress.postalCode ? ` ${shippingAddress.postalCode}` : ''}<br>
                ${shippingAddress.country}</p>
              </div>
              
              <div class="urgent">
                <p><strong>Next Steps:</strong></p>
                <ul>
                  <li>Process the order in your admin panel</li>
                  <li>Confirm inventory availability</li>
                  <li>Update order status to 'confirmed'</li>
                  <li>Prepare for shipping</li>
                </ul>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        🚨 NEW ORDER ALERT - ${orderNumber}
        
        A new order has been placed and requires processing.
        
        Order Information:
        Order Number: ${orderNumber}
        Order Date: ${new Date().toLocaleString()}
        Order Value: ৳${total}
        
        Customer Information:
        Name: ${customerName}
        Email: ${customerEmail}
        Phone: ${customerPhone || 'Not provided'}
        
        Items Ordered:
        ${items.map(item => `- ${item.productName || 'Product'} (Qty: ${item.quantity}, Price: ৳${item.price}${item.size ? `, Size: ${item.size}` : ''})`).join('\n')}
        
        Total: ৳${total}
        
        Shipping Address:
        ${shippingAddress.street}
        ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}
        ${shippingAddress.country}
        
        Please process this order promptly.
      `
    }
  }
}

// Send order received email to customer (initial receipt)
export const sendOrderReceivedEmail = async (orderData) => {
  try {
    const transporter = createTransporter()
    const emailContent = emailTemplates.orderReceived(orderData)
    
    const mailOptions = {
      from: `"EmpireBD" <${process.env.GMAIL_USER}>`,
      to: orderData.customerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log('Order received email sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending order received email:', error)
    return { success: false, error: error.message }
  }
}

// Send order confirmation email to customer (when status changes to confirmed)
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const transporter = createTransporter()
    const emailContent = emailTemplates.orderConfirmation(orderData)
    
    const mailOptions = {
      from: `"EmpireBD" <${process.env.GMAIL_USER}>`,
      to: orderData.customerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log('Order confirmation email sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return { success: false, error: error.message }
  }
}

// Send order notification email to admin
export const sendAdminOrderNotification = async (orderData) => {
  try {
    const transporter = createTransporter()
    const emailContent = emailTemplates.adminOrderNotification(orderData)
    
    const mailOptions = {
      from: `"EmpireBD System" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.GMAIL_USER, // Admin email
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log('Admin order notification sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending admin order notification:', error)
    return { success: false, error: error.message }
  }
}

// Send password reset email
export const sendPasswordResetEmail = async (resetData) => {
  try {
    const transporter = createTransporter()
    const template = emailTemplates.passwordReset(resetData)
    
    const mailOptions = {
      from: `"EmpireBD" <${process.env.GMAIL_USER}>`,
      to: resetData.to,
      subject: template.subject,
      html: template.html
    }
    
    const result = await transporter.sendMail(mailOptions)
    console.log('Password reset email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw error
  }
}

// Send both customer and admin emails for new orders
export const sendOrderEmails = async (orderData) => {
  const results = {
    customer: await sendOrderReceivedEmail(orderData),
    admin: await sendAdminOrderNotification(orderData)
  }
  
  return results
}