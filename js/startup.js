
let frboats=undefined;


 
function startup() {	 
	$('#currentYear').text(currentYear);
	$('#valid').text(currentYear);
    showBoatsCounts();
	createFrtable();
	
	$('#frboats tbody').on('click', 'tr td', function () { 
		if ($(this) [0]._DT_CellIndex == undefined) {
			return;
		}
		const column = $(this) [0]._DT_CellIndex.column;
		if (column != 2){
			showSingleboat($(this) [0]._DT_CellIndex.row);
		} 
	});
	 
}
 
const mobileColumns = [
			{ data: "C_TYPE", title: ""},
			{ data: "TYPE", title: 'Tyyppi\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0',},
			{ data: "FIN_FinRating_TOT", title: "FinRating"},
			{ data: "NAME", title: "Nimi\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"},
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
	   data: boatlist,
	   columns: device === 'desktop' ? desktopColumns :  mobileColumns,
	   order: [[2, 'asc']],
       lengthMenu: [10, 15, 25, 50, -1],
	   pageLength: device === 'desktop'?  desktopPageLength : mobilePageLength,
	   language: {
	       lengthMenu: "Näytä riviä _MENU_",
	       info: "Näytetään sivua _PAGE_ / _PAGES_",
           search: "Hae",
	       infoEmpty: "Ei tietueita",
	       infoFiltered: "(filtteröity _MAX_ tietueesta)",
           zeroRecords: 'Outoa, mitään ei löytynyt'
	 	},
        responsive: {
		  details: {
	          type: 'column',
		      target: 2
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
        dom: '<lf><"ctypeSearch">tip'
	});
    document.getElementsByClassName('ctypeSearch')[0].appendChild(createSelect ());
	console.log('frboats');
}


function createSelect () {
 								 
	let div =  document.createElement('div');
	div.setAttribute('id','selectDiv');
	let checkBoxDiv =  document.createElement('div');
	checkBoxDiv.setAttribute('id','checkBoxDiv');
    checkBoxDiv.appendChild(document.createTextNode('Valitse\xa0\xa0\xa0'));
	checkBoxDiv.setAttribute('class','checkBoxes');
	createCheckboxes (checkBoxDiv);
 	div.appendChild(checkBoxDiv);	
     		
	checkBoxDiv.addEventListener('change', function () {  
		let checkboxes = document.querySelectorAll('input[name="checkbox"]:checked');
		let values = [];
		checkboxes.forEach((checkbox) => {
	       	values.push(checkbox.value);
		});
		updateTable(values.join('|'));
	});
    
    return div;
	 
}	 
		 
const intlSearch = 'INTL';
const clubSearch = 'CLUB';
const dhSearch = 'DHIN|DHCL';
const nsSearch = 'NSIN|NSCL';
const tableSearch = 'TABLE';
const allSearch = tableSearch + '|' + intlSearch + '|' + clubSearch + '|' + dhSearch + '|' + nsSearch;

function createCheckboxes (checkBoxDiv) {
	const values = ['ALL',tableSearch,intlSearch,clubSearch,dhSearch,nsSearch];
	const texts = ['\xa0Kaikki\xa0\xa0','\xa0TABLE\xa0\xa0','\xa0INTL\xa0\xa0','\xa0CLUB\xa0\xa0','\xa0DH\xa0\xa0','\xa0NS'];
	['ALL', 'TABLE','INTL','CLUB','DH','NS'].forEach ((box,i) => {
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
	});
  
}

let showintl=1;
let showClub=1;
let showDh=1;
let showNs=1;
let showTable=1;

function updateTable(values) {
    console.log(values);
	if(values.includes ('ALL')) {
        values = allSearch;
        $('#NS').prop('checked', false);
        $('#DH').prop('checked', false);
        $('#CLUB').prop('checked', false);
        $('#TABLE').prop('checked', false);
        $('#INTL').prop('checked', false);
    }
	showintl=showClub=showDh=showNs=showTable=0;
	if(values.includes(tableSearch)) showTable = 1;
	if(values.includes(intlSearch)) showintl = 1;
    if(values.includes(clubSearch)) showClub = 1;
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
			console.log('reload');
		}
	}, 10);
}

function showBoatsCounts() {
	 
    let slash = '/';
	if (showDh === 0 && showTable === 0 && showNs === 0) slash = '';
	if(showintl === 1 && showClub === 1) $('#orcBoats').text(orcBoats+'\xa0ORC\xa0todistusta\xa0'+slash+'\xa0');
    if(showintl === 1 && showClub === 0 ) $('#orcBoats').text(intlBoats+'\xa0INTL\xa0todistusta\xa0'+slash+'\xa0');
    if(showintl === 0 && showClub === 1 ) $('#orcBoats').text(clubBoats+'\xa0CLUB\xa0todistusta\xa0'+slash+'\xa0');
    if(showintl === 0 && showClub === 0) $('#orcBoats').text('');
	
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



