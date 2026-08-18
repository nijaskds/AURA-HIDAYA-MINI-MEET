// ======================================================
// AURA MINI MEET 2026
// LIVE RESULTS
// FINAL VERSION
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

document.addEventListener("DOMContentLoaded", () => {

loadLivePage();

});


// ------------------------------------------------------
// LOAD ALL DATA
// ------------------------------------------------------

async function loadLivePage(){

try{

const responses = await Promise.all([

fetch(EVENT_URL + "&t=" + Date.now()),

fetch(CANDIDATE_URL + "&t=" + Date.now()),

fetch(GRANDTOTAL_URL + "&t=" + Date.now())

]);

if(!responses[0].ok || !responses[1].ok || !responses[2].ok){

throw new Error("Google Sheet data could not be loaded.");

}

const eventCsv = await responses[0].text();

const candidateCsv = await responses[1].text();

const grandCsv = await responses[2].text();

const events = parseCSV(eventCsv);

const candidates = parseCSV(candidateCsv);

const grand = parseCSV(grandCsv);


// Render

renderLiveResults(events);

renderKalaprathibha(candidates);

renderTeamScore(grand);


}catch(error){

console.error("LIVE PAGE ERROR:", error);

showError();

}

}


// ------------------------------------------------------
// CSV PARSER
// ------------------------------------------------------

function parseCSV(csv){

if(!csv || !csv.trim()){

return [];

}

const lines = csv
.trim()
.split(/\r?\n/)
.filter(line => line.trim() !== "");

if(lines.length < 2){

return [];

}

const headers = splitCSV(lines[0]).map(header =>
header.trim().replace(/^"|"$/g,"")
);

const data = [];

for(let i = 1; i < lines.length; i++){

const values = splitCSV(lines[i]);

const row = {};

headers.forEach((header,index) => {

row[header] =
values[index] !== undefined
? values[index].trim()
: "";

});

data.push(row);

}

return data;

}


// ------------------------------------------------------
// SAFE CSV SPLITTER
// ------------------------------------------------------

function splitCSV(line){

const result = [];

let value = "";

let insideQuotes = false;

for(let i = 0; i < line.length; i++){

const char = line[i];

if(char === '"'){

if(insideQuotes && line[i + 1] === '"'){

value += '"';

i++;

}else{

insideQuotes = !insideQuotes;

}

}

else if(char === "," && !insideQuotes){

result.push(value);

value = "";

}

else{

value += char;

}

}

result.push(value);

return result;

}


// ------------------------------------------------------
// ESCAPE HTML
// ------------------------------------------------------

function escapeHTML(value){

return String(value ?? "")
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;")
.replace(/'/g,"&#039;");

}


// ------------------------------------------------------
// LIVE RESULTS
// ------------------------------------------------------

function renderLiveResults(rows){

const liveEvents = rows.filter(row => {

const status =
(row.STATUS || "").trim().toUpperCase();

const live =
(row.LIVE || "").trim().toUpperCase();

return status === "PUBLISHED" && live === "LIVE";

});


// Latest events first

const latestEvents = liveEvents
.slice()
.reverse()
.slice(0,6);


if(latestEvents.length === 0){

document.getElementById("liveResults").innerHTML = `

<div class="waiting">

No Live Results Available

</div>

`;

return;

}


let html = "";


latestEvents.forEach(row => {

const category =
escapeHTML(row.CATEGORY || "");

const eventName =
escapeHTML(row.EVENT_NAME || "Event");


const firstName =
escapeHTML(row.FIRST_NAME || "-");

const firstTeam =
escapeHTML(row.FIRST_TEAM || "");

const secondName =
escapeHTML(row.SECOND_NAME || "-");

const secondTeam =
escapeHTML(row.SECOND_TEAM || "");

const thirdName =
escapeHTML(row.THIRD_NAME || "-");

const thirdTeam =
escapeHTML(row.THIRD_TEAM || "");


html += `

<div class="live-card">

<div class="live-badge">

🔴 LIVE NOW

</div>

<div class="category">

${category}

</div>

<div class="event-name">

${eventName}

</div>


<div class="result-row">

<span>

🥇 ${firstName}

</span>

<strong>

${firstTeam}

</strong>

</div>


<div class="result-row">

<span>

🥈 ${secondName}

</span>

<strong>

${secondTeam}

</strong>

</div>


<div class="result-row">

<span>

🥉 ${thirdName}

</span>

<strong>

${thirdTeam}

</strong>

</div>

</div>

`;

});


document.getElementById("liveResults").innerHTML = html;

}


// ------------------------------------------------------
// CURRENT KALAPRATHIBHA
// ------------------------------------------------------

function renderKalaprathibha(rows){

const categories = [

"SUB JUNIOR",

"SENIOR",

"SUPER SENIOR"

];


let html = "";


categories.forEach(category => {


const players = rows

.filter(row =>

(row.CATEGORY || "").trim().toUpperCase()
=== category

)

.filter(row =>

row.NAME &&
!isNaN(Number(row["TOTAL POINTS"]))

)

.sort((a,b) =>

Number(b["TOTAL POINTS"] || 0)
-
Number(a["TOTAL POINTS"] || 0)

);


if(players.length === 0){

html += `

<div class="info-card">

<div class="info-title">

${category}

</div>

<div class="info-name">

No Result

</div>

</div>

`;

return;

}


const winner = players[0];


const name =
escapeHTML(winner.NAME);

const team =
escapeHTML(winner.TEAM || "");

const points =
Number(winner["TOTAL POINTS"] || 0);


html += `

<div class="info-card">

<div class="info-title">

${category}

</div>

<div class="info-name">

${name}

</div>

<div style="margin-bottom:10px;font-size:16px;color:#ddd;font-weight:600;">

TEAM ${team}

</div>

<div class="info-points">

🏅 ${points} Points

</div>

</div>

`;

});


document.getElementById("kalaprathibhaContainer").innerHTML = html;

}


// ------------------------------------------------------
// LIVE TEAM SCORE
// TEAM D EXCLUDED
// ------------------------------------------------------

function renderTeamScore(rows){

const container =
document.getElementById("teamScoreContainer");

if(!container) return;


// ------------------------------------------------------
// FIND TOTAL ROW
// ------------------------------------------------------

const totalRow = rows.find(row => {

return Object.values(row).some(value =>

String(value)
.trim()
.toUpperCase() === "TOTAL"

);

});


if(!totalRow){

container.innerHTML = `

<div class="waiting">

No Team Score Available

</div>

`;

return;

}


// ------------------------------------------------------
// GRAND TOTAL STRUCTURE
// ------------------------------------------------------
//
// A = Category / TOTAL
// B = Team A
// C = Team B
// D = Team C
// E = Team D
//
// Team D is intentionally excluded.
// ------------------------------------------------------

const values = Object.values(totalRow);


// ------------------------------------------------------
// ONLY TEAM A, B, C
// ------------------------------------------------------

const teams = [

{
name:"A",
score:Number(values[1]) || 0
},

{
name:"B",
score:Number(values[2]) || 0
},

{
name:"C",
score:Number(values[3]) || 0
}

];


// ------------------------------------------------------
// SORT BY SCORE
// ------------------------------------------------------

teams.sort((a,b) => {

return b.score - a.score;

});


// ------------------------------------------------------
// MEDALS
// ------------------------------------------------------

const medals = [

"🥇",
"🥈",
"🥉"

];


// ------------------------------------------------------
// CREATE SCOREBOARD
// ------------------------------------------------------

let html = "";

teams.forEach((team,index) => {

html += `

<div class="result-row">

<span style="
font-size:20px;
font-weight:700;
">

${medals[index]}

TEAM ${escapeHTML(team.name)}

</span>

<strong style="
font-size:24px;
color:#FFD54F;
">

${team.score}

</strong>

</div>

`;

});


// ------------------------------------------------------
// DISPLAY
// ------------------------------------------------------

container.innerHTML = html;

}


// ------------------------------------------------------
// ERROR MESSAGE
// ------------------------------------------------------

function showError(){

document.getElementById("liveResults").innerHTML = `

<div class="waiting">

⚠️ Unable to load Live Results

<br><br>

Please try again shortly.

</div>

`;

}


// ------------------------------------------------------
// AUTO REFRESH
// ------------------------------------------------------

setInterval(() => {

loadLivePage();

},10000);
