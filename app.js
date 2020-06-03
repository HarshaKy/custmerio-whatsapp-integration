const CIO = require('customerio-node')
const express = require('express')
const twilio = require('twilio')
const emailValidator = require('email-validator')
const bodyParser = require('body-parser')

const { MessagingResponse } = require('twilio').twiml
const { siteId } = require('./keys')
const { apiKey } = require('./keys')
const { accountSid } = require('./keys')
const { authToken } = require('./keys')

const cio = new CIO(siteId, apiKey)
const client = require('twilio')(accountSid, authToken);
const app = express()

app.use(bodyParser.json())

app.post('/message', (req, res) => {
    
    const twiml = new MessagingResponse()

    let messageBody

    if (req.body.message) {
        console.log(req.body.phone)
        
        client.messages
            .create({
                from: 'whatsapp:+14155238886',
                body: req.body.message,
                to: `whatsapp:${req.body.phone}`
            })
            .then(message => console.log(message.sid))
        
        res.send('ok').status(200)
    }

    client.messages.list({limit: 1}).then((messages) => {
        messageBody = messages[0].body
        messageFrom = messages[0].from.replace('whatsapp:', '')
        
        if(!emailValidator.validate(messageBody)) {

            twiml.message(`Hello ${messageFrom}. Enter email to register`)

            res.writeHead(200, { 'Content-Type': 'text/xml' })
            res.end(twiml.toString())
        } else {

            cio.identify(messageFrom, {
                phone: messageFrom,
                email: messageBody,
                channel: 'WhatsApp',
                plan: 'basic',
                created_at: Math.floor( Date.now() / 1000 )
            
            })
            .then(() => {
                
                twiml.message(`Awaiting confirmation...`)

                res.writeHead(200, { 'Content-Type': 'text/xml' })
                res.end(twiml.toString())
            
            }, (e) => {
                console.log(e)
            })
        }   
    })
    
    
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})