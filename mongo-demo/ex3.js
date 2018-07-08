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
    let result = await Course
        .find({ isPublished: true })
        .or([{ price: { $gte: 15 } }, { name: /.*by.*/i }])
        .sort('-price')
        .select('name author price')
    console.log(result);
}

getCourses();