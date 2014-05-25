/* <script>
if (typeof jeForthVM==='undefined' && typeof require==='function')
	var jeForthVM=require('./jeForthVM.js').jeForthVM
  </script> */
// <script>
'uses strict'
var buf=''
if (typeof jeForthVM==='undefined' && typeof require==='function')
	var jeForthVM=require('./jeForthVM.js').jeForthVM
var jef=new jeForthVM()
// fs=require('fs'), 
var clrBuf=function(){
	buf.split(/\r?\n/).map(function(L){
		if (L) console.log(L.length,L)
	})
	buf=''
}
jef.type=function(x){
	buf+=x
	if (buf.match(/\n$/))
		clrBuf()
}
//jef.tagging=1
jef.exec(
	'code . function(){ print(" "+dStk.pop()) }end-code'+	'\n'+
	'code + function(){ var x=dStk.pop(); dStk[dStk.length-1]+=x }end-code'
)
jef.exec('2 3 4 + + .')
var sourceCode=fs.readFileSync('../topics/default').toString()
jef.exec(sourceCode)
if (buf)
	clrBuf()
// </script>