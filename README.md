#jeforthVM -- the javascript eforth VM

https://github.com/samsuanchen/multitaskjavascripteforth/

**jeForthVM.js** is a javascript source code running as a **multi task jeforth VM** with initially three jeforth words **'root'**, **'code'**, and **'dbg'** on web client or server html pages. This VM could be involved by &lt;script src= **"./jeForthVM.js"**> &lt;/script>. Please check demos: **jefvm0.html**, **jefvm1.htm1**, or **movingEffect.htm**. A node.js (or node-webkit) server program could involve this VM, via require( **"./jeForthVM.js"**). Please check demos: **jefvm0.bat**, **jefvm1.bat**, or **jefvm2run.bat**.

>##The word 'root'

>This is a primitive root **vocabulary** having three jeforth word words **'root'**, **'code'**, and **'dbg'** initially.
Please check topic 06 **vocTest** (using UP/DOWN key to select topic) in jefvm1.htm1 to see how a **new vocabulary/word** could be defined, and how an **appropriate vocabulary/word** among vocabularies could be selected and be used properly.

>##The word 'code'

>This jeforth word could be used to define a **new jeforth words** by assigning a java script anonymous function to the new word. In jefvm1.htm1, a lot of new jeforth words defined as demos in topics **default**, **basic01**, **vocTest**, and **multiTask**. Also, this jeforth word could be used to define **new js functions** in order to be called by jeforth words. Please check topic 05 **jsFunctionTest** in jefvm1.html.

>##The word 'dbg'

>This jeforth word is used to easy trace or debug a defined jeforth word. Setting breakpoint in jeForthVM.js at **BP0**, of its corresponding javascript function, could halt the VM if **dbg** alone (having no any following word) is being executed. Otherwise, for example, **dbg xyz**, the following word xyz will be put into debugged list so that setting breakpoint **BP1** in jeForthVM.js could halt the VM if any word in the list is being executed.

>##jefvm0.html

>This is a web client html page used as a simple demonstration showing how to involve this javascript eforth VM via &lt;script src= **"./jeForthVM.js"**> &lt;/script>.

>##jefvm0.bat

>Double click this batch command file will start a node-webkit web server (local host) html page showing how to involve this javascript eforth VM via require( **"./jeForthVM.js"**).

>##jefvm1.html

>This is a web client html page with local storage used as a demonstration showing how to involve, test, and debug jeForthVM.js.

>##jefvm1.bat

>Double click this batch command file will start a node-webkit web server (local host) html page with local storage used as a demonstration showing how to involve, test, and debug jeForthVM.js.

>>##01. topics

>>showing all the topics

>>##02. default

>>showing how to define new jeforth words

>>##03. basic01 

>>showing how to define a few basic jeforth words

>>##04. basic02 

>>showing how to test the basic jeforth words just defined

>>##05. jsFunctionTest 

>>showing how to define a java script function to be used in jeforth words

>>##06. vocTest 

>>showing how to define and use jeforth words in vocabularies

>>##07. multiTask 

>>showing how to define jeforth words for multi tasking

>>##08. multiTask1 

>>showing how to start multi tasks

>##jefvm2run.bat

>Double click this batch command file will start a process running 'node jefvm2.js' with file system I/O as yet another demonstration showing how to involve and test jeForthVM.js.

>##multiTaskJavascriptEforthOutput.html

>showing multi tasking demostration log output.

>##specialEffect.htm

>another web client html page multi tasking demostration of special effect moving objects.