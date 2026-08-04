// ======================================================
// HIDAYA MINI MEET 2026
// SUB JUNIOR RESULTS
// FINAL VERSION
// ======================================================


// ------------------------------------------------------
// GOOGLE SHEET CSV
// ------------------------------------------------------

const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQz8ipfKh59UBNMTnf6lrU1C_bNky3tUumYpuGAt4-d4G2O7Vs7wOFcBVcnGMDBQuHS5PtftsZ59G8b/pub?gid=1656570034&single=true&output=csv";



// ------------------------------------------------------
// START
// ------------------------------------------------------

document.addEventListener("DOMContentLoaded",()=>{

loadResults();

});



// ------------------------------------------------------
// LOAD DATA
// ------------------------------------------------------

async function loadResults(){

try{

const response = await fetch(CSV_URL);

const csv = await response.text();

const rows = parseCSV(csv);

renderRanking(rows);

renderEvents(rows);

renderPointTable(rows);

}catch(error){

console.error("Loading Error :",error);

}

}



// ------------------------------------------------------
// CSV PARSER
// ------------------------------------------------------

function parseCSV(csv){

const lines = csv.trim().split(/\r?\n/);

const headers = splitCSV(lines[0]);

const data = [];

for(let i=1;i<lines.length;i++){

const values = splitCSV(lines[i]);

let row = {};

headers.forEach((header,index)=>{

row[header.trim()] = values[index] ? values[index].trim() : "";

});

data.push(row);

}

return data;

}



// ------------------------------------------------------
// SPLIT CSV
// Handles commas inside quotes
// ------------------------------------------------------

function splitCSV(line){

const result=[];

let value="";

let insideQuotes=false;

for(let i=0;i<line.length;i++){

const char=line[i];

if(char=='"'){

insideQuotes=!insideQuotes;

continue;

}

if(char=="," && !insideQuotes){

result.push(value);

value="";

}else{

value+=char;

}

}

result.push(value);

return result;

}



// ------------------------------------------------------
// TEAM POINTS
// ------------------------------------------------------

function calculateTeams(rows){

const teams={};

rows.forEach(row=>{

if((row.STATUS||"").trim()!="PUBLISHED") return;

addPoint(teams,row.FIRST_TEAM,row.FIRST_POINT);

addPoint(teams,row.SECOND_TEAM,row.SECOND_POINT);

addPoint(teams,row.THIRD_TEAM,row.THIRD_POINT);

});

return teams;

}



function addPoint(teams,team,point){

team=(team||"").trim();

if(team=="") return;

if(!teams[team]){

teams[team]=0;

}

teams[team]+=Number(point||0);

}
// ------------------------------------------------------
// LIVE TEAM RANKING
// ------------------------------------------------------

function renderRanking(rows){

const teams = calculateTeams(rows);

const ranking = Object.entries(teams).sort((a,b)=>b[1]-a[1]);

const medals=["🥇","🥈","🥉"];

let html="";

ranking.forEach((team,index)=>{

html+=`

<div class="rank">

<span>${medals[index] || "🏅"} ${team[0]}</span>

<span>${team[1]}</span>

</div>

`;

});

document.getElementById("ranking").innerHTML=html;

}



// ------------------------------------------------------
// EVENT RESULTS
// ------------------------------------------------------

function renderEvents(rows){

let html="";

rows.forEach(row=>{

const published=(row.STATUS||"").trim()=="PUBLISHED";

html+=`

<details class="event" ${published ? "open":""}>

<summary>

${row.EVENT_NAME}

</summary>

`;

if(published){

html+=`

<div class="result">

<div class="gold">

🥇 ${row.FIRST_CHEST} ${row.FIRST_NAME}

<span style="float:right;font-weight:bold;">

${row.FIRST_TEAM}

</span>

</div>

<div class="silver">

🥈 ${row.SECOND_CHEST} ${row.SECOND_NAME}

<span style="float:right;font-weight:bold;">

${row.SECOND_TEAM}

</span>

</div>

<div class="bronze">

🥉 ${row.THIRD_CHEST} ${row.THIRD_NAME}

<span style="float:right;font-weight:bold;">

${row.THIRD_TEAM}

</span>

</div>

</div>

`;

}else{

html+=`

<div class="waiting">

Result Awaited

</div>

`;

}

html+=`

</details>

`;

});

document.getElementById("events").innerHTML=html;

}
