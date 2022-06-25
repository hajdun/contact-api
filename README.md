# Description

This is a small mock api to manage contacts (name, phone number). It has no database, just an array being (mostly) deleted on service stop.

# Details

## Run

`npm run start`

## Ports

It runs on `3001` by default. Client CORS is configured for `http://localhost:4200`. 
So it looks like this: `http://localhost:3001/contacts`

## Data structure

```
{
    id: number // auto-generated
    name: string
    phone: string
}
```

## Endpoints

```
GET /contacts

POST /contacts

PUT /contacts/:id

DELETE /contacts/:id
```