// 	jeForthVm.js	2012/04/16 ~ 2014/05/23
//	YapCheaHshen@gmail.com, SamSuanChen@gmail.com, ChenHanSunDing@gmail.com
( function() { 					// anonymous function main
  'uses strict' 				// strict sytax checking for all undefined
  if (typeof jeForthVM==='undefined')
  var jeForthVM=function () {	// VM for jeForth
	this.type		= 0			// function for typing out (the import function)
	this.output		= 0			// <pre id='output'></pre>
	this.directOut	= 0			// <input id="directOut" type="checkbox">
	this.tagging	= tagging	// output tagging as <inp>, <ok>, <err>, <wrn>
	var tagging		= 0
	var VM			= this
	var dStk		= []		// data stack for passing data among words
	var	rStk		= []		// return stack for return from high level calling
	var time0		= 0			// new Date() as time stampe for easy referencing
	var functions	= {}		// collection of all js functions defined by code
	var z			= "0,5"		// vocs[0].wrds[5]
	var compiledCode= [0]		// compiled code of high level words
	var	tib			= ""		// source code for processing
	var iTib		= 0			// offset for source code being processed
	var tsk0		= {iTib:0,tib:tib,error:0,waiting:0}// outter source interpreter
	var tsks		= []		// tasks started
	var tsk						// task
	var tkn						// token
	var end_code=/\}\s*end-code/ // pattern of end-code
	var ip			= 0			// point to compiled code during processing
	var error		= ""		// error message of illegal syntax
	var compiling	= 0			// state of compiling code for high level definition
	var waiting		= 0			// state of waiting for IO
	var tracing		= 0			// turn on this flag to show multi tasking info
	var base		= 10		// number convering base (delfault 10 for decimal)
	var hName		= ""		// name 				 of high level word (being defined)
	var hXt			= 0			// compiled code pointer of high level word (being defined)
	var hSrc		= 0			// source   code pointer of high level word (being defined)
	var lstWrd		= {}		// the last word defined
	var debugged	= [0]		// list of v,w being debugged
	var context		= [0, 0]	// vocabulary ids for searching a given word name
	var current		= 0			// id of vocabulary for defining new words
	var root =  { name	: 'root'// the root vocabulary
			 	, wrds	: [0]	// no words in root yet
				, index	: {}	// no words in root yet
				}		
	var vocs		= [root]	// the only vocabulary in vocs
	var stringifyWrd = function(w){
		if (w) {
			var w1={}
			for (var pw in w) {
				var wp=w[pw]
				if (pw==='xt') // each xt function
					wp=wp.toString()
				w1[pw]=wp
			}
		} else var w1=0
		return w1
	}
	var stringifyVoc = function(v){
		var v1={}
		for (var pv in v) {
			var vp=v[pv]
			if (pv==='wrds') {
				vp=vp.map(function(w){ // each word
					return stringifyWrd(w)
				})
			}
			v1[pv]=vp
		}
		return v1
	}
	var getVocs = function(){
		var vocs1=vocs.map(function(v){
			return stringifyVoc(v)
		})
		return JSON.stringify(vocs1)
	}
	var setVocs = function(vs){
		vs=JSON.parse(vs)
		for(var i=0; i<vs.length; i++) {
			var v=vs[i], ws=v.wrds // each voc
			for(var j=1; j<ws.length; j++) {
				w=ws[j] // each word
				if (w)
					w.xt=eval('('+w.xt+')') // each xt function
			}
			vocs[i]=v
		}
		return vs
	}
	var getCompiledCode = function(){
	    return JSON.stringify(compiledCode)
	}
	var setCompiledCode = function(cc){
		return compiledCode=JSON.parse(cc)
	}
	var getFunctions = function(f){
		var fs={}
		for(f in functions) {
			fs[f]=functions[f].toString()
		}
		return JSON.stringify(fs)
	}
	var setFunctions = function(fs){
		fs=JSON.parse(fs)
		for(f in fs) {
			fs[f]=eval('VM.'+f+'='+fs[f])
		}
		return functions=fs
	}
	var digits	=function(i,n){ // integer i, n<64
	    i=i.toString(base)
		return	'000000000000000000000000000000000000000000000000000000000000000'
				.substr(0,n-i.length)+i
	}
	var zWrd=function (z) {
		z=z.split(',').map(function(x){return parseInt(x)})
		return vocs[z[0]].wrds[z[1]]
	}
	var reset	=function (   ) { error = 1, dStk = [], rStk = [] }
	var type	=function (msg) { if (VM.type && msg) VM.type(msg) }
	var txtCnv	=function (txt) {
		if (VM.output)
			txt=txt.toString().replace(/</g,'&lt;')
		return txt 
	}
	var cr		=function (   ) { type("\n"					) }
	var print	=function (txt) { type(			txtCnv(txt)	) }
	var shwOk	=function (txt) { type(tagging?
		( '<ok>' + txtCnv(txt) + '</ok>'	) : txtCnv(txt)	) }
	var shwInp	=function (txt) { type(tagging?
		( '<inp>'+ txtCnv(txt) + '</inp>'	) : txtCnv(txt)	) }
	var shwWrn	=function (txt) { type(tagging?
		( '<wrn>'+ txtCnv(txt) + '</wrn>'	) : txtCnv(txt)	) }
	var shwErr	=function (txt) { type(tagging?
		( '<err>'+ txtCnv(txt) + '</err>'	) : txtCnv(txt)	) }
	var abort	=function (msg) { var m, O, S, p
		if (compiling) {
			compiling = 0
			msg += '\nWhile defining high level word "' + hName +'"'
		} else {
			m = msg.match(/Unexpected tkn (.+)/)
			if (m) {
				msg += '\nWhile coding low level word "' + tkn +'"'
				//////////////////////////////////////////////////////////
				O = VM.out || VM.output.innerHTML						//
				O = O.split(/\n<inp>\s*code /)							// split output
				S = O[O.length-1]										// the source code
				p = RegExp(m[1].replace(/[\][(){}.+*?]/g, function(m){	// pattern for tkn
					return '\\'+m										// 
				}),'g')													//
				O[O.length-1] = S.replace(p,function(t) {				// highlight tkn
					return '<err>' +  t.replace(/</g,'&lt;') + '</err>'	//
				})														//
				O = O.join('\n<inp>code ')								// join output
				if (VM.out) VM.out = O									//
				else VM.output.innerHTML = O							// update output
				//////////////////////////////////////////////////////////
		}	}
		shwErr('\n' + msg + '\n'); reset()
		if (!VM.type) alert(msg)
		error=msg
	}
	var ignWhtSpc=function () { var c
		while ((c=tib.charAt(iTib))==='\t'||c===' ') iTib++
	}
	var nxtTkn=function (deli) { var i, m
	 	tkn = tib.substr(iTib)
		if (deli) {
			tkn = tkn.substr(1)
			if ((i = tkn.indexOf(deli))>=0) {
				tkn = tkn.substr(0,i)
				iTib += deli.length+1
			}
		} else {
			ignWhtSpc()
			tkn = tib.substr(iTib)
			tkn=(m=tkn.match(/^\S+/))?m[0]:''
		}
		iTib += tkn.length
		return tkn
	}
	var compile=function (x) { compiledCode.push(x) }	// compile x (could be any thing)
	var compileCode=function (z, n) {		// compile a forth word (given index or name)
	    if (typeof z === "string" && !z.match(/^\d+,\d+$/)) {
			var name = z
			z = fndWrd(name)
			if (!z) { 
				abort('"'+name+'" undefined for tkn "'+tkn+'"')
				return
		}	}
		compile(z)
		if (n !== undefined) compile(n) 	// n could be 0
	}
	function parseNums (tkn) { var n
		return tkn.split(',').map(function(t){
			return parseNum(t)
		})
	}
	var parseNum=function (tkn) { var n
		if ( tkn.match(/^\$[0-9A-Fa-f]+$/) )
			n = parseInt(tkn.substr(1), 16)	// hex number of leading $
		else if (base !== 10)		
			n = parseInt(tkn, base)			// non-decimal number
		else if (! isNaN(tkn))
			n = parseFloat(tkn)				// decimal floating
		return n							// n could be undefined
	}
	var at=function (t,p){
		var i=t.indexOf(p)					// offset of p in t
		if(i<0) i=t.length					// if p not matched, take t.length
		return i
	}
	var deCompile=function (z) {
		var w=zWrd(z), name=w.name, src=w.src
		src = src || 'code ' + name + ' ' + w.xt + ' end-code'
		if (w.compileOnly) src += ' compileOnly'
		if (w.immediate  ) src += ' immediate'
		return src
	}
	var fndWrd=function(name){ var i, v, v0, ws
		for (i=0; i<context.length; i++) {
			v=context[i]
			if (v!==v0) {
				if (ws=vocs[v].index[name])
					return [v, ws[0]].join()
			}
			v0=v
		}
	}
	var newWrd=function(name,xt,src) { var v, i, ids, n
		v=vocs[current], i=v.wrds.length
		v.wrds.push({name:name,xt:xt})
		lstWrd=v.wrds[i]
		if (src)
			lstWrd.src=src
		ids=v.index[name]||[], n=ids.length
		ids.unshift(i)
		shwWrn('\nword'+(ids.length>1?'s':'')+' defined at '+ids.map(function(i){
			return current+','+i
		}).join(' '))
		v.index[name]=ids
	}
	var code = function() { // code ( <name> -- ) define a new word using javascript
		ignWhtSpc()
		var name = nxtTkn(), n, d, c, xt, t, x, m, eol
		t = tib.substr(iTib)
		m=t.match(end_code), n=m?t.indexOf(m[0]):-1
		if (n+1) {
			if ((d=n-(eol=at(t,'\n')))>0) {
				x=t.substr(n)
				t=t.substr(eol)
				eol=at(x,'\n')
				shwInp(t.substr(0,d+eol))
			}
			c = tib.substr(iTib, n+1)
			if (name === 'function') {
				name=c.match(/^\s+(\S+)\s*\(/)[1]
				try {
					functions[name]=eval('VM.'+name+'=function '+c)	// js function
					if(typeof(functions[name])==='function')
						shwWrn('\njavascript function '+c.match(/^\s+(\S+\s*\(\S*\))/)[1]+' defined')
				} catch(e) {
					abort(e)
				}
			} else { 
				newWrd(name,eval('('+c+')'))	// low level word
			}
			iTib += n + m[0].length
		} else abort('"code ' + name + '" sould be ended with "end-code"')
	}
	var zExe=function (z) { var w
		if (debugged.indexOf(z)>0)
			dbg(z)
		w=zWrd(z)
		try { execute(w.xt) }					// execute word
		catch(e) { 
			abort('Abort at word "' + w.name + '", because ' + e.message)	// error in javascript
		}
	}
	var endProcess=function () {				// process source code
		if (!compiling) shwOk(' ok')				// shw ok
		cr()
		if (VM.out) {							// if output buffer not empty
			VM.output.innerHTML += VM.out, VM.out=''	// shw output and scroll up
			VM.output.scrollTop = VM.output.scrollHeight
		}
	}
	var shwNextInpLine=function() { var t
		t=tib.substr(iTib)
		if (!t) return
		t=t.substr(0,eol=at(t,'\n'))
		shwInp(t)
	}
	var resumeExec=function (it) { var t, z, v, i, w
		if (it)
			print('\n'+digits(new Date()-time0,6)+' resumeExec at '+it)
		waiting = 0
		do {
			shwNextInpLine()
			while(tkn = nxtTkn()){					// get tkn
				if (!tkn)							// end of line or end of tib
					break
				if (z = fndWrd(tkn)) {				// search word for id in context vocs
					w=zWrd(z)						// get word
					if (w.compileOnly && ! compiling)
						abort('"' + w.name + '" compileOnly')
					else if (compiling && ! w.immediate)
						compile(z) 					// compile word
					else
						zExe(z)						// execute word
				} else {
					n = tkn.indexOf(',')>0 ? parseNums(tkn) : parseNum(tkn)
					if (n === undefined)			// n could be 0
						abort('"' + tkn + '" undefined')
					else {
						if (compiling)
							compileCode("doLit", n)	// compile number
						else
							dStk.push(n) 			// push number
					}
				}
				if (error || waiting) break
			}										// end of line, end of tib, error, or waiting
			if (error || waiting) break
			if (!compiling && !error && !it)
				shwOk(' ok')
			cr()
			if (tib.substr(iTib))
				iTib++
		} while (tib.substr(iTib))					// error, or waiting
	}
	var exec =function (cmds) {	// outer source code interpreter
		time0=new Date()
		if (error) {
			error=0, context=[0,0], current=0
		}
		tagging=this.tagging
		tib=tsk0.tib=cmds.replace(/\s+$/,''), iTib=tsk0.iTib=0
		dStk=tsk0.dStk=[], rStk=tsk0.rStk=[] 
		resumeExec()
	}
	var dbg =function (z) {	// this word dbg is just for debugging
		var msg, i, t
		if (!z && (t=nxtTkn())) {
			if (t && !(z=fndWrd(t)))
				abort('\ dbg '+t+' undefined')
			else {
				dbg(z), zExe(z)
			}
			return
		}
		if (!z) { t=tib.substr(iTib) // z undefined
			msg = '\nshwing ' + deCompile([current,vocs[current].wrds.length-1])
				+ ( (i=t.indexOf('\n'))<0?t:t.substr(0,i) )
				+ '\ndStk '	   + (dStk.length ? dStk.join(' ') : 'empty')
			shwWrn(msg)
			console.log(msg)	// set break point here VM will pause if word dbg is executed
			return
		}
		// z in debugged
			tracing=true
			if (VM.output && VM.directOut && !VM.directOut.checked) {
				VM.directOut.checked=1
				VM.output.innerHTML+=VM.out, VM.out=''
				VM.output.scrollTop = VM.output.scrollHeight
			}
			msg = '\n'+digits(new Date()-time0,6)+' tracing '+z+' '+zWrd(z).name
				+ '  dStk: '	    + (dStk.length ? dStk.join(' ') : 'empty')
				+ '  rStk: '	    + (rStk.length ? rStk.join(' ') : 'empty')
			shwWrn(msg)
			console.log(msg)	// set break point here VM will pause if id is in list debugged
	}
	var execute=function (xt) {
		if (xt%1===0)	// if xt is integer
			call(xt)	// execute high level compiled code at xt
		else
			xt()		// execute low  level javascript function xt
	}
	var switchToTask=function(tsk) {
		tsk0.ip=ip, tsk0.rStk=rStk, tsk0.dStk=dStk, tsk0.z=z
		ip =tsk.ip, rStk =tsk.rStk, dStk =tsk.dStk, z =tsk.z
	}
	var returnFromTask=function(tsk) {
		tsk.ip =ip, tsk.rStk =rStk, tsk.dStk =dStk, tsk.z =z
		ip=tsk0.ip, rStk=tsk0.rStk, dStk=tsk0.dStk, z=tsk0.z
	}
	var resumeTask=function (tsk) {
		waiting=0
		if (tsk) {
			var z=tsk.z
			if (tracing)
				print('\n'+
					digits(new Date()-time0,6)+
					' resumeTask '+z+' '+
					zWrd(z).name+' '+tsk.ip+' '
				)
			switchToTask(tsk)
		}
		resumeCall()
		if (tsk) {
			if (!rStk.length)		// normal end of inner loop 
			    rmTsk(tsk)			// remove from task waiting list
			returnFromTask(tsk)
		}
	}
	var rmTsk=function (tsk) {		// remove task
		var z=tsk.z, i				// get z (task id)
		if (tracing)				// show info
			print('\n'+digits(new Date()-time0,6)+' resumeTask '+z+' '+zWrd(z).name+' done ')
		if ((i=tsks.indexOf(z))>=0)	// if z in task list
			tsks.splice(i,1)		// remove z from task list
		if (!tsks.length)			// if no more task in list
			resumeExec()			// resume outer source code interpreter
	}
	var resumeCall=function () {	// inner loop of compiled code interpreting
		while (rStk.length) {
			zExe(compiledCode[ip++])// execute compiled code one by one
			if (error||waiting)
				break				// break if error or need to wait
		}
	}
	var call=function (i) {			// call compiled code at i
		rStk.push(ip),ip=i,error=0	// switch ip to i
		resumeCall()				// jump into inner loop of compiled code interpreting
	}
	newWrd('root'	,function(){
		context[0]=0
	})
	newWrd('code'	,code	)
	newWrd('dbg'	,dbg	)
	VM.exec				= exec				// export source code interpreter
	VM.getFunctions		= getFunctions
	VM.setFunctions		= setFunctions
	VM.getVocs			= getVocs
	VM.setVocs			= setVocs
	VM.getCompiledCode	= getCompiledCode
	VM.setCompiledCode	= setCompiledCode
  }
  if (typeof exports==='undefined')
  	  window .jeForthVM=jeForthVM	// export for web cliend APP
  else
  	  exports.jeForthVM=jeForthVM	// export for node.js APP
}) () 								// execute Main