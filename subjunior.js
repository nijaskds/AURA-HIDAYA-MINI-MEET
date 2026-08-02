// ==========================================
// HIDAYA MINI MEET 2026
// SUB JUNIOR RESULTS
// ==========================================

// Google Sheet CSV Link

const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQz8ipfKh59UBNMTnf6lrU1C_bNky3tUumYpuGAt4-d4G2O7Vs7wOFcBVcnGMDBQuHS5PtftsZ59G8b/pub?gid=1656570034&single=true&output=csv";



// ==========================================
// START
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

loadData();

});



// ==========================================
// LOAD CSV
// ==========================================

async function loadData(){

try{

const response = await fetch(CSV_URL);

const csv = await response.text();

const rows = parseCSV(csv);

console.log(rows);

renderRanking(rows);

renderEvents(rows);

renderPointTable(rows);

}catch(error){

console.error(error);

}

}



// ==========================================
// CSV TO OBJECT
// ==========================================

function parseCSV(csv){

const lines = csv.trim().split("\n");

const headers = lines[0].split(",");

const data = [];

for(let i=1;i<lines.length;i++){

const values = lines[i].split(",");

let row = {};

headers.forEach((header,index)=>{

row[header.trim()] = values[index] ? values[index].trim() : "";

});

data.push(row);

}

return data;

}



// ==========================================
// FUNCTIONS
// ==========================================

function renderRanking(rows){

// Part 2

}



function renderEvents(rows){

let html = "";

rows.forEach(row=>{

const status = (row.STATUS || "").trim();

if(status === "PUBLISHED"){

html += `

<details class="event">

<summary>

${row.EVENT_NAME}

</summary>

<div class="result">

<div class="gold">

🥇 ${row.FIRST_CHEST} ${row.FIRST_NAME} - TEAM ${row.FIRST_TEAM}

</div>

<div class="silver">

🥈 ${row.SECOND_CHEST} ${row.SECOND_NAME} - TEAM ${row.SECOND_TEAM}

</div>

<div class="bronze">

🥉 ${row.THIRD_CHEST} ${row.THIRD_NAME} - TEAM ${row.THIRD_TEAM}

</div>

</div>

</details>

`;

}else{

html += `

<details class="event">

<summary>

${row.EVENT_NAME}

</summary>

<div class="waiting">

Result Awaited

</div>

</details>

`;

}

});

document.getElementById("events").innerHTML = html;

}



function renderPointTable(rows){

// Part 4

}
// ==========================================
// PART 2
// LIVE TEAM RANKING
// ==========================================

function renderRanking(rows){

const teams = {

A:0,
B:0,
C:0

};

// Published Events മാത്രം Count ചെയ്യുക

rows.forEach(row=>{

if(row.STATUS !== "PUBLISHED") return;

teams[row.FIRST_TEAM] += Number(row.FIRST_POINT || 0);

teams[row.SECOND_TEAM] += Number(row.SECOND_POINT || 0);

teams[row.THIRD_TEAM] += Number(row.THIRD_POINT || 0);

});


// Sort Teams

const ranking = Object.entries(teams)

.sort((a,b)=>b[1]-a[1]);


// HTML

const medals = ["🥇","🥈","🥉"];

let html = "";

ranking.forEach((team,index)=>{

html += `

<div class="rank">

<span>${medals[index]} TEAM ${team[0]}</span>

<span>${team[1]}</span>

</div>

`;

});


document.getElementById("ranking").innerHTML = html;

}
