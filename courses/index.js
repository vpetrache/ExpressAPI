const express = require('express');
const Joi = require('joi');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const courses = [{
    id: 1,
    name: "course1"
},
{
    id: 2,
    name: "course2"
},
{
    id: 3,
    name: "course3"
}];

app.get('/', (req, res) => {
    res.status(404).send("Page not found");
})

app.get('/api/courses', (req, res) => {
    res.send(courses);
})

//req.params and query params
//http://localhost:3000/api/courses/3/221?test=int&null=false
app.get('/api/courses/:id/:params', (req, res) => {
    console.log(req.params);
    console.log(req.query);
    res.send(courses[req.params.id - 1])
});

app.get('/api/courses/:id/', (req, res) => {
    let course = courses.find(x => { return x.id === parseInt(req.params.id) });
    if (!course) {
        return res.status(404).send(`Course with id=${req.params.id} was not found!`)
    }
    else {
        res.send(course);
    }
});

app.post('/api/courses', (req, res) => {
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    const { error } = validateCourseName(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //manual validation
    // if (!req.body.name || req.body.name.length < 3) {
    //     res.status(400).send("Invalid data sent");
    //     return;
    // }
    courses.push(course);
    return res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    //Lookup the course
    //If not exist, return 404
    const course = courses.find(x => { return x.id.toString() === req.params.id })
    if (!course) {
        return res.status(404).send(`Course with id=${req.params.id} was not found!`)
    }
    //Validate
    //If invalid, return 400

    //object destruction
    const { error } = validateCourseName(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //Update course
    //Return the update course
    course.name = req.body.name;
    return res.send(course);

});

app.delete('/api/courses/:id', (req, res) => {
    //if doesn't exists 404
    const course = courses.find(x => { return x.id.toString() === req.params.id })
    if (!course) {
        return res.status(404).send(`Course with id=${req.params.id} was not found!`);
    }
    // Delete
    const index = courses.indexOf(course);
    console.log(index);
    courses.splice(index, 1);

    // return courses list
    res.send(courses);
})

app.listen(port, () => { console.log(`Listening on port ${port}..`) });

function validateCourseName(course) {
    const schema = {
        name: Joi.string().min(3).max(10).required()
    };
    return Joi.validate(course, schema);
}