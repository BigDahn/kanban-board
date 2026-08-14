const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

module.exports = class Email {
  constructor(user, url = null, options = {}) {
    this.from = `Kanban-Board <${process.env.EMAIL_FROM}>`;
    this.to = user.email || user.pendingEmail;
    this.url = url;
    this.firstName = user.name.split(' ')[0];
    this.user = user;
    this.date = options.date ?? null;
    this.time = options.time ?? null;
    this.otp = options.otp ?? null;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      });
    } else {
      return nodemailer.createTransport({
        port: process.env.EMAIL_PORT,
        host: process.env.EMAIL_HOST,
        auth: {
          pass: process.env.EMAIL_PASS,
          user: process.env.EMAIL_USER,
        },
      });
    }
  }

  async send(template, subject) {
    const templatePath = path.join(
      __dirname,
      '../template',
      `${template}.html`,
    );
    const templateSource = fs.readFileSync(templatePath, 'utf-8');

    // 3. Compile template
    const templateHtml = handlebars.compile(templateSource);

    const html = templateHtml({
      name: this.user.name,
      email: this.user.email,
      url: this.url,
      support: this.from,
      date: this.date,
      time: this.time,
      otp: this.otp,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    await this.newTransport().sendMail(mailOptions);
  }
};
