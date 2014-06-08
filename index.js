var jeForthVM=require('./jeForthVM.js').jeForthVM	//-- method 2 of involving jeForthVM.js --//
var vm=new jeForthVM()								// get the jeForth VM
vm.tagging=1										// set tagging opption
vm.type=function(s){process.stdout.write(s)}		// setup the output function for jeForth VM
var tib=''											// input line buffer
function processLine(Line){							// define a function to process a line
	tib+=Line; var m=tib.match(/.*?code\s/)			// collect input line into buffer
	if (m&&!tib.substr(m[0].length).match(/end-code/))	// check if code ... end-code given
		return										// wait until end-code given
	vm.exec(tib),tib=''								// give source codes or test commands to VM
}
require('readline')									// setup readline interface
.createInterface({
	input: process.stdin, output: process.stdout	// use stdin and stdout
 })
.on('line', processLine)							// activate console 