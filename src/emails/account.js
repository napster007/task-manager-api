const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//     to:'jaysonolaguera@gmail.com',
//     from:'jayson.olaguera@mobilemoney.ph',
//     subject:'This is a test email',
//     text:'Please reply to me',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>'
// })
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })

const sendWelcomeEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from:'jayson.olaguera@mobilemoney.ph',
        subject:'Thanks for Joining',
        text:`Welcome to the app, ${name}. Let me know how you will get along the app`,
        html:'<b>Welcome to our App</b>'

    })
}

const sendCancellationEmail = (email, name)=>{
    sgMail.send({
        to: email,
        from:'jayson.olaguera@mobilemoney.ph',
        subject:'Why Cancelling?',
        text:`We would like to know ${name} why do you want to cancel subscription to our app.`,
        html:'<b>Why cancel?</b>'

    })
}

module.exports ={
    sendWelcomeEmail,
    sendCancellationEmail
}