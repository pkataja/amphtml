
let frboats;


 
function startup() {	 
	$('#currentYear').text(currentYear);
	$('#valid').text(currentYear);
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
    $("#selectButton").click(function() {
      $('#selectCtypeDiv').show();
      $('#selectCtypeDiv').css({top:$('#frTableDiv').position().top+'px'});
    });
    $("#selectCtypeDiv").change(function () {  
        let checkboxes = document.querySelectorAll('input[name="checkbox"]:checked');
        let values = [];
        checkboxes.forEach((checkbox) => {
            values.push(checkbox.value);
        });
        updateTable(values.join('|'));
    }); 
}

function goShow() {
    $('#selectCtypeDiv').hide();
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
        dom: '<lf<"ctypeSearch">>tip'
	});
    document.getElementsByClassName('ctypeSearch')[0].appendChild(createSelect ());
	console.log('frboats');
 
}


function createSelect () {				 
	let div =  document.createElement('div');
	div.setAttribute('id','selectDiv');
	let checkBoxDiv =  document.createElement('div');
	checkBoxDiv.setAttribute('id','checkBoxDiv');
    var selectButton = document.createElement("button");
    selectButton.setAttribute('id','selectButton');
    selectButton.appendChild(document.createTextNode("Valitse"));
    div.appendChild(selectButton);      
    return div;
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
			console.log('reloaded');
            setSelectCounts();
		}
	}, 10);
}

function setSelectCounts() {
    $('#orcSelect').text(orcBoats);
    $('#intlSelect').text(intlBoats);
    $('#clubSelect').text(clubBoats);
    $('#dhSelect').text(dhBoats);
    $('#dhinSelect').text(dhinBoats);
    $('#dhclSelect').text(dhclBoats);
    $('#nsSelect').text(nsBoats);
    $('#nsinSelect').text(nsinBoats);
    $('#nsclSelect').text(nsclBoats);
    $('#tableSelect').text(tableBoats);
    $('#INTL').prop('checked', true);
    $('#CLUB').prop('checked', true);
    $('#DHIN').prop('checked', true);
    $('#DHCL').prop('checked', true);
    $('#NSIN').prop('checked', true);
    $('#NSCL').prop('checked', true);
    $('#TABLE').prop('checked', true); 
}

let showintl=1;
let showClub=1;
let showIndh=1;
let showCldh=1;
let showInns=1;
let showClns=1;
let showTable=1;

function updateTable(values) {
    if(values === '') {
        values = '_DONT_SHOW_NOTHING_Ñ_';
    }
    showintl=showClub=showIndh=showCldh=showInns=showClns=showTable=0;
    if(values.includes('TABLE')) showTable = 1;
    if(values.includes('INTL')) showintl = 1;
    if(values.includes('CLUB')) showClub = 1;
    if(values.includes('DHIN')) showIndh = 1;
    if(values.includes('DHCL')) showCldh = 1;
    if(values.includes('NSIN')) showInns = 1;
    if(values.includes('NSCL')) showClns = 1;  
    showBoatsCounts();
    frboats.column(0).search(values, {exact: true}).draw();
    frboats.column(2).order('asc').draw();      
} 

function showBoatsCounts() {
    
    let slash = '/';
	if (showIndh === 0 && showCldh === 0 && showTable === 0 && showInns === 0 && showClns === 0) slash = '';
	if (showintl === 1 && showClub === 1) $('#orcBoats').text(orcBoats+'\xa0ORC\xa0todistusta\xa0'+slash+'\xa0');
    if (showintl === 1 && showClub === 0) $('#orcBoats').text(intlBoats+'\xa0INTL\xa0todistusta\xa0'+slash+'\xa0');
    if (showintl === 0 && showClub === 1) $('#orcBoats').text(clubBoats+'\xa0CLUB\xa0todistusta\xa0'+slash+'\xa0');
    if (showintl === 0 && showClub === 0) $('#orcBoats').text('');
	
	slash = '/';
	if (showInns === 0 && showClns === 0 && showTable === 0) slash = '';
	if (showIndh === 1 && showCldh === 1) $('#dhBoats').text(dhBoats+'\xa0DH\xa0todistusta\xa0'+slash+' ');
    if (showIndh === 1 && showCldh === 0) $('#dhBoats').text(dhinBoats+'\xa0DHIN\xa0todistusta\xa0'+slash+' ');
    if (showIndh === 0 && showCldh === 1) $('#dhBoats').text(dhclBoats+'\xa0DHCL\xa0todistusta\xa0'+slash+' ');
	if (showIndh === 0 && showCldh === 0) $('#dhBoats').text(''); 
	
	slash = '/';
	if (showTable === 0) slash = '';
	if(showInns === 1 && showClns ===1)	$('#nsBoats').text(nsBoats+'\xa0NS\xa0todistusta\xa0'+slash+'\xa0');
    if(showInns === 1 && showClns ===0) $('#nsBoats').text(nsinBoats+'\xa0NSIN\xa0todistusta\xa0'+slash+'\xa0');
    if(showInns === 0 && showClns ===1) $('#nsBoats').text(nsclBoats+'\xa0NSCL\xa0todistusta\xa0'+slash+'\xa0');
	if(showInns === 0 && showClns ===0) $('#nsBoats').text('');
	
	if(showTable=== 1) $('#tableBoats').text(tableBoats+'\xa0Taululukkovenettä');
	else $('#tableBoats').text(''); 
  
}


