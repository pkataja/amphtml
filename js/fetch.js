 

const currentYear = new Date().getFullYear();
 
const boatlist = new Array();
let csvData;
let csvHeader;
let tablejsonData;
let orcBoats=0;
let dhBoats=0;
let nsBoats=0;
let tableBoats=0;
 
 
console.log('orc') ;
Promise.all([
	fetch('https://data.orc.org/public/WPub.dll?action=DownRMS&CountryId=FIN&ext=json&family=1&VPPYear='+currentYear),
	fetch('https://data.orc.org/public/WPub.dll?action=DownRMS&CountryId=FIN&ext=json&family=3&VPPYear='+currentYear),
	fetch('https://data.orc.org/public/WPub.dll?action=DownRMS&CountryId=FIN&ext=json&family=5&VPPYear='+currentYear)
]).then(orcjsons => {
	return Promise.all(orcjsons.map(orc => orc.json()));
	}).then(results => {
		results.forEach(async (json) => {
			getJsonData (json);
		});
		console.log('orc');
		readyToReload();
});		
 
console.log('table');		
fetch ('https://ampranking.s3.eu-north-1.amazonaws.com/2025/FinnishClass.json').then(response => {
			return response.json();
		}).then(tablejson => {
			tablejsonData = Array.from(tablejson.rms.entries());
				fetch('https://ampranking.s3.eu-north-1.amazonaws.com/2025/FIN_table25.csv').then(csv => {
					getCVSData(csv);
					console.log('table');
					readyToReload();
			});
		}); 
console.log('fetch');

let fetchDone=0;
function readyToReload() {
	if(++fetchDone == 2) reloadTable();
}

  
 
async function getCVSData (cvs) {
	const csvArray = await cvs.text();
	csvData = Papa.parse (csvArray );
	csvData.data.forEach (function(line,i){	
		if(i>0 && line[0] !='') {
		 
			let boatdata = new Map()
			
			let s = line[0];
			const bin = s.replace('.dxt','');;
			const jsonMap = tablejsonData.find(([key, value]) => value ["BIN"] === bin)[1];
			boatdata ["FIN_FinRating_TOT"] = jsonMap ["FIN_FinRating_TOT"];
			boatdata ["FIN_FinRating_H_TOT"] = jsonMap ["FIN_FinRating_H_TOT"];
			boatdata ["FIN_FinRating_L_TOT"] = jsonMap ["FIN_FinRating_L_TOT"];
			boatdata ["CDL"] = jsonMap ["CDL"];
			boatdata ["FIN_FinRating_TOD"] = jsonMap ["FIN_FinRating_TOD"];
			boatdata ["FIN_FinRating_H_TOD"] = jsonMap ["FIN_FinRating_H_TOD"];
			boatdata ["FIN_FinRating_L_TOD"] = jsonMap ["FIN_FinRating_L_TOD"];
			 
			boatdata ["CrewWT"] = line[11];
			boatdata ["C_TYPE"] = "TABLE";
			boatdata ["TYPE"] = line[2];
			boatdata ["FILE_ID"] = line[0];
			boatdata ["SAILNUMB"] = "";
			boatdata ["NAME"] = "";
			boatdata ["index"] = i;
			boatlist.push(boatdata);  
			
			line.push (boatdata ["FIN_FinRating_TOT"] );
			line.push (boatdata ["FIN_FinRating_H_TOT"] );
			line.push (boatdata ["FIN_FinRating_L_TOT"] );
			line.push (boatdata ["CDL"] );
			line.push (boatdata ["FIN_FinRating_TOD"] );
			line.push (boatdata ["FIN_FinRating_H_TOD"] );
			line.push (boatdata ["FIN_FinRating_L_TOD"] );
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
	data ["rms"].forEach (item => {
		let boatdata = new Map();
		boatdata ["FIN_FinRating_TOT"] = item ["FIN_FinRating_TOT"];
		boatdata ["FIN_FinRating_H_TOT"] = item ["FIN_FinRating_H_TOT"];
		boatdata ["FIN_FinRating_L_TOT"] = item ["FIN_FinRating_L_TOT"];
		boatdata ["CDL"] = item ["CDL"];
		boatdata ["CrewWT"] = item ["CrewWT"];
		let c_type =  item ["C_Type"];
		boatdata ["C_TYPE"] = c_type;
		boatdata ["TYPE"] = item ["Class"];
		boatdata ["FILE_ID"] = item ["RefNo"];
		boatdata ["SAILNUMB"] = item ["SailNo"];
	 	boatdata ["NAME"] = item ["YachtName"];
	  boatlist.push(boatdata); 
		
		if(c_type==='INTL' || c_type === 'CLUB') {
				++orcBoats;
		}
		if(c_type==='DHIN' || c_type === 'DHCL') {
				dhBoats = data ["rms"].length;
		}
		if(c_type==='HSIN' || c_type === 'NSCL') {
			nsBoats = data ["rms"].length;
		}
		 
	});
 
}
 

 

 
	
	 