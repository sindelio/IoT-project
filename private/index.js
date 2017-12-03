/*  Universidade de São Paulo - Campus São Carlos 
        
      Computer Engineering Thesis Project: Internet of "things" - controlling actuators through web pages
      Author: Sindélio Henrique Lima
      Advisor: Maximiliam Luppe
      
      June of 2017 
      
      This is the index.js javascript file running in the client app/browser. 
      This code gives manages the intelligence and dinamism into the control page.
 */

var socket = io.connect('/', {secure: true}); //Creates the socket.io object. This object is used for high abstraction web communication 
//Alternative address to '/' -> https://172.26.166.183:3000/
//Alternative command -> io()

var button_web = false //Variable holding the state of the web button
function toggle(){ //Function used to change the webpage when the web button is clicked	
	socket.emit('toggle') //Informs the server that the web button's state has changed
    button_web = !button_web //Toggles the web button state
	if(button_web === true){ //If the web button is activated
		document.getElementById('button').innerHTML= 'Deactivate' //Updates the text in the button to 'Desativar'
	}
	else { //If the web button is deactivated
		document.getElementById('button').innerHTML= 'Activate' //Updates the text in the button to 'Ativar'		
	}
}
document.getElementById('button').onclick = toggle //Listener for mouse clicks. If there's benn a click, invokes the function toggle()

function zeroFill(i) { //Function used to fill numbers smaller than 9 with a left zero. i is hours or minutes etc
  return (i < 10 ? '0' : '') + i
}

function now () { //Function used to get the present date and time
	var d = new Date() //d is an object of the Date Class containing the present time and date
    
    //Mounts the date in ISO format
  	return d.getFullYear() + '-'
    	+ zeroFill(d.getMonth() + 1) + '-'
	    + zeroFill(d.getDate()) + 'T'
	    + zeroFill(d.getHours()) + ':'
	    + zeroFill(d.getMinutes())
}

var startTime = '' //Variable representing the scheduled time for activation of the system
var presentTime = '' //Variable representing the present instant in time
function dateInput(event){ //Function used to update the scheduled time for activation of the system
	startTime = document.getElementById('datetime').value //Sets startTime with the user input
	// console.log(typeof(startTime))
}
document.getElementById('datetime').onchange = dateInput //Listener for changes in the user input. If there's been a change, invokes the function dateInput()

//Listener for disconnections
socket.on('disconnect', function(){
	document.write('<p> Connection to server lost. Either you are offline or something went wrong with the server. </p>') //Updates the entire web page to display an error message
	window.alert('Connection to server lost :[\n') //Alerts the client that the connection with the server has been lost
	// window.stop() //Tester
	// confirm('Exiting !!') //Tester
})

//Listener for changes in the local hardware button
socket.on('toggle', function(){
    //console.log('teste') //Debugger
    button_web = !button_web //Toggles the web button state
    if(button_web === true){ //If the web button is activated
		document.getElementById('button').innerHTML= 'Deactivate' //Updates the text in the button to 'Desativar'
        //console.log('teste2') //Debugger
	}
	else {
		document.getElementById('button').innerHTML= 'Activate' //Updates the text in the button to 'Ativar'
        //console.log('teste3') //Debugger
	}
})

setInterval(function(){ //Function used to watch over 
	presentTime = now() //Sets presentTime with the present time and date
	if(presentTime === startTime){ //If the present time and date are equal to the scheduled time and date for activation
		toggle() // Invokes the function toggle
		//console.log('works') //Debugger
	}
}, 60000) //Repeats every minute or 60000ms


//if(window.navigator.onLine){ //Tester