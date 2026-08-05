// ======================================================
// AURA MINI MEET 2026
// GRAND TOTAL
// PART 1
// ======================================================


// ------------------------------------------------------
// GOOGLE SHEET CSV
// ------------------------------------------------------

const CSV_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vQz8ipfKh59UBNMTnf6lrU1C_bNky3tUumYpuGAt4-d4G2O7Vs7wOFcBVcnGMDBQuHS5PtftsZ59G8b/pub?gid=776690482&single=true&output=csv";


// ------------------------------------------------------
// START
// ------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    loadResults();

    setInterval(loadResults, 10000);

});


// ------------------------------------------------------
// LOAD CSV
// ------------------------------------------------------

async function loadResults() {

    try {

        const response = await fetch(
            CSV_URL + "&t=" + Date.now(),
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("Unable to load CSV");
        }

        const csv = await response.text();

        const rows = parseCSV(csv);

        renderChampion(rows);

        renderRanking(rows);

        renderTable(rows);

    }

    catch (error) {

        console.error(error);

        document.getElementById("champion").innerHTML =
            "Unable to load.";

        document.getElementById("ranking").innerHTML =
            '<div class="waiting">Unable to load ranking.</div>';

        document.getElementById("pointTable").innerHTML =
            '<div class="waiting">Unable to load table.</div>';

    }

}


// ------------------------------------------------------
// CSV PARSER
// ------------------------------------------------------

function parseCSV(csv) {

    const lines = csv.trim().split(/\r?\n/);

    if (lines.length < 2) return [];

    const rows = [];

    for (let i = 0; i < lines.length; i++) {

        const values = splitCSV(lines[i]);

        rows.push(values);

    }

    return rows;

}


// ------------------------------------------------------
// SPLIT CSV
// ------------------------------------------------------

function splitCSV(line) {

    const result = [];

    let current = "";

    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {

        const char = line[i];

        if (char === '"') {

            insideQuotes = !insideQuotes;

            continue;

        }

        if (char === "," && !insideQuotes) {

            result.push(current);

            current = "";

        }

        else {

            current += char;

        }

    }

    result.push(current);

    return result;

}


// ------------------------------------------------------
// GET TOTAL ROW
// ------------------------------------------------------

function getTotalRow(rows) {

    for (let i = 1; i < rows.length; i++) {

        const category = (rows[i][0] || "").trim().toUpperCase();

        if (category === "TOTAL") {

            return rows[i];

        }

    }

    return null;

}
// ------------------------------------------------------
// CHAMPION
// ------------------------------------------------------

function renderChampion(rows) {

    const totalRow = getTotalRow(rows);

    if (!totalRow) {

        document.getElementById("champion").innerHTML =
            "<h2>🏆 No Data</h2>";

        return;

    }

    const header = rows[0];

    const teams = [];

    // Column 1 മുതൽ അവസാനത്തേതിന് മുമ്പ് വരെ
    // (അവസാന column GRAND TOTAL ആണെങ്കിൽ അത് ഒഴിവാക്കും)

    const lastTeamColumn = totalRow.length - 1;

    for (let i = 1; i < lastTeamColumn; i++) {

        teams.push({

            name: (header[i] || ("TEAM " + i)).trim(),

            points: Number(totalRow[i]) || 0

        });

    }

    teams.sort((a, b) => b.points - a.points);

    const champion = teams[0];

    document.getElementById("champion").innerHTML = `

        <h2>🏆 OVERALL CHAMPION</h2>

        <h3>TEAM ${champion.name}</h3>

        <p>${champion.points} POINTS</p>

    `;

}



// ------------------------------------------------------
// LIVE TEAM RANKING
// ------------------------------------------------------

function renderRanking(rows) {

    const totalRow = getTotalRow(rows);

    if (!totalRow) {

        document.getElementById("ranking").innerHTML =
            '<div class="waiting">No Ranking Available</div>';

        return;

    }

    const header = rows[0];

    const ranking = [];

    const lastTeamColumn = totalRow.length - 1;

    for (let i = 1; i < lastTeamColumn; i++) {

        ranking.push({

            name: (header[i] || ("TEAM " + i)).trim(),

            points: Number(totalRow[i]) || 0

        });

    }

    ranking.sort((a, b) => b.points - a.points);

    const medals = ["🥇", "🥈", "🥉"];

    let html = "";

    ranking.forEach((team, index) => {

        html += `

            <div class="rank">

                <span>${medals[index]} TEAM ${team.name}</span>

                <span>${team.points}</span>

            </div>

        `;

    });

    document.getElementById("ranking").innerHTML = html;

}
// ------------------------------------------------------
// GRAND TOTAL TABLE
// ------------------------------------------------------

function renderTable(rows) {

    if (rows.length < 2) {

        document.getElementById("pointTable").innerHTML =
            '<div class="waiting">No data available.</div>';

        return;

    }

    const header = rows[0];

    let html = `
        <table>
            <tr>
                <th>${header[0] || "Category"}</th>
    `;

    // അവസാന GRAND TOTAL column ഒഴിവാക്കി Team columns മാത്രം
    const lastTeamColumn = header.length - 1;

    for (let i = 1; i < lastTeamColumn; i++) {

        html += `<th>${header[i]}</th>`;

    }

    html += `
            </tr>
    `;

    for (let r = 1; r < rows.length; r++) {

        const row = rows[r];

        const category = (row[0] || "").trim();

        const isTotal = category.toUpperCase() === "TOTAL";

        html += `
            <tr ${isTotal ? 'style="background:#FFF8E1;font-weight:bold;"' : ""}>
                <td><b>${category}</b></td>
        `;

        for (let c = 1; c < lastTeamColumn; c++) {

            html += `<td>${row[c] || 0}</td>`;

        }

        html += `
            </tr>
        `;

    }

    html += `
        </table>
    `;

    document.getElementById("pointTable").innerHTML = html;

}


// ------------------------------------------------------
// END
// ------------------------------------------------------
