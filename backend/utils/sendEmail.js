import { createTransport } from "nodemailer";

export const sendEmail = async (to, subject, text) => {

    const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465, // ✅ important
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.SMTP_USER, // better than hardcoding gmail
        to,
        subject,
        text,
    });
};