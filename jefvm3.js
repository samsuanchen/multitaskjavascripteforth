var jeforthVM=require('./jeForthVM.js').jeForthVM						// get jeForthVM.js
var VM=new jeforthVM() 													// get the VM
VM.tagging=1, VM.type=function(msg){ // set opption and output function for VM
	process.stdout.write(msg)
}
VM.exec('code . function(){print(" "+dataStack.pop())}end-code')		// define .
VM.exec('5 .')															// test .
VM.exec('code token function(){dataStack.push(nextToken())}end-code')	// define token
VM.exec('token five .')													// test token
VM.exec('code + function(){'									  +'\n'+// define +
		'  var t=dataStack.pop();dataStack[dataStack.length-1]+=t'+'\n'+
		'} end-code')
VM.exec('123 432 + . token abc token def + .')							// test +