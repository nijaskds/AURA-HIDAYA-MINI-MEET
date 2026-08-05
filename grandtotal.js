// ======================================================
// HIDAYA MINI MEET 2026
// GRAND TOTAL
// FINAL VERSION V2
// ======================================================


// ------------------------------------------------------
// GOOGLE SHEET CSV
// ------------------------------------------------------

const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQz8ipfKh59UBNMTnf6lrU1C_bNky3tUumYpuGAt4-d4G2O7Vs7wOFcBVcnGMDBQuHS5PtftsZ59G8b/pub?gid=776690482&single=true&output=csv";


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

const response = await fetch(

CSV_URL + "&t=" + Date.now(),

{

cache:"no-store"

}

);

if(!response.ok){

throw new Error("Unable to load CSV");

}

const csv = await response.text();

const rows = parseCSV(csv);

renderChampion(rows);

renderRanking(rows);

renderTable(rows);

}catch(error){

console.error(error);

document.getElementById("champion").innerHTML="Unable to load.";

document.getElementById("ranking").innerHTML=
'<div class="waiting">Unable to load ranking.</div>';

document.getElementById("pointTable").innerHTML=
'<div class="waiting">Unable to load table.</div>';

}

}


// ------------------------------------------------------
// CSV PARSER
// ------------------------------------------------------

function parseCSV(csv){

const lines=csv.trim().split(/\r?\n/);

const headers=splitCSV(lines[0]);

const data=[];

for(let i=1;i<lines.length;i++){

if(!lines[i].trim()) continue;

const values=splitCSV(lines[i]);

let row={};

headers.forEach((header,index)=>{

row[header.trim()]=values[index]
? values[index].trim()
: "";

});

data.push(row);

}

return data;

}


// ------------------------------------------------------
// SPLIT CSV
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
// CHAMPION
// ------------------------------------------------------

function renderChampion(rows){

if(rows.length===0){

document.getElementById("champion").innerHTML=
"🏆 No Data";

return;

}

const champion=[...rows].sort((a,b)=>

Number(b.TOTAL)-Number(a.TOTAL)

)[0];

document.getElementById("champion").innerHTML=`

<h2>🏆 OVERALL CHAMPION</h2>

<h3>${champion.TEAM}</h3>

<p>${champion.TOTAL} POINTS</p>

`;

}


// ------------------------------------------------------
// LIVE TEAM RANKING
// ------------------------------------------------------

function renderRanking(rows){

if(rows.length===0){

document.getElementById("ranking").innerHTML=
'<div class="waiting">No ranking available.</div>';

return;

}

const ranking=[...rows].sort((a,b)=>

Number(b.TOTAL)-Number(a.TOTAL)

);

const medals=["🥇","🥈","🥉"];

let html="";

ranking.forEach((team,index)=>{

html+=`

<div class="rank">

<span>${medals[index] || "🏅"} ${team.TEAM}</span>

<span>${team.TOTAL}</span>

</div>

`;

});

document.getElementById("ranking").innerHTML=html;

}
// ------------------------------------------------------
// GRAND TOTAL TABLE
// ------------------------------------------------------

function renderTable(rows){

if(rows.length===0){

document.getElementById("pointTable").innerHTML=
'<div class="waiting">No data available.</div>';

return;

}

let html=`

<table>

<tr>

<th>TEAM</th>

<th>SUB JUNIOR</th>

<th>SENIOR</th>

<th>SUPER SENIOR</th>

<th>GENERAL</th>

<th>TOTAL</th>

</tr>

`;

rows.forEach(row=>{

html+=`

<tr>

<td><b>${row.TEAM}</b></td>

<td>${row["SUB JUNIOR"] || 0}</td>

<td>${row.SENIOR || 0}</td>

<td>${row["SUPER SENIOR"] || 0}</td>

<td>${row.GENERAL || 0}</td>

<td><b>${row.TOTAL || 0}</b></td>

</tr>

`;

});

html+=`

</table>

`;

document.getElementById("pointTable").innerHTML=html;

}


// ------------------------------------------------------
// AUTO REFRESH
// ------------------------------------------------------

setInterval(loadResults,10000);
