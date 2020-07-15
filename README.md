# Cross-Edits-Suspicious-Patterns-Production-Prototype
Author: Haoran Fei (haoranfei@google.com) <br />
Date: July 15th, 2020 <br />
Host: Zainan Zhou (zzn@google.com) <br />
This repository hosts a prototype for the Cross-Edits-Suspicious-Patterns Project's Second Milestone. The prototype supports the complete workflow of the future production code, except for obtaining reviewer's decision interactively. The prototype is written as a TypeScript Script that can be compiled to native JavaScript and then run using Node.JS runtime. 

# Usage
Compilation: <br />
```
tsc 
```
Then, add line <br />
```
const fetch = require('node-fetch');
```
to the beginning of prototype.js <br />
Finally, run <br />
```
node prototype.js 
```
