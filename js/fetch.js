 

const currentYear = new Date().getFullYear();
 
const boatlist = [];
let csvData;
let csvHeader;
let tablejsonData;

let orcBoats=0;
let intlBoats=0;
let clubBoats=0;
let dhBoats=0;
let dhinBoats=0;
let dhclBoats=0;
let nsBoats=0;
let nsinBoats=0;
let nsclBoats=0;
let tableBoats=0;
 
console.log('orc') ;
for (const family of [1,3,5]) {
    fromOrc(family); 
}
async function fromOrc(family) {
    fetch('https://data.orc.org/public/WPub.dll?action=DownRMS&CountryId=FIN&ext=json&family=' + family + '&VPPYear=' + currentYear).then(response => {
        return response.json();
    }).then(json => {
        getJsonData(json);
        readyToReload();
        console.log('orc ' + family);
    });
}

console.log('table');
fetch('https://ampranking.s3.eu-north-1.amazonaws.com/2025/FinnishClass.json').then(response => {
    return response.json();
}).then(json => {
    tablejsonData = Array.from(json.rms.entries());
});
fetch('https://ampranking.s3.eu-north-1.amazonaws.com/2025/FIN_table25.csv').then(csv => {
    csv.text().then(text => {
        let interval = setInterval(function() {
            if (tablejsonData === undefined) { }
            else {
                clearInterval(interval);
                getCVSData(text);
                readyToReload();
                console.log('table');
            }
        }, 10);
    });
});

console.log('fetch');

let fetchDone = 0;
function readyToReload() {
    if (++fetchDone == 4) {
        let interval = setInterval(function() {
            if (typeof reloadTable != 'function') { }
            else {
                clearInterval(interval);
                reloadTable();
            }
        }, 10);
    }
}

  
 
function getCVSData (csvArray) {    
	csvData = Papa.parse (csvArray );
	csvData.data.forEach (function(line,i){	
		if(i>0 && line[0] !='') {
		 
			let boatdata = new Map();
			
			let s = line[0];
			const bin = s.replace('.dxt','');
			const jsonMap = tablejsonData.find(([key, value]) => value.BIN === bin)[1];
			boatdata.FIN_FinRating_TOT = jsonMap.FIN_FinRating_TOT;
			boatdata.FIN_FinRating_H_TOT = jsonMap.FIN_FinRating_H_TOT;
			boatdata.FIN_FinRating_L_TOT = jsonMap.FIN_FinRating_L_TOT;
			boatdata.CDL = jsonMap.CDL;
			boatdata.FIN_FinRating_TOD = jsonMap.FIN_FinRating_TOD;
			boatdata.FIN_FinRating_H_TOD = jsonMap.FIN_FinRating_H_TOD;
			boatdata.FIN_FinRating_L_TOD = jsonMap.FIN_FinRating_L_TOD;
			 
			boatdata.CrewWT = line[11];
			boatdata.C_TYPE = "TABLE";
			boatdata.TYPE = line[2];
			boatdata.FILE_ID = line[0];
			boatdata.SAILNUMB = "\xa0";
			boatdata.NAME = "\xa0";
			boatdata.index = i;
			boatlist.push(boatdata);  
			
			line.push (boatdata.FIN_FinRating_TOT);
			line.push (boatdata.FIN_FinRating_H_TOT);
			line.push (boatdata.FIN_FinRating_L_TOT);
			line.push (boatdata.CDL);
			line.push (boatdata.FIN_FinRating_TOD);
			line.push (boatdata.FIN_FinRating_H_TOD);
			line.push (boatdata.FIN_FinRating_L_TOD);
		}
		if (i===0){
			line.push ("FIN_FinRating_TOT");
			line.push ("FIN_FinRating_H_TOT");
			line.push ("FIN_FinRating_L_TOT");
			line.push ("CDL");
			line.push ("FIN_FinRating_TOD");
			line.push ("FIN_FinRating_H_TOD");
			line.push ("FIN_FinRating_L_TOD");
			csvHeader=line;
		} 
	
	}); 
	tableBoats=csvData.data.length-1;
}

function getJsonData (data) {
	data.rms.forEach (item => {
	let boatdata = new Map();
	boatdata.FIN_FinRating_TOT = item.FIN_FinRating_TOT;
	boatdata.FIN_FinRating_H_TOT = item.FIN_FinRating_H_TOT;
	boatdata.FIN_FinRating_L_TOT = item.FIN_FinRating_L_TOT;
	boatdata.CDL = item.CDL;
	boatdata.CrewWT = item.CrewWT;
	let c_type =  item.C_Type;
	boatdata.C_TYPE = c_type;
	boatdata.TYPE = item.Class;
	boatdata.FILE_ID = item.RefNo;
	boatdata.SAILNUMB = item.SailNo;
	boatdata.NAME = item.YachtName;
	boatlist.push(boatdata); 
		
	if(c_type==='INTL' || c_type === 'CLUB') {
        ++orcBoats;
        if(c_type==='INTL') ++intlBoats;
        if(c_type==='CLUB') ++clubBoats;
	}
    if(c_type==='DHIN' || c_type === 'DHCL') {
        ++dhBoats;
        if(c_type==='DHIN') ++dhinBoats;
        if(c_type==='DHCL') ++dhclBoats;
    }
    if(c_type==='NSIN' || c_type === 'NSCL') {
        ++nsBoats;
        if(c_type==='NSIN') ++nsinBoats;
        if(c_type==='NSCL') ++nsclBoats;
	}
		 
	});
 
}
 

 

 
	
	 