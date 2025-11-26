

let lystableJS = undefined;
let existingIDs = [];
 
function reloadTable() {
    let interval = setInterval(function() {
        if (lystableJS === undefined) {
        }
        else {
            clearInterval(interval);
            lystableJS.clear();
            lystableJS.rows.add(boatlist);
            lystableJS.draw();
            $('#waitPlease').hide();
        }
    }, 10);
}

function createLystable() {

    lystableJS = $('#lystable').DataTable({
        data: boatlist,
        columns: [
            { data: "C_TYPE", title: "" },
            { data: "TYPE", title: "Tyyppi", },
            { data: "FIN_FinRating_TOT", title: "FR" },
            { data: "NAME", title: "Nimi" },
            { data: "SAILNUMB", title: "Purjenro" }],
        responsive: false,
        paging: true,
        pageLength: 8,
        language: {
            search: "Hae veneit&auml;:&nbsp;&nbsp;",
            lengthMenu: "",
            zeroRecords: "",
            info: "",
            infoEmpty: "",
            infoFiltered: "",
        },
        columnDefs: [{
            targets: [2,],
            render: function (value, type, row) {
                return fixNumber (value);
            }, 
            
        }],
        dom: 'sftip',
        order: [[2, 'asc']],
        search: {
            caseInsensitive: true
        },
        fixedColumns: {
            left: 3
        },
        retrieve: true,
        initComplete: function(settings, json) {
            $("#lystable").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
        }
    });

    var searchInput = document.getElementById("lystable_filter").childNodes[0].childNodes[1];
    searchInput.classList.remove("form-control");
    $('#lystable_filter').css('display', 'inline').css('float', 'left').css('padding-right', '0.66rem').css('padding-bottom', '1rem');
    $("div.dataTables_filter input").keyup(function(e) {
        if ($('#lystable').DataTable().page.len() == 0) {
            $('#lystable').DataTable().page.len(8).draw();
        }
    });

}

function fixNumber(n) {
    if (!isNaN(n)) {
        return Number(n).toFixed(4);
    }
    else {
        return n;
    }
}


function sortBoats(map) {
    const sortedBoats = new Map([...boats].sort(([k1, v1], [k2, v2]) => {
        if (v1.FIN_FinRating_TOT > v2.FIN_FinRating_TOT) {
            return 1;
        }
        if (v1.FIN_FinRating_TOT < v2.FIN_FinRating_TOT) {
            return -1;
        }
        return 0;
    }));
    return sortedBoats;
}

function getUniqueID() {
    const getRandomLetters = (length = 1) => Array(length).fill().map(e => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join('');
    const getRandomDigits = (length = 1) => Array(length).fill().map(e => Math.floor(Math.random() * 10)).join('');
    const generateUniqueID = () => {
        let id = getRandomLetters(4) + getRandomDigits(6);
        while (existingIDs.includes(id)) {
            id = getRandomLetters(4) + getRandomDigits(6);
        }
        return id;
    };
    var newid = generateUniqueID();
    existingIDs.push(newid);
    return newid;
}
 




