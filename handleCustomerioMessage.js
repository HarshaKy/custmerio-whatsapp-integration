const fetch = require('node-fetch')
const { apikey } = require('./keys')
const { fromPhoneNumber } = require('./phoneNumbers')

const handleCustomerioMessage = (req) =>{
    const inputBody = {
        "to": req.body.phone,
        "channels": [
            "sms"
        ],
        "sms": {
            "from": fromPhoneNumber,
            "contentType": "text",
            "text": req.body.message
        }
    }
    
    const headers = {
        'Content-Type':'application/json',
        'Accept':'application/json',
        'apikey': apikey
    }
    
    fetch('https://api.tyntec.com/chat-api/v2/messages', {
        method: 'POST',
        body: JSON.stringify(inputBody),
        headers: headers
    })
    .then((response) => {
        return response.json()
    })
    .then((body) => {
        console.log(body)
    })
}

// const handleCustomerioMessage = (req) =>{
//     const inputBody = {
//         "to": req.body.phone,
//         "channels": [
//             "whatsapp"
//         ],
//         "whatsapp": {
//             "from": fromPhoneNumber,
//             "contentType": "text",
//             "text": req.body.message
//         }
//     }
    
//     const headers = {
//         'Content-Type':'application/json',
//         'Accept':'application/json',
//         'apikey': apikey
//     }
    
//     fetch('https://api.tyntec.com/chat-api/v2/messages', {
//         method: 'POST',
//         body: JSON.stringify(inputBody),
//         headers: headers
//     })
//     .then((response) => {
//         return response.json()
//     })
//     .then((body) => {
//         console.log(body)
//     })
// }

module.exports = { handleCustomerioMessage }