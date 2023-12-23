'use strict';
const express = require('express')
const { chargeCreditCard, validateForm } = require('./utility')
const app = express()
const bodyParser = require('body-parser');


const cors = require('cors');
app.use(cors());
app.use(bodyParser.json())

app.post('/charge/card', (req, res) => {
    console.log(req.body)

    const validationErrors = validateForm(req.body);

    if (validationErrors.length > 0) {
        console.log("Errors", validationErrors)
        res.json({ errors: validationErrors });
        return;
    } else {
        console.log("Validation Complete, Processing Card Now!")
        chargeCreditCard(req.body, function () {
            console.log('chargeCreditCard call complete.');
        });
    }
});

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
    console.log(`Server is running on port ${port}`);
});


