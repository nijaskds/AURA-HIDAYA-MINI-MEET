// ======================================================
// HIDAYA MINI MEET 2026
// SUB JUNIOR RESULTS
// Version 2.0
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
// LOAD CSV
// ------------------------------------------------------

async function loadResults(){

try{

const response=await fetch(CSV_URL);

const csv=await response.text();

const rows=parseCSV(csv);

renderRanking(rows);

renderEvents(rows);

renderPointTable(rows);

}catch(error){

console.error(error);

}

}


// ------------------------------------------------------
// CSV PARSER
// ------------------------------------------------------

function parseCSV(csv){

const lines=csv.trim().split("\n");

const headers=lines[0].split(",");

const data=[];

for(let i=1;i<lines.length;i++){

const row={};

const values=lines[i].split(",");

headers.forEach((header,index)=>{

row[header.trim()]=values[index] ? values[index].trim() : "";

});

data.push(row);

}

return data;

}


// ------------------------------------------------------
// CALCULATE TEAM POINTS
// ------------------------------------------------------

function calculateTeams(rows){

const teams={};

rows.forEach(row=>{

if(row.STATUS!="PUBLISHED") return;

addPoint(teams,row.FIRST_TEAM,row.FIRST_POINT);

addPoint(teams,row.SECOND_TEAM,row.SECOND_POINT);

addPoint(teams,row.THIRD_TEAM,row.THIRD_POINT);

});

return teams;

}


function addPoint(teams,team,point){

if(!team) return;

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

const ranking = Object.entries(teams)
.sort((a,b)=>b[1]-a[1]);

const medals=["🥇","🥈","🥉"];

let html="";

ranking.forEach((team,index)=>{

html+=`

<div class="rank">

<span>${medals[index] || "🏅"} TEAM ${team[0]}</span>

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

<details class="event" ${published ? "open" : ""}>

<summary>

${row.EVENT_NAME}

</summary>

`;

if(published){

html+=`

<div class="result">

<div class="gold">

🥇 ${row.FIRST_CHEST} ${row.FIRST_NAME}

<br>

TEAM ${row.FIRST_TEAM}

</div>

<div class="silver">

🥈 ${row.SECOND_CHEST} ${row.SECOND_NAME}

<br>

TEAM ${row.SECOND_TEAM}

</div>

<div class="bronze">

🥉 ${row.THIRD_CHEST} ${row.THIRD_NAME}

<br>

TEAM ${row.THIRD_TEAM}

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

const teams = [...new Set(

rows.flatMap(row=>[
row.FIRST_TEAM,
row.SECOND_TEAM,
row.THIRD_TEAM
]).filter(Boolean)

)].sort();

let html=`

<table>

<tr>

<th>Event</th>

`;

teams.forEach(team=>{

html+=`<th>TEAM ${team}</th>`;

});

html+=`

</tr>

`;

rows.forEach(row=>{

html+=`

<tr>

<td>${row.EVENT_NAME}</td>

`;

const points={};

teams.forEach(team=>points[team]=0);

if((row.STATUS||"").trim()=="PUBLISHED"){

points[row.FIRST_TEAM]=Number(row.FIRST_POINT||0);

points[row.SECOND_TEAM]=Number(row.SECOND_POINT||0);

points[row.THIRD_TEAM]=Number(row.THIRD_POINT||0);

}

teams.forEach(team=>{

html+=`

<td>${points[team]}</td>

`;

});

html+=`

</tr>

`;

});

html+=`

<tr>

<td colspan="${teams.length+1}"

style="padding:15px;
text-align:center;
color:#777;
font-style:italic;">

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

// Uncomment this if you want automatic refresh every 30 seconds.

// setInterval(loadResults,30000);
