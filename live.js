// ======================================================
// AURA MINI MEET 2026
// LIVE RESULTS
// PART 1
// ======================================================


// ------------------------------------------------------
// CSV LINKS
// ------------------------------------------------------

const EVENT_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQz8ipfKh59UBNMTnf6lrU1C_bNky3tUumYpuGAt4-d4G2O7Vs7wOFcBVcnGMDBQuHS5PtftsZ59G8b/pub?gid=1656570034&single=true&output=csv";

const CANDIDATE_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQz8ipfKh59UBNMTnf6lrU1C_bNky3tUumYpuGAt4-d4G2O7Vs7wOFcBVcnGMDBQuHS5PtftsZ59G8b/pub?gid=1243258977&single=true&output=csv";

const GRANDTOTAL_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQz8ipfKh59UBNMTnf6lrU1C_bNky3tUumYpuGAt4-d4G2O7Vs7wOFcBVcnGMDBQuHS5PtftsZ59G8b/pub?gid=776690482&single=true&output=csv";


// ------------------------------------------------------
// START
// ------------------------------------------------------

document.addEventListener("DOMContentLoaded",()=>{

loadLivePage();

});


// ------------------------------------------------------
// LOAD ALL DATA
// ------------------------------------------------------

async function loadLivePage(){

try{

const [

eventCsv,
candidateCsv,
grandCsv

]=await Promise.all([

fetch(EVENT_URL).then(r=>r.text()),
fetch(CANDIDATE_URL).then(r=>r.text()),
fetch(GRANDTOTAL_URL).then(r=>r.text())

]);

const events=parseCSV(eventCsv);

const candidates=parseCSV(candidateCsv);

const grand=parseCSV(grandCsv);

renderLiveResults(events);

renderKalaprathibha(candidates);

renderTeamScore(grand);

}catch(error){

console.error(error);

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

const values=splitCSV(lines[i]);

let row={};

headers.forEach((header,index)=>{

row[header.trim()]=values[index] ? values[index].trim() : "";

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

let inside=false;

for(let i=0;i<line.length;i++){

const char=line[i];

if(char=='"'){

inside=!inside;

continue;

}

if(char=="," && !inside){

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
// LIVE RESULTS
// ------------------------------------------------------

function renderLiveResults(rows){

const liveEvents=rows.filter(row=>

(row.STATUS||"").trim()=="PUBLISHED" &&

(row.LIVE||"").trim().toUpperCase()=="LIVE"

);

if(liveEvents.length===0){

document.getElementById("liveResults").innerHTML=`

<div class="waiting">

No Live Results Available

</div>

`;

return;

}

let html="";

liveEvents.reverse().forEach(row=>{

html+=`

<div class="live-card">

<div class="live-badge">

🔴 LIVE NOW

</div>

<div class="category">

${row.CATEGORY}

</div>

<div class="event-name">

${row.EVENT_NAME}

</div>

<div class="result-row">

<span>

🥇 ${row.FIRST_NAME}

</span>

<strong>

${row.FIRST_TEAM}

</strong>

</div>

<div class="result-row">

<span>

🥈 ${row.SECOND_NAME}

</span>

<strong>

${row.SECOND_TEAM}

</strong>

</div>

<div class="result-row">

<span>

🥉 ${row.THIRD_NAME}

</span>

<strong>

${row.THIRD_TEAM}

</strong>

</div>

</div>

`;

});

document.getElementById("liveResults").innerHTML=html;

}

// ------------------------------------------------------
// CURRENT KALAPRATHIBHA
// ------------------------------------------------------

function renderKalaprathibha(rows){

const categories=[

"SUB JUNIOR",

"SENIOR",

"SUPER SENIOR"

];

let html="";

categories.forEach(category=>{

const players=rows
.filter(r=>(r.CATEGORY||"").trim()==category)
.sort((a,b)=>
Number(b["TOTAL POINTS"]||0)-Number(a["TOTAL POINTS"]||0)
);

if(players.length===0) return;

const winner=players[0];

html+=`

<div class="info-card">

<div class="info-title">

${category}

</div>

<div class="info-name">

${winner.NAME}

</div>

<div class="info-points">

🏅 ${winner["TOTAL POINTS"]} Points

</div>

</div>

`;

});

document.getElementById("kalaprathibhaContainer").innerHTML=html;

}



// ------------------------------------------------------
// LIVE TEAM SCORE
// ------------------------------------------------------

function renderTeamScore(rows){

if(rows.length===0){

document.getElementById("teamScoreContainer").innerHTML=`

<div class="waiting">

No Team Score

</div>

`;

return;

}

let html="";

const medals=["🥇","🥈","🥉"];

rows.forEach((row,index)=>{

html+=`

<div class="result-row">

<span>

${medals[index]||"🏅"} TEAM ${row.TEAM}

</span>

<strong>

${row.TOTAL}

</strong>

</div>

`;

});

document.getElementById("teamScoreContainer").innerHTML=html;

}



// ------------------------------------------------------
// AUTO REFRESH
// ------------------------------------------------------

setInterval(loadLivePage,10000);
