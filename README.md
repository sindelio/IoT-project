# IoT_project
************************************************************************************************
## Brazil
### Universidade de São Paulo - Campus São Carlos    
### Computer Engineering Thesis Project: Internet of "things": controlling actuators through web pages
### Author: Sindélio Henrique Lima
### Advisor: Maximiliam Luppe
### June of 2017 
************************************************************************************************

This is a simple IoT project focused in security. The objective of the project is to control an actuator, of which a buzzer was chosen for test, but it can be anything with a on/off behavior. The MRAA library was used to interact with the buzzer.

#### SETUP

The Intel Edison board was used for the project. Unfortunately, [this board was discontinued by Intel](https://software.intel.com/en-us/iot/hardware/discontinued). Other platforms can be used with little or no changes in the code, such as a Raspberry Pi, since the libraries used support the most commonly used platforms.
In order to download the dependencies of the project on your working environment, run the following command:
```
$ npm install
```
This command will install all Node.js dependencies on your working environment. Be sure to have Node.js and NPM (Node Package Manager) installed on your environment prior to running this command.

#### RUNNING THE SYSTEM

To run the project, use the following command:
```
$ node main.js
```
This command will start the Node.js HTTPS server, and then you will be able to access the server with a browser in the local host through the following URL:
```
https://localhost:3000
```
In which 3000 is the port used by the Node.js HTTPS server. The server can also be accessed through it's IP address in the local network, which should look like this:
```
https://192.168.26.16:3000
```

**IMPORTANT:** You need to create new asymmetric cryptography keys in order to use the HTTPS server. You can use the OpenSSL to generate new criptographic material for the Node.js HTTPS server. The generated cryptographic material, meaning the public and private keys, should be placed in the **security** folder. Also remember to modify the main.js program to look for the correct file names that you created. Here's a simple tutorial on how to create your own asymmetric keys using OpenSSL:
[how to create your own asymmetric keys using OpenSSL](https://rietta.com/blog/2012/01/27/openssl-generating-rsa-key-from-command/).


In depth details about the project can be found in the report file (although it's written in Portuguese):
**Internet of "things": controlling actuators through an Internet page.pdf**

#### Contributions

ANY COMMENTS AND CONTRIBUTIONS ARE MUCH WELCOME!

#### Copyright and license

This code is distributed under [the MIT license](https://github.com/sindelio/IoT_project/blob/master/LICENSE).


      
   



