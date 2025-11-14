 
  
let boats = new Map();
let existingIDs = [];  
let sailTimesLength = 0;
let currentDefaultBoat='';
  
let currentIDHMS;
let inputTableJS;
let lystableJS=undefined;
let sailTimesArray = new Array();
  
let maxNameWidth;
let pagingType;
let showtime=false;
     
$(document).ready(function() {  
	startup();
}); 
  
   
  
  function startup() {	 
		maxNameWidth = window.getComputedStyle(document.body).getPropertyValue('--max-name-width');
		pagingType = window.getComputedStyle(document.body).getPropertyValue('--paging-type');
	 
		
	  createLystable();
  	$('#lystable tbody').on('click', 'tr', function () {
     	addBoat (boatlist[$(this) [0]._DT_RowIndex]);
   	});
    $("#createExcel").click(function(){
    	createExcel();
  	});   
    $("#instructions").click(function(){
    	 alert("TBD");
  	});   
    $("#toggle").click(function(){
    	doToggle();
  	});  
    $('#defaultTimes').click(function (){
    	putDefaultTimes();
      updateInputs();
   	});
    $(document).on('change', 'input[type=radio][name=defaultBoat]', function (event) {
    	updateInputs();
  	});
  	$(document).on('click', 'td[name=sailtimeCh]', function (event) {
			changeASailTime();
  	});
  	 
    putDefaultTimes(); 
    
   
	}   
  
  function doToggle() {
	  showtime = !showtime;
   	let text = "Näytä aika";
   	if(!showtime) {
				text = "Näytä erotus"
   	}
   	$('#toggle').html(text);
   	console.log(showtime);
   	updateInputs();
	}
 	
	function createLystable() {

		lystableJS = $('#lystable').DataTable ({
			data:  boatlist,
			columns: [
				{ data: "TYPE", title: "Tyyppi",},
				{ data: "FIN_FinRating_TOT", title: "FR"},
				{ data: "C_TYPE", title: ""},
				{ data: "NAME", title: "Nimi"},
				{ data: "SAILNUMB", title: "Purjenro"}],
    	responsive: false,
      paging: true,
      pageLength: 8,
      language: {
      	search: "Hae veneit&auml;:&nbsp;&nbsp;",
        paginate: {
					"first":      "<<",
          "next":       ">",
           "previous":   "<",
           "last":       ">>"
       	},
    	lengthMenu: "",
      	"zeroRecords": "",
        "info": "",
        "infoEmpty": "",
        "infoFiltered": "",
    	},
      columnDefs: [{
     		targets: [1,],              
        render: function (value, type, row) {
        	return fixNumber (value);
       	}, 
     	}], 
      dom: '<fpt>' ,
      order: [[1, 'asc']],
      search: {
				caseInsensitive: true
     	},
     	fixedColumns: {
     		left: 3
     	},
    	pagingType: pagingType,
    	retrieve: true,
     	initComplete: function (settings, json) {  
	    	$("#lystable").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
	   	}
   	});
		 
		var searchInput = document.getElementById("lystable_filter").childNodes[0].childNodes[1] ;
	  searchInput.classList.remove("form-control");   
	 	$('#lystable_filter').css('display','inline').css('float','left').css('padding-right','8px');
	  $("div.dataTables_filter input").keyup( function (e) {
	  	if ($('#lystable').DataTable().page.len() == 0) {
	   		$('#lystable').DataTable().page.len(8).draw();
	   	} 
	 	});
	   
	}
	
	function changeASailTime() {

		currentIDHMS = event.target.getAttribute('id');
		const i = currentIDHMS.substr(currentIDHMS.length - 1);
		const hour = sailTimesArray[i] [0] [0];
		const minute = sailTimesArray[i] [0] [1];
		const second = sailTimesArray[i] [0] [2];
  	 
		document.getElementById(currentIDHMS).classList.add('blinkingText');
		 
		$('#changeHour').val(hour);
		$('#changeMinute').val(minute);
		$('#changeSecond').val(second);
		$('#changeOrder').text((Number(i)+1)+ ".");
			  
		const top = $("#scratchDiv").get(0).getBoundingClientRect().bottom;
		const left = Number(document.getElementById(currentIDHMS).getBoundingClientRect().left)-120;
		
		$('#sailtimeDiv').css({top:top,left:left});
		$('#sailtimeDiv').show();
		$('#finratingDiv').hide();
		  
	} 		
	
	function goShow() {
		document.getElementById(currentIDHMS).classList.remove('blinkingText');
		$('#sailtimeDiv').hide();
		$('#finratingDiv').show();
	}
		
	function updateSailTimeArray() { 
  	const i = 	currentIDHMS.substr(currentIDHMS .length - 1);
  	sailTimesArray[i] = new Array([$('#changeHour').val(), $('#changeMinute').val(), $('#changeSecond').val()]); 	 
    updateInputs();
    goShow();
	}
   
  function createExcel() {
		let clone = document.getElementById("inputTable").cloneNode(true);
    let wb =  XLSX.utils.table_to_book(clone, {sheet:"scratch"});
    let ws = wb.Sheets['scratch'];
   	ws['!cols'] =  [{width:2},{width:14},{width:20},{width:32},{width:18},{width:18},{width:18},{width:18},{width:18},{width:18}];
    const date = new Date();
    wb.Props = {};
    wb.Props.Author = "Avomeripurjehtijat ry 2025";     
    wb.Props.CreatedDate = date;
    if (typeof wb.Props.SheetNames != 'undefined') {
    	wb.Props.SheetNames[0] =  "scratch";;
  	}
    const now = date.toISOString().replace(/[^0-9]/g, '').slice(0,-3);
   	XLSX.writeFile (wb, 'scratch_' + now + '.xlsx',{type:'file'});
	}

   
	function putDefaultTimes() {
		sailTimesArray [0] = new Array (['1','00','00']) ;
		sailTimesArray [1] = new Array (['2','00','00']);
		sailTimesArray [2] = new Array (['3','00','00']) ;
		sailTimesArray [3] = new Array (['5','00','00']);
		sailTimesArray [4] = new Array (['8','00','00']) ;
		sailTimesArray [5] = new Array (['12','00','00']);
	}
      
	function fixNumber (n) {
  	if (!isNaN (n)) {
    	return Number(n).toFixed(4); 
  	}
    else {
    	return n;
  	}
 	}
     
  function addBoat (boat) { 
  	boats.set (getUniqueID(), boat);
    $('#scratchDiv').show(); 
    updateInputs ();
 	}
      
  function removeBoat (boatid) {
  	boats.delete (boatid);
    if (boats.size == 0) {
    	$('#scratchDiv').hide();
      return;
   	}
    updateInputs ();
 	}
      	
	function updateInputs () {   
	
  	let sortedBoats = sortBoats(boats);
    currentDefaultBoat = $("input:radio[name=defaultBoat]:checked").val();
    if (typeof currentDefaultBoat == 'undefined' ||  typeof boats.get(currentDefaultBoat) == 'undefined') {
    	currentDefaultBoat = sortedBoats.keys().next().value;
  	}
 
   	if (boats.size > 0) {
    	calculate();
  	}
   	
 		if (inputTableJS != null) {
 			inputTableJS.clear().destroy();
		}
    $('#inputTable tbody tr').remove(); 
    
   	for (const [key, sboat] of sortedBoats) {   
    	let defaultBoatSelected = '';
      let fontWeight = ''; 
      let showDiff=true;
      
      if (key == currentDefaultBoat) {
      	defaultBoatSelected = 'checked=checked';
        fontWeight = ' style="font-weight: bold"';
        showDiff = false;
    	}
      let row = '<tr><td><input type="submit" onclick="removeBoat(\''+ key + '\')" value="-">'; 
      row +=            '<input type="radio" value="' + key + '" name="defaultBoat"' +  defaultBoatSelected + '>' + '</td>';
      row += '<td' + fontWeight + '>' + fixNumber(sboat.FIN_FinRating_TOT) + '<span class="scratcSpacer">(' + sboat.C_TYPE + ')</span></td>' 
      row += '<td' + fontWeight + '>' + sboat.TYPE.slice(0,maxNameWidth) + '</td>'; 
      row += '<td' + fontWeight + '>' + sboat.NAME.slice(0,maxNameWidth) + '</td>';
      let timeTd=0;    
      for (time of sboat.times) {
      	if (showDiff) {
					if(showtime) {
						row += '<td>' +time [1] + time [2] + '</td>';
						row += '<td style="display:none;">(' + time [0] + ')</td>';
					}
					else {
       			row += '<td>&ensp;' + time [0] + '</td>';
       			row += '<td style="display:none;">(' + time [1] + time [2] + ')</td>>';
					}
       	} 
        else {
       		row += '<td' + fontWeight + ' name="sailtimeCh" id="hms'+timeTd+'">&ensp;'+time [0] + '</td>';
       		row += '<td style="display:none;"></td>';
				}
      	++timeTd;
        
   		}
      row += '</tr>';http: 
      $('#inputTable tbody').append (row);
  	}
   	 	 
		inputTableJS = $('#inputTable').DataTable ({
			dom: '<t>',
			retrieve: true,
			ordering: false,
			fixedColumns: {
	    	left: 3
	    }, 
	   	initComplete: function (settings, json) {  
	    	$("#inputTable").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");            
	   	},
		});
		 
 	}
      
 	const toHHMMSS = (secs) => {
  	const sec_num = parseInt(secs, 10)
    const hours   = Math.floor(sec_num / 3600)
    const minutes = Math.floor(sec_num / 60) % 60
    const seconds = sec_num % 60   
    return [hours,minutes,seconds].map(v => v < 10 ? "0" + v : v).join(":")
 	}
       
 	function sortBoats (map) {
  	const sortedBoats = new Map ([...boats].sort (([k1, v1], [k2, v2]) => {
    	if (v1.FIN_FinRating_TOT > v2.FIN_FinRating_TOT) {
      	return 1;
    	}
      if (v1.FIN_FinRating_TOT < v2.FIN_FinRating_TOT) {
      	return -1;
      }
     	return  0;
   	}));
    return sortedBoats;
	}
    
 	function getUniqueID () { 
  	const getRandomLetters = (length = 1) => Array(length).fill().map(e => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join('');
    const getRandomDigits = (length = 1) => Array(length).fill().map(e => Math.floor(Math.random() * 10)).join('');
    const generateUniqueID = () => {
    	let id = getRandomLetters(4)  + getRandomDigits(6);
      while (existingIDs.includes(id)) {
      	id = getRandomLetters(4) + getRandomDigits(6);
     	}
      return id;
  	};
    var newid =  generateUniqueID();
    existingIDs.push (newid);
    return newid;      
	}
  
      
	function calculate() {
  	if (boats.size == 0) {
    	alert ("Valitse veneet");
      	return;
   	}
    $('#createExcel').show();
    let sailtimes = [];  
      
    for (let i = 0; i < sailTimesArray.length; i++) {
    	const aSailTime = sailTimesArray [i] [0];
      let hours = aSailTime[0];  
      let minutes = aSailTime [1];
      let seconds = aSailTime [2];
      if (hours.match(/^[0-9]+$/) == null) { 
      	hours = '00';
    	} 
      if (minutes.match(/^[0-9]+$/) == null) {
      	minutes = '00';
    	}  
     	if (seconds.match(/^[0-9]+$/) == null) {
      	seconds = '00';
   		} 
   		var sailedTime = hours + ':' + minutes + ':' + seconds;
     	if (sailedTime === '00:00:00') {
      	sailedTime = null;
     	}        
     	if (sailedTime) {  
       	sailtimes.push (sailedTime.split(':').reduce((acc,time) => (60 * acc) + +time));
    	}        
 		}
    
    sailTimesLength = sailtimes.length;
    let frbase = boats.get(currentDefaultBoat).FIN_FinRating_TOT
    for (const [key, aboat] of (boats)) {
    	let fr = aboat.FIN_FinRating_TOT;
      let boatAllTimes =  [];
      for (sailtime of sailtimes) {   
      	let time = Math.floor (sailtime);
        let sail = Math.floor ((time + (frbase * time/fr) - time));
        let calc = sail * fr; 
        let diff = Math.floor (sail - time);
        let mark = "&plus;";
        if (sail < time) {
        	diff = time - sail;
         	mark = "&minus;";
       	}
        if (diff == 0) {
        	mark = "&nbsp;&nbsp; ";
        }
        let boatTimes = []
        boatTimes.push (toHHMMSS (sail));
        boatTimes.push (mark);
        boatTimes.push (toHHMMSS (diff));
        boatTimes.push (toHHMMSS (calc));
        boatAllTimes.push (boatTimes);
     	}
    	aboat ['times'] = boatAllTimes; 
    }
  }
	
	
	
	function reloadTable() {  
		let interval = setInterval(function() {
			if(lystableJS === undefined){
			}
			else{
				clearInterval(interval);
				lystableJS.clear();
				lystableJS.rows.add(boatlist);
				lystableJS.draw();
				$('#waitPlease').hide();
			}
		}, 10);
	}
	           