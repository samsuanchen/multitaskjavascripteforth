/* <script>
if (typeof jeForthVM==='undefined' && typeof require==='function')
	var jeForthVM=require('./jeForthVM.js').jeForthVM
  </script> */
// <script>
'uses strict'
var buf=''
if (typeof jeForthVM==='undefined' && typeof require==='function') {
	var jeForthVM=require('./jeForthVM.js').jeForthVM
	var fs=require('fs') // file system, fs.readFileSync() could be used
}
var jef=new jeForthVM()
var clrBuf=function(){
	buf.split(/\r?\n/).map(function(L){
		if (L.length && L!=='<inp></inp><ok> ok</ok>')
			console.log(L)
	})
	buf=''
}
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
jef.exec(fs.readFileSync('./topics/basic01').toString())
jef.exec(fs.readFileSync('./topics/basic02').toString())
if (buf)
	clrBuf()
// </script>