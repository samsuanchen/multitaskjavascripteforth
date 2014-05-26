// <script>
console.log('begin html')
'uses strict'
var fs=require('fs') // file system, fs.readFileSync() could be used
var jeForthVM=require('./jeForthVM.js').jeForthVM
var jef=new jeForthVM()
var buf='', out=''
var clrBuf=function(){
	buf.split(/\r?\n/).map(function(L){
		if (L.length && L!=='<inp></inp><ok> ok</ok>') {
			if (jef.directOut.checked)
				console.log(L)
			else
				out+=L+'\n'
		}
	})
	buf=''
}
jef.type=function(x){
	buf+=x
	if (buf.match(/\n$/))
		clrBuf()
}
jef.directOut={} // jef.tagging=1
jef.exec(
	'code . function(){ print(" "+dStk.pop()) }end-code'+	'\n'+
	'code + function(){ var x=dStk.pop(); dStk[dStk.length-1]+=x }end-code'
)
jef.exec('2 3 4 + + .')
var dir=typeof nwDispatcher==='object'?'..':'.'
jef.exec(fs.readFileSync(dir+'/topics/basic01').toString())
jef.exec(fs.readFileSync(dir+'/topics/basic02').toString())
jef.exec(fs.readFileSync(dir+'/topics/default').toString())
jef.exec(fs.readFileSync(dir+'/topics/jsFunctionTest').toString())
jef.exec(fs.readFileSync(dir+'/topics/vocTest').toString())
jef.exec(fs.readFileSync(dir+'/topics/multiTask').toString())
if (buf) clrBuf()
if (out) fs.writeFileSync('./jefVM2.txt',out)
console.log('./jefVM2.txt length',out.length)
jef.directOut.checked=1
jef.exec(fs.readFileSync(dir+'/topics/multiTask1').toString())
// </script>