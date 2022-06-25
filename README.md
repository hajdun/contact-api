# Description

This is a small mock api to manage contacts (name, phone number). It has no database, just an array being deleted on service stop.

# Details

## Run

`npm run start`

## Data structure

`{
    id: number // auto-generated
    name: string
    phone: string
}`

## Endpoints

```
GET /contacts

POST /contacts

PUT /contacts/:id

DELETE /contacts/:id
```