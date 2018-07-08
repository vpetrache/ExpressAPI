const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected'))
    .catch((err) => console.error(err));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

const course = new Course({
    name: "Angular.Js course",
    author: "vali petrache",
    tags: ["test", "learn", "angular", "mongo"],
    isPublished: true
})

async function createCourse() {
    const result = await course.save();
    console.log(result);
};

async function getCourses() {
    const pageNumber =2;
    const pageSize = 10;

    let result = await Course
        // .find({})
        //starts with va
        // .find({ author: /^vali/ })
        //ends with li
        // .find({ author: /petrach$/i })
        //contains ali case in
        // .find({ author: /.*ali.*/i })
        .find({author: /Petrache$/i})
        .skip()
        .limit(pageSize)
        .sort({ name: -1 })
        .select({ name: 1, tags: 1 })
        // .count();
    console.log(result);
}

async function updateCourse(id){
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

     const result = Course.findByIdAndUpdate(id,{
        $set:{
            author: 'Mosh',
            isPublished: false
        }
    }, {new : true})

    console.log(result);

}

async function removeCourse(){
   const result = await Course.deleteOne({ isPublished:false});
//    const result = await Course.findByIdAndRemove(id);
   console.log(result)
}

// createCourse();
// getCourses();
// updateCourse('5b425822e8da5a03c0b412b7');

removeCourse();