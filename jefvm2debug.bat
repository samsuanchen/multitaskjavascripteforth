copy jefvm2.js jefvm2.html
del node-webkit\package.json
copy jefvm2.json node-webkit\package.json
node-webkit\nw --remote-debugging-port=9222