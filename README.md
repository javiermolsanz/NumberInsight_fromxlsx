# NumberInsight-fromxlsx

# Installation
cd to the directory of the project and then run npm install 

# Usage
1 Fill out the .env file with your own API key and secret

2. Move the .xlsx file that you want to be read inside of the main directory of the project. Make sure that the column's header where all the numbers are listed is called 'To'

3. Running the script
    3.1 If you want the whole file to be read simply run npm integration.js
    3.2 if you want to limit the read to the first "x" results, run npm integration.js x, where x is the number of results to       be read
4. A csv file will be generated with the numbers listed in international format and reachability status
