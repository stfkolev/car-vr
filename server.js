const connect = require('connect');
const serveStatic = require('serve-static');
const PORT = 1000;

connect().use(serveStatic(__dirname)).listen(PORT, function(){
    console.log('Server running on '+ PORT +'...');
});