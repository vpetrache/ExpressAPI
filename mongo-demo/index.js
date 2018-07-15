const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/playground', { useNewUrlParser: true })
    .then(() => console.log('Connected'))
    .catch((err) => console.error(err));

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 10,
        maxlengthL: 250,
        required: true
    },
    category: {
        type: String,
        enum: ['web', 'mobile', 'network'],
        required: true,
        lowercase: true,
        // uppercase:true,
        trim: true
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            isAsync: true,
            validator: function (v, callback) {
                setTimeout(() => {
                    let result = v && v.length > 0;
                    callback(result);
                }
                    , 1000)
            },
            message: 'A course should have at least a tag.'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function () {
            return this.isPublished
        },
        get: v => Math.round(v),
        set: v=> Math.round(v)
    }
});

const Course = mongoose.model('Course', courseSchema);

const course = new Course({
    name: 'Test Course',
    category: 'WEB',
    author: "vali petrache",
    tags: ["test", "learn", "angular", "mongo"],
    isPublished: true,
    price: '15'
})

async function createCourse() {
    try {
        // await course.validate();
        const result = await course.save();
        console.log(result);
    }
    catch (ex) {
        for(f in ex.errors){
            console.log(ex.errors[f].message);
        }
    }
};

// createCourse();
getCourses();

async function getCourses() {
    const pageNumber = 2;
    const pageSize = 10;

    let result = await Course
        // .find({})
        //starts with va
        // .find({ author: /^vali/ })
        //ends with li
        // .find({ author: /petrach$/i })
        //contains ali case in
        // .find({ author: /.*ali.*/i })
        .find({ author: /Petrache$/i })
        .skip()
        .limit(pageSize)
        .sort({ name: -1 })
        .select({ name: 1, tags: 1 })
    // .count();
    console.log(result);
}

async function updateCourse(id) {
    //Approach: Query first
    //findbyid()
    //modify properties
    //save()

    // const course = await Course.findById(id);
    // if(!course){
    //     return console.log('course not found');
    // }
    // if(course.isPublished){ return;}

    // course.isPublished = true;
    // course.author = 'Another author';

    // course.set({
    //     isPublished: true,
    //     author: 'Another author'
    // })

    // const result = await course.save().then((r)=>{
    //     console.log('updated ',r);
    // })

    //Approach: Update first
    //Update directly
    //optional: get the updated document

    // const result = Course.update({_id:id},{
    //     $set:{
    //         author: 'Mosh',
    //         isPublished: false
    //     }
    // })

    // console.log(result);

    const result = Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Mosh',
            isPublished: false
        }
    }, { new: true })

    console.log(result);

}

async function removeCourse() {
    const result = await Course.deleteOne({ isPublished: false });
    //    const result = await Course.findByIdAndRemove(id);
    console.log(result)
}

// createCourse();
// getCourses();
// updateCourse('5b425822e8da5a03c0b412b7');
