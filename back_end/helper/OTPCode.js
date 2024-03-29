// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure

require('dotenv').config();
const crypto = require('crypto');

const accountSid = process.env.ACCOUNT_SID_TWILIO;
const authToken = process.env.AUTH_TOKEN_TWILIO;
const verifySid = process.env.VERIFY_SID_TWILIO;
const smsSecretKey = process.env.SMS_SECRET_KEY;

const sendCodeOTP = async function (phone) {
  const client = require('twilio')(accountSid, authToken);
  const otpCode = Math.floor(100000 + Math.random() * 900000);
  const ttl = 1 * 60 * 1000;
  const expire = Date.now() + ttl;
  const data = `${phone}.${otpCode}.${expire}`;
  const hash = crypto.createHmac('sha256', smsSecretKey).update(data).digest('hex');
  const fullHash = `${hash}.${expire}`;

  client.verify.v2
    .services(verifySid)
    .verifications.create({ to: phone, channel: 'sms' })
    .then(() => {
      client.messages
        .create({
          body: `Mã xác thực của bạn là: ${otpCode}`,
          from: '+15076094750',
          to: phone,
        })
        .then((messages) => console.log(messages))
        .catch((er) => console.log(er));
    });
  return {
    hash: fullHash,
    phone,
  };
};
const verifyCodeOTP = async function (phone, otp, hash) {
  let [hashValue, expire] = hash.split('.');
  let now = Date.now();
  if (now > parseInt(expire)) {
    return {
      success: false,
      messages: 'Timeout please try login again',
    };
  }
  const data = `${phone}.${otp}.${expire}`;
  let newCalculatorHash = crypto.createHmac('sha256', smsSecretKey).update(data).digest('hex');

  if (newCalculatorHash === hashValue) {
    return {
      success: true,
      messages: 'Correct OTP Code',
    };
  } else {
    return {
      success: false,
      messages: 'Incorrect OTP Code',
    };
  }
};
module.exports = {
  sendCodeOTP,
  verifyCodeOTP,
};
