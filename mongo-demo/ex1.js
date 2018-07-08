const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mongo-exercises').then(() => console.log('Connected to database')).catch((err) => console.error('error connecting: ' + err));

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
    let result = await Course
        .find({ name: /^node.js/i, isPublished: true })
        .limit(10)
        //1 for ascending -1 for descending or '-$key'
        .sort('author')
        .select({ name: 1, author: 1 });
    return result;
}

console.log(getCourses());