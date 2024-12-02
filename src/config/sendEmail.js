const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "seuemail@gmail.com",
    pass: "suasenha",
  },
});

async function sendEmail(simular, from, to, subject, text, html) {
  if (simular) {
    console.log("Simulação de E-mail enviado para ", to);
  } else {
    try {
      const info = await transporter.sendMail({
        from: from || '"Seu Nome" <seuemail@gmail.com>',
        to: to || "destinatario@gmail.com",
        subject: subject || "Assunto do E-mail",
        text: text || "Texto do e-mail",
        html: html || "<b>Texto do e-mail em HTML</b>",
      });
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
    }
  }
}

module.exports = sendEmail;
