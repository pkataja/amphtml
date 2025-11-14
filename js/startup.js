
let frboats=undefined;
let showOrc=1;
let showDh=1;
let showNs=1;
let showTable=1;
 
function startup() {	 
	$('#currentYear').text(currentYear);
	$('#valid').text(currentYear);
  showBoatsCounts();
	
	createFrtable();
	doParam();
	
	$('#frboats tbody').on('click', 'tr td', function () { 
		if ($(this) [0]._DT_CellIndex == undefined) {
			return;
		}
		const column = $(this) [0]._DT_CellIndex.column;
		if (column == 0){
			showSingleboat($(this) [0]._DT_CellIndex.row);
		} 
	});
	 
}

function doParam() {
	const qsParam = new URL(location.href).searchParams.get('q'); 
 	if(qsParam === '1') {
		showNs=showDh=showOrc=0;
		updateTable(tableSearch); 
 	}
 	if(qsParam === '2') {
 		showNs=showDh=showTable=0;
 		updateTable(orcSearch); 
 	}
 	if(qsParam === '3') {
 		showOrc=showNs=showTable=0;
 		updateTable(dhSearch); 
 	}
 	if(qsParam === '4') {
 		showOrc=showDh=showTable=0;
  	updateTable(nsSearch); 
 	} 
}

const mobileColumns = [
			{ data: "C_TYPE", title: ""},
			{ data: "TYPE", title: "Tyyppi",},
			{ data: "FIN_FinRating_TOT", title: "FinRating"},
			{ data: "NAME", title: "Nimi"},
			{ data: "SAILNUMB", title: "Purjenro"}, 
			{ data: "FIN_FinRating_TOT", title: "FinRating"},
			{ data: "FIN_FinRating_L_TOT", title: "FR,kevyt"},
			{ data: "FIN_FinRating_H_TOT", title: "FR,kova"},
			{ data: "CrewWT", title: "Miehistön paino"},	
			{ data: "CDL", title: "CDL"}];
const mobileNoWarpTargets = [1,3,4];
const mobileNumberFixTargets = [2,5,6,7];
const mobilePageLength = 15;

const desktopColumns = 			[
			{ data: "C_TYPE", title: ""},
			{ data: "TYPE", title: "Tyyppi",},
			{ data: "FIN_FinRating_TOT", title: "FinRating"},
			{ data: "FIN_FinRating_L_TOT", title: "FR,kevyt"},
			{ data: "FIN_FinRating_H_TOT", title: "FR,kova"},
			{ data: "CrewWT", title: "M.paino"},
			{ data: "NAME", title: "Nimi"},
			{ data: "SAILNUMB", title: "Purjenro"}, 
			{ data: "CDL", title: "CDL"}]		;	
const desktopNoWarpTargets = [1,6,7];
const desktopNumberFixTargets = [2,3,4,8];
const desktopPageLength = 25;

function createFrtable() { 
	
	const device = window.getComputedStyle(document.body).getPropertyValue('--device');

	frboats = $('#frboats').DataTable({
		data:  boatlist,
		columns: device === 'desktop' ? desktopColumns :  mobileColumns,
		order: [[2, 'asc']],
		pageLength: device === 'desktop'?  desktopPageLength : mobilePageLength,
		language: {
	 	 		lengthMenu: 
					"Näytä _MENU_ riviä sivulla",
	        "info": "Näytetään sivua _PAGE_ / _PAGES_",
	        "infoEmpty": "Ei tietueita",
	        "infoFiltered": "(filtteröity _MAX_ tietueesta)",
					"zeroRecords": 'Outoa, mitään ei löytynyt'
	 	},
		responsive: {
			details: {
					type: 'column',
					target: 1
			 }
		},
	  columnDefs: [
			{targets: device === 'desktop' ? desktopNumberFixTargets : mobileNumberFixTargets,
				    	render(v) {
				      if (v != '-') return Number(v).toFixed(4);
				      else return "-";
				    	}
						},
			{targets: device === 'desktop' ? desktopNoWarpTargets : mobileNoWarpTargets,
				className: 'dt-body-nowrap'
	    } 
		
		],
		initComplete: function () {
			this.api().columns(0).every(creeateSelect);
		}
	});
	
}


function creeateSelect () {
	let column = this;								 
	let div =  document.createElement('div');
	div.setAttribute('id','selectDiv');
	div.appendChild(document.createTextNode('Näytä'));			

	let checkBoxDiv =  document.createElement('div');
	checkBoxDiv.setAttribute('id','checkBoxDiv');
	checkBoxDiv.setAttribute('class','checkBoxes');
	createCheckboxes (checkBoxDiv);
 	div.appendChild(checkBoxDiv);	
	
	column.header().replaceChildren(div);
	$('#checkBoxDiv').hide();
 
	$('#selectDiv').hover(function() {
		$('#checkBoxDiv').show();
	}, function() {  
		$('#checkBoxDiv').hide();
	});
							
	checkBoxDiv.addEventListener('change', function () {  
		let checkboxes = document.querySelectorAll('input[name="checkbox"]:checked');
		let values = [];
		checkboxes.forEach((checkbox) => {
	   	values.push(checkbox.value);
		});
		updateTable(values.join('|'));
	});
	 
}	 
		 
const orcSearch = 'INTL|CLUB';
const dhSearch = 'DHIN|DHCL';
const nsSearch = 'NSIN|NSCL';
const tableSearch = 'TABLE';
const allSearch = tableSearch + '|' + orcSearch + '|' + dhSearch + '|' + nsSearch;

function createCheckboxes (checkBoxDiv) {
	const values = [allSearch,tableSearch,orcSearch,dhSearch,nsSearch];
	const texts = ['\xa0Kaikki','\xa0Table','\xa0ORC','\xa0DH','\xa0NS'];
	['ALL', 'TABLE','ORC','DH','NS'].forEach ((box,i) => {
		let checkbox = document.createElement('input');
		checkbox.type = "checkbox";
		checkbox.name = "checkbox";
		checkbox.id = box;
		checkbox.value = values[i];
		checkBoxDiv.appendChild(checkbox);
		label = document.createElement('label')
		label.htmlFor = box;
		label.appendChild(document.createTextNode(texts[i])); 
		checkBoxDiv.appendChild(label);
	  checkBoxDiv.appendChild(document.createElement('br'));
	});
}

function updateTable(values) {
	if(values.includes ('ALL')) values = allSearch;
	showOrc=showDh=showNs=showTable=0;
	if(values.includes(tableSearch)) showTable = 1;
	if(values.includes(orcSearch)) showOrc = 1;
	if(values.includes(dhSearch)) showDh = 1;
	if(values.includes(nsSearch)) showNs = 1; 		 
	showBoatsCounts();
	frboats.column(0).search(values, {exact: true}).draw();
	frboats.column(2).order('asc').draw();		
} 
 
function reloadTable() {  
	let interval = setInterval(function() {
		if( frboats === undefined){
		}
		else{
			clearInterval(interval);
			showBoatsCounts();	
			frboats.clear();
			frboats.rows.add(boatlist);
			frboats.draw();
			$('#waitPlease').hide();
		}
	}, 10);
}

function showBoatsCounts() {
	 
	let slash = '/';
	if (showDh === 0 && showTable === 0 && showNs === 0) slash = '';
	if(showOrc === 1) $('#orcBoats').text(orcBoats+'\xa0ORC\xa0todistusta\xa0'+slash+'\xa0');
  else $('#orcBoats').text('');
	
	slash = '/';
	if (showNs === 0 && showTable === 0) slash = '';
	if(showDh === 1)	$('#dhBoats').text(dhBoats+'\xa0DH\xa0todistusta\xa0'+slash+' ');
	else $('#dhBoats').text(''); 
	
	slash = '/';
	if (showTable === 0) slash = '';
	if(showNs === 1)	$('#nsBoats').text(nsBoats+'\xa0NS\xa0todistusta\xa0'+slash+'\xa0');
	else $('#nsBoats').text('');
	
	if(showTable=== 1) $('#tableBoats').text(tableBoats+'\xa0Taululukkovenettä');
	else $('#tableBoats').text(''); 
  
}



