// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure

require('dotenv').config();

const accountSid = process.env.ACCOUNT_SID_TWILIO;
const authToken = process.env.AUTH_TOKEN_TWILIO;
const verifySid = process.env.VERIFY_SID_TWILIO;

module.exports = async function () {
  console.log(123456);
  const client = require('twilio')(accountSid, authToken);
  client.verify.v2
    .services(verifySid)
    .verifications.create({ to: '+84815647388', channel: 'sms' })
    .then((verification) => console.log(verification.status))
    .then(() => {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      readline.question('Please enter the OTP:', (otpCode) => {
        client.messages
          .create({
            body: `Solo yasuo không?`,
            from: '+1 320 391 9731',
            to: '+84815647388',
          })
          .then((messages) => console.log(messages))
          .catch((er) => console.log(er));
      });
    });
};
