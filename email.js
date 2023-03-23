const nodemailer = require('nodemailer');
const { selectEmailProvider } = require('./emailProviders');


exports.mailer = (email, message, sender, password, subject) => {
    var emailSent = false;
    // setup email data with unicode symbols
    let mailOptions = {
        from: `${sender ?? process.env.SENDER_EMAIL} <${sender ?? process.env.SENDER_EMAIL}>`,// sender address
        to: `${email}`,// list of recievedRequest
        subject: subject,//
        text: message.slice(0, message.length > 50 ? 20: message.length).trim()+'...',// body in plain text
        html: message, // html body
    };

    // console.log(mailOptions);
    console.log(selectEmailProvider(sender));
    // create reusable transporter object using the default smtp transport
    let transport = nodemailer.createTransport({
        service: selectEmailProvider(sender.toLowerCase()),
        auth: {
            user: sender ?? process.env.SENDER_EMAIL,
            pass: password ?? process.env.SENDER_EMAIL_PASSWORD,
        }
    });

    // send mail with defined transport object
    transport.sendMail(mailOptions, (error, info) =>{
        if(error) {
            console.log(error);
            throw new Error({message: 'email not sent'})
            console.log(info);
        }
        else{
            console.log(info);
            emailSent = true;
            console.log("Email has been sent");
        }
    });
    return emailSent;
}