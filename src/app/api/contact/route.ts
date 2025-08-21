import { mailOptions, transporter } from '@/config/nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { email, phone, message } = await req.json();
        //sending email to my box
        await transporter.sendMail({
            ...mailOptions,
            subject: `📩 New Contact Form Submission from ${email}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height:1.5; color:#333;">
                <h2 style="color:#1e40af; margin: 0;">New Contact Form Submission</h2>
                <p><strong>From:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong></p>
                <div style="padding:10px; background:#f3f4f6; border-radius:5px; margin-top:5px;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
                <hr style="margin:20px 0;" />
                <p style="font-size:12px; color:#555;">This email was sent from your website's contact form.</p>
                </div>
            `,
        });

        //sending confirmation email to user
        await transporter.sendMail({
            from: mailOptions.from,
            to: email,
            subject: '✅ Thank you for contacting us!',
            html: `
                <div style="font-family: Arial, sans-serif; line-height:1.5; color:#333;">
                <h2 style="color:#10b981;">Thank you for reaching out!</h2>
                <p>Hi ${email.split('@')[0]},</p>
                <p>We have received your message and our team will get back to you as soon as possible.</p>
                <p><strong>Your Message:</strong></p>
                <div style="padding:10px; background:#f3f4f6; border-radius:5px; margin-top:5px;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
                <p style="margin-top:20px;">Best regards,<br/>D0F DigiCademy</p>
                <hr style="margin:20px 0;" />
                <p style="font-size:12px; color:#555;">This is an automated message. Please do not reply to this email.</p>
                </div>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
