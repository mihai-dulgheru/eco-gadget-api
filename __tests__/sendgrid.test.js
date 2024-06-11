require('dotenv').config();
const sgMail = require('@sendgrid/mail');

describe('SendGrid', () => {
  test('sends an email', async () => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: 'test@example.com', // Change to your recipient
      from: 'test@example.com', // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    expect(sgMail.send(msg)).resolves.toBeTruthy();
  });
});
