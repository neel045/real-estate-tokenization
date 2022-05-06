# Project Title

it's web application that allows users to list their properties on our website and tokenize them. tokens/shares of that property will be able to sell/buy by the users. any user can rent a property.

## Run Locally

Clone the project

```bash
  git clone https://github.com/neel045/ret
```

Go to the project directory

Install truffle dependencies

```bash
  npm install
```

Start Ganache and upload smart contract to Ganache

```bash
    truffle migrate
```

Install nodejs dependencies

```bash
  cd server
```

```bash
  npm install
```

Start the server

```bash
  node server.js
```

Install react dependencies

```bash
  cd client
```

```bash
  npm install
```

Start the server

```bash
  npm start
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in server folder.

`NODE_ENV` use "development" for development purpose

`PORT`

`DATABASE` URI of mongoDB Database

`DATABASE_PASSWORD` password of database
