const express = require('express')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
app.post('/', (req, res) => {
    const text = req.body.message.text

    /* START OF ACTIONS */
    const _actions_text = {
        text: 'Option 1'
    }
    const _actions_url = {
        title: 'Link Button',
        url: 'http://google.com' // optional
    }
    const _actions_postback = {
        title: 'Postback button',
        payload: 'THIS_IS_PAYLOAD_KEY' // optional
    }
    const _actions = [
        _actions_text,
        _actions_url,
        _actions_postback
    ]
    /* END OF ACTIONS */

    /* START OF IMAGE */
    const _imageObject = {
        url: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",            // required
        accessibilityText: "Image alternate text",      // optional
    }
    /* END OF IMAGE */

    /* 
    Every object can start with this response

    const baseResponse = {
        text: `Received text: ${text}`, //required
        ssml: 'Here are <say-as interpret-as="characters">SSML</say-as> samples.', //optional
        actions: _actions // optional
    }
    */

    // text response
    const textResponse = {
        text: `Received text: ${text}`, //required
        ssml: 'Here are <say-as interpret-as="characters">SSML</say-as> samples.', //optional
        actions: _actions // optional
    }

    // image response
    const imageResponse = {
        text: `Received text: ${text}`,                     // optional
        ssml: 'Here are <say-as interpret-as="characters">SSML</say-as> samples.', //optional
        image: _imageObject,
        imageDisplayOptions: 'CROPPED',                      // optional
        actions: _actions // optional
    }

    // single card response
    const singleCardResponse = {
        text: 'This is what we found',
        ssml: 'Here are <say-as interpret-as="characters">SSML</say-as> samples.', //optional
        items: [{
            title: "Tacos",
            description: "Description",
            image: _imageObject,
            actions: _actions // optional
        }]
    }

    // carousel response
    const carouselResponse = {
        text: 'This is what we found', // optional
        ssml: 'Here are <say-as interpret-as="characters">SSML</say-as> samples.', //optional
        items: [{
            title: "Tacos",
            description: "Description",
            image: _imageObject,
            actions: _actions // optional
        }]
    }

    /*
    START OF OVERRIDE RESPONSE
    */

    // case 1:
    // We create a carousel response. For facebook, we just want to send plain text only.
    // So we create add override.facebook
    // for empty object, we send text only
    const overrideResponse = {
        ...carouselResponse,
        override: {
            facebook: {}
        }
    }

    res.json(textResponse)
})
app.listen(port, () => console.log(`delight-webhook-demo is listening on port ${port}!`))