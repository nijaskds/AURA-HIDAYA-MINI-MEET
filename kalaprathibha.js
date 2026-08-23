// ======================================================
// AURA MINI MEET 2026
// KALAPRATHIBHA
// PHOTO ENABLED VERSION
// ======================================================


// ------------------------------------------------------
// GOOGLE SHEET CSV
// ------------------------------------------------------

const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQz8ipfKh59UBNMTnf6lrU1C_bNky3tUumYpuGAt4-d4G2O7Vs7wOFcBVcnGMDBQuHS5PtftsZ59G8b/pub?gid=1243258977&single=true&output=csv";


// ------------------------------------------------------
// PHOTO FOLDER
// ------------------------------------------------------

const PHOTO_FOLDER = "candidate_avatar/";


// ------------------------------------------------------
// START
// ------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

loadResults();

});


// ------------------------------------------------------
// PHOTO URL
// ------------------------------------------------------

function getPhoto(chest){

const value = String(chest || "").trim();

if(!value){

return "";

}

return PHOTO_FOLDER + encodeURIComponent(value) + ".jpg";

}


// ------------------------------------------------------
// LOAD CSV
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


const contestants = rows

.filter(r =>

(r.NAME || "").trim() !== ""

)

.map(r => ({

chest: r.CHEST,

name: r.NAME,

team: r.TEAM,

category: r.CATEGORY,

gold: Number(r.GOLD || 0),

silver: Number(r.SILVER || 0),

bronze: Number(r.BRONZE || 0),

points: Number(r["TOTAL POINTS"] || 0)

}))

.sort((a,b) =>

b.points - a.points

);


// ------------------------------------------------------
// RENDER
// ------------------------------------------------------

renderOverall(contestants);

renderCategory(contestants);

renderTop10(contestants);


}catch(error){

console.error(

"KALAPRATHIBHA ERROR:",

error

);


document.getElementById(
"overallHero"
).innerHTML =

'<div class="waiting">Unable to load.</div>';


document.getElementById(
"categoryCards"
).innerHTML =

'<div class="waiting">Unable to load.</div>';


document.getElementById(
"top10Container"
).innerHTML =

'<div class="waiting">Unable to load.</div>';

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

.filter(line =>

line.trim() !== ""

);


if(lines.length < 2){

return [];

}


const headers = splitCSV(lines[0]);


const data = [];


for(let i = 1; i < lines.length; i++){

const values = splitCSV(lines[i]);

const row = {};


headers.forEach((header,index) => {

row[header.trim()] =

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

if(

insideQuotes &&

line[i + 1] === '"'

){

value += '"';

i++;

}else{

insideQuotes = !insideQuotes;

}

}


else if(

char === "," &&

!insideQuotes

){

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
// OVERALL KALAPRATHIBHA
// ------------------------------------------------------

function renderOverall(contestants){

const container =

document.getElementById(
"overallHero"
);


if(!container){

return;

}


if(contestants.length === 0){

container.innerHTML =

'<div class="waiting">No Data</div>';

return;

}


const winner = contestants[0];

const photo = getPhoto(
winner.chest
);


container.innerHTML = `

<div class="overall-photo-wrap">

<img

src="${photo}"

alt="${escapeHTML(winner.name)}"

class="overall-photo"

onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"

>

<div

class="photo-placeholder"

style="display:none;"

>

👤

</div>

</div>


<div class="icon">

👑

</div>


<h2>

OVERALL KALAPRATHIBHA

</h2>


<div class="name">

${escapeHTML(winner.name)}

</div>


<div class="chest">

CHEST NO. ${escapeHTML(winner.chest)}

</div>


<div class="team">

TEAM ${escapeHTML(winner.team)}

</div>


<div class="points">

🏅 ${winner.points} POINTS

</div>


<div class="medals">

<span>

🥇 ${winner.gold}

</span>

<span>

🥈 ${winner.silver}

</span>

<span>

🥉 ${winner.bronze}

</span>

</div>

`;

}


// ------------------------------------------------------
// CATEGORY TOPPERS
// ------------------------------------------------------

function renderCategory(contestants){

const categories = [

"SUB JUNIOR",

"SENIOR",

"SUPER SENIOR"

];


let html = "";


categories.forEach(category => {


const players = contestants

.filter(c =>

(c.category || "")
.trim()
.toUpperCase()
=== category

)

.sort((a,b) =>

b.points - a.points

);


if(players.length === 0){

return;

}


const winner = players[0];

const second = players[1];

const third = players[2];


html += `

<div class="category-card">


<div class="category-title">

${escapeHTML(category)}

</div>


<!-- ========================================= -->
<!-- FIRST PLACE -->
<!-- ========================================= -->

<div class="category-winner">


<div class="category-photo-large">

<img

src="${getPhoto(winner.chest)}"

alt="${escapeHTML(winner.name)}"

onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"

>

<div

class="photo-placeholder-small"

style="display:none;"

>

👤

</div>

</div>


<div class="winner-name">

🥇 ${escapeHTML(winner.name)}

</div>


<div class="winner-chest">

CHEST ${escapeHTML(winner.chest)}

</div>


<div class="team-badge">

TEAM ${escapeHTML(winner.team)}

</div>


<div class="total-points">

🏅 ${winner.points} POINTS

</div>


<div class="medal-count">

<span>

🥇 ${winner.gold}

</span>

<span>

🥈 ${winner.silver}

</span>

<span>

🥉 ${winner.bronze}

</span>

</div>


</div>


<!-- ========================================= -->
<!-- SECOND + THIRD -->
<!-- ========================================= -->

<div class="category-runners">


${second ? `

<div class="runner-card">


<div class="runner-photo">

<img

src="${getPhoto(second.chest)}"

alt="${escapeHTML(second.name)}"

onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"

>

<div

class="photo-placeholder-small"

style="display:none;"

>

👤

</div>

</div>


<div class="runner-rank">

🥈 2ND

</div>


<div class="runner-name">

${escapeHTML(second.name)}

</div>


<div class="runner-info">

CHEST ${escapeHTML(second.chest)}

<br>

TEAM ${escapeHTML(second.team)}

</div>


<div class="runner-points">

${second.points} POINTS

</div>


</div>

` : ""}


${third ? `

<div class="runner-card">


<div class="runner-photo">

<img

src="${getPhoto(third.chest)}"

alt="${escapeHTML(third.name)}"

onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"

>

<div

class="photo-placeholder-small"

style="display:none;"

>

👤

</div>

</div>


<div class="runner-rank">

🥉 3RD

</div>


<div class="runner-name">

${escapeHTML(third.name)}

</div>


<div class="runner-info">

CHEST ${escapeHTML(third.chest)}

<br>

TEAM ${escapeHTML(third.team)}

</div>


<div class="runner-points">

${third.points} POINTS

</div>


</div>

` : ""}


</div>


</div>

`;

});


document.getElementById(
"categoryCards"
).innerHTML = html;

}


// ------------------------------------------------------
// TOP 10 OVERALL
// ------------------------------------------------------

function renderTop10(contestants){

const top10 = contestants.slice(0,10);


let html = "";


top10.forEach((player,index) => {


let rank = "";


if(index === 0){

rank = "🥇";

}

else if(index === 1){

rank = "🥈";

}

else if(index === 2){

rank = "🥉";

}

else{

rank = (index + 1) + "th";

}


html += `

<div class="top10-card">


<div class="top10-photo">

<img

src="${getPhoto(player.chest)}"

alt="${escapeHTML(player.name)}"

onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"

>

<div

class="photo-placeholder-top10"

style="display:none;"

>

👤

</div>

</div>


<div class="top10-details">


<div class="top10-rank">

${rank}

</div>


<div class="top10-chest">

CHEST ${escapeHTML(player.chest)}

</div>


<div class="top10-name">

${escapeHTML(player.name)}

</div>


<div class="top10-team">

TEAM ${escapeHTML(player.team)}

</div>


<div class="top10-points">

🏅 ${player.points}

</div>


</div>


</div>

`;

});


document.getElementById(
"top10Container"
).innerHTML = html;

}


// ------------------------------------------------------
// AUTO REFRESH
// ------------------------------------------------------

setInterval(() => {

loadResults();

},10000);
