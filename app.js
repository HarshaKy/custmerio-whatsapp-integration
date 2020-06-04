const CIO = require('customerio-node')
const express = require('express')
const bodyParser = require('body-parser')

const { siteId } = require('./keys')
const { apiKey } = require('./keys')

const { handleCustomerioMessage } = require('./handleCustomerioMessage')

const cio = new CIO(siteId, apiKey)
const app = express()

app.use(bodyParser.json())

app.post('/fromWhatsapp', (req, res) => {
    
    messageFrom = '+' + req.body.from
    
    cio.identify(messageFrom, {
        phone: messageFrom,
        channel: 'WhatsApp',
        created_at: Math.floor( Date.now() / 1000 )
    }).then(() => {
        res.send('ok').status(200)
    }, (e) => {
        console.log(e)
    })
})

app.post('/welcomeMessage', (req, res) => {

    handleCustomerioMessage(req)

    res.send('ok').status(200)

})

app.post('/broadcast', (req, res) => {
    
    handleCustomerioMessage(req)
    
    res.send('ok').status(200)

})

app.post('/whatsappNewsletter', (req, res) => {
    
    handleCustomerioMessage(req)

    res.send('ok').status(200)

})



app.listen(3000, () => {
    console.log('Listening on port 3000')
})