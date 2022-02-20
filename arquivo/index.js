const express = require('express');


/**
 * @tipos de Paramaetros
 * Route Params => Identificar um recurso editar/deletar/buscar
 * Query Params => Paginação, filtros, ordenação
 * Request Body => Dados para criação ou atualização de um registro
 */

const app = express();

app.use(express.json());

app.get('/',(request, response) => {
    return response.json({message: 'Health Check'});
})

app.get('/courses',(request, response) => {
    const query = request.query
    console.log(query)
    return response.json(['Curso 1','Curso 2','Curso 3','Curso 5','Curso 10']);
})

app.post('/courses',(request, response) => {
    const body = request.body
    console.log(body)
    return response.json(['Curso 1','Curso 2','Curso 3','Curso 5','Curso 10','Curso 11']);
})

app.put('/courses/:id',(request, response) => {
    const {id} = request.params;
    console.log(id);
    return response.json(['Curso 6','Curso 2','Curso 3','Curso 5','Curso 10','Curso 11']);
})

app.delete('/courses/:id',(request, response) => {
    return response.json(['Curso 2','Curso 3','Curso 5','Curso 10','Curso 11']);
})

app.listen(3333)