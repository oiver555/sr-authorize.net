'use strict';
const { APIControllers, APIContracts, Constants } = require('authorizenet');
const validator = require('validator');
const nodemailer = require('nodemailer')
const apiID = process.env.apiID;
const transactionKey = process.env.transactionKey;
const testData = {
  invoiceNumber: 555,
  firstName: "Oliver",
  lastName: "Saintilien",
  city: "Mountain Dale",
  zip: 12763,
  state: "New York",
  country: "USA",
  email: "osaintilien55@gmail.com",
  phone: "9736668136",
  tithe1: 50,
  tithe2: 50,
  offering: 5,
  bldg: 5,
  total: 200,
  invoiceNumber: 555,
  accountNumber: 123456789
}
const testResponse = {
  transId: 12345,
  authCode: 554478
}
const transporter = nodemailer.createTransport({
  host: 'shepherds-rod-message.org',
  port: 465,
  auth: {
    user: 'admin@shepherds-rod-message.org',
    pass: 'Zip1tdown32!'
  }
});

const emailRecipt = async (data, type, transactionResponse) => {

  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  
  const time = Date.now()

  const options = {
    timeZone: 'America/New_York', // Set time zone to Eastern Standard Time (EST)
    hour12: true, // Use 12-hour time format (true) or 24-hour format (false)
    hour: 'numeric', // Display hours
    minute: 'numeric', // Display minutes
    second: 'numeric' // Display seconds
  };

  // Convert Date object to a readable string in EST time zone
  const formattedTime = new Date(time).toLocaleString('en-US', options);

  console.log(formattedTime)
  return transporter.sendMail({
    from: 'admin@shepherds-rod-message.org', // sender address
    to: data.email, // list of receivers
    subject: "Receipt", // Subject line
    text: `Since HTML has been disabled on your email client we have opted to send you a plain text version of our receipt. \nMay God Bless your Faithfulness!\n You may print this receipt page for your records.\n\n\n Receipt Information\nMerchant: GENERAL ASSOC. OF DAVIDIAN SEVENTH DAY ADVENTIST\nInvoice Number :${data.invoiceNumber}\nDate: ${today}\nTime: ${formattedTime} EST\nFirst Name: ${data.firstName}\nLast Name: ${data.lastName}\nCity: ${data.city}\nZip: ${data.zip}\nState: ${data.state}\nCountry: ${data.country}\nEmail: ${data.email}\nPhone: ${data.phone}\n1st Tithe: ${data.tithe1}\n2nd Tithe: ${data.tithe2}\nOffering: ${data.offering}\nBldg.: ${data.bldg}\nTotal: ${data.total}\nAccount Number: ${data.accountNumber}\nTransaction ID: ${transactionResponse.transId}\nTransaction Auth. Code: ${transactionResponse.authCode}\n`, // plain text body
    html: `         
  <body style="margin: 25px 200px; padding: 10px; outline: solid 2px black; color: black">
  <h3 style="font-family: arial; margin: 0; padding: 0; text-align:left">
    May God Bless your Faithfulness!
  </h3>
  <hr size="2px" />
  <div style="font-size: 14px; font-weight: 100;  text-align:left">
    You may print this receipt page for your records.
  </div>

  <div style="padding: 10px 0; color: gray; font-size: 14px;  text-align:left">
    Receipt Information
  </div>

  <div
   
  >
    <div style="display: flex; justify-content: space-between">
      <div style="flex: 0.2; font-size: 13px;  text-align:left">Merchant:</div>
      <div style="flex: 0.8; font-size: 13px;  text-align:left">
        GENERAL ASSOC. OF DAVIDIAN SEVENTH DAY ADVENTIST
      </div>
    </div>
    <div style="display: flex; justify-content: space-between">
      <div style="flex: 0.2; font-size: 13px;  text-align:left">Invoice Number:</div>
      <div id="receipt-invoice-nubmer" style="flex: 0.8; text-align:left; font-size: 13px">
        INV-${data.invoiceNumber}
      </div>
    </div>
    <div >
      <div style="font-size: 13px; text-align:left">Date: ${today}</div>      
      <div style="font-size: 13px; text-align:left">Time: ${formattedTime} EST</div>     
    </div>
  </div>

  <hr size="2px" />
  <div style="padding: 5px 0; font-weight: bold; font-size: 13px;  text-align:left">
    Billing Information
  </div>

  <div style="font-size: 13px;  text-align:left">
    <span style="text-align:left">First Name: ${data.firstName}</span><br />
    <span style="text-align:left">Last Name: ${data.lastName}</span><br />
    <span style="text-align:left">City: ${data.city}</span><br />
    <span style="text-align:left">State: ${data.state}</span><br />
    <span style="text-align:left">Zip: ${data.zip}</span><br />
    <span style="text-align:left">Country: ${data.country}</span><br />
    <span style="text-align:left">Email: ${data.email}</span><br />
    <span style="text-align:left">Phone: ${data.phone}</span>
  </div>
  <hr size="2px" />
  <div style="display: flex; position: relative">
    <div style="float:left">
      <div style="padding-bottom: 5px 0; font-weight: bold; font-size: 13px;  text-align:left">
        Contributions
      </div>
      <div style="font-size: 13px;  text-align:left">First Tithe</div>
      <div style="font-size: 13px; text-align:left">Second Tithe</div>
      <div style="font-size: 13px; text-align:left">Offering</div>
      <div style="font-size: 13px; text-align:left">Bldg.</div>
    </div>

    <div style="float:right; margin-left: 50px">
      <div style="padding-bottom: 5px 0; font-weight: bold; font-size: 13px">
        Amount
      </div>
      <div style="font-size: 13px">$${data.tithe1}</div>
      <div style="font-size: 13px">$${data.tithe2}</div>
      <div style="font-size: 13px">$${data.offering}</div>
      <div style="font-size: 13px">$${data.bldg}</div>
    </div>
  </div>
  <hr size="2px" />

  <div style="position: relative">
    <div      
      style="text-align: right; font-weight: bold; font-size: 13px"
    >Total: $${data.total}</div>
  </div>
  <br />
  <div>
    <div style=" font-size: 13px;  text-align:left">
      <span style=" text-align:left; font-size: 13px"
         
      >Account Number: ${data.accountNumber}</span>
    </div>
    <div style="font-size: 13px; text-align:left">
      <div style="font-size: 13px; text-align:left">Date: ${today}</div>      
      <div style="font-size: 13px; text-align:left">Time: ${formattedTime}</div>
    </div>
    <div style="font-size: 13px; text-align:left">
      Transaction ID: ${transactionResponse.transId}
    </div>
    <div style="font-size: 13px; text-align:left">Auth Code: ${transactionResponse.authCode}</div>
    <div style="font-size: 13px; text-align:left">
      Payment Method: ${type}
      Invoice Number: ${data.invoiceNumber}</span>
    </div>
  </div>
</body>`, // html body
  });



}
const emailReciptMobile = async (data, type, transactionResponse) => {

  let today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;

  const time = Date.now()

  return transporter.sendMail({
    from: 'admin@shepherds-rod-message.or', // sender address
    to: data.email, // list of receivers
    subject: "VTH Writings Receipt", // Subject line
    text: `Since HTML has been disabled on your email client we have opted to send you a plain text version of our receipt.\nMay God Bless your Kindness!\n You may print this receipt page for your records.\n\n\n Receipt Information\nMerchant: GENERAL ASSOC. OF DAVIDIAN SEVENTH DAY ADVENTIST\nInvoice Number :${data.invoiceNumber}\nDate: ${today}\nTime: ${formattedTime}\nFirst Name: ${data.firstName}\nLast Name: ${data.lastName}\nCity: ${data.city}\nZip: ${data.zip}\nState: ${data.state}\nCountry: ${data.country}\nEmail: ${data.email}\nPhone: ${data.phone}\nTotal: ${data.amount}\nAccount Number: ${data.accountNumber}\nTransaction ID: ${transactionResponse.transId}\nTransaction Auth. Code: ${transactionResponse.authCode}\n`, // plain text body
    html: `         
  <body style="padding: 10px; outline: solid 2px black">
  <h3 style="font-family: arial; margin: 0; padding: 0; text-align:left">
    May God Bless your Kindness!
  </h3>
  <hr size="2px" />
  <div style="font-size: 14px; font-weight: 100;  text-align:left">
    You may print this receipt page for your records.
  </div>

  <div style="padding: 10px 0; color: gray; font-size: 14px;  text-align:left">
    Receipt Information
  </div>

  <div
    style="
      display: flex;
      flex-direction: column;
      height: 60px;
      justify-content: space-between;
    "
  >
    <div style="display: flex; justify-content: space-between">
      <div style="flex: 0.2; font-size: 13px;  text-align:left">Merchant:</div>
      <div style="flex: 0.8; font-size: 13px;  text-align:left">
        GENERAL ASSOC. OF DAVIDIAN SEVENTH DAY ADVENTIST
      </div>
    </div>
    <div style="display: flex; justify-content: space-between">
      <div style="flex: 0.2; font-size: 13px;  text-align:left">Invoice Number:</div>
      <div id="receipt-invoice-nubmer" style="flex: 0.8; text-align:left; font-size: 13px">
        INV-${data.invoiceNumber}
      </div>
    </div>
    <div style="display: flex; justify-content: space-between">
      <div style="flex: 0.2; font-size: 13px; text-align:left">Date/Time:</div>
      <div style="flex: 0.8; font-size: 13px; text-align:left">
        <span>${today}</span> <span>${formattedTime}</span>
      </div>
    </div>
  </div>

  <hr size="2px" />
  <div style="padding: 5px 0; font-weight: bold; font-size: 13px;  text-align:left">
    Billing Information
  </div>

  <div style="font-size: 13px;  text-align:left">
    <span style=" text-align:left" id="receipt-name">${data.firstName}</span><br />
    <span style=" text-align:left" id="receipt-address">${data.lastName}</span><br />
    <span style=" text-align:left" id="receipt-city">${data.city}</span> <span style=" text-align:left" id="receipt-state">${data.state}</span>
    <span style=" text-align:left" id="receipt-zip">${data.zip}</span><br />
    <span style=" text-align:left" id="receipt-country">${data.country}</span><br />
    <span style=" text-align:left" id="receipt-email">${data.email}</span><br />
    Phone: <span id="receipt-phone" style=" text-align:left">${data.phone}</span>
  </div>
  <hr size="2px" />

  <div style="position: relative">
    <div
      id="receipt-total"
      style="text-align: right; font-weight: bold; font-size: 13px"
    >${data.amount}</div>
  </div>
  <br />
  <div>
    <div style="color: grey; font-size: 13px;  text-align:left">
      <span style=" text-align:left>${type}</span>
      <span
        style=" text-align:left; font-size: 13px"
        
      >${transactionResponse.accountNumber}</span>
    </div>
    <div style="font-size: 13px; text-align:left">
      Date/Time: <span >${today}</span>
      <span >${formattedTime}</span>
    </div>
    <div style="font-size: 13px; text-align:left">
      Transaction ID : <span id="transactionID">${transactionResponse.transId}</span>
    </div>
    <div style="font-size: 13px; text-align:left">Auth Code: <span id="authCode">${transactionResponse.authCode}</span></div>
    <div style="font-size: 13px; text-align:left">
      Payment Method : <span >${type}</span>
      <span >${data.invoiceNumber}</span>
    </div>
  </div>
  
</body>`, // html body
  })
}

emailRecipt(testData, "mobile", testResponse)
  .then(res => {
    console.log(res)
  })

function chargeCreditCard(data, callback) {
  // console.log("[Utility.js] chargeCreditCard()", apiID, transactionKey)
  var merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(apiID);
  merchantAuthenticationType.setTransactionKey(transactionKey);



  var creditCard = new APIContracts.CreditCardType();
  creditCard.setCardNumber(data.cardNumber);
  creditCard.setExpirationDate(data.expiration);
  creditCard.setCardCode(data.cardCode);

  var paymentType = new APIContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  var orderDetails = new APIContracts.OrderType();
  orderDetails.setInvoiceNumber(`${data.invoiceNumber}`);
  orderDetails.setDescription('Tithe & Offering');

  var billTo = new APIContracts.CustomerAddressType();
  billTo.setFirstName(data.firstName);
  billTo.setLastName(data.lastName);
  billTo.setAddress(data.address);
  billTo.setCity(data.city);
  billTo.setState(data.state);
  billTo.setZip(data.zip);
  billTo.setCountry(data.country);
  !data.anonymous && data.email && billTo.setEmail(data.email)

  var lineItem_id1 = new APIContracts.LineItemType();
  lineItem_id1.setItemId('1');
  lineItem_id1.setName('1st Tithe');
  lineItem_id1.setQuantity('1');
  lineItem_id1.setUnitPrice(data.tithe1);

  var lineItem_id2 = new APIContracts.LineItemType();
  lineItem_id2.setItemId('2');
  lineItem_id2.setName('2nd Tithe');
  lineItem_id2.setQuantity('1');
  lineItem_id2.setUnitPrice(data.tithe2);

  var lineItem_id3 = new APIContracts.LineItemType();
  lineItem_id3.setItemId('3');
  lineItem_id3.setName('Offering');
  lineItem_id3.setQuantity('1');
  lineItem_id3.setUnitPrice(data.offering);

  var lineItem_id4 = new APIContracts.LineItemType();
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

  var lineItems = new APIContracts.ArrayOfLineItem();
  lineItems.setLineItem(lineItemList);

  const total = JSON.parse(lineItem_id1.unitPrice) + JSON.parse(lineItem_id2.unitPrice) + JSON.parse(lineItem_id3.unitPrice) + JSON.parse(lineItem_id4.unitPrice)

  var transactionSetting1 = new APIContracts.SettingType();
  transactionSetting1.setSettingName('duplicateWindow');
  transactionSetting1.setSettingValue('120');

  var transactionSetting2 = new APIContracts.SettingType();
  transactionSetting2.setSettingName('recurringBilling');
  transactionSetting2.setSettingValue('false');

  var transactionSetting3 = new APIContracts.SettingType();
  transactionSetting3.setSettingName('emailCustomer');
  transactionSetting3.setSettingValue(data.anonymous ? 'false' : 'true');

  var transactionSettingList = [];
  transactionSettingList.push(transactionSetting1);
  transactionSettingList.push(transactionSetting2);
  transactionSettingList.push(transactionSetting3);

  var transactionSettings = new APIContracts.ArrayOfSetting();
  transactionSettings.setSetting(transactionSettingList);

  var transactionRequestType = new APIContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
  transactionRequestType.setPayment(paymentType);

  transactionRequestType.setAmount(JSON.parse(lineItem_id1.unitPrice) + JSON.parse(lineItem_id2.unitPrice) + JSON.parse(lineItem_id3.unitPrice) + JSON.parse(lineItem_id4.unitPrice));
  transactionRequestType.setLineItems(lineItems);
  transactionRequestType.setOrder(orderDetails);
  !data.anonymous && transactionRequestType.setBillTo(billTo);
  transactionRequestType.setTransactionSettings(transactionSettings);

  var createRequest = new APIContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  // console.log(JSON.stringify(createRequest.getJSON(), null, 2));

  var ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());
  //Defaults to sandbox
  ctrl.setEnvironment(Constants.endpoint.production);

  ctrl.execute(function () {

    var apiResponse = ctrl.getResponse();

    var response = new APIContracts.CreateTransactionResponse(apiResponse);

    if (response != null) {
      if (response.getMessages().getResultCode() == APIContracts.MessageTypeEnum.OK) {
        if (response.getTransactionResponse().getMessages() != null) {
          emailRecipt(data, "Credit Card", respone, total)
          // console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
          // console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
          // console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
          // console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
        }
        else {
          console.log('Failed Transaction.');
          if (response.getTransactionResponse().getErrors() != null) {
            // console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
            // console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
          }
        }
      }
      else {
        console.log('Failed Transaction. ');
        if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {

          // console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
          // console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
        }
        else {
          // console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
          // console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
        }
      }
    }
    else {
      console.log('Null Response.');
    }

    callback(response);
  });
}


function chargeCreditCardMobile(data, callback) {
  console.log("[Utility.js] chargeCreditCard()")
  var merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(apiID);
  merchantAuthenticationType.setTransactionKey(transactionKey);

  var creditCard = new APIContracts.CreditCardType();
  creditCard.setCardNumber(data.cardNumber);
  creditCard.setExpirationDate(data.month + data.year);
  creditCard.setCardCode(data.cardCode);

  var paymentType = new APIContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  var orderDetails = new APIContracts.OrderType();
  orderDetails.setInvoiceNumber(`${data.invoiceNumber}`);
  orderDetails.setDescription('Donation');

  var billTo = new APIContracts.CustomerAddressType();
  billTo.setFirstName(data.firstName);
  billTo.setLastName(data.lastName);
  billTo.setZip(data.zip);
  !data.anonymous && data.email && billTo.setEmail(data.email)

  var lineItem_id1 = new APIContracts.LineItemType();
  lineItem_id1.setItemId('1');
  lineItem_id1.setName('Amount');
  lineItem_id1.setQuantity('1');
  lineItem_id1.setUnitPrice(data.amount);

  var lineItemList = [];
  lineItemList.push(lineItem_id1);

  var lineItems = new APIContracts.ArrayOfLineItem();
  lineItems.setLineItem(lineItemList);

  var transactionSetting1 = new APIContracts.SettingType();
  transactionSetting1.setSettingName('duplicateWindow');
  transactionSetting1.setSettingValue('120');

  var transactionSetting2 = new APIContracts.SettingType();
  transactionSetting2.setSettingName('recurringBilling');
  transactionSetting2.setSettingValue('false');

  var transactionSetting3 = new APIContracts.SettingType();
  transactionSetting3.setSettingName('emailCustomer');
  transactionSetting3.setSettingValue(data.anonymous ? 'false' : 'true');

  var transactionSettingList = [];
  transactionSettingList.push(transactionSetting1);
  transactionSettingList.push(transactionSetting2);
  transactionSettingList.push(transactionSetting3);

  var transactionSettings = new APIContracts.ArrayOfSetting();
  transactionSettings.setSetting(transactionSettingList);

  var transactionRequestType = new APIContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
  transactionRequestType.setPayment(paymentType);

  transactionRequestType.setAmount(JSON.parse(lineItem_id1.unitPrice));
  transactionRequestType.setLineItems(lineItems);
  transactionRequestType.setOrder(orderDetails);
  !data.anonymous && transactionRequestType.setBillTo(billTo);
  transactionRequestType.setTransactionSettings(transactionSettings);

  var createRequest = new APIContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  // console.log(JSON.stringify(createRequest.getJSON(), null, 2));

  var ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());
  //Defaults to sandbox
  //ctrl.setEnvironment(SDKConstants.endpoint.production);

  ctrl.execute(function () {

    var apiResponse = ctrl.getResponse();

    var response = new APIContracts.CreateTransactionResponse(apiResponse);

    if (response != null) {
      if (response.getMessages().getResultCode() == APIContracts.MessageTypeEnum.OK) {
        if (response.getTransactionResponse().getMessages() != null) {
          emailReciptMobile(data, "Credit Card", response)
        }
        else {
          console.log('Failed Transaction.');
          if (response.getTransactionResponse().getErrors() != null) {

          }
        }
      }
      else {
        console.log('Failed Transaction. ');

      }
    }
    else {
      console.log('Null Response.');
    }

    callback(response);
  });
}

const validateCreditCard = (req) => {
  console.log("[Utility.js] validateCreditCard()")

  const { cardNumber, tithe1, tithe2, cardCode, offering, bldg, email, anonymous, firstName, lastName, zip, phone } = req;

  const errors = [];

  if (!validator.isCreditCard(cardNumber)) {
    errors.push({
      param: 'cardNumber',
      value: cardNumber,
      msg: 'Invalid Credit Card Number'
    });
  }


  if (!anonymous && !validator.isEmail(email)) {
    errors.push({
      param: 'email',
      value: email,
      msg: 'Invalid Email'
    });
  }
  if (!anonymous && validator.isEmpty(firstName)) {
    errors.push({
      param: 'firstName',
      value: firstName,
      msg: 'Invalid First Name'
    });
  }
  if (!anonymous && validator.isEmpty(lastName)) {
    errors.push({
      param: 'lastName',
      value: lastName,
      msg: 'Invalid Last Name'
    });
  }



  if (!validator.isPostalCode(zip, 'any')) {
    errors.push({
      param: 'zip',
      value: zip,
      msg: 'Invalid Zip Code'
    });
  }

  if (!validator.isDecimal(tithe1)) {
    errors.push({
      param: 'tithe1',
      value: tithe1,
      msg: 'Invalid 1st Tithe'
    });
  }
  if (!validator.isDecimal(tithe2)) {
    errors.push({
      param: 'tithe2',
      value: tithe2,
      msg: 'Invalid 2nd Tithe'
    });
  }
  if (!validator.isDecimal(offering)) {
    errors.push({
      param: 'offering',
      value: offering,
      msg: 'Invalid Offering'
    });
  }
  if (!validator.isDecimal(bldg)) {
    console.log(bldg)
    errors.push({
      param: 'bldg',
      value: bldg,
      msg: 'Invalid Bldg. Amount'
    });
  }

  return errors;
}

const validateBankAccount = (req) => {
  console.log("[Utility.js] validateBankAccount()")

  const { bankAccountNumber, routingNumber, anonymous, firstName, lastName, zip, phone } = req;

  const errors = [];

  if (!validator.isCreditCard(cardNumber)) {
    errors.push({
      param: 'cardNumber',
      value: cardNumber,
      msg: 'Invalid credit card number.'
    });
  }


  if (!anonymous && !validator.isEmail(email)) {
    errors.push({
      param: 'email',
      value: email,
      msg: 'Invalid Email.'
    });
  }
  if (!anonymous && validator.isEmpty(firstName)) {
    errors.push({
      param: 'firstName',
      value: firstName,
      msg: 'Invalid First Name.'
    });
  }
  if (!anonymous && validator.isEmpty(lastName)) {
    errors.push({
      param: 'lastName',
      value: lastName,
      msg: 'Invalid Last Name'
    });
  }



  if (!validator.isPostalCode(zip, 'any')) {
    errors.push({
      param: 'zip',
      value: zip,
      msg: 'Invalid Zip Code'
    });
  }

  if (!validator.isDecimal(tithe1)) {
    errors.push({
      param: 'tithe1',
      value: tithe1,
      msg: 'Invalid 1st Tithe Amount'
    });
  }
  if (!validator.isDecimal(tithe2)) {
    errors.push({
      param: 'tithe2',
      value: tithe2,
      msg: 'Invalid 2nd Tithe Amount'
    });
  }
  if (!validator.isDecimal(offering)) {
    errors.push({
      param: 'offering',
      value: offering,
      msg: 'Invalid Offering Amount'
    });
  }
  if (!validator.isDecimal(bldg)) {
    console.log(bldg)
    errors.push({
      param: 'bldg',
      value: bldg,
      msg: 'Invalid Bldg. Amount'
    });
  }

  return errors;
}

function debitBankAccount(data, callback) {

  var merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(apiID);
  merchantAuthenticationType.setTransactionKey(transactionKey);

  var bankAccountType = new APIContracts.BankAccountType();
  bankAccountType.setAccountType(APIContracts.BankAccountTypeEnum.SAVINGS);
  bankAccountType.setRoutingNumber(data.routingNumber);
  //added code

  bankAccountType.setAccountNumber(data.accountNumber);
  bankAccountType.setNameOnAccount(data.nameOnAccount);

  var paymentType = new APIContracts.PaymentType();
  paymentType.setBankAccount(bankAccountType);

  var orderDetails = new APIContracts.OrderType();
  orderDetails.setInvoiceNumber(data.invoiceNumber);
  orderDetails.setDescription('Tithes & Offerings');


  var billTo = new APIContracts.CustomerAddressType();
  billTo.setFirstName(data.firstName);
  billTo.setLastName(data.lastName);
  billTo.setAddress(data.address);
  billTo.setCity(data.city);
  billTo.setState(data.state);
  billTo.setZip(data.zip);
  billTo.setCountry(data.country);

  var lineItem_id1 = new APIContracts.LineItemType();
  lineItem_id1.setItemId('1');
  lineItem_id1.setName('1st Tithe');
  lineItem_id1.setQuantity('1');
  lineItem_id1.setUnitPrice(data.tithe1);

  var lineItem_id2 = new APIContracts.LineItemType();
  lineItem_id2.setItemId('2');
  lineItem_id2.setName('2nd Tithe');
  lineItem_id2.setQuantity('1');
  lineItem_id2.setUnitPrice(data.tithe2);


  var lineItem_id3 = new APIContracts.LineItemType();
  lineItem_id3.setItemId('3');
  lineItem_id3.setName('Offering');
  lineItem_id3.setQuantity('1');
  lineItem_id3.setUnitPrice(data.offering);

  var lineItem_id4 = new APIContracts.LineItemType();
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

  var lineItems = new APIContracts.ArrayOfLineItem();
  lineItems.setLineItem(lineItemList);

  var transactionRequestType = new APIContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setAmount(JSON.parse(lineItem_id1.unitPrice) + JSON.parse(lineItem_id2.unitPrice) + JSON.parse(lineItem_id3.unitPrice) + JSON.parse(lineItem_id4.unitPrice));
  transactionRequestType.setLineItems(lineItems);
  transactionRequestType.setOrder(orderDetails);
  transactionRequestType.setBillTo(billTo);

  var createRequest = new APIContracts.CreateTransactionRequest();
  createRequest.setRefId(data.invoiceNumber);
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  //pretty print request
  console.log(JSON.stringify(createRequest.getJSON(), null, 2));

  var ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());

  ctrl.execute(function () {

    var apiResponse = ctrl.getResponse();

    var response = new APIContracts.CreateTransactionResponse(apiResponse);

    //pretty print response
    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (response.getMessages().getResultCode() == APIContracts.MessageTypeEnum.OK) {
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

function debitBankAccountMobile(data, callback) {

  var merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(apiID);
  merchantAuthenticationType.setTransactionKey(transactionKey);

  var bankAccountType = new APIContracts.BankAccountType();
  bankAccountType.setAccountType(APIContracts.BankAccountTypeEnum.SAVINGS);
  bankAccountType.setRoutingNumber(data.routingNumber);
  //added code

  bankAccountType.setAccountNumber(data.accountNumber);
  bankAccountType.setNameOnAccount(data.nameOnAccount);

  var paymentType = new APIContracts.PaymentType();
  paymentType.setBankAccount(bankAccountType);

  var orderDetails = new APIContracts.OrderType();
  orderDetails.setInvoiceNumber(data.invoiceNumber);
  orderDetails.setDescription('Donation');


  var billTo = new APIContracts.CustomerAddressType();
  billTo.setFirstName(data.firstName);
  billTo.setLastName(data.lastName);
  billTo.setAddress(data.address);
  billTo.setCity(data.city);
  billTo.setState(data.state);
  billTo.setZip(data.zip);
  billTo.setCountry(data.country);

  var lineItem_id1 = new APIContracts.LineItemType();
  lineItem_id1.setItemId('1');
  lineItem_id1.setName('Amount');
  lineItem_id1.setQuantity('1');
  lineItem_id1.setUnitPrice(data.amount);

  var lineItemList = [];
  lineItemList.push(lineItem_id1);

  var lineItems = new APIContracts.ArrayOfLineItem();
  lineItems.setLineItem(lineItemList);

  var transactionRequestType = new APIContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setAmount(JSON.parse(lineItem_id1.unitPrice));
  transactionRequestType.setLineItems(lineItems);
  transactionRequestType.setOrder(orderDetails);
  transactionRequestType.setBillTo(billTo);

  var createRequest = new APIContracts.CreateTransactionRequest();
  createRequest.setRefId(data.invoiceNumber);
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  //pretty print request
  console.log(JSON.stringify(createRequest.getJSON(), null, 2));

  var ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());

  ctrl.execute(function () {

    var apiResponse = ctrl.getResponse();

    var response = new APIContracts.CreateTransactionResponse(apiResponse);

    //pretty print response
    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (response.getMessages().getResultCode() == APIContracts.MessageTypeEnum.OK) {
        if (response.getTransactionResponse().getMessages() != null) {
          emailReciptMobile(data, "Bank", response)
          // console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
          // console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
          // console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
          // console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
        }
        else {
          console.log('Failed Transaction.');
          if (response.getTransactionResponse().getErrors() != null) {
            // console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
            // console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
          }
        }
      }
      else {
        console.log('Failed Transaction. ');
        if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {

          // console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
          // console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
        }
        else {
          // console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
          // console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
        }
      }
    }
    else {
      console.log('Null Response.');
    }

    callback(response);
  });
}



module.exports = {
  chargeCreditCard, validateCreditCard, chargeCreditCardMobile, debitBankAccountMobile, validateBankAccount, debitBankAccount, emailRecipt
}