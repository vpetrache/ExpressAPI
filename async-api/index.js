
console.log('Before');

// //callback Hell
// getUser(1, function (user) {
//     console.log(user);
//     getRepositories(user, function(repos){
//         console.log(repos);
//     })
// });

//fix callback hell

// getUser(1, getRepositories)

// function displayCommits(commits){
//     console.log(commits);
// }
// function getCommits(repos){
//     getCommits(repo, displayCommits)
// }

// function getRepositories(user){
//     getRepositories(user.gitUserName, getCommits)
// }

// getUser(1)
//     .then(user => getRepositories(user.gitUserName))
//     .then(repos => getCommits(repos[0]))
//     .then(commits => console.log(commits))
//     .catch(err => console.log(err.message));

//Async-decorator Await

async function displayCommits() {
    try{
        const user = await getUser(1);
        const repositories = await getRepositories(user.gitUserName);
        const commits = await getCommits(repositories[0]);
        console.log(commits);
    }
    catch(err){
        console.log(err);
    }

}
displayCommits();

console.log('After');

function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Connecting to Github API')
            resolve({ id: id, "gitUserName": "vpetrache" });
            // reject(new Error('get user returned an error'));
        }, 2000)
    })
}

function getRepositories(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Getting the repos for ${username}`);
            resolve(['repo1', 'repo2', 'repo3']);
        }, 2000)
    })
}

function getCommits(repo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Getting the commits for ${repo}`);
            resolve(['commit', 'commit1', 'commit2']);
        }, 2000)
    })
}