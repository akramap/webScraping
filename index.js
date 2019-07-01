// The simplified HTTP request client 'request' with Promise support
const rp = require('request-promise');
// Fast, flexible, and lean implementation of core jQuery designed specifically for the server.
const cheerio = require('cheerio');
// This utility allows you to render unicode-aided tables on the command line from your node.js scripts.
const Table = require('cli-table');

const users=[];
const table = new Table({
    head: ['username','💌','challenges'],
    colWidths: [15,5,10]
})


const options= {
    url:'https://www.freecodecamp.org/forum/directory_items?period=weekly&order=likes_received&_=1561627256826',
    json:true
};

rp(options)
.then((data)=>{
    
    const userData=[];
    for(let user of data.directory_items){
        userData.push({name:user.user.username,likes_received:user.likes_received});
    }
    process.stdout.write('loading');
    getChallengesCompletedAndPushToUserArray(userData);
}).catch((err)=>{
       console.log(err);
   });


   function getChallengesCompletedAndPushToUserArray(userData){

       var i=0;

       function next() {
           if(i < userData.length){

               var options={
                   url:'https://www.freecodecamp.org/' + userData[i].name,
                   transform: body => cheerio.load(body)
               }
               rp(options)
               .then(function($){
                process.stdout.write('.');
                // check for user account existence.
                const fccAccount = $('h1.landing-heading').length == 0;
                // if account exist check for completed tasks.
                const challengesPassed = fccAccount ? $('tbody tr').length : 'unknown';
                table.push([userData[i].name,userData[i].likes_received,challengesPassed]);                
                ++i;
               return next();
            })
           }else{
               printData();
           }
       }
       return next();
   }

   function printData(){
       console.log('😃');
       console.log(table.toString());
       
   }

