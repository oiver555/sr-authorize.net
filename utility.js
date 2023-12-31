'use strict';
const { APIControllers, APIContracts: ApiContracts, } = require('authorizenet');
const validator = require('validator');
const apiID = process.env.apiID;
const transactionKey = process.env.transactionKey;

function chargeCreditCard(data, callback) {
    var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(apiID);
    merchantAuthenticationType.setTransactionKey(transactionKey);

    var creditCard = new ApiContracts.CreditCardType();
    creditCard.setCardNumber(data.cardNumber);
    creditCard.setExpirationDate(data.expiration);
    creditCard.setCardCode(data.cardCode);

    var paymentType = new ApiContracts.PaymentType();
    paymentType.setCreditCard(creditCard);

    var orderDetails = new ApiContracts.OrderType();
    orderDetails.setInvoiceNumber(data.invoiceNumber);
    orderDetails.setDescription('Tithe & Offering');

    var billTo = new ApiContracts.CustomerAddressType();
    billTo.setFirstName(data.firstName);
    billTo.setLastName(data.lastName);
    billTo.setAddress(data.address);
    billTo.setCity(data.city);
    billTo.setState(data.state);
    billTo.setZip(data.zip);
    billTo.setCountry(data.country);
    billTo.setEmail(data.email)

    var lineItem_id1 = new ApiContracts.LineItemType();
    lineItem_id1.setItemId('1');
    lineItem_id1.setName('1st Tithe');
    lineItem_id1.setQuantity('1');
    lineItem_id1.setUnitPrice(data.tithe1);

    var lineItem_id2 = new ApiContracts.LineItemType();
    lineItem_id2.setItemId('2');
    lineItem_id2.setName('2nd Tithe');
    lineItem_id2.setQuantity('1');
    lineItem_id2.setUnitPrice(data.tithe2);

    var lineItem_id3 = new ApiContracts.LineItemType();
    lineItem_id3.setItemId('3');
    lineItem_id3.setName('Offering');
    lineItem_id3.setQuantity('1');
    lineItem_id3.setUnitPrice(data.offering);

    var lineItem_id4 = new ApiContracts.LineItemType();
    lineItem_id4.setItemId('4');
    lineItem_id4.setName('Bldg. Fund');
    lineItem_id3.setDescription('For the upkeep of the buidlings at Mt. Carmel');
    lineItem_id4.setQuantity('1');
    lineItem_id4.setUnitPrice(data.bldg)

    var lineItemList = [];
    lineItemList.push(lineItem_id1);
    lineItemList.push(lineItem_id2);
    lineItemList.push(lineItem_id3);
    lineItemList.push(lineItem_id4);

    var lineItems = new ApiContracts.ArrayOfLineItem();
    lineItems.setLineItem(lineItemList);

    var transactionSetting1 = new ApiContracts.SettingType();
    transactionSetting1.setSettingName('duplicateWindow');
    transactionSetting1.setSettingValue('120');

    var transactionSetting2 = new ApiContracts.SettingType();
    transactionSetting2.setSettingName('recurringBilling');
    transactionSetting2.setSettingValue('false');

    var transactionSetting3 = new ApiContracts.SettingType();
    transactionSetting3.setSettingName('emailCustomer');
    transactionSetting3.setSettingValue('true');

    var transactionSettingList = [];
    transactionSettingList.push(transactionSetting1);
    transactionSettingList.push(transactionSetting2);
    transactionSettingList.push(transactionSetting3);

    var transactionSettings = new ApiContracts.ArrayOfSetting();
    transactionSettings.setSetting(transactionSettingList);

    var transactionRequestType = new ApiContracts.TransactionRequestType();
    transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
    transactionRequestType.setPayment(paymentType);
    transactionRequestType.setAmount(JSON.parse(lineItem_id1.unitPrice) + JSON.parse(lineItem_id2.unitPrice) + JSON.parse(lineItem_id3.unitPrice) + JSON.parse(lineItem_id4.unitPrice));
    transactionRequestType.setLineItems(lineItems);
    transactionRequestType.setOrder(orderDetails);
    transactionRequestType.setBillTo(billTo);
    transactionRequestType.setTransactionSettings(transactionSettings);

    var createRequest = new ApiContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(transactionRequestType);

    //pretty print request
    console.log(JSON.stringify(createRequest.getJSON(), null, 2));

    var ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());
    //Defaults to sandbox
    //ctrl.setEnvironment(SDKConstants.endpoint.production);

    ctrl.execute(function () {

        var apiResponse = ctrl.getResponse();

        var response = new ApiContracts.CreateTransactionResponse(apiResponse);

        //pretty print response
        console.log(JSON.stringify(response, null, 2));

        if (response != null) {
            if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                if (response.getTransactionResponse().getMessages() != null) {
                    console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
                    console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
                    console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
                    console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
                }
                else {
                    console.log('Failed Transaction.');
                    if (response.getTransactionResponse().getErrors() != null) {
                        console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                        console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
                    }
                }
            }
            else {
                console.log('Failed Transaction. ');
                if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {

                    console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                    console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
                }
                else {
                    console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                    console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                }
            }
        }
        else {
            console.log('Null Response.');
        }

        callback(response);
    });
}




const validateForm = (req) => {
    const { cardNumber, cardCode, expiration, tithe1, tithe2, offering, bldg, email  } = req;

    const errors = [];

    if (!validator.isCreditCard(cardNumber)) {
        errors.push({
            param: 'cardNumber',
            value: cardNumber,
            msg: 'Invalid credit card number.'
        });
    }

    if (!validator.isEmail(email)) {
        errors.push({
            param: 'email',
            value: email,
            msg: 'Invalid Email.'
        });
    }

    if (!/^\d{4}$/.test(expiration)) {
        errors.push({
            param: 'expiration',
            value: expiration,
            msg: 'Invalid expiration date.'
        });
    }

    if (!validator.isDecimal(tithe1)) {
        errors.push({
            param: 'tithe1',
            value: tithe1,
            msg: 'Invalid tithe1.'
        });
    }
    if (!validator.isDecimal(tithe2)) {
        errors.push({
            param: 'tithe2',
            value: tithe2,
            msg: 'Invalid tithe2.'
        });
    }
    if (!validator.isDecimal(offering)) {
        errors.push({
            param: 'offering',
            value: offering,
            msg: 'Invalid offering.'
        });
    }
    if (!validator.isDecimal(bldg)) {
        console.log(bldg)
        errors.push({
            param: 'bldg',
            value: bldg,
            msg: 'Invalid bldg.'
        });
    }

    return errors;
}

module.exports = {
    chargeCreditCard, validateForm
}