#javascript eforth VM

**jeForthVM.js** is a javascript source code running as a **multi task jeforth VM** with initially three jeforth words **'root'**, **'code'**, and **'dbg'**. On web client html page. This VM could be included by &lt;script src= **"./jeForthVM.js"**> &lt;/script>. Please check **jefvm0.html**, **jefvm1.htm1**, **movingEffect.htm**, or related tutorials. A node.js webkit server program could use this VM as well, via require( **"./jeForthVM.js"**). Please check **jefvm0.bat** or **jefvm1.bat**.

>##The word 'root'

This is a **root vocabulary** having three jeforth word words **'root'**, **'code'**, and **'dbg'** initially.
Please check the topic **vocTest** to see how to add vocabulary/word and to use vocabulary/word among all vocabularies.

>##The word 'code'

This jeforth word is used to define **new jeforth words** running thier corresponding **java script anonymous functions** or to define **new js functions called by jeforth words**. Lots new jeforth word definitions could be seen in topics **default**, **basic01**, **jsFunctionTest**, **vocTest**, and **multiTask**.

>##The word 'dbg'

This jeforth word is used to trace or debug all the jeforth words defined. Setting **breakpoint BP0** in the source code of dbg could halt the processing if **dbg** alone is being executed (having no any following word). Otherwise, for example, **dbg xyz**, the following word xyz will be put into debugged list. Setting **breakpoint BP1** in the source code of dbg could halt the processing if any of the words in the list is being executed.

>##jefvm0.html

the web client html page used as demo 0 to test, debug, and demostrate this VM.

>##jefvm0.bat

starting a node-webkit local host html page used as demo 0 to test, debug, and demostrate this VM.

>##jefvm1.html

the web client html page with local storage used as demo 1 to test, debug, and demostrate this VM.

>##jefvm1.bat

starting a node-webkit local host html page with local storage used as demo 1 to test, debug, and demostrate this VM.

>##jefvm2run.bat

running node-dev jefvm2.js (with file system) as a simple demo to run this VM.

>##jefvm2debug.bat

running node-webkit jefvm2.html (with file system) as a simple demo to test and debug this VM.

>##1. topics

showing all the topics

>##2. default

showing how to define words

>##3. basic01 

showing how to define a few basic words

>##4. basic02 

showing how to test the basic words

>##5. jsFunctionTest 

showing how to define a java script function to be used in words

>##6. vocTest 

showing how to define and use new words in vocabularies

>##7. multiTask 

showing how to define words for multi tasking

>##8. multiTask1 

showing how to test and demonstrate for multi tasking

>##multiTaskJavascriptEforthOutput.html

a demostration output for multi tasking.

>##specialEffect.htm

another demostration for multi tasking.