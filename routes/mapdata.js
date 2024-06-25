const { response } = require('express');
var sqlmanager = require('./sqlmanager.js');
const fs = require('node:fs');

var files = ['6-1-2023', '7-1-2023', '8-1-2023', '9-1-2023', '10-1-2023', '11-1-2023', '12-1-2023', '1-1-2024', '2-1-2024', '3-1-2024', '4-1-2024', '5-1-2024'];

for (var j = 0; j < files.length; j++) {
    (async function(f) {
        var fileOut = '';

        fs.readFile(files[f] + '.csv', 'utf8', (err, data) => {
            if (err) {
            console.error(err);
            return;
            }
            var lines = data.split('\n');

            fs.readFile(files[f] + '-1-response.json', 'utf8', (err, res) => {
                var response1 = JSON.parse(res);

                for (var i = 1; i < lines.length / 2 - 1; i++) {
                    var line = lines[i].split(',');
                    var longitude = line[0];
                    var latitude = line[1];
                    
                    if (response1["Results"][i] === undefined) {
                        console.log(files[f] + '-1:' + i);
                        continue;
                    }

                    var risk = response1["Results"][i][1][0][1];
                    //console.log(risk);
                    var time = f;

                    fileOut = fileOut + "\n" + longitude + "," + latitude + "," + risk + "," + time;
                }

                fs.writeFile(files[f] + '-1-data.csv', fileOut.substring(1), err => {
                    if (err) {
                        console.error(err);
                    }
                });
            });
        });
    })(j);

    (async function(f) {
        var fileOut = '';

        fs.readFile(files[f] + '.csv', 'utf8', (err, data) => {
            if (err) {
            console.error(err);
            return;
            }
            var lines = data.split('\n');

            fs.readFile(files[f] + '-2-response.json', 'utf8', (err, res) => {
                var response1 = JSON.parse(res);

                for (var i = lines.length / 2 + 1; i < lines.length - 1; i++) {
                    var line = lines[i].split(',');
                    var longitude = line[0];
                    var latitude = line[1];

                    if (response1["Results"][i - lines.length / 2] === undefined) {
                        console.log(files[f] + '-1:' + i);
                        continue;
                    }

                    var risk = response1["Results"][i - lines.length / 2][1][0][1];
                    
                    var time = f;

                    fileOut = fileOut + "\n" + longitude + "," + latitude + "," + risk + "," + time;
                }

                fs.writeFile(files[f] + '-2-data.csv', fileOut.substring(1), err => {
                    if (err) {
                        console.error(err);
                    }
                });
            });
        });
    })(j);
}