const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'ferbious22@gmail.com',
        subject: ' Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
    })
}
const userGoodByeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'ferbious22@gmail.com',
        subject: 'It is sad to let you go',
        text:`We are so sorry to hear that you have to leave our app due to our lack of supportive toward your needs ${name}`
    })
}

module.exports = {
    sendWelcomeEmail,
    userGoodByeEmail
}

