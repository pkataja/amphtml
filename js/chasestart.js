 
let boats = new Map();
let inputTableJS;
let firstStartTime = ['00','00','00'];
let distance=0;
let roundTime=1;
let firstBoatChanged=0;
const finlysFactor=600;

$(document).ready(function() {
    createLystable();
    startup();
});

function startup() {
    $('#lystable tbody').on('click', 'tr', function() {
       boats.set(getUniqueID(), boatlist[$(this)[0]._DT_RowIndex]);
       updateBoats() 
    });
    $(document).on('change', 'input[type=radio][name=firstBoat]', function(event) {
        firstBoatChanged=1;
        updateBoats();
    });
    $("#startTimes").click(function() {
        askSettings();
    });
    $("#createExcel").click(function() {
        createExcel();
    });
    $("#instructions").click(function() {
        alert("TBD");
    });
    askSettings();
}

function askSettings() {
    $('#fstHour').val(firstStartTime [0]);
    $('#fstMinute').val(firstStartTime [1]);
    $('#fstSecond').val(firstStartTime [2]);
    $('#fstRound').val(roundTime);
    $('#fstDistance').val(distance);
    $('#startTimeDiv').show();
    $('#finratingDiv').hide();
    $('#scratchDiv').hide();
}      
    
function useSettings() {
    $('#fstTimeError').html("");
    $('#fstDistanceError').html("");
    const hh = parseInt($('#fstHour').val());
    if (isNaN(hh) || hh > 24 || hh < 0) {
        $('#fstTimeError').html("Tarkista aika");
        return;
    }
    const mm = parseInt($('#fstMinute').val());
    if (isNaN(mm) || mm > 60 || mm < 0) {
        $('#fstTimeError').html("Tarkista aika");
        return;
    }
    const ss = parseInt($('#fstSecond').val());
    if (isNaN(ss) || ss > 60 || ss < 0) {
        $('#fstTimeError').html("Tarkista aika");
        return;
    }
    if (hh == 0 && mm == 0) {
        $('#fstTimeError').html("Tarkista aika");
        return;
    }
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    firstStartTime[0] = zeroPad(hh.toString(), 2);
    firstStartTime[1] = zeroPad(mm.toString(), 2);
    firstStartTime[2] = zeroPad(ss.toString(), 2);
    
    roundTime = $('#fstRound').val();
    distance = parseFloat($('#fstDistance').val().replace(',','.'));
  
    if (isNaN(distance) || distance < 1) {
        $('#fstDistanceError').html("Tarkista matka");
        return;
    }
    
    $('#cancelSettings').show();
    updateBoats();
}

 

function goShow() {
    $('#startTimeDiv').hide();
    $('#finratingDiv').show();
    if(boats.size > 0) {
        $('#scratchDiv').show();
        $('#createExcel').show();
    }
} 



function updateBoats() {
    
    let firstBoatSelected;  
    const sortedBoats = sortBoats(boats);  
   
    if (firstBoatChanged == 1) {
        firstBoatSelected = $("input:radio[name=firstBoat]:checked").val();
        if(boats.get(firstBoatSelected) === undefined) {
            firstBoatChanged = 0; 
        }
    }
    if (firstBoatChanged == 0) {
        firstBoatSelected = sortedBoats.keys().next().value;
    }
 
    if (inputTableJS != null) {
          inputTableJS.clear().destroy();
      }
    $('#inputTable tbody tr').remove();
       
    let frSmallest;
    let firstBoaFound = 0;
   
    for (const [key, sboat] of sortedBoats) {
        if (key === firstBoatSelected) {
            frSmallest = sboat.FIN_FinRating_TOT;
        }
     }  
    
    for (const [key, sboat] of sortedBoats) {
        let defaultBoatSelected='';
        if (key === firstBoatSelected) {
            defaultBoatSelected = 'checked=checked';
            firstBoaFound = 1;
        }
        let row = '<tr><td><input type="submit" onclick="removeBoat(\'' + key + '\')" value="-"></input>';
        row += '<input type="radio" value="' + key + '" name="firstBoat"' + defaultBoatSelected + '></input' + '</td>';
        row += '<td>'+sboat.C_TYPE+'</td>';
        row += '<td>'+sboat.TYPE+'</td>';
        row += '<td>'+fixNumber(sboat.FIN_FinRating_TOT)+'</td>';
        row += '<td>'+sboat.NAME+'</td>'; 
        row += '<td>'+sboat.SAILNUMB+'</td>';
        sboat['startTime'] = calculcateStartTime(frSmallest,sboat.FIN_FinRating_TOT,firstBoaFound);
  
        let startTime = '';
        if (sboat.startTime != undefined) {
            startTime = sboat.startTime;
        }
        row += '<td>'+startTime+'</td>';
        row += '<td style="display:none"></th>';
        row += '<td style="display:none"></th>';
        row += '<td style="display:none"></th>';
        row += '</tr>';  
        $('#inputTable tbody').append(row);
    }
    
    inputTableJS = $('#inputTable').DataTable({
           dom: '<t>',
           retrieve: true,
           ordering: false,
           fixedColumns: {
               left: 4
           },
           initComplete: function(settings, json) {
               $("#inputTable").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
           },
       });
    goShow();
}

function calculcateStartTime(frSmallest,finrating,firstBoaFound) {
    const firstStartTimeSeconds = firstStartTime.reduce((acc, time) => (60 * acc) + +time);
    let boatStartTime = firstStartTimeSeconds;
    if ( firstBoaFound == 1) {
        boatStartTime =  Math.round(firstStartTimeSeconds +  finlysFactor * distance/frSmallest - finlysFactor *  distance/finrating) ;
    }
    const hours = Math.floor(boatStartTime / 3600);
    let minutes = Math.floor(boatStartTime / 60) % 60;
    let seconds = Math.floor(boatStartTime % 60) ;
    if(roundTime === '1') {
        if(seconds>30) {
            minutes += 1;
        }
        seconds=0;
    }    
    return [hours, minutes, seconds].map(v => v < 10 ? "0" + v : v).join(":");             
}

function removeBoat(boatid) {
    boats.delete(boatid);
    if (boats.size == 0) {
        $('#scratchDiv').hide();
        return;
    }
    updateBoats();
}

function createExcel() {
    let clone = document.getElementById("inputTable").cloneNode(true);
    let wb = XLSX.utils.table_to_book(clone, { sheet: "Veneet" });
    let ws = wb.Sheets['Veneet'];
    ws['!cols'] = [{ width:4},{width:9},{width:20},{width:10},{width:30},{width:10},{width:10},{ width:10},{width:10},{ width: 10 }];
    const date = new Date();
    
    wb.Props = {};
    wb.Props.Author = "Avomeripurjehtijat ry 2025";
    wb.Props.CreatedDate = date;
    if (typeof wb.Props.SheetNames != 'undefined') {
        wb.Props.SheetNames[0] = "Veneet";
    }
    let i = 1;
    for (const [key, sboat] of sortBoats(boats)) {
        ++i;
        ws['D'+i]={t:'n',z:'0.0000',v:sboat.FIN_FinRating_TOT},
        ws['H'+i]={t:'s',v:' '},
        ws['I'+i]={t:'n',z:'hh:mm:ss',f:'IF(G'+i+'>H'+i+',H'+i+'+1,H'+i+')-G'+i},
        ws['J'+i]={t:'n',z:'hh:mm:ss',f:'((I'+i+'*86400)+(600*(1-1/D'+i+')*Asetukset!B1))/86400'}
    }
    
    
    let settings = [
        ["Matka mpk", distance],
    ];
    let ds = XLSX.utils.aoa_to_sheet(settings);
    ds['!cols'] = [{width:14},{width:4}];
    XLSX.utils.book_append_sheet(wb, ds, "Asetukset");
   
    let binary = XLSX.write(wb, { bookType:'xlsx', bookSST:false, type:'binary'}); 
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    const now = date.toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    saveAs(new Blob([s2ab(binary)],{type:""}), 'tod_'+now + '.xlsx');
}
         
    

   
   
   