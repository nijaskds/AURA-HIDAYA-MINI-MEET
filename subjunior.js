// ======================================================
// HIDAYA MINI MEET 2026
// SUB JUNIOR RESULTS
// FINAL VERSION 3.0
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

renderRanking(rows);

renderEvents(rows);

renderPointTable(rows);

}catch(error){

console.error(error);

document.getElementById("ranking").innerHTML=
'<div class="waiting">Unable to load ranking.</div>';

document.getElementById("events").innerHTML=
'<div class="waiting">Unable to load events.</div>';

document.getElementById("pointTable").innerHTML=
'<div class="waiting">Unable to load point table.</div>';

}

}



// ------------------------------------------------------
// CSV PARSER
// ------------------------------------------------------

function parseCSV(csv){

const lines = csv.trim().split(/\r?\n/);

const headers = splitCSV(lines[0]);

const data=[];

for(let i=1;i<lines.length;i++){

if(!lines[i].trim()) continue;

const values = splitCSV(lines[i]);

const row={};

headers.forEach((header,index)=>{

row[header.trim()] = (values[index] || "").trim();

});

data.push(row);

}

return data;

}



// ------------------------------------------------------
// SPLIT
// ------------------------------------------------------
// LIVE TEAM RANKING
// ------------------------------------------------------

function renderRanking(rows){

const teams=calculateTeams(rows);

const ranking=Object.entries(teams).sort((a,b)=>b[1]-a[1]);

const medals=["🥇","🥈","🥉"];

let html="";

if(ranking.length===0){

html='<div class="waiting">No published results.</div>';

}else{

ranking.forEach((team,index)=>{

html+=`

<div class="rank">

<span>${medals[index] || "🏅"} ${team[0]}</span>

<span>${team[1]}</span>

</div>

`;

});

}

document.getElementById("ranking").innerHTML=html;

}



// ------------------------------------------------------
// EVENT RESULTS
// ------------------------------------------------------

function renderEvents(rows){

let html="";

rows.forEach(row=>{

const published=(row.STATUS||"").trim()==="PUBLISHED";

html+=`

<details class="event" ${published ? "open" : ""}>

<summary>

${row.EVENT_NAME || "-"}

</summary>

`;

if(published){

html+=`

<div class="result">

<div class="gold">

🥇 ${row.FIRST_CHEST || ""} ${row.FIRST_NAME || ""}

<span style="float:right;font-weight:bold;">

${row.FIRST_TEAM || ""}

</span>

</div>

<div class="silver">

🥈 ${row.SECOND_CHEST || ""} ${row.SECOND_NAME || ""}

<span style="float:right;font-weight:bold;">

${row.SECOND_TEAM || ""}

</span>

</div>

<div class="bronze">

🥉 ${row.THIRD_CHEST || ""} ${row.THIRD_NAME || ""}

<span style="float:right;font-weight:bold;">

${row.THIRD_TEAM || ""}

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
// ------------------------------------------------------
// POINT TABLE
// ------------------------------------------------------

function renderPointTable(rows){

const teams=[...new Set(

rows.flatMap(row=>[
(row.FIRST_TEAM||"").trim(),
(row.SECOND_TEAM||"").trim(),
(row.THIRD_TEAM||"").trim()
]).filter(Boolean)

)].sort();

if(teams.length===0){

document.getElementById("pointTable").innerHTML=
'<div class="waiting">No published results.</div>';

return;

}

const totalPoints={};

teams.forEach(team=>{

totalPoints[team]=0;

});

let html=`

<table>

<tr>

<th>Event</th>

`;

teams.forEach(team=>{

html+=`<th>${team}</th>`;

});

html+=`

</tr>

`;

rows.forEach(row=>{

const points={};

teams.forEach(team=>{

points[team]=0;

});

if((row.STATUS||"").trim()==="PUBLISHED"){

if((row.FIRST_TEAM||"").trim()){

points[row.FIRST_TEAM.trim()]+=Number(row.FIRST_POINT)||0;

}

if((row.SECOND_TEAM||"").trim()){

points[row.SECOND_TEAM.trim()]+=Number(row.SECOND_POINT)||0;

}

if((row.THIRD_TEAM||"").trim()){

points[row.THIRD_TEAM.trim()]+=Number(row.THIRD_POINT)||0;

}

}

html+=`

<tr>

<td>${row.EVENT_NAME||""}</td>

`;

teams.forEach(team=>{

html+=`<td>${points[team]}</td>`;

totalPoints[team]+=points[team];

});

html+=`

</tr>

`;

});

html+=`

<tr style="background:#f3f7ff;font-weight:bold;">

<td>TOTAL</td>

`;

teams.forEach(team=>{

html+=`<td>${totalPoints[team]}</td>`;

});

html+=`

</tr>

<tr>

<td colspan="${teams.length+1}"

style="padding:15px;text-align:center;color:#777;font-style:italic;">

Results of the remaining events will be published after official verification.

</td>

</tr>

</table>

`;

document.getElementById("pointTable").innerHTML=html;

}



// ------------------------------------------------------
// AUTO REFRESH
// ------------------------------------------------------

setInterval(loadResults,10000);
