const express = require("express");
const { v4: uuidV4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];

//Middleware

function verifyIfExistAccountCPF(request, response, next){
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ message: "customer not found" });
  }

  request.customer = customer

  return next()
  

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

app.get("/statement",verifyIfExistAccountCPF, (request, response) => {
  const{customer} = request

  return response.status(201).json(customer.statement);
});

app.post("/deposit", verifyIfExistAccountCPF, (request, response)=>{
  const {description, amount} = request.body

  const {customer} = request

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'credit'
  }

  customer.statement.push(statementOperation)

  return response.status(201).send()
})

app.listen(3333);
