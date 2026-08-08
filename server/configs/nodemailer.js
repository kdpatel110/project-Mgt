import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});


const sendEmail = async (to, sunject, body) => {
    const responce = await transporter.sendMail({
        from: process.env.SENDER_EMAIL, // sender address
        to, // list of recipients
        subject, // subject line
        html: body, // HTML body
    });

    return responce
}

export default sendEmail


















