// ======================================================
// AURA MINI MEET 2026
// KALAPRATHIBHA
// PART 1
// ======================================================


// ------------------------------------------------------
// CSV URL
// ------------------------------------------------------

const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQz8ipfKh59UBNMTnf6lrU1C_bNky3tUumYpuGAt4-d4G2O7Vs7wOFcBVcnGMDBQuHS5PtftsZ59G8b/pub?gid=1243258977&single=true&output=csv";


// ------------------------------------------------------
// GLOBAL
// ------------------------------------------------------

let contestants = [];


// ------------------------------------------------------
// START
// ------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    loadResults();

    setInterval(loadResults,10000);

});


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

        contestants = parseCSV(csv);

        prepareData();

    }

    catch(error){

        console.error(error);

    }

}


// ------------------------------------------------------
// CSV PARSER
// ------------------------------------------------------

function parseCSV(csv){

    const lines = csv.trim().split(/\r?\n/);

    if(lines.length<=1){

        return [];

    }

    const headers = splitCSV(lines[0]);

    const data=[];

    for(let i=1;i<lines.length;i++){

        if(!lines[i].trim()){

            continue;

        }

        const values = splitCSV(lines[i]);

        let row={};

        headers.forEach((header,index)=>{

            row[header.trim()] =

            values[index]

            ? values[index].trim()

            : "";

        });

        if(

            row["CHEST"]==="" ||

            row["NAME"]===""

        ){

            continue;

        }

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

        }

        else{

            value+=char;

        }

    }

    result.push(value);

    return result;

}


// ------------------------------------------------------
// NUMBER
// ------------------------------------------------------

function num(value){

    return Number(value)||0;

}


// ------------------------------------------------------
// SORT
// ------------------------------------------------------

function sortByPoints(list){

    return list.sort((a,b)=>{

        return num(b["TOTAL POINTS"])

        -

        num(a["TOTAL POINTS"]);

    });

}


// ------------------------------------------------------
// CATEGORY
// ------------------------------------------------------

function getCategory(category){

    return contestants.filter(row=>{

        return (

            row["CATEGORY"]

            .trim()

            .toUpperCase()

            ===

            category

        );

    });

}


// ------------------------------------------------------
// NEXT PART
// ------------------------------------------------------

function prepareData(){

    // PART 2

}
// ------------------------------------------------------
// PREPARE DATA
// ------------------------------------------------------

function prepareData(){

    contestants = contestants.filter(row=>{

        return num(row["TOTAL POINTS"])>0 ||

               num(row["GOLD"])>0 ||

               num(row["SILVER"])>0 ||

               num(row["BRONZE"])>0;

    });

    contestants = sortByPoints(contestants);

    renderOverall();

    renderCategory("SUB JUNIOR","sj");

    renderCategory("SENIOR","senior");

    renderCategory("SUPER SENIOR","ss");

    renderTop10();

}


// ------------------------------------------------------
// OVERALL HERO
// ------------------------------------------------------

function renderOverall(){

    if(contestants.length===0){

        return;

    }

    const winner = contestants[0];

    document.getElementById("overallName").textContent =
    winner["NAME"];

    document.getElementById("overallTeam").textContent =
    "TEAM " + winner["TEAM"];

    document.getElementById("overallPoints").textContent =
    "🏅 " + winner["TOTAL POINTS"] + " POINTS";

    document.getElementById("overallGold").textContent =
    "🥇 " + num(winner["GOLD"]);

    document.getElementById("overallSilver").textContent =
    "🥈 " + num(winner["SILVER"]);

    document.getElementById("overallBronze").textContent =
    "🥉 " + num(winner["BRONZE"]);

}


// ------------------------------------------------------
// CATEGORY
// ------------------------------------------------------

function renderCategory(category,prefix){

    let list = getCategory(category);

    list = sortByPoints(list);

    if(list.length===0){

        return;

    }

    const winner = list[0];

    document.getElementById(prefix+"WinnerName").textContent =
    winner["NAME"];

    document.getElementById(prefix+"WinnerTeam").textContent =
    "TEAM " + winner["TEAM"];

    document.getElementById(prefix+"WinnerPoints").textContent =
    "🏅 " + winner["TOTAL POINTS"] + " POINTS";

    document.getElementById(prefix+"Gold").textContent =
    "🥇 " + num(winner["GOLD"]);

    document.getElementById(prefix+"Silver").textContent =
    "🥈 " + num(winner["SILVER"]);

    document.getElementById(prefix+"Bronze").textContent =
    "🥉 " + num(winner["BRONZE"]);

    renderTop3(list,prefix);

}// ------------------------------------------------------
// CATEGORY TOP 3
// ------------------------------------------------------

function renderTop3(list,prefix){

    for(let i=0;i<3;i++){

        const item = list[i];

        if(!item){

            document.getElementById(prefix+"Top"+(i+1)+"Name").textContent="-";

            document.getElementById(prefix+"Top"+(i+1)+"Points").textContent="0 Points";

            continue;

        }

        document.getElementById(prefix+"Top"+(i+1)+"Name").textContent=
        item["NAME"];

        document.getElementById(prefix+"Top"+(i+1)+"Points").textContent=
        item["TOTAL POINTS"]+" Points";

    }

}


// ------------------------------------------------------
// OVERALL TOP 10
// ------------------------------------------------------

function renderTop10(){

    let list=[...contestants];

    list=sortByPoints(list);

    for(let i=0;i<10;i++){

        const item=list[i];

        if(!item){

            document.getElementById("top"+(i+1)+"Name").textContent="-";

            document.getElementById("top"+(i+1)+"Team").textContent="-";

            document.getElementById("top"+(i+1)+"Points").textContent="0 Points";

            continue;

        }

        document.getElementById("top"+(i+1)+"Name").textContent=
        item["NAME"];

        document.getElementById("top"+(i+1)+"Team").textContent=
        "TEAM "+item["TEAM"];

        document.getElementById("top"+(i+1)+"Points").textContent=
        item["TOTAL POINTS"]+" Points";

    }

}
// ------------------------------------------------------
// BETTER SORT
// ------------------------------------------------------

function sortByPoints(list){

    return list.sort((a,b)=>{

        const pointDiff =
            num(b["TOTAL POINTS"]) -
            num(a["TOTAL POINTS"]);

        if(pointDiff!==0){

            return pointDiff;

        }

        const goldDiff =
            num(b["GOLD"]) -
            num(a["GOLD"]);

        if(goldDiff!==0){

            return goldDiff;

        }

        const silverDiff =
            num(b["SILVER"]) -
            num(a["SILVER"]);

        if(silverDiff!==0){

            return silverDiff;

        }

        const bronzeDiff =
            num(b["BRONZE"]) -
            num(a["BRONZE"]);

        if(bronzeDiff!==0){

            return bronzeDiff;

        }

        return String(a["NAME"]).localeCompare(String(b["NAME"]));

    });

}


// ------------------------------------------------------
// SAFE TEXT
// ------------------------------------------------------

function setText(id,value){

    const element=document.getElementById(id);

    if(element){

        element.textContent=value;

    }

}


// ------------------------------------------------------
// SAFE HTML
// ------------------------------------------------------

function setHTML(id,value){

    const element=document.getElementById(id);

    if(element){

        element.innerHTML=value;

    }

}


// ------------------------------------------------------
// RELOAD
// ------------------------------------------------------

function reload(){

    loadResults();

}


// ------------------------------------------------------
// AUTO REFRESH
// ------------------------------------------------------

setInterval(reload,10000);


// ------------------------------------------------------
// WINDOW ERROR
// ------------------------------------------------------

window.addEventListener("error",function(error){

    console.error(error);

});


// ------------------------------------------------------
// UNHANDLED PROMISE
// ------------------------------------------------------

window.addEventListener("unhandledrejection",function(error){

    console.error(error);

});


// ------------------------------------------------------
// END
// ------------------------------------------------------

console.log("Kalaprathibha Loaded");
