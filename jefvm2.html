// <script>
'uses strict'
var fs=require('fs') // file system, fs.readFileSync() could be used
var jeForthVM=require('./jeForthVM.js').jeForthVM
var jef=new jeForthVM()
var buf=''
var clrBuf=function(){
	buf.split(/\r?\n/).map(function(L){
		if (L.length && L!=='<inp></inp><ok> ok</ok>')
			console.log(L)
	})
	buf=''
}
jef.directOut={}
jef.type=function(x){
	buf+=x
	if (buf.match(/\n$/))
		clrBuf()
}
jef.tagging=1
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
jef.exec(fs.readFileSync(dir+'/topics/multiTask1').toString())
if (buf)
	clrBuf()
// </script>