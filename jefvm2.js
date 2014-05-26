// <script>
'uses strict'
var fs=require('fs') // for later using fs.readFileSync() and fs.writeFileSync()
var jeForthVM=require('./jeForthVM.js').jeForthVM
var VM=new jeForthVM()
var buf='', out=''
var clrBuf=function(){
	buf=buf.replace(/\r?\n(<inp><\/inp><ok> ok<\/ok>)?\r?\n/g,'\n')
	if (VM.directOut.checked)	process.stdout.write(buf)
	else 						out+=buf
	buf=''
}
VM.type=function(x){ if (!x) return
	buf+=x
	if (VM.directOut.checked||buf.match(/\n$/))
		clrBuf()
}
VM.directOut={} // jef.tagging=1
VM.exec('code . function(){ print(" "+dStk.pop()) }end-code\n'+
		 'code + function(){ var x=dStk.pop(); dStk[dStk.length-1]+=x }end-code')
VM.exec('2 3 4 + + .')
var dir=typeof nwDispatcher==='object'?'..':'.'
VM.exec(fs.readFileSync(dir+'/topics/basic01').toString())
VM.exec(fs.readFileSync(dir+'/topics/basic02').toString())
VM.exec(fs.readFileSync(dir+'/topics/default').toString())
VM.exec(fs.readFileSync(dir+'/topics/jsFunctionTest').toString())
VM.exec(fs.readFileSync(dir+'/topics/vocTest').toString())
VM.exec(fs.readFileSync(dir+'/topics/multiTask').toString())
if (out+=buf) fs.writeFileSync('./jefVM2.txt',out)
console.log('write to file ./jefVM2.txt of length',out.length)
VM.directOut.checked=1
VM.exec(fs.readFileSync(dir+'/topics/multiTask1').toString())
// </script>