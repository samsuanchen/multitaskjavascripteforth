var jeforthVM=require('./jeForthVM.js').jeForthVM // get the js file
var VM=new jeforthVM() // get the VM
VM.tagging=1, VM.type=function(msg){ // set opption and output function
	process.stdout.write(msg)
}
eval=VM.exec
eval('code . function(){print(" "+dataStack.pop())}end-code')		// define .
eval('5 .')															// test .
eval('code token function(){dataStack.push(nextToken())}end-code')		// define token
eval('token five .')													// test token
eval('code + function(){'									   +'\n'+	// define +
	 '  var t=dataStack.pop();dataStack[dataStack.length-1]+=t'+'\n'+
	 '} end-code')
eval('123 432 + . token abc token def + .')								// test +