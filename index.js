const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());

// parse application/json
app.use(bodyParser.json());

const port = 3001;
const frontendPort = 4200;
const origin = `http://localhost:${frontendPort}`;

// the "database" (id "generated", name set somewhere on the UI)
let contacts = [
  {
    id: 1,
    name: "John contact",
    phone: "+26 1 334 34 123",
  },
  {
    id: 2,
    name: "Lia contact",
    phone: "+26 1 334 34 124",
  },
];

const sortContacts=(array)=>{
 return array.sort((a, b) => {
    return a.name - b.name;
  });
}


//validate if phone number is a duplicate
const isDuplicatePhoneNumber = (phoneNumber) => {
  const foundSavedPhoneNumber = contacts.find(
    (item) => item.phone === phoneNumber
  );
  if (foundSavedPhoneNumber) {
    return true;
  }
  return false;
};

// retrieve all contacts on a GET http://localhost:3001/contacts request
// filter contacts by name GET http://localhost:3001/contacts request
app.get("/contacts", (req, res) => {
  const filterName = req.query.filter;
  let filteredContacts = contacts;

  if (filterName)
    filteredContacts = contacts.filter((contact) => {
      const lowerCaseContactArrayName = contact.name.toLowerCase().trim();
      const lowerCaseFiltername = filterName.toLowerCase().trim();
      return lowerCaseContactArrayName.indexOf(lowerCaseFiltername) > -1;
    });

  const sortedFilteredContacts = sortContacts(filteredContacts)

  res.set("Access-Control-Allow-Origin", origin);
  res.json(sortedFilteredContacts);
});

// save a new contact to the contact table on a POST http://localhost:3001/contacts request
app.post("/contacts", (req, res, next) => {
  const lastcontact =
    0 < contacts.length ? contacts[contacts.length - 1] : null;
  const newcontactId = lastcontact ? lastcontact.id + 1 : 1;

  //validate if phone number is a duplicate
  const foundSavedPhoneNumber = isDuplicatePhoneNumber(req.body.phone);
  res.set("Access-Control-Allow-Origin", origin);

  if (foundSavedPhoneNumber) {
    next(
      "Error adding contact, phone number already exists for user named " +
        foundSavedPhoneNumber.name
    );
  } else {
    contacts.push({
      id: newcontactId,
      name: req.body.name,
      phone: req.body.phone,
    });
    const sortedContacts = sortContacts(contacts)
    res.json(sortedContacts);
  }
});

// updates an existing contact in the contact table on a PUT http://localhost:3001/contacts/[contactId] request
app.put("/contacts/:id", (req, res) => {
  const idFromParameter = req.params.id.toString();
  const modifiedcontactIndex = contacts.findIndex((element) => {
    return element.id.toString() === idFromParameter;
  });

  //validate if phone number is a duplicate
  const foundSavedPhoneNumber = isDuplicatePhoneNumber(req.body.phone);
  res.set("Access-Control-Allow-Origin", origin);

  if (foundSavedPhoneNumber) {
    next(
      "Error updating contact, phone number already exists for user named " +
        foundSavedPhoneNumber.name
    );
  } else {
    contacts[modifiedcontactIndex] = {
      ...contacts[modifiedcontactIndex],
      ...req.body,
    };
    const sortedContacts = sortContacts(contacts)
    res.json(sortedContacts);
  }
});

// deletes an existing contact in the contact table on a DELETE http://localhost:3001/contacts/[contactId] request
app.delete("/contacts/:id", (req, res) => {
  const idFromParameter = req.params.id.toString();

  contacts = contacts.filter((element) => {
    return element.id.toString() != idFromParameter;
  });
  res.set("Access-Control-Allow-Origin", origin);
  const sortedContacts = sortContacts(contacts)
  res.json(sortedContacts);
});

app.listen(port, () => {
  console.log(`Contact app listening at http://localhost:${port}`);
});
