// ======================================================
// AURA MINI MEET 2026
// SCHEDULE
// FINAL VERSION
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
await fetch(
SCHEDULE_URL + "&t=" + Date.now()
);

if(!response.ok){

throw new Error(
"Schedule could not be loaded."
);

}

const csv =
await response.text();

const rows =
parseCSV(csv);

renderSchedule(rows);

}

catch(error){

console.error(
"SCHEDULE ERROR:",
error
);

const container =
document.getElementById(
"scheduleContainer"
);

if(container){

container.innerHTML = `

<div class="empty">

⚠️ Unable to load schedule.

<br><br>

Please try again shortly.

</div>

`;

}

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
csv
.trim()
.split(/\r?\n/)
.filter(
line => line.trim() !== ""
);


if(lines.length < 2){

return [];

}


const headers =
splitCSV(lines[0])
.map(header =>

header
.trim()
.replace(/^"|"$/g,"")

);


const data = [];


for(
let i = 1;
i < lines.length;
i++
){

const values =
splitCSV(lines[i]);

const row = {};


headers.forEach(
(header,index) => {

row[header] =
values[index] !== undefined
? values[index].trim()
: "";

}
);


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


for(
let i = 0;
i < line.length;
i++
){

const char =
line[i];


if(char === '"'){

if(
insideQuotes &&
line[i + 1] === '"'
){

value += '"';

i++;

}

else{

insideQuotes =
!insideQuotes;

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

return String(
value ?? ""
)

.replace(
/&/g,
"&amp;"
)

.replace(
/</g,
"&lt;"
)

.replace(
/>/g,
"&gt;"
)

.replace(
/"/g,
"&quot;"
)

.replace(
/'/g,
"&#039;"
);

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


if(
period === "PM" &&
hour !== 12
){

hour += 12;

}


if(
period === "AM" &&
hour === 12
){

hour = 0;

}


return {

hour: hour,

minute: minute

};

}


// ------------------------------------------------------
// CREATE EVENT DATE
// ------------------------------------------------------
//
// Expected:
//
// DD-MM-YYYY
//
// Example:
//
// 24-08-2026
//
// ------------------------------------------------------

function getEventDate(row){

const dateString =
(row.DATE || "").trim();

const timeString =
(row.TIME || "").trim();


if(
!dateString ||
!timeString
){

return null;

}


const time =
parseTime(timeString);


if(!time){

return null;

}


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


if(
isNaN(
date.getTime()
)
){

return null;

}


return date;

}


// ------------------------------------------------------
// FORMAT DATE FOR DISPLAY
// ------------------------------------------------------

function formatDate(date){

const day =
String(
date.getDate()
).padStart(2,"0");

const month =
String(
date.getMonth() + 1
).padStart(2,"0");

const year =
date.getFullYear();


return `${day}-${month}-${year}`;

}


// ------------------------------------------------------
// PREPARE EVENTS
// ------------------------------------------------------

function prepareEvents(rows){

return rows

.map(row => {

return {

row: row,

date: getEventDate(row)

};

})

.filter(item => item.date)

.sort(
(a,b) =>
a.date - b.date
);

}


// ------------------------------------------------------
// FIND CURRENT LIVE EVENTS
// ------------------------------------------------------
//
// IMPORTANT:
//
// If two or more programs have exactly
// the same start time, they are ALL LIVE.
//
// Example:
//
// 10:00 AM Stage I
// 10:00 AM Stage II
//
// Both will show LIVE NOW.
//
// ------------------------------------------------------

function findLiveEvents(events){

const now =
new Date();


// Find all events that have already started

const started =
events.filter(
item =>
item.date <= now
);


if(started.length === 0){

return [];

}


// Find the latest start time

const latestStart =
started[started.length - 1].date;


// All events having that same
// start time are LIVE.

return events.filter(
item =>
item.date.getTime()
===
latestStart.getTime()
);

}


// ------------------------------------------------------
// FIND NEXT EVENTS
// ------------------------------------------------------
//
// The NEXT event means:
//
// The earliest event time AFTER NOW.
//
// If multiple programs happen at that exact
// next time, all of them are NEXT.
//
// ------------------------------------------------------

function findNextEvents(events){

const now =
new Date();


// Future events only

const future =
events.filter(
item =>
item.date > now
);


if(future.length === 0){

return [];

}


// Earliest future time

const nextTime =
future[0].date;


// All events at that same time

return future.filter(
item =>
item.date.getTime()
===
nextTime.getTime()
);

}


// ------------------------------------------------------
// RENDER NEXT / LIVE CARD
// ------------------------------------------------------

function renderTopCard(
liveEvents,
nextEvents
){

const container =
document.getElementById(
"nextEvent"
);


if(!container){

return;

}


// ------------------------------------------------------
// LIVE
// ------------------------------------------------------

if(liveEvents.length > 0){

let html = `

<div class="next-card">

<div class="next-label">

🔴 LIVE NOW

</div>

`;


liveEvents.forEach(
item => {

const row =
item.row;


html += `

<div class="next-event">

${escapeHTML(
row.EVENT_NAME
)}

</div>

<div class="next-details">

${escapeHTML(
row.TIME
)}

&nbsp; • &nbsp;

${escapeHTML(
row.STAGE
)}

&nbsp; • &nbsp;

${escapeHTML(
row.CATEGORY
)}

</div>

`;

}
);


html += `

</div>

`;


container.innerHTML =
html;

return;

}


// ------------------------------------------------------
// NEXT EVENT
// ------------------------------------------------------

if(nextEvents.length > 0){

let html = `

<div class="next-card">

<div class="next-label">

🟡 NEXT EVENT

</div>

`;


nextEvents.forEach(
item => {

const row =
item.row;


html += `

<div class="next-event">

${escapeHTML(
row.EVENT_NAME
)}

</div>

<div class="next-details">

${escapeHTML(
row.DATE
)}

&nbsp; • &nbsp;

${escapeHTML(
row.TIME
)}

&nbsp; • &nbsp;

${escapeHTML(
row.STAGE
)}

&nbsp; • &nbsp;

${escapeHTML(
row.CATEGORY
)}

</div>

`;

}
);


html += `

</div>

`;


container.innerHTML =
html;

return;

}


// ------------------------------------------------------
// ALL COMPLETED
// ------------------------------------------------------

container.innerHTML = `

<div class="next-card">

<div class="next-label">

🏁 SCHEDULE COMPLETE

</div>

<div class="next-event">

All Events Completed

</div>

<div class="next-details">

Thank you for being part of
AURA MINI MEET 2026

</div>

</div>

`;

}


// ------------------------------------------------------
// RENDER FULL SCHEDULE
// ------------------------------------------------------

function renderSchedule(rows){

const container =
document.getElementById(
"scheduleContainer"
);


if(!container){

return;

}


// Prepare

const events =
prepareEvents(rows);


// No schedule

if(events.length === 0){

container.innerHTML = `

<div class="empty">

📅 No schedule available.

</div>

`;

return;

}


// ------------------------------------------------------
// FIND LIVE
// ------------------------------------------------------

const liveEvents =
findLiveEvents(events);


// ------------------------------------------------------
// FIND NEXT
// ------------------------------------------------------

const nextEvents =
findNextEvents(events);


// ------------------------------------------------------
// TOP CARD
// ------------------------------------------------------

renderTopCard(
liveEvents,
nextEvents
);


// ------------------------------------------------------
// CURRENT TIME
// ------------------------------------------------------

const now =
new Date();


// ------------------------------------------------------
// CREATE IDENTIFIERS
// ------------------------------------------------------

const liveSet =
new Set(
liveEvents.map(
item =>
item.date.getTime()
+ "|" +
item.row.EVENT_NAME
+ "|" +
item.row.STAGE
)
);


const nextSet =
new Set(
nextEvents.map(
item =>
item.date.getTime()
+ "|" +
item.row.EVENT_NAME
+ "|" +
item.row.STAGE
)
);


// ------------------------------------------------------
// SEPARATE EVENTS
// ------------------------------------------------------

const completedEvents = [];

const upcomingEvents = [];


// Everything after current live time

// but excluding NEXT

events.forEach(
item => {

const key =
item.date.getTime()
+ "|" +
item.row.EVENT_NAME
+ "|" +
item.row.STAGE;


if(liveSet.has(key)){

return;

}


if(nextSet.has(key)){

return;

}


if(item.date > now){

upcomingEvents.push(item);

}

else{

completedEvents.push(item);

}

}
);


// ------------------------------------------------------
// FINAL DISPLAY ORDER
// ------------------------------------------------------
//
// 1. LIVE
// 2. NEXT
// 3. UPCOMING
// 4. COMPLETED
//
// ------------------------------------------------------

const displayEvents = [

...liveEvents,

...nextEvents,

...upcomingEvents,

...completedEvents

];


// ------------------------------------------------------
// BUILD HTML
// ------------------------------------------------------

let html = "";

let currentSection = "";

let currentDate = "";


// ------------------------------------------------------
// DISPLAY EVENTS
// ------------------------------------------------------

displayEvents.forEach(
item => {

const row =
item.row;


const key =
item.date.getTime()
+ "|" +
row.EVENT_NAME
+ "|" +
row.STAGE;


let status = "COMPLETED";


if(liveSet.has(key)){

status = "LIVE";

}

else if(nextSet.has(key)){

status = "NEXT";

}

else if(
item.date > now
){

status = "UPCOMING";

}

else{

status = "COMPLETED";

}


// ------------------------------------------------------
// SECTION TITLE
// ------------------------------------------------------

let sectionTitle = "";


if(status === "LIVE"){

sectionTitle =
"🔴 LIVE NOW";

}

else if(status === "NEXT"){

sectionTitle =
"🟡 NEXT EVENT";

}

else if(status === "UPCOMING"){

sectionTitle =
"📅 UPCOMING EVENTS";

}

else{

sectionTitle =
"✓ COMPLETED EVENTS";

}


if(
sectionTitle !==
currentSection
){

currentSection =
sectionTitle;

currentDate = "";


html += `

<div class="section-title">

${sectionTitle}

</div>

`;

}


// ------------------------------------------------------
// DATE HEADER
// ------------------------------------------------------
//
// For upcoming/completed events,
// show date grouping.
//
// LIVE and NEXT already have
// their important information inside
// the card.
// ------------------------------------------------------

const dateKey =
(row.DATE || "")
+
"|"
+
(row.DAY || "");


if(
status !== "LIVE" &&
status !== "NEXT" &&
dateKey !== currentDate
){

currentDate =
dateKey;


html += `

<div class="date-header">

📅 ${escapeHTML(
row.DAY
)}

&nbsp; • &nbsp;

${escapeHTML(
row.DATE
)}

</div>

`;

}


// ------------------------------------------------------
// STATUS BADGE
// ------------------------------------------------------

let statusHTML = "";


if(status === "LIVE"){

statusHTML = `

<div class="status status-live">

🔴 LIVE NOW

</div>

`;

}

else if(status === "NEXT"){

statusHTML = `

<div class="status status-next">

🟡 NEXT EVENT

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


// ------------------------------------------------------
// EVENT CARD
// ------------------------------------------------------

html += `

<div class="schedule-card">

<div class="time">

${escapeHTML(
row.TIME
)}

</div>


<div>

<div class="event-name">

${escapeHTML(
row.EVENT_NAME
)}

</div>


<div class="event-meta">

${escapeHTML(
row.CATEGORY
)}

</div>


${statusHTML}


</div>


<div class="stage">

${escapeHTML(
row.STAGE
)}

</div>


</div>

`;

}
);


// ------------------------------------------------------
// DISPLAY
// ------------------------------------------------------

container.innerHTML =
html;

}


// ------------------------------------------------------
// AUTO REFRESH
// ------------------------------------------------------

setInterval(
() => {

loadSchedule();

},
10000
);
