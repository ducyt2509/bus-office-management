const responseHandler = require('../handlers/response.handler');
const EmailService = require('../helper/Gmail');
module.exports = {
  async send(req, res) {
    try {
      const { message, email, fullname } = req.body;
      const subject = 'Đóng góp ý kiến từ khách hàng';
      const htmlForm = `
            <p>Người gửi : ${fullname}</p>
            <p>Email : ${email}</p>
            <p>Nội dung góp ý : <br>
            ${message}
            </p>
             `;

      const subjectResponse = 'Cảm ơn bạn đã đóng góp ý kiến!';
      const htmlFormForResponse = `
            <h4>Gửi bạn ${fullname}!</h4>
            <br>
            <p>Cảm ơn bạn đã gửi góp ý cho nhà xe! Nhà xe sẽ phản hồi bạn trong thời gian sớm nhất <3</p>
            <br>
            <p>Thanks</p>
            `;

      if (message && email && fullname) {
        //send to owner or manager
        EmailService.sendMail('duclee028@gmail.com', subject, htmlForm);
        // send back to customer
        EmailService.sendMail(email, subjectResponse, htmlFormForResponse);
        return responseHandler.ok(res, 'Send email sucessfully');
      } else {
        return responseHandler.badRequest(res, 'Input is not null');
      }
    } catch (error) {
      return responseHandler.error;
    }
  },
};
