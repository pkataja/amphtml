 

function showSingleboat(row) {
	const boat = boatlist [row]; 
	if(boat.C_TYPE ==='TABLE') {
		tableShowSingleboat (boat.index);
	}
	else {
		window.open('https://data.orc.org/public/WPub.dll/CC/'+boat.FILE_ID);
	}
}

function tableShowSingleboat(index) {
	$('#containerTable').hide();
	$('#singleBoat').show();
	const row = csvData.data [index];
	csvHeader.forEach(function(value,key) {
		const elements = document.querySelectorAll('[data-key="'+value+'"]');  
		if(elements.length > 0) {
			elements.forEach(function(element) {
				element.textContent = row[key];
			});
		}
	});
}

function backToMain () {
	$('#singleBoat').hide();
	$('#ORCBoatDiv').hide();
	$('#containerTable').show();
}