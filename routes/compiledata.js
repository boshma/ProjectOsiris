const { response } = require('express');
var sqlmanager = require('./sqlmanager.js');
const fs = require('node:fs');

var files = ['6-1-2023', '7-1-2023', '8-1-2023', '9-1-2023', '10-1-2023', '11-1-2023', '12-1-2023', '1-1-2024', '2-1-2024', '3-1-2024', '4-1-2024', '5-1-2024'];

var fileOut = '';

for (var j = 0; j < files.length; j++) {
    (async function(f) {
        fs.readFile(files[f] + '-1-data.csv', 'utf8', (err, res) => {
            fileOut = fileOut + '\n' + res;

            fs.writeFile('data.csv', fileOut.substring(1), err => {
                if (err) {
                    console.error(err);
                }
            });
        });
    })(j);
    (async function(f) {
        fs.readFile(files[f] + '-2-data.csv', 'utf8', (err, res) => {
            fileOut = fileOut + '\n' + res;

            fs.writeFile('data.csv', fileOut.substring(1), err => {
                if (err) {
                    console.error(err);
                }
            });
        });
    })(j);
}