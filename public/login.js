/*  Universidade de São Paulo - Campus São Carlos 
        
      Computer Engineering Thesis Project: Internet of "things" - controlling actuators through web pages
      Author: Sindélio Henrique Lima
      Advisor: Maximiliam Luppe
      
      June of 2017 
      
      This is the login.js javascript file running in the client app/browser. 
      This code manages login into the control page.
 */

var socket = io.connect('/', {secure: true}); //Creates the socket.io object. This object is used for high abstraction web communication 
// Alternative address to '/' -> https://172.26.166.183:3000/

const maxLoginFails = 5 //Maximun number of login fails a client can have before being disconnected

//Creation of session storage 
if (sessionStorage.loginFailCount) { //If defined

}
else { //If not defined
    sessionStorage.loginFailCount = '0'; //Creates login fail count variable, initialized with 0
    //console.log('initializing storage: ' + sessionStorage.getItem('loginFailCount'))//Debugger
}

function loginAttempt(){ //Function used to emit page update events
  socket.emit('loginAttempt', socket.id) //Emits login attempt event
  //console.log('loginAttempt') //Debugger
  //console.log(document.getElementById('login').value) //Debugger

}

//Function to update page, NOT USED
//function updatePage(){ //Function used to emit page update events
//	socket.emit('updatePage')
//    // console.log('Teste') //Debugger
//	// console.log(document.getElementById('login').value) //Debugger
//
//}

//Function to determine clients IP, NOT USED
//function getIP(json) {
//  //document.write("My public IP address is: ", json.ip); //Debugger
//  var myIP = json.ip
//  console.log(json.ip)
//}

document.getElementById('form').onsubmit = loginAttempt //Listener for form submissions. If there's been a form submission, invokes loginAttempt() function

//Listener for login fail events
socket.on('loginFail', function(submittingSocketID){ 
    if(socket.id == submittingSocketID){ //If this client was the one attempting to login
      sessionStorage.loginFailCount = Number(sessionStorage.loginFailCount) + 1 //Updates client's number of login failures
      //console.log('updated login failures: ' + sessionStorage.getItem('loginFailCount')) //Debugger
      if(sessionStorage.loginFailCount >= maxLoginFails){ //If the client reached the maximun number of login failures
        document.write('<p> Please try again later </p>') //Updates the entire web page to display an error message
        window.alert('Reached maximun number of login attempts\n') //Alerts the client that the connection with the server has been lost 
        socket.disconnect() //Disconnects the client from the system
      }
    }
})

//Function to lock the system if too many clients have attempted to connect
socket.on('serverOverload', function(){
  //console.log('vai toma seu gostoso!')
  document.write('<p> Please try again later </p>') //Updates the entire web page to display an error message
  window.alert('Server overloaded\n') //Alerts the client that the connection with the server has been lost 
  //socket.disconnect()
})
