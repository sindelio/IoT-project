/*  Universidade de São Paulo - Campus São Carlos 
        
      Computer Engineering Thesis Project: Internet of "things" - controlling actuators through web pages
      Author: Sindélio Henrique Lima
      Advisor: Maximiliam Luppe
      
      June of 2017 
      
      This is the main control file. In this file is the iterative loop that watches over the system.
*/

"use strict" //Set compilation mode to be stricter than usual

var mraa = require("mraa") //Invokes the hardware library, to work with pins in the Intel Edison
//console.log(mraa) //Prints mraa object 

//Input and output variables
var button_local = 0, button_local_last = 0 //Variables referring to the local hardware button
var button_web = 0, button_web_last = 0 //Variables referring to the web button
var output = 0 //Variable referring to the state of the actuator (buzzer in this case)
/* It`s good to remeber that the Intel Edison is a Memory Mapped System, along with most Embedded Systems. This means that every component, such as sensors and actuators, are controlled via the state of their respective memory adresses. */

//Initializes the button connected in GPIO D2
var digital_pin_D2 = new mraa.Gpio(2) //Activates general purpose pin 2
digital_pin_D2.dir(mraa.DIR_IN) //Sets pin 2 as an input
digital_pin_D2.write(0) //Sets pin 2 to low logic level

//Initializes the buzzer connected in GPIO D6
var digital_pin_D6 = new mraa.Gpio(6) //Activates general purpose pin 6
digital_pin_D6.dir(mraa.DIR_OUT) //Sets pin 6 as an output
digital_pin_D6.write(0) //Sets pin 6 to low logic level

//Set the TSL/SSL required files for encryption. The algorythm used is the RSA
var fs = require('fs')
var options = { //Sets the credentials required by RSA encryption algorythm
  key: fs.readFileSync('./security/file.pem'), //Read the private key file
  cert: fs.readFileSync('./security/file.crt') //Read the certificate file
};

//Sets the web requirements 
const express = require('express') //Invokes express framework/module
const app = express() //Creates express object
const https = require('https') //Invokes https module
const https_server = https.Server(options, app) //Creates an HTTPS server using the security credentials and binds it to the express object
const socket_io = require('socket.io') //Invokes the socket.io module. This is a module for high abstraction web communication
const io = socket_io(https_server) //Creates the socket.io object and binds it to the HTTP server
const path = require('path') //Invokes path module
const bodyParser = require('body-parser') //Invokes body-parser module

const maxUsers = 5 // Maximun number of clients connected to the system
var submittingSocketID = '' //ID of the client who's attempting to login to the system

//Allows use of files in the root folder by the client application/browser
app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.urlencoded({extended: true}))

//Listener for GET requisitions at the website
app.get('/', function(request, response){
    response.sendFile(__dirname + '/public/login.html') //Sends the HTML login page file to be displayed in the clients browser
})

//Listener for login attempts
app.post('/', function(request, response){
	if(request.body.login === 'login' && request.body.password === 'password'){ //If the correct login credentials werere put 
		app.use(express.static(path.join(__dirname, '/private')))
		response.sendFile(path.join(__dirname, '/private/_index.html'))	//Sends the HTML control page file to be displayed in the clients browser
		//console.log('Redirecionado com sucesso !!') //Debugger
		//console.log(request.body) //Debugger
		
	} else{
		console.log('Login error !!\n') //Notificates the server that someone tried to login with non authorized credentials		
		io.emit('loginFail', submittingSocketID);
		// response.send('Erro nas credenciais !! Por favor tente novamente.') //Debugger
		//socket.emit('loginFail') //Debugger
		//console.log('IDfailing: ' + socket.id) //Debugger
		
	}
})

//Listener for succesful connections 
var clientCount = 0
io.on('connection', function(socket){
    //console.log('User connected, ID: ' + socket.id) //Debugger 
    clientCount++ //Incremets the actual number of clients
    if(clientCount > maxUsers){ //If the maximun number of clients was reached
      clientCount-- //Decrements the actual number of clients
    	//console.log('clientCount: ' + clientCount) //Debugger
    	socket.emit('serverOverload')
    	socket.disconnect()

//Server 2 activation
//    	const child_process = require('child_process')
//      const child = child_process.exec('node server2.js', function(error, data){
//		   console.log('Server2 ok')
//      })
    }
    
    //Listener for disconnection events
    socket.on('disconnect', function(){
    	clientCount-- //Decrements the actual number of clients
    	//console.log('Adios') //Debugger

    })

    //Listener for login attempt events
    socket.on('loginAttempt', function(AttemptingClientSocketID){
      submittingSocketID = AttemptingClientSocketID // Updates the ID of the client attempting to connect to login to the system
      //console.log('submittingSocketID: ' + submittingSocketID) //Debugger
    })
    socket.on('toggle', function(){ //Listener for mouse click events
        button_web = !button_web //Toggle web button state
    })
})

//Activates HTTPS server on port 3000
https_server.listen(3000, function(){
   console.log('Server listening on port 3000 ..\n') //Callback functions to inform activation of the server
})

//Main loop
setInterval(function(){
    button_local = digital_pin_D2.read() //Reads the button (sensor) state
    
    //Conditions regarding the local hardware button
    if(button_local == 0 && button_local_last == 1){ //If the local button was pressed
        //console.log('caso 1') //Debugger
        output == 1 ? output = 0 : output = 1 //Toggles buzzer state
        io.emit('toggle') //Informs the client that the buzzer's state has changed 
    } else if(button_local == 1 && button_local_last == 0){ //If the local button was released
        //console.log('caso 2') //Debugger
        output == 1 ? output = 0 : output = 1 //Toggles buzzer state
        io.emit('toggle') //Informs the client that the buzzer's state has changed
    }
    
    //Conditions regarding the web button
    if(button_web == 0 && button_web_last == 1){ //If the web button was clicked
        //console.log('caso 3') //Debigger
        output == 1 ? output = 0 : output = 1 //Toggles buzzer state
    } else if(button_web == 1 && button_web_last == 0){ //If the web button was clicked again
        //console.log('caso 4') //Debugger
         output == 1 ? output = 0 : output = 1 //Toggles buzzer state
    }

    //console.log('output:' + output) //Debugger
    digital_pin_D6.write(output) //Write the new buzzer (actuator) state
    button_local_last = button_local //Updates the last state of the local button
    button_web_last = button_web //Updates the last state of the web button
}, 200) // Repeats every 200ms