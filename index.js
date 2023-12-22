'use strict';
const { APIControllers, APIContracts: ApiContracts } = require('authorizenet');
const express = require('express')
const { chargeCreditCard, validateForm } = require('./utility')
const app = express()
const port = process.env.PORT || 3000;



app.post('/charge/card', (req, res) => {
    const validationErrors = validateForm(req.query);

    if (validationErrors.length > 0) {
        console.log("Errors", validationErrors)
        res.json({ errors: validationErrors });
        return;
    } else {
        console.log("Validation Complete, Processing Card Now!")
        const { cardNumber,firstName,lastName,address, cardCode, expiration, tithe1, tithe2, offering, bldg, email, invoiceNumber, city , state, zip, country } = req.query;
        chargeCreditCard({
        firstName,
        lastName,
        address,
        cardNumber,
        expiration,
        cardCode,
        invoiceNumber,
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





app.listen(port);



if (require.main === module) {

}
