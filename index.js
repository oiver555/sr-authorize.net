'use strict';
const express = require('express')
const { validateCreditCard, chargeCreditCard, debitBankAccount, debitBankAccountMobile, chargeCreditCardMobile, emailRecipt } = require('./utility')
const app = express()
const bodyParser = require('body-parser');
const { getNameList } = require('country-list')


const cors = require('cors');
app.use(cors());
app.use(bodyParser.json())

app.post('/charge/card', (req, res) => {
    console.log(req.body)
    const validationErrors = validateCreditCard(req.body);

    if (validationErrors.length > 0) {
        console.log("Errors", validationErrors)
        res.status(500).json({
            status: "error",
            type: "Card",
            requestedAt: req.requestTime,
            errors: validationErrors,
            message: "Validation Error",
            data: validationErrors
        });
        return;
    } else {
        chargeCreditCard(req.body, function (result, data) {
            if (result["transactionResponse"]["errors"] === undefined) {
                console.log("Transaction Complete!")
                emailRecipt(req.body, "Credit Card", result.transactionResponse)
                res.status(200).json({
                    status: 'success',
                    type: "Card",
                    requestedAt: req.requestTime,
                    data: result
                })
            } else {
                console.log("There was an error", result.messages.message,)
                res.status(500).json({
                    status: 'error',
                    type: "Card",
                    message: result.messages.message,
                });
            }
        });
    }
});

app.post('/charge/app/card', (req, res) => {
    console.log(req.body)
    chargeCreditCardMobile(req.body, function (result) {
        console.log(result)
        res.status(200).json({
            status: 'success',
            type: "Card",
            requestedAt: req.requestTime,
            data: result
        })
    });
});


app.post('/charge/app/bank', (req, res) => {
    debitBankAccountMobile()
    debitBankAccount(req.body, function (result) {
        console.log(result)
        res.status(200).json({
            status: 'success',
            type: "Bank",
            requestedAt: req.requestTime,
            data: result
        })
    });

});

app.post('/charge/bank', (req, res) => {
    console.log(req.body)
    debitBankAccount(req.body, function (result) {
        console.log(result)
        res.status(200).json({
            status: 'success',
            type: "Bank",
            requestedAt: req.requestTime,
            data: result
        })
    });

});


app.get('/country/list', (req, res) => {
    console.log("Returning Country List")
    res.status(200).json({
        status: 'success',
        type: "Country",
        requestedAt: req.requestTime,
        data: getNameList()
    })
})

app.get('/receipt', (req, res) => {
    console.info('Sending Receipt', req.body)
    emailRecipt()
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {}
    })
})
app.get('/', (req, res) => {
    console.info('Hello from the Server!')

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {}
    })
})

// Enable CORS for all routes
const port = process.env.PORT || 3000;

app.listen(port, () => {
    // console.log(`Server is running on port ${port}`);
});