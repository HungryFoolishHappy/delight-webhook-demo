const express = require('express')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
app.post('/', (req, res) => {
    const text = req.body.message.text
    const postback = req.body.message.postback

    /* START OF ACTIONS */
    const _actions_text = {
        title: 'Option 1'
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
        placeholder: "Image alternate text",      // optional
    }
    /* END OF IMAGE */

    const _ssml = '<speak>How do you spell Delight? It is <say-as interpret-as="verbatim">delight</say-as></speak>'
    let _responseText
    if (postback)
        _responseText = `Received postback: ${postback}`
    else
        _responseText = `Received text: ${text}`
    /* 
    Every object can start with this response

    const baseResponse = {
        text: `Received text: ${text}`, //required
        ssml: 'Here are <say-as interpret-as="characters">SSML</say-as> samples.', //optional
        actions: _actions, // optional
        shouldEndConversation: true // optional, default to false. If set to true, the assistant will terminate the mic
    }
    */



    // image response
    // const imageResponse = {
    //     text: `Received text: ${text}`,                     // optional
    //     ssml: 'Here are <say-as interpret-as="characters">SSML</say-as> samples.', //optional
    //     image: _imageObject,
    //     imageDisplayOptions: 'CROPPED',                      // optional
    //     actions: _actions // optional
    // }

    /*
    START OF OVERRIDE RESPONSE
    */

    // case 1:
    // We create a carousel response. For facebook, we just want to send plain text only.
    // So we create add override.facebook
    // for empty object, we send text only
    // const overrideResponse = {
    //     ...singleCardResponse,
    //     override: {
    //         facebook: {}
    //     }
    // }

    const textResponse = {
        text: _responseText, //required
        ssml: _ssml, //optional
        actions: _actions // optional
    }

    switch (text) {
        case 'text':
            // text response
            res.json(textResponse)
            break

        case 'card':
            // single card response
            const singleCardResponse = {
                text: _responseText,
                ssml: _ssml, //optional
                items: [{
                    title: "Tacos",
                    description: "Description",
                    image: _imageObject,
                    actions: _actions // optional
                }],
            }
            res.json(singleCardResponse)
            break

        case 'carousel':
            // carousel response
            const carouselResponse = {
                text: _responseText, // optional
                ssml: _ssml, //optional
                items: [{
                    title: "Tacos",
                    description: "Description",
                    image: _imageObject,
                    actions: _actions // optional
                }, {
                    "title": "Choo Yilin",
                    "description": "Award-winning jewellery designer Choo Yilin is well known for her modern jade pieces as well as her contemporary take on traditional Chinese and Peranakan wedding jewellery.",
                    "image": {
                        'url': "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
                        'placeholder': "Image alternate text"
                    },
                    "actions": [{
                        'title': 'Show me the map',
                        'url': 'https://maps.google.com'
                    }]
                }]
            }
            res.json(carouselResponse)
            break

        default:
            res.json(textResponse)
    }

})
app.listen(port, () => console.log(`delight-webhook-demo is listening on port ${port}!`))