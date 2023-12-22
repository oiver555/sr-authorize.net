'use strict';
const express = require('express')
const { chargeCreditCard, validateForm } = require('./utility')
const app = express()
 
const cors = require('cors');

app.post('/charge/card', (req, res) => {
    const validationErrors = validateForm(req.query);

    if (validationErrors.length > 0) {
        console.log("Errors", validationErrors)
        res.json({ errors: validationErrors });
        return;
    } else {
        console.log("Validation Complete, Processing Card Now!")
        const { cardNumber,firstName,lastName,address, cardCode, expiration, tithe1, tithe2, offering, bldg, email,  city , state, zip, country } = req.query;
        chargeCreditCard({
        firstName,
        lastName,
        address,
        cardNumber,
        expiration,
        cardCode,  
        city,
        state,
        zip,
        country,
        tithe1,
        tithe2,
        offering,
        bldg,
        email
        }, function () {
            console.log('chargeCreditCard call complete.');
        });
    }
});

app.get('/', (req, res) => {
    logger.info('Hello from the Server!')

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {}
    })
})

// Enable CORS for all routes
app.use(cors());


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });


