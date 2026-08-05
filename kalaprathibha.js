// ======================================================
// AURA MINI MEET 2026
// KALAPRATHIBHA
// PART 1
// ======================================================


// ------------------------------------------------------
// GOOGLE SHEET CSV
// ------------------------------------------------------

const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQz8ipfKh59UBNMTnf6lrU1C_bNky3tUumYpuGAt4-d4G2O7Vs7wOFcBVcnGMDBQuHS5PtftsZ59G8b/pub?gid=1243258977&single=true&output=csv";


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

const response=await fetch(

CSV_URL+"&t="+Date.now(),

{

cache:"no-store"

}

);

if(!response.ok){

throw new Error("Unable to load CSV");

}

const csv=await response.text();

const rows=parseCSV(csv);

const contestants=rows
.filter(r=>(r.NAME||"").trim()!="")
.map(r=>({

chest:r.CHEST,

name:r.NAME,

team:r.TEAM,

category:r.CATEGORY,

gold:Number(r.GOLD||0),

silver:Number(r.SILVER||0),

bronze:Number(r.BRONZE||0),

points:Number(r["TOTAL POINTS"]||0)

}))
.sort((a,b)=>b.points-a.points);

renderOverall(contestants);

renderCategory(contestants);

renderTop10(contestants);

}catch(error){

console.error(error);

document.getElementById("overallHero").innerHTML=

'<div class="waiting">Unable to load.</div>';

document.getElementById("categoryCards").innerHTML=

'<div class="waiting">Unable to load.</div>';

document.getElementById("top10Container").innerHTML=

'<div class="waiting">Unable to load.</div>';

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

if(char==","&&!insideQuotes){

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
// OVERALL KALAPRATHIBHA
// ------------------------------------------------------

function renderOverall(contestants){

if(contestants.length===0){

document.getElementById("overallHero").innerHTML=
'<div class="waiting">No Data</div>';

return;

}

const winner=contestants[0];

document.getElementById("overallHero").innerHTML=`

<div class="icon">👑</div>

<h2>OVERALL KALAPRATHIBHA</h2>

<div class="name">

${winner.name}

</div>

<div class="team">

TEAM ${winner.team}

</div>

<div class="points">

🏅 ${winner.points} POINTS

</div>

<div class="medals">

<span>🥇 ${winner.gold}</span>

<span>🥈 ${winner.silver}</span>

<span>🥉 ${winner.bronze}</span>

</div>

`;

}



// ------------------------------------------------------
// CATEGORY TOPPERS
// ------------------------------------------------------

function renderCategory(contestants){

const categories=[

"SUB JUNIOR",

"SENIOR",

"SUPER SENIOR"

];

let html="";

categories.forEach(category=>{

const players=contestants

.filter(c=>c.category===category)

.sort((a,b)=>b.points-a.points);

if(players.length===0) return;

const winner=players[0];

html+=`

<div class="category-card">

<div class="category-title">

${category}

</div>

<div class="winner-name">

${winner.name}

</div>

<div style="text-align:center;">

<span class="team-badge">

TEAM ${winner.team}

</span>

</div>

<div class="total-points">

🏅 ${winner.points} POINTS

</div>

<div class="medal-count">

<span>🥇 ${winner.gold}</span>

<span>🥈 ${winner.silver}</span>

<span>🥉 ${winner.bronze}</span>

</div>

<div class="top3">

`;

players.slice(0,3).forEach((player,index)=>{

const medal=["🥇","🥈","🥉"];

html+=`

<div class="top3-row">

<div class="rank-name">

${medal[index]}

${player.name}

</div>

<div class="rank-points">

${player.points} Points

</div>

</div>

`;

});

html+=`

</div>

</div>

`;

});

document.getElementById("categoryCards").innerHTML=html;

}
// ------------------------------------------------------
// TOP 10 OVERALL
// ------------------------------------------------------

function renderTop10(contestants){

const top10=contestants.slice(0,10);

let html="";

top10.forEach((player,index)=>{

let medal="";

if(index===0){

medal="🥇";

}else if(index===1){

medal="🥈";

}else if(index===2){

medal="🥉";

}else{

medal=(index+1)+"th";

}

html+=`

<div class="top10-card">

<div class="top10-rank">

${medal}

</div>

<div class="top10-name">

${player.name}

</div>

<div class="top10-team">

TEAM ${player.team}

</div>

<div class="top10-points">

🏅 ${player.points} POINTS

</div>

</div>

`;

});

document.getElementById("top10Container").innerHTML=html;

}



// ------------------------------------------------------
// AUTO REFRESH
// ------------------------------------------------------

setInterval(loadResults,10000);
