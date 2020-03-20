const Nexmo = require('nexmo');
var XLSX = require('xlsx');
var path = require('path');
var http = require('http');
var dotenv = require('dotenv').config()
var RateLimiter = require('limiter').RateLimiter;
const glob = require('glob');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;  

var agent = new http.Agent({
  keepAlive: true,
  maxSockets: 1,
  keepAliveMsecs: 3000
})

let resultado = []
let result = []
let internat = [];
let portability = [];
let current_carrier =[];
  
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

//remove duplicated results just in case
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
  header: [
      {id: 'reachable', title: 'reachable'},
      {id: 'number', title: 'number'},
      {id: 'ported', title: 'ported'},
      {id: 'Network', title: 'Network'}

  ]
});


    limiter.removeTokens(1, () => {

     function Checkallnumbers(result, finished){

  for (let i=0; i< result.length; i++){
    nexmo.numberInsight.get({level: 'advancedSync', number: result[i]}, (err, resp)=>{

      if (err){console.log(err)}
      else{
        resultado.push(resp.reachable)
        internat.push(resp.international_format_number)
        portability.push(resp.ported)
        current_carrier.push(resp.current_carrier.network_code)
        //return finished()
        if (resultado.length === result.length){return finished()}
      }
    });
  }

}

Checkallnumbers(result,finished)

function finished(){
  let newArr = result.map((val, i, result) => {
    return {
      number: internat[i],
      reachable: val,
      ported: portability[i],
      Network: current_carrier[i]
    };
  });

  csvWriter.writeRecords(newArr) .then(() => {
    console.log(newArr)
    console.log('...Done');
    });
  //console.log(newArr)
}
       

        })  
 
})

