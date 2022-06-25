const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// parse application/json
app.use(bodyParser.json());

const port = 3001;
const frontendPort = 4200;

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

const origin= `http://localhost:${frontendPort}`


// retrieve all contacts on a GET http://localhost:3001/contacts request
app.get("/contacts", (req, res) => {
  res.set("Access-Control-Allow-Origin", origin);
  res.json(contacts);
});

// save a new customer to the customer table on a POST http://localhost:3001/contacts request
app.post("/contacts", (req, res) => {
  const lastCustomer =
    0 < contacts.length ? contacts[contacts.length - 1] : null;
  const newCustomerId = lastCustomer ? lastCustomer.id + 1 : 1;

  contacts.push({
    id: newCustomerId,
    name: req.body.name,
    phone: req.body.phone,
  });
  res.set("Access-Control-Allow-Origin", origin);
  res.json(contacts);
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
