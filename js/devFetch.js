const currentYear = new Date().getFullYear();

const boatlist = [];
let csvData;
let csvHeader;
let tablejsonData;
let orcBoats = 0;
let intlBoats = 0;
let clubBoats = 0;
let dhBoats = 0;
let nsBoats = 0;
let tableBoats = 0;


console.log('foo 1');

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

fetch('foo.csv').then(csv => {
    devGetCVSData(csv).then(async n => {
        console.log('foo 2');
        await sleep(1000);
        console.log('foo 3');
        reloadTable();
    });
});
async function devGetCVSData(cvs) {
    const csvArray = await cvs.text();
    csvData = Papa.parse(csvArray);
    csvData.data.forEach(function(line, i) {
        if (i > 0 && line.length > 1) {
            let boatdata = new Map();
            boatdata["index"] = i;
            boatdata["FILE_ID"] = line[0];
            boatdata["TYPE"] = line[2]
            boatdata["CrewWT"] = line[11];
            const c_type = line[96];
            boatdata["C_TYPE"] = c_type;;
            boatdata["FIN_FinRating_TOT"] = line[97];
            boatdata["FIN_FinRating_H_TOT"] = line[98];
            boatdata["FIN_FinRating_L_TOT"] = line[99];
            boatdata["CDL"] = line[100];
            boatdata["SAILNUMB"] = line[104];
            boatdata["NAME"] = line[105];
            boatlist.push(boatdata);

            if (c_type === 'INTL' || c_type === 'CLUB') {
                ++orcBoats;
            }
            if (c_type === 'DHCL' || c_type === 'DHIN') {
                ++dhBoats;
            }
            if (c_type === 'NSCL' || c_type === 'NSIN') {
                ++nsBoats;
            }
            if (c_type === 'TABLE') {
                ++tableBoats;
            }
        }
        if (i === 0) {
            csvHeader = line;
        }
    });
}

