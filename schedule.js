// ======================================================
// AURA MINI MEET 2026
// SCHEDULE
// ======================================================


// ------------------------------------------------------
// CSV LINK
// ------------------------------------------------------

const SCHEDULE_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQz8ipfKh59UBNMTnf6lrU1C_bNky3tUumYpuGAt4-d4G2O7Vs7wOFcBVcnGMDBQuHS5PtftsZ59G8b/pub?gid=1195863457&single=true&output=csv";


// ------------------------------------------------------
// START
// ------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

loadSchedule();

});


// ------------------------------------------------------
// LOAD SCHEDULE
// ------------------------------------------------------

async function loadSchedule(){

try{

const response =
await fetch(SCHEDULE_URL + "&t=" + Date.now());

if(!response.ok){

throw new Error("Schedule could not be loaded.");

}

const csv = await response.text();

const rows = parseCSV(csv);

renderSchedule(rows);

}catch(error){

console.error("SCHEDULE ERROR:",error);

document.getElementById("scheduleContainer").innerHTML = `

<div class="empty">

⚠️ Unable to load schedule.

<br><br>

Please try again shortly.

</div>

`;

}

}


// ------------------------------------------------------
// CSV PARSER
// ------------------------------------------------------

function parseCSV(csv){

if(!csv || !csv.trim()){

return [];

}

const lines =
csv.trim()
.split(/\r?\n/)
.filter(line => line.trim() !== "");


if(lines.length < 2){

return [];

}


const headers =
splitCSV(lines[0]).map(header =>

header.trim()
.replace(/^"|"$/g,"")

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
// TIME CONVERSION
// ------------------------------------------------------

function parseTime(timeString){

if(!timeString){

return null;

}


const value =
timeString
.trim()
.toUpperCase();


const match =
value.match(
/^(\d{1,2}):(\d{2})\s*(AM|PM)$/
);


if(!match){

return null;

}


let hour =
Number(match[1]);

const minute =
Number(match[2]);

const period =
match[3];


if(period === "PM" && hour !== 12){

hour += 12;

}


if(period === "AM" && hour === 12){

hour = 0;

}


return {
hour:hour,
minute:minute
};

}


// ------------------------------------------------------
// CREATE EVENT DATETIME
// ------------------------------------------------------

function getEventDate(row){

const dateString =
(row.DATE || "").trim();

const timeString =
(row.TIME || "").trim();


if(!dateString || !timeString){

return null;

}


const time =
parseTime(timeString);


if(!time){

return null;

}


// Supports DD-MM-YYYY

const parts =
dateString.split("-");


if(parts.length !== 3){

return null;

}


const day =
Number(parts[0]);

const month =
Number(parts[1]) - 1;

const year =
Number(parts[2]);


const date =
new Date(
year,
month,
day,
time.hour,
time.minute,
0,
0
);


if(isNaN(date.getTime())){

return null;

}


return date;

}


// ------------------------------------------------------
// STATUS
// ------------------------------------------------------

function getStatus(eventDate,index,events){

const now =
new Date();


if(!eventDate){

return "UPCOMING";

}


const eventEnd =
new Date(eventDate.getTime());


// ------------------------------------------------------
// IMPORTANT
// ------------------------------------------------------
// Since Sheet has only TIME and no END_TIME,
// an event is considered LIVE until the next event starts.
// ------------------------------------------------------

const nextEvent =
events[index + 1];


if(nextEvent){

const nextDate =
getEventDate(nextEvent);


if(
nextDate &&
now >= eventDate &&
now < nextDate
){

return "LIVE";

}

}


if(now < eventDate){

return "UPCOMING";

}


return "COMPLETED";

}


// ------------------------------------------------------
// RENDER SCHEDULE
// ------------------------------------------------------

function renderSchedule(rows){

const container =
document.getElementById("scheduleContainer");

const nextContainer =
document.getElementById("nextEvent");


if(!container){

return;

}


// ------------------------------------------------------
// PREPARE EVENTS
// ------------------------------------------------------

const events =
rows

.map(row => {

return {

row:row,

date:getEventDate(row)

};

})

.filter(item => item.date)

.sort((a,b) =>

a.date - b.date

);


// ------------------------------------------------------
// NO EVENTS
// ------------------------------------------------------

if(events.length === 0){

container.innerHTML = `

<div class="empty">

📅 No schedule available.

</div>

`;

return;

}


// ------------------------------------------------------
// FIND NEXT / LIVE
// ------------------------------------------------------

const now =
new Date();


let liveEvent = null;

let nextEvent = null;


events.forEach((item,index) => {

const status =
getStatus(
item.date,
index,
events.map(e => e.row)
);


if(status === "LIVE" && !liveEvent){

liveEvent = item;

}


if(
status === "UPCOMING" &&
!nextEvent
){

nextEvent = item;

}

});


// ------------------------------------------------------
// NEXT EVENT CARD
// ------------------------------------------------------

if(nextContainer){

if(liveEvent){

const row =
liveEvent.row;

nextContainer.innerHTML = `

<div class="next-card">

<div class="next-label">

🔴 LIVE NOW

</div>

<div class="next-event">

${escapeHTML(row.EVENT_NAME)}

</div>

<div class="next-details">

${escapeHTML(row.TIME)}
&nbsp; • &nbsp;
${escapeHTML(row.STAGE)}
&nbsp; • &nbsp;
${escapeHTML(row.CATEGORY)}

</div>

</div>

`;

}

else if(nextEvent){

const row =
nextEvent.row;

nextContainer.innerHTML = `

<div class="next-card">

<div class="next-label">

⏳ NEXT EVENT

</div>

<div class="next-event">

${escapeHTML(row.EVENT_NAME)}

</div>

<div class="next-details">

${escapeHTML(row.TIME)}
&nbsp; • &nbsp;
${escapeHTML(row.STAGE)}
&nbsp; • &nbsp;
${escapeHTML(row.CATEGORY)}

</div>

</div>

`;

}

else{

nextContainer.innerHTML = `

<div class="next-card">

<div class="next-label">

🏁 SCHEDULE COMPLETE

</div>

<div class="next-event">

All Events Completed

</div>

<div class="next-details">

Thank you for being part of AURA MINI MEET 2026

</div>

</div>

`;

}

}


// ------------------------------------------------------
// GROUP BY DATE
// ------------------------------------------------------

let html = "";

let currentDate = "";


// ------------------------------------------------------
// DISPLAY EVENTS
// ------------------------------------------------------

events.forEach((item,index) => {

const row =
item.row;

const status =
getStatus(
item.date,
index,
events.map(e => e.row)
);


// Date heading

const dateKey =
row.DATE + "|" + row.DAY;


if(dateKey !== currentDate){

currentDate = dateKey;

html += `

<div class="date-header">

📅 ${escapeHTML(row.DAY)}
&nbsp; • &nbsp;
${escapeHTML(row.DATE)}

</div>

`;

}


// Status

let statusHTML = "";


if(status === "LIVE"){

statusHTML = `

<div class="status status-live">

🔴 LIVE NOW

</div>

`;

}

else if(status === "UPCOMING"){

statusHTML = `

<div class="status status-upcoming">

UPCOMING

</div>

`;

}

else{

statusHTML = `

<div class="status status-completed">

✓ COMPLETED

</div>

`;

}


// Card

html += `

<div class="schedule-card">

<div class="time">

${escapeHTML(row.TIME)}

</div>


<div>

<div class="event-name">

${escapeHTML(row.EVENT_NAME)}

</div>

<div class="event-meta">

${escapeHTML(row.CATEGORY)}

</div>

${statusHTML}

</div>


<div class="stage">

${escapeHTML(row.STAGE)}

</div>

</div>

`;

});


container.innerHTML = html;

}


// ------------------------------------------------------
// AUTO REFRESH
// ------------------------------------------------------

setInterval(() => {

loadSchedule();

},10000);
