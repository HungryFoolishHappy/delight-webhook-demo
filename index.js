const express = require('express')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
app.post('/', (req, res) => {
    const text = req.body.message.text.toLowerCase()
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

    const _ssml = ''
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

        case 'ssml':
            res.json({
                text: _responseText,
                ssml: '<speak>How do you spell Delight? It is <say-as interpret-as="verbatim">delight</say-as></speak>', //optional
            })
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

        // case 'email':
        //     res.json({
        //         'helperIntent': {
        //             'name': 'get_email',
        //             'success_callback': 'get_email_success'
        //         }
        //     })
        //     break

        case 'raw':
            /*
            We override the google action response in the override field.
            As a result, google action user will receive a different response than the rest.
            */
            res.json({
                text: 'Only google action will see override response.',
                'override': {
                    'alexa': {
                        'raw': {"version": "1.0", "response": {"outputSpeech": {"type": "PlainText", "text": "This is a message from alexa raw mode"}, "shouldEndSession": false}}
                    },
                    'bixby': {
                        'raw': {'text': 'This is a message from bixby raw mode'}
                    },
                    'telegram':{
                        'raw': {'text': 'This is a message from telegram raw mode'}
                    },
                    'line': {
                        'raw': [{"quickReply": {"items": [{"action": {"label": "Option 1", "text": "Option 1", "type": "message"}, "type": "action"}, {"action": {"label": "Link Button", "text": "Link Button", "type": "message"}, "type": "action"}, {"action": {"label": "Postback button", "text": "Postback button", "type": "message"}, "type": "action"}]}, "text": "This is a message from line raw mode", "type": "text"}]  // line can support sending multiple messages in the same request, so we need to wrap it in array
                    },
                    'wechat': {
                        'raw': {
                            'msgtype': 'text',
                            'text': {
                                'content': 'This is a message from wechat raw mode',
                            }
                        }
                    },
                    'googleaction': {
                        'raw': {
                            "expectUserResponse": true,
                            "expectedInputs": [
                                {
                                    "possibleIntents": [
                                        {
                                            "intent": "actions.intent.TEXT"
                                        }
                                    ],
                                    "inputPrompt": {
                                        "richInitialPrompt": {
                                            "items": [
                                                {
                                                    "simpleResponse": {
                                                        "textToSpeech": "Here's an example of override google action response. Which type of response would you like to see next?"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            })
            break

        default:
            res.json(textResponse)
    }

})
app.listen(port, () => console.log(`delight-webhook-demo is listening on port ${port}!`))