// ======================================================
// HIDAYA MINI MEET 2026
// GRAND TOTAL
// FINAL VERSION 2.0
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

const csv = await response.text();

const rows = parseCSV(csv);

renderChampion(rows);

renderRanking(rows);

renderTable(rows);

}catch(error){

console.error("Loading Error :",error);

}

}



// ------------------------------------------------------
// CSV PARSER
// ------------------------------------------------------

function parseCSV(csv){

const lines = csv.trim().split(/\r?\n/);

const headers = lines[0].split(",");

const data=[];

for(let i=1;i<lines.length;i++){

const values = lines[i].split(",");

let row={};

headers.forEach((header,index)=>{

row[header.trim()] = values[index]
? values[index].trim()
: "";

});

data.push(row);

}

return data;

}
// ------------------------------------------------------
// CHAMPION
// ------------------------------------------------------

function renderChampion(rows){

const champion=[...rows].sort((a,b)=>

Number(b.TOTAL)-Number(a.TOTAL)

)[0];

document.getElementById("champion").innerHTML=`

🏆 OVERALL CHAMPION

<br><br>

🥇 ${champion.TEAM}

<br>

${champion.TOTAL} POINTS

`;

}



// ------------------------------------------------------
// LIVE TEAM RANKING
// ------------------------------------------------------

function renderRanking(rows){

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

<td>${row["SUB JUNIOR"]}</td>

<td>${row.SENIOR}</td>

<td>${row["SUPER SENIOR"]}</td>

<td>${row.GENERAL}</td>

<td><b>${row.TOTAL}</b></td>

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

// Auto refresh every 10 seconds

setInterval(loadResults,10000);
