// 	vocabularyJavascriptEforth.js	2012/04/16 ~ 2014/04/28
//	YapCheaHshen@gmail.com, SamSuanChen@gmail.com, ChenHanSunDing@gmail.com
( function() { 					// main
  'uses strict' 				// sytax checking for all undefined
  var eForthVM1=function () {		// VM for eForth
  
	this.type		= 0			// function for typing out (the import function)
	this.output		= 0			// <pre id='output'></pre>
	this.outputStepwise	= 0		// <input id="outputStepwise" type="checkbox"> 
	
	var dStk		= []		// data stack for passing data among words
	var	rStk		= []		// return stack for return from high level calling 
	var tStk		= []		// task status stack
	var rStkLen		= 0
	var time0		= 0
	var functions	= {}
	var z			= "0,5"
	var compiledCode= [0]		// compiled code of high level definition
	var	tib			= ""		// source code for processing
	var iTib		= 0			// offset for source code being processed
	var tsk0		= {iTib:0,tib:tib,error:0,waiting:0}
	var tsks		= []		// outter source interpreter as the first task
	var tsk
	var tkn
	var end_code 	= /\}\s+end-code/
	var ip			= 0			// point to compiled code during processing
	var error		= ""		// error code of illegal syntax
	var compiling	= 0			// state of compiling code for high level definition
	var waiting		= 0			// state of waiting for IO
	var tracing		= 0
	var base		= 10		// number convering base (delfault 10 for decimal)
	var hName		= ""		// name 				 of high level word (being defined)
	var hXt			= 0			// compiled code pointer of high level word (being defined)
	var hSrc		= 0			// source   code pointer of high level word (being defined)
	var lstWrd		= {}		// 
	var debugged	= [0]		// list of v,w being debugged
	var context		= [0, 0]	// vocabulary ids for searching a given word name
	var current		= 0			// id of vocabulary for defining new words
	var root		= {name: 'root', xt: function(){
		context[0]=0
	}, vid: 0}
	var vocs		= [root]
	root.wrds		= [0, root]
	root.dictionary	= {'root': [1]}
	var getVocs = function(){
	    return vocs
	}
	var setVocs = function(vs){
		vocs=vs
		return vocs
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
	var type	=function (msg) { if (this.type && msg) this.type(msg)		 		   }
	var cr		=function (   ) { type("\n"					   						 ) }
	var print	=function (txt) { type(			 txt.replace(/</g,'&lt;')			 ) }
	var shwOk	=function (txt) { type(' <ok>' + txt.replace(/</g,'&lt;') + '</ok>'  ) }
	var shwInp	=function (txt) { type('<inp>' + txt.replace(/</g,'&lt;') + '</inp> ') }
	var shwWrn	=function (txt) { type('<wrn>' + txt.replace(/</g,'&lt;') + '</wrn>' ) }
	var shwErr	=function (txt) { type('<err>' + txt.replace(/</g,'&lt;') + '</err>' ) }
	var abort	=function (msg) { var m, O, S, p
		if (compiling) {
			compiling = 0
			msg += '\nWhile defining high level word "' + hName +'"'
		} else {
			m = msg.match(/Unexpected tkn (.+)/)
			if (m) {
				msg += '\nWhile coding low level word "' + tkn +'"'
			//////////////////////////////////////////////////////////////////
				O = out || output.innerHTML								//
				O = O.split(/\n<inp>\s*code /)							// split output
				S = O[O.length-1]										// the source code
				p = RegExp(m[1].replace(/[\][(){}.+*?]/g, function(m){	// pattern for tkn
					return '\\'+m											// 
				}),'g')														//
				O[O.length-1] = S.replace(p,function(t) {					// highlight tkn
					return '<err>' +  t.replace(/</g,'&lt;') + '</err>'		//
				})															//
				O = O.join('\n<inp>code ')									// join output
				if (out) out = O											//
				else output.innerHTML = O									// update output
			//////////////////////////////////////////////////////////////////
		}	}
		shwErr('\n' + msg + '\n'); reset()
		if (!this.type) alert(msg)
		error=msg
	}
	var ignoreWhtSpc=function () {
		while (tib.substr(iTib).match(/^[\t ]/)) iTib++
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
			ignoreWhtSpc()
			tkn = tib.substr(iTib)
			tkn=(m=tkn.match(/^\S+/))?m[0]:''
		}
		iTib += tkn.length
		return tkn
	}
	var compile=function (x) { compiledCode.push(x) }	// compile x (could be any thing)
	var compileCode=function (z, n) {			// compile a forth word (given index or name)
	    if (typeof(z) === "string"&&!z.match(/^\d+,\d+$/)) {
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
		return n								// n could be undefined
	}
	var at=function (t,p){ var i
		return (i=t.indexOf(p)) >=0 ? i : i=t.length
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
				if (ws=vocs[v].dictionary[name])
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
		ids=v.dictionary[name]||[], n=ids.length
		ids.unshift(i)
		shwWrn('\nword'+(ids.length>1?'s':'')+' defined at '+ids.map(function(i){
			return current+','+i
		}).join(' '))
		v.dictionary[name]=ids
	}
	var code = function() { // code ( <name> -- ) define a new word using javascript
		ignoreWhtSpc()
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
			c = tib.substr(iTib, n+2)
			if (name === 'function') {
				name=c.match(/^\s+(\S+)\s*\(/)[1]
				try {
					functions[name]=eval('this.'+name+'=function '+c)	// js function
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
		try { execute(w.xt) }				// execute word
		catch(e) { 
			abort('Abort at word "' + w.name + '", because ' + e.message)	// error in javascript
		}
	}
	var endProcess=function () {						// process source code
		if (!compiling) shwOk('ok')				// shw ok
		cr()
		if (this.out) {							// if output buffer not empty
			this.output.innerHTML += this.out, this.out=''	// shw output and scroll up
			this.output.scrollTop = this.output.scrollHeight
		}
	}
	var shwNextInpLine=function() { var t
		t=tib.substr(iTib)
		if(!(this.output.innerHTML+this.out).match(/\n$/))print('\n')
		shwInp(t.substr(0,eol=at(t,'\n')))
		eol=t.substr(eol)
	}
	var resumeExec=function (it) { var t, z, v, i, w
		tib=tsk0.tib, iTib=tsk0.iTib, dStk=tsk0.dStk, rStk=tsk0.rStk
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
				shwOk('ok')
			if (tib.substr(iTib))
				iTib++
		} while (tib.substr(iTib))					// error, or waiting
		tsk0={tib:tib, iTib:iTib, dStk:dStk, rStk:rStk}
	}
	var exec =function (cmds) {	// outer source code interpreter
		time0=new Date()
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
			if (this.output && this.outputStepwise && !this.outputStepwise.checked) {
				this.outputStepwise.checked=1
				this.output.innerHTML+=out, out=''
				this.output.scrollTop = this.output.scrollHeight
			}
			msg = '\n'+digits(new Date()-time0,6)+' tracing '+z+' '+zWrd(z).name
			//	+ '\n'+deCompile(z)
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
		if (0>tsks.indexOf(tsk.z)) tsks.push(tsk.z)
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
				print('\n'+digits(new Date()-time0,6)+' resumeTask '+z+' '+zWrd(z).name+' '+tsk.ip)
			switchToTask(tsk)
			resumeCall(tsk)
			returnFromTask(tsk)
		} else 
			resumeCall()
	}
	var resumeCall=function (tsk) {
		while (rStk.length > rStkLen) {
			z=compiledCode[ip++]
			zExe(z)
			if (error||waiting) break
		}
		if (rStk.length === rStkLen) {
		    if (tsk) {
				z=tsk.z
				if (tracing)
					print('\n'+digits(new Date()-time0,6)+' resumeTask '+z+' '+zWrd(z).name+' done')
				var i=tsks.indexOf(tsk.z)
				tsks=tsks.slice(0,i).concat(tsks.slice(i+1))
				if (!tsks.length)
					resumeExec()
			}
		}
	}
	var call=function (iCompiledCode) { var xt		// inner compiled code interpreter
		rStkLen = rStk.length
		rStk.push(ip)							// 
		error=0, ip=iCompiledCode
		resumeCall()	
	}
	newWrd('code'			,code			)
	newWrd('dbg'			,dbg			)
	this.exec		= exec		// outer interpreter (the export function)
	this.getVocs	= getVocs
	this.setVocs	= setVocs
  } 			
  window.eForthVM1 = eForthVM1	// export
} ) (); 						// execute Main