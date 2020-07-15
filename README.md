# Cross-Edits-Suspicious-Patterns-Production-Prototype
Author: Haoran Fei (haoranfei@google.com)
Date: July 15th, 2020
Host: Zainan Zhou (zzn@google.com)
This repository hosts a prototype for the Cross-Edits-Suspicious-Patterns Project's Second Milestone. The prototype supports the complete workflow of the future production code, except for obtaining reviewer's decision interactively. The prototype is written as a TypeScript Script that can be compiled to native JavaScript and then run using Node.JS runtime. 

# Usage
Compilation: 
tsc 
Then, add line 
const fetch = require('node-fetch');
to the beginning of prototype.js
Finally, run
node prototype.js
