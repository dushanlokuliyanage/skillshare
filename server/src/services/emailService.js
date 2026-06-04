import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendVerificationEmail = async (to, name, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Inventory Express" <noreply@inventoryexpress.com>',
    to,
    subject: 'Verify your Inventory Express account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #4f46e5; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Inventory Express</h1>
        </div>
        <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
          <h2 style="color: #111827; margin: 0 0 16px;">Hello, ${name}!</h2>
          <p style="color: #6b7280; margin: 0 0 24px; line-height: 1.6;">
            Thanks for registering. Please verify your email address to activate your account.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="background: #4f46e5; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 14px; margin: 0; text-align: center;">
            This link expires in 24 hours. If you did not create an account, you can ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
            Or copy this link: <a href="${verifyUrl}" style="color: #4f46e5;">${verifyUrl}</a>
          </p>
        </div>
      </div>
    `,
  })
}

export const sendLowStockAlert = async (product) => {
  const isOutOfStock = product.quantity === 0
  const statusColor = isOutOfStock ? '#ef4444' : '#f59e0b'
  const statusText = isOutOfStock ? 'OUT OF STOCK' : 'LOW STOCK'
  const inventoryUrl = `${process.env.CLIENT_URL}/inventory`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Inventory Express" <noreply@inventoryexpress.com>',
    to: process.env.STORE_OWNER_EMAIL || process.env.EMAIL_USER,
    subject: `${isOutOfStock ? '🚨 Out of Stock' : '⚠️ Low Stock Alert'}: ${product.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: ${statusColor}; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">${statusText} ALERT</h1>
        </div>
        <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0 0 24px; line-height: 1.6;">
            A product in your inventory requires attention.
          </p>
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
            <tr style="background: #f3f4f6;">
              <td style="padding: 12px 16px; font-weight: 600; color: #374151; width: 40%;">Product</td>
              <td style="padding: 12px 16px; color: #111827;">${product.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; color: #374151;">SKU</td>
              <td style="padding: 12px 16px; color: #111827;">${product.sku}</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 12px 16px; font-weight: 600; color: #374151;">Category</td>
              <td style="padding: 12px 16px; color: #111827;">${product.category}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; color: #374151;">Current Stock</td>
              <td style="padding: 12px 16px; font-weight: 700; color: ${statusColor};">${product.quantity} units</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 12px 16px; font-weight: 600; color: #374151;">Minimum Level</td>
              <td style="padding: 12px 16px; color: #111827;">${product.minStockLevel} units</td>
            </tr>
          </table>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${inventoryUrl}" style="background: #4f46e5; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
              Go to Inventory
            </a>
          </div>
        </div>
      </div>
    `,
  })
}
