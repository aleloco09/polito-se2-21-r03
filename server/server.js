const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware

const dao=require("./dao");
const PORT = 3001;

app = new express();
app.use(morgan('dev'));
app.use(express.json());



/****** API *****
 * *****************************************************
 *  GET GET /api/tasksGet/user=:user
 *              retrieves a list of tasks for a given user
 *  GET /api/filters/:filter/tasks 
 *              retrives a list of tasks that 
 *              fullfill a given filter
 *              // Verify if the api is correct //
 *  GET /api/tasks/:id 
 *              retrieve a task, given its id
 *  POST /api/tasks 
 *              create a new task
 *  PUT /api/tasks/
 *              update an existing task except the id
 *              by providing all relevant information
 * 
 *  PUT /api/tasks/id=:id&completed=:completed
 *              mark an existing task 
 *              as completed/uncompleted
 * 
 *  DELETE /api/tasks/:id
 *              delete an existing task given it's id
 * *****************************************************
 * */ 

// {description:, important:, private:, deadline:}

let isLoggedIn = true;

app.get('/api/tasksGet/user=:user',  [    check('user').isInt({min:0})], isLoggedIn,async (req, res) => {
    await dao.getAllTasks(req.params.user)
    .then(tasks => res.json(tasks))
    .catch(()=> res.status(500).json("Database unreachable"));
});
app.get('/api/filters/filter=:filter/user=:user/tasks', isLoggedIn, async (req, res) => {
    await dao.getFilteredTasks(req.params.filter, req.params.user)
    .then(tasks => res.json(tasks))
    .catch(()=> res.status(500).json("Database unreachable"));
});

app.get('/api/tasks/:id',[
    check('id').isInt({min:0})
],isLoggedIn, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()})
    }
    const id = req.params.id;
    await dao.getTask(id).then(task => res.json(task))
    .catch(()=> res.status(500).json("Database unreachable"));
});

app.post('/api/tasks', [
    check('description').isString(),
    check('important').isInt({min:0, max:1}),
    check('private').isInt({min:0, max:1}),
    check('deadline').isLength({min:16,max:16}).matches(/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/),
    //isDate({format: 'YYYY-MM-DD HH:mm', strictMode: true}),
    check('user').isInt({min:0})
],isLoggedIn, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        
        return res.status(422).json({errors: errors.array()})
    }
    const task = {
        description: req.body.description,
        important: req.body.important,
        private: req.body.private,
        deadline: req.body.deadline,
        user:req.body.user,
    };
    try {
        await dao.createTask(task);
        res.status(201).end();
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: `Database error during the creation of task ${task.description}.` });
    }

});


app.post('/api/tickets', [
    check('ticketId').isInt({min:0}),
    check('counterId').isInt({min:0}),
    check('position').isInt({min:0}),
    check('ticketNumber').isInt({min:0}),
    check('serviceTypeId').isInt(),
    check('ticketNumber').isInt(),
    check('creationDate').isLength({min:16,max:16}).matches(/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/),
    //isDate({format: 'YYYY-MM-DD HH:mm', strictMode: true}),
    check('ewt').isFloat({min:0})
],isLoggedIn, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        
        return res.status(422).json({errors: errors.array()})
    }
    const task = {
        ticketId: req.body.ticketId,
        counterId: req.body.counterId,
        position: req.body.position,
        ticketNumber: req.body.ticketNumber,
        creationDate:req.body.creationDate,
        ewt:req.body.ewt,
    };
    try {
        await dao.createTicket(ticket);
        res.status(201).end();
    } catch (err) {
        console.log(err)
        res.status(503).json({ error: `Database error during the creation of ticket ${ticket.ticketId}.` });
    }

});

app.put('/api/tasks',[
    check('id').isInt({min:0}),
    check('description').isString(),
    check('important').isInt({min:0, max:1}),
    check('private').isInt({min:0, max:1}),
    check('deadline').isLength({min:16,max:16}).matches(/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/),
], isLoggedIn, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()})
    }
    const task = {
        id: req.body.id,
        description: req.body.description,
        important: req.body.important,
        private: req.body.private,
        deadline: req.body.deadline,

    };
    try {
        await dao.updateTask(task);
        res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the update of task ${task.description}.` });
    }

});

app.put('/api/tickets',[
    check('ticketId').isInt({min:0}),
    check('counterId').isInt({min:0}),
    check('position').isInt({min:0}),
    check('ticketNumber').isInt({min:0}),
    check('serviceTypeId').isInt(),
    check('ticketNumber').isInt(),
    check('creationDate').isLength({min:16,max:16}).matches(/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/),
    //isDate({format: 'YYYY-MM-DD HH:mm', strictMode: true}),
    check('ewt').isFloat({min:0})
],isLoggedIn, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        
        return res.status(422).json({errors: errors.array()})
    }
    const task = {
        ticketId: req.body.ticketId,
        counterId: req.body.counterId,
        position: req.body.position,
        ticketNumber: req.body.ticketNumber,
        creationDate:req.body.creationDate,
        ewt:req.body.ewt,
    };
    try {
        await dao.handleTicket(ticket);
        res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the handle of ticket ${ticket.ticketId}.` });
    }

});

app.put('/api/tasks/id=:id&completed=:completed',[
    check('id').isInt({min:0}),
    check('completed').isInt({min:0,max:1}),
    
], isLoggedIn, async (req, res) => {
    console.log(req)
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()})
    }
    const task = {
        id: req.params.id,
        completed: req.params.completed
    };
    try {
        await dao.completeTask(task);
        res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the update of task ${task.description}.` });
    }

});

app.delete('/api/tasks/:id',[
    check('id').isInt({min:0})
], isLoggedIn, async (req,res)=>{
    const errors =validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()})
    }
    const task = { id: req.params.id};

    try {
        await dao.deleteTask(task);
        res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the delete of task ${task.id}.` });
    }
});

/*app.delete('/api/service_type_ticket/:ticketId',[
    check('ticketId').isInt({min:0})
], isLoggedIn, async (req,res)=>{
    const errors =validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()})
    }
    const tickets = { ticketId: req.params.ticketId};

    try {
        await dao.deleteTicket(ticket);
        res.status(201).end();
    } catch (err) {
        res.status(503).json({ error: `Database error during the delete of ticket ${ticket.ticketId}.` });
    }
});*/

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));