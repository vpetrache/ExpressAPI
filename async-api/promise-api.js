
// const p = Promise.resolve(1);
// const p = Promise.reject(new Error("Test error message"));
// p.then(res=> console.log(res)).catch(err=> console.log(err));


const p1 = new Promise((resolve, reject)=>{
        setTimeout(()=>{
            console.log("Async operation 1....");
            resolve(1);
        }, 2000)
});

const p2 = new Promise((resolve)=>{
    setTimeout(()=>{
        console.log('Async operation 2...');
        resolve(2);
    }, 1000)
})

Promise.all([p2,p1]).then(result => console.log(result))
.catch(err => console.log(err.message));

Promise.race([p2,p1]).then(result => console.log(result))
.catch(err => console.log(err.message));