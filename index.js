const express = require('express')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
app.post('/', (req, res) => {
    const text = req.body.message.text
    res.json({
        'text': `Received text: ${text}`
    })
})
app.listen(port, () => console.log(`delight-webhook-demo is listening on port ${port}!`))