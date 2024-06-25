const { response } = require('express');
var sqlmanager = require('./sqlmanager.js');
const fs = require('node:fs');

var files = ['6-1-2023', '7-1-2023', '8-1-2023', '9-1-2023', '10-1-2023', '11-1-2023', '12-1-2023', '1-1-2024', '2-1-2024', '3-1-2024', '4-1-2024', '5-1-2024'];

for (var j = 0; j < files.length; j++) {
    (async function(f) {
        // Base query before data added
    var query = "INSERT INTO mapfuturedata (time, latitude, longitude, temp_max, temp_min, wind_gust, wind_speed, cloudcover, precip_prob, precip_cover) VALUES (0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '')";

    var fileOut = '';

    fs.readFile(files[f] + '.csv', 'utf8', (err, data) => {
        if (err) {
        console.error(err);
        return;
        }
        var lines = data.split('\n');
        
        index = "";
        data = "";
    
        for (var i = lines.length  / 2 + 1; i < lines.length - 1; i++) {
        var line = lines[i].split(',');
        var longitude = line[0];
        var latitude = line[1];
        var ndvi = line[2];
        var temp_max = line[4];
        var temp_min = line[5];
        var wind_gust = line[6];
        var wind_speed = line[7];
        var cloudcover = line[8];
        var precip_prob = line[9];
        var precip_cover = line[10];

        index = index + i + ",";
        dataline = `["` + ndvi + `",` + temp_max + "," + temp_min + "," + wind_gust + "," + wind_speed + "," + cloudcover + "," + precip_prob + "," + precip_cover + `]`;
        data = data + dataline + ",";
        }

        index = index.slice(0, -1);
        data = data.slice(0, -1);

        const requestBody = `{
        "Inputs": {
            "columns": [
                "NDVI",
                "TEMP_MAX",
                "TEMP_MIN",
                "WIND_GUST",
                "WIND_SPEED",
                "CLOUDCOVER",
                "PRECIP_PROB",
                "PRECIP_COVER"
            ],
            "data": [` + data + `]
        },
        "GlobalParameters": {
            "method": "predict"
        }
    }`;
        fs.writeFile(files[f] + '-2.json', requestBody, err => {
            if (err) {
                console.error(err);
            }
        });

        fs.writeFile(files[f] + '-2-response.json', '', err => {
            if (err) {
                console.error(err);
            }
        });
    });
    })(j);
}