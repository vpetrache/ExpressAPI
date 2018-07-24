async function sendCustomerEmail(){
    const customer = await getCustomer(1);
    console.log(customer);
    if(customer.isGold){
      const movies = await getTopMovies();
      console.log('Top movies.js: ', movies);
      await sendEmail(customer.email, movies);
    }
}
sendCustomerEmail();

function getCustomer(id){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve({
        id: 1,
        name: "Valentin Petrache",
        isGold: true,
        email: 'vpetrache@outlook.com'
      })
    },4000)
  })
}

function getTopMovies(){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(['movie1','movie2','movie3'])
    }, 4000)
  })
}

function sendEmail(email, movies){
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      console.log(`Sent ${movies} to ${email}`)
      resolve(1);
    }, 4000)
  })
}