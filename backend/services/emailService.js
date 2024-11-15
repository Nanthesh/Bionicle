// emailService.js
const sgMail = require('@sendgrid/mail');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Loads and compiles an HTML template using Handlebars.
 * @param {string} templateName - Name of the template file (without extension).
 * @param {object} data - Data to be injected into the template.
 * @returns {string} - Compiled HTML content.
 */
const loadTemplate = (templateName, data) => {
  const filePath = path.join(__dirname, `../templates/${templateName}.html`);
  const source = fs.readFileSync(filePath, 'utf-8');
  const template = handlebars.compile(source);
  return template(data);
};

/**
 * Sends an email using SendGrid.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Subject of the email.
 * @param {string} templateName - Name of the template file (without extension).
 * @param {object} dynamicData - Data for the template (e.g., userName, orderId, totalPrice).
 */
const sendEmail = async (to, subject, templateName, dynamicData) => {
  const htmlContent = loadTemplate(templateName, dynamicData);

  const msg = {
    to,
    from: process.env.SENDER_EMAIL,
    subject,
    html: htmlContent,
  };

  try {
    console.log('Email message:', msg);
    const response = await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
 
    console.log(`Email sent successfully to ${to}`, response);
  } catch (error) {
    console.error(`Error sending email: ${error.response?.body?.errors || error.message}`);
    throw error;
  }
};

module.exports = { sendEmail };
