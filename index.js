document.getElementById('countBtn').addEventListener('click', function (e) {
    const allStudents = document.getElementById('textInput').value.split('\n');

    const regex = new RegExp('\\d{2}\\w{3}\\d{5}', 'g');
    var lions = [];

    // parse input text into array of arrays containing lion data
    allStudents.forEach(element => {
        if (regex.test(element)) {
            lions.push(element.split(' ').filter((e) => e != ''));
        }
    });

    setLions(lions);
});

document.getElementById('fileUpload').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert worksheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Process the JSON data
        setLions(getLions(jsonData));
    };

    reader.readAsArrayBuffer(file);
});

function getLions(jsonData) {
    const regex = new RegExp('\\d{2}\\w{3}\\d{4,5}');
    // find  out the column that has registration numbers
    for (let i = 0; i < jsonData[1].length; i++) {
        if (regex.test(jsonData[1][i])) {
            var regNumCol = i;
            break;
        }
    }

    // find lions and store into array of arrays
    var lions = [];
    const lionRegex = new RegExp('\\d{2}\\w{3}\\d{5}');
    for (let i = 1; i < jsonData.length; i++) {
        const element = jsonData[i][regNumCol];
        if (lionRegex.test(element.trim())) {
            lions.push(jsonData[i]);
        }
    }
    return lions;
}

// turn array of arrays in to html tables
function array_to_table(lions) {
    var table = '<table>';
    var count = 1;
    lions.forEach(lion => {
        table += '<tr>';
        table += `<td>${count}</td>`;
        count++;
        lion.forEach(element => {
            table += `<td>${element}</td>`;
        });
        table += '</tr>';
    });
    table += '</table>';
    return table;
}

function setLions(lions) {
    document.getElementById('lions').innerHTML = array_to_table(lions);
}
