const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name)=>{
  sgMail.send({
    to: email,
    from: 'da.valaux@gmail.com',
    subject: 'Thank You For Joining In',
    text: `Welcome to join the app, ${name}. Let us know how you get along with the app`
  })
}

const sendCancelationEmail = (email, name)=>{
  sgMail.send({
    to: email,
    from: 'da.valaux@gmail.com',
    subject: 'Anything We Could Do To Improve Our Service?',
    text: `Dear ${name}, sorry for your bad experience, if you have any suggestion for us to improve our service, let us know`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}