const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mongo-exercises')
    .then(() => console.log('Connected'))
    .catch((err) => console.error(err));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: Number
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
    let result = Course.find({isPublished:true, tags:{
        $in: ['frontend', 'backend']
    }})
    //with or
    //.or([{tags: 'frontend'}, {tags:'backend}])
    .sort('-price')
    .select({name:1, author:1})
    return result;
}

getCourses().then((r)=>{console.log(r)});
