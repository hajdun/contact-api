const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');

app.use(cors())

// parse application/json
app.use(bodyParser.json());

const port = 3001;
const frontendPort = 4200;
const origin= `http://localhost:${frontendPort}`

// the "database" (id "generated", name set somewhere on the UI)
let contacts = [
  {
    id: 1,
    name: "John Customer",
    phone: "+26 1 334 34 123",
  },
  {
    id: 2,
    name: "Lia Customer",
    phone: "+26 1 334 34 124",
  },
];




// retrieve all contacts on a GET http://localhost:3001/contacts request
app.get("/contacts", (req, res) => {
  res.set("Access-Control-Allow-Origin", origin);
  res.json(contacts);
});

// save a new customer to the customer table on a POST http://localhost:3001/contacts request
app.post("/contacts", (req, res, next) => {
  const lastCustomer =
    0 < contacts.length ? contacts[contacts.length - 1] : null;
  const newCustomerId = lastCustomer ? lastCustomer.id + 1 : 1;

//validate if phone number is a duplicate
const foundSavedPhoneNumber=contacts.find(item=>item.phone===req.body.phone)
res.set("Access-Control-Allow-Origin", origin);

if(foundSavedPhoneNumber){
  next("Error adding contact, phone number already exists for user named " + foundSavedPhoneNumber.name)
} else {
  contacts.push({
    id: newCustomerId,
    name: req.body.name,
    phone: req.body.phone,
  });

  res.json(contacts);
}

});

// updates an existing customer in the customer table on a PUT http://localhost:3001/contacts/[customerId] request
app.put("/contacts/:id", (req, res) => {
  const idFromParameter = req.params.id.toString();
  const modifiedCustomerIndex = contacts.findIndex((element) => {
    return element.id.toString() === idFromParameter;
  });

  contacts[modifiedCustomerIndex] = {
    ...contacts[modifiedCustomerIndex],
    ...req.body,
  };
  res.set("Access-Control-Allow-Origin", origin);
  res.json(contacts);
});

// deletes an existing customer in the customer table on a DELETE http://localhost:3001/contacts/[customerId] request
app.delete("/contacts/:id", (req, res) => {
  const idFromParameter = req.params.id.toString();

  contacts = contacts.filter((element) => {
    return element.id.toString() != idFromParameter;
  });
  res.set("Access-Control-Allow-Origin", origin);
  res.json(contacts);
});

app.listen(port, () => {
  console.log(`Contact app listening at http://localhost:${port}`);
});
