# iot_project
************************************************************************************************
Brazil - <break> 
	Universidade de São Paulo - Campus São Carlos    
	Computer Engineering Thesis Project: Internet of "things" - controlling actuators through web pages
    	Author: Sindélio Henrique Lima
    	Advisor: Maximiliam Luppe
      
   	June of 2017 
************************************************************************************************

This is a simple IoT project focused in security. The objective of the project is to control an actuator, of which a buzzer was chosen for test, but it can be anything with a on/off behavior. The MRAA library was used to interact with the buzzer.

SETUP

In order to download the dependencies of the project on your working environment, run the following command:

$ npm install

This command will install all Node.js dependencies on your working environment. Be sure to have Node.js and NPM (Node Package Manager) installed on your environment pior to running this command.

RUNNING THE SYSTEM

To run the project, use the following command:

$ node main.js

This command will start the Node.js HTTPS server, and then you will be able to access the server with a browser in the local network through the following URL:

https://localhost:3000

In which 3000 is the port used by the Node.js HTTPS server. 

IMPORTANT: If you are going to used this project in a comercial application, I strongly recommend you change the asymmetric cryptography keys in the security folder before doing so. You can use the OpenSSL to generate new criptographic material for the Node.js HTTPS server.

      
   



