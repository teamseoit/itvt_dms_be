const nodemailer = require("nodemailer");
exports.send_email = async (to_email, subject, text, content_html) => {
  try {
      const create_email = nodemailer.createTestAccount()
      const transporter =  nodemailer.createTransport({ // config mail server
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'pityvt95@gmail.com', //Tài khoản gmail vừa tạo
            pass: 'igtz nzju vhgu dynd' //Mật khẩu tài khoản gmail vừa tạo
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
      });

      const data = await transporter.sendMail({
        from: "Phúc abc pityvt95@gmail.com", // sender address
        to: to_email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: content_html, // html body
      });
  } catch (error) {
    console.error(error)
  }
}

// this.send_email("phamvanvu992412@gmail.com","Email test", "Abc def", `
//     <h1>Hello</h1>
//     <h2>Heloooooo</h2>
//   `)