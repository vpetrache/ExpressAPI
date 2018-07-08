const p = new Promise(function (resolve, reject) {
    //async work
        //..
    setTimeout(()=>{
        // resolve(1);
        reject(new Error('error message'));
    },2000)

});

p.then((result)=>{
    console.log(result)
}).catch(error=> console.log(error.message))