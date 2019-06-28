const Nexmo = require('nexmo');
var XLSX = require('xlsx');
var path = require('path');
var http = require('http');
var dotenv = require('dotenv').config()
var RateLimiter = require('limiter').RateLimiter;
const glob = require('glob');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;  

var agent = new http.Agent({
  keepAlive: true,
  maxSockets: 1,
  keepAliveMsecs: 3000
})

let salida = []
let llenar= []
let format =[]
let national = []
let result = []
  
const nexmo = new Nexmo({
apiKey: process.env.apiKey,
apiSecret:process.env.apiSecret

})

glob(__dirname + '/**/*.xlsx', {}, (err, files)=>{

var wb = XLSX.readFile(files.toString());
data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header:1});

let rows_length=data.length;
let columns = data[0];

	let leng = (columns.length);

    for (i = 0; i < leng; i++) { 

    		if (columns[i] === 'To'){

                if (typeof(process.argv[2]) != 'undefined'){
                rows_length = process.argv[2]
                    console.log('Reading the first ', rows_length + ' values')
                  } 

    			     for (j=1; j<rows_length; j++) {
    				      result[j] = data[j][i];
    	           }

    		}
		   
    }

//to avoid undefined
result[0]=result[1];

//remove duplicated results
function removeDuplicates(num) {
  let x,
      len=num.length,
      out=[],
      obj={};
 
  for (x=0; x<len; x++) {
    obj[num[x]]=0;
  }
  for (x in obj) {
    out.push(x);
  }
  return out;
  console.log(out)
}


var final = removeDuplicates(result);
 var limiter = new RateLimiter(27, 'second', true);
const csvWriter = createCsvWriter({
    path: 'out.csv',
    append: true
});

final.forEach((item, index) => {
    limiter.removeTokens(1, () => {

      nexmo.numberInsight.get({level: 'advancedSync', number: item}, (error, response) => {
       if (error) {
         console.error(error)
       } else {

                      llenar[index, 0]=(response.status_message)
                      format[index, 0]=(response.international_format_number)
                      national[index, 0]=(response.reachable)
                      let record = llenar.concat(format,national);
                      console.log(record)

                                function chunkArray(myArray, chunk_size){
                                var index = 0;
                                var arrayLength = myArray.length;
                                var tempArray = [];
                        
                                  for (index = 0; index < arrayLength; index += chunk_size) {
                                   myChunk = myArray.slice(index, index+chunk_size);
                                    tempArray.push(myChunk);
                                    }


                                      return tempArray;
                                }     

                      let resultadin = chunkArray(record, 3);
                      console.log('This is', resultadin);

               

                  csvWriter.writeRecords(resultadin) .then(() => {
                  //console.log('...Done');
                  });

         
      
                }
          })
       

        })  
 }) 
})



      
         
       }
     })
       

   })



  
 }) 


})


