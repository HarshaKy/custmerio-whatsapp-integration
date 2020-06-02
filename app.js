const CIO = require('customerio-node')
const express = require('express')
const twilio = require('twilio')
const emailValidator = require('email-validator')

const { MessagingResponse } = require('twilio').twiml
const { siteId } = require('./keys')
const { apiKey } = require('./keys')
const { accountSid } = require('./keys')
const { authToken } = require('./keys')

const cio = new CIO(siteId, apiKey)
const client = require('twilio')(accountSid, authToken);
const app = express()

app.post('/message', (req, res) => {
    const twiml = new MessagingResponse()

    let messageBody

    client.messages.list({limit: 2}).then((messages) => {
        messageBody = messages[0].body
        messageFrom = messages[0].from
        
        if(!emailValidator.validate(messageBody)) {
            // console.log(messages[0])

            twiml.message(`Hello ${messageFrom}. Enter email to register`)

            res.writeHead(200, { 'Content-Type': 'text/xml' })
            res.end(twiml.toString())
        } else {
            cio.identify(messageFrom, {
                phone: messageFrom,
                email: messageBody,
                created_at: Math.floor( Date.now() / 1000 )
            }).then(() => {
                console.log('trigger welcome event')
                twiml.message(`trigger welcome event`)

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