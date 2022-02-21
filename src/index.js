const express = require("express");
const { v4: uuidV4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];

//Middleware

function verifyIfExistAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ message: "customer not found" });
  }

  request.customer = customer;

  return next();
}

function getBalance(statement) {
  //pegar varias informacoes e transformar em uma unica coisa
  //acc = acumulador , responsavel por adicionar e remover o objeto
  //operation = tipo de operacao, debito ou credito
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === "credit") {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0); // inicializador do reduce

  return balance;
}

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some(
    (customers) => customers.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response
      .status(400)
      .json({ error: "Customer already exists! - cpf: " + cpf });
  }

  customers.push({
    cpf,
    name,
    id: uuidV4,
    statement: [],
  });

  return response.status(201).send();
});

//app.use(verifyIfExistAccountCPF)

app.get("/statement", verifyIfExistAccountCPF, (request, response) => {
  const { customer } = request;

  return response.status(201).json(customer.statement);
});

app.post("/deposit", verifyIfExistAccountCPF, (request, response) => {
  const { description, amount } = request.body;

  const { customer } = request;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

app.post("/withdraw", verifyIfExistAccountCPF, (request, response) => {
  const { amount } = request.body;

  const { customer } = request;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return response.status(400).json({ error: "Insufficient funds!" });
  }
  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit",
  };

  customer.statement.push(statementOperation);

  return response.status(201).send()
});

app.get("/statement/date", verifyIfExistAccountCPF, (request, response) => {
  const { customer } = request;
  const {date} = request.query;

  const dateFormat = new Date(date + "00:00");

  const statement = customer.statement.filter 

  return response.status(201).json(customer.statement);
});


app.listen(3333);
