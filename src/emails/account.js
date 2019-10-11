const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) =>{
    sgMail.send({
        to: email,
        from: 'hurwitzse@gmail.com',
        subject: 'Welcome to the App!',
        text: `Welcome to my awesome task manager, ${name}`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'hurwitzse@gmail.com',
        subject: `SAD TO SEE YOU GO, ${name}`,
        text: 'Were we that bad?'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}