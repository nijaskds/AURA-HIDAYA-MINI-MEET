// ======================================================
// HIDAYA MINI MEET 2026
// GRAND TOTAL
// FINAL VERSION V3
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

document.getElementById("champion").innerHTML=
"Unable to load.";

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

const totalRow = rows.find(row=>

(row[""] || row.TEAM || "").trim().toUpperCase()=="TOTAL"

);

if(!totalRow){

document.getElementById("champion").innerHTML="🏆 No Data";

return;

}

const teams=[

{name:"A",points:Number(totalRow.A||0)},

{name:"B",points:Number(totalRow.B||0)},

{name:"C",points:Number(totalRow.C||0)}

];

teams.sort((a,b)=>b.points-a.points);

const champion=teams[0];

document.getElementById("champion").innerHTML=`

<h2>🏆 OVERALL CHAMPION</h2>

<h3>TEAM ${champion.name}</h3>

<p>${champion.points} POINTS</p>

`;

}


// ------------------------------------------------------
// LIVE TEAM RANKING
// ------------------------------------------------------

function renderRanking(rows){

const totalRow = rows.find(row=>

(row[""] || row.TEAM || "").trim().toUpperCase()=="TOTAL"

);

if(!totalRow){

document.getElementById("ranking").innerHTML=
'<div class="waiting">No ranking available.</div>';

return;

}

const ranking=[

{name:"A",points:Number(totalRow.A||0)},

{name:"B",points:Number(totalRow.B||0)},

{name:"C",points:Number(totalRow.C||0)}

].sort((a,b)=>b.points-a.points);

const medals=["🥇","🥈","🥉"];

let html="";

ranking.forEach((team,index)=>{

html+=`

<div class="rank">

<span>${medals[index]} TEAM ${team.name}</span>

<span>${team.points}</span>

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

<th>Category</th>

<th>A</th>

<th>B</th>

<th>C</th>

</tr>

`;

rows.forEach(row=>{

const category = row[""] || row.TEAM || "";

const isTotal = category.trim().toUpperCase()=="TOTAL";

html+=`

<tr ${isTotal ? 'style="background:#FFF8E1;font-weight:bold;"' : ""}>

<td><b>${category}</b></td>

<td>${row.A || 0}</td>

<td>${row.B || 0}</td>

<td>${row.C || 0}</td>

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
