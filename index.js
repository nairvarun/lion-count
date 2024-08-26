// // formatted console greeting
// console.log(
// 	"%cheloo",
// 	"font-size:25px;"
// );

// all click event handlers.
window.addEventListener('click', (MouseEvent) => {
    const contextMenuCss = document.querySelector('.custom-cm').style;
    const clickedOn = MouseEvent.target.innerText;

    // hide context menu on click
    if (contextMenuCss.visibility === 'visible') {
        contextMenuCss.visibility = '';
    }

    // custom context menu actions
    if (MouseEvent.target.className === 'custom-cm__item') {
        switch (clickedOn) {
            case 'clear':
                document.getElementById('primary-output').value = '';
                break;
            case 'github':
                window.open('https://github.com/nairvarun/lions', '_blank');
                break;
            default:
                break;
        }
    }
});

// show custom context menu (at cursor location) on right click
window.addEventListener('contextmenu', (MouseEvent) => {
    MouseEvent.preventDefault();   // prevents the default context menu from showing so that our custom one can replace it.

    const contextMenu = document.querySelector('.custom-cm');

    if (contextMenu.style.visibility === 'visible') {
        contextMenu.style.visibility = '';
    }

    // prevents the context menu from overflowing outside the window
    if (contextMenu.style.visibility === '') {
        if (MouseEvent.y + contextMenu.offsetHeight > window.innerHeight) {
            contextMenu.style.top = window.innerHeight - contextMenu.offsetHeight + 'px';
        } else {
            contextMenu.style.top = `${MouseEvent.y}px`;
        }
        if (MouseEvent.x + contextMenu.offsetWidth > window.innerWidth) {
            contextMenu.style.left = window.innerWidth - contextMenu.offsetWidth + 'px';
        } else {
            contextMenu.style.left = `${MouseEvent.x}px`;
        }
        contextMenu.style.visibility = 'visible';
    }
});

Object.values(document.getElementsByClassName('count-button')).forEach(element => {
    element.addEventListener('click', function (e) {
        const allStudents = document.getElementById('primary-output').value.split('\n');

        const regex = new RegExp('\\d{2}[A-Za-z]{3}\\d{5}\\D*');
        var lions = [];

        // parse input text into array of arrays containing lion data
        allStudents.forEach(element => {
            if (regex.test(element)) {
                lions.push(element.split(' ').filter((e) => e != ''));
            }
        });

        setLions(lions);
    });
});

document.getElementById('acme-menubar__fileUpload').addEventListener('change', function (e) {
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
    const regex = new RegExp('\\d{2}[A-Za-z]{3}\\d{4,5}');
    // find  out the column that has registration numbers
    for (let i = 0; i < jsonData[1].length; i++) {
        if (regex.test(jsonData[1][i])) {
            var regNumCol = i;
            break;
        }
    }

    // find lions and store into array of arrays
    var lions = [];
    const lionRegex = new RegExp('\\d{2}[A-Za-z]{3}\\d{5}\\D*');
    for (let i = 1; i < jsonData.length; i++) {
        const element = jsonData[i][regNumCol];
        try {
            if (lionRegex.test(element.trim())) {
                lions.push(jsonData[i]);
            }
        } catch (error) {
            console.log(error)
        }
    }
    return lions;
}

// turn array of arrays in to html tables
function array_to_table(lions) {
    var table = '';
    var count = 1;
    lions.forEach(lion => {
        table += `${count}. `;
        count++;
        lion.forEach(element => {
            table += `${element}   `;
        });
        table += `\n`
    });
    return table;
}

function setLions(lions) {
    const output_area = document.getElementById('primary-output');
    if (lions.length == 0) {
        output_area.value = 'no lions found :( (or no registration numbers provided)'
    } else {
        output_area.value = array_to_table(lions);
    }
    document.getElementById('acme-menubar__fileUpload').value = "";
}
