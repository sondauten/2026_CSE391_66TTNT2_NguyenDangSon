const nameInput = document.getElementById("nameInput");
const scoreInput = document.getElementById("scoreInput");
const addBtn = document.getElementById("addBtn");
const tableBody = document.getElementById("tableBody");
const stat = document.getElementById("stat");

const searchInput = document.getElementById("searchInput");
const filterRank = document.getElementById("filterRank");
const scoreHeader = document.getElementById("scoreHeader");
const sortIcon = document.getElementById("sortIcon");

let students = [];
let filteredStudents = [];

let sortDirection = "asc";

function getRank(score){

    if(score >= 8.5) return "Giỏi";
    if(score >= 7) return "Khá";
    if(score >= 5) return "Trung bình";
    return "Yếu";

}

function renderTable(){

    tableBody.innerHTML = "";

    if(filteredStudents.length === 0){

        tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="text-center text-danger">
            Không có kết quả
            </td>
        </tr>
        `;

        updateStat();
        return;
    }

    filteredStudents.forEach((sv, index)=>{

        const realIndex = students.indexOf(sv);

        const tr = document.createElement("tr");

        if(sv.score < 5){
            tr.classList.add("table-warning");
        }

        tr.innerHTML = `
        <td>${index+1}</td>
        <td>${sv.name}</td>
        <td>${sv.score}</td>
        <td>${getRank(sv.score)}</td>
        <td>
            <button class="btn btn-danger btn-sm" data-index="${realIndex}">
            Xóa
            </button>
        </td>
        `;

        tableBody.appendChild(tr);

    });

    updateStat();

}

function updateStat(){

    const total = students.length;

    let sum = 0;

    students.forEach(sv=>{
        sum += sv.score;
    });

    const avg = total ? (sum/total).toFixed(2) : 0;

    stat.innerText = `Tổng sinh viên: ${total} | Điểm trung bình: ${avg}`;

}

function applyFilters(){

    const keyword = searchInput.value.toLowerCase();
    const rankFilter = filterRank.value;

    filteredStudents = students.filter(sv=>{

        const matchName = sv.name.toLowerCase().includes(keyword);

        const rank = getRank(sv.score);

        const matchRank = rankFilter === "all" || rank === rankFilter;

        return matchName && matchRank;

    });

    filteredStudents.sort((a,b)=>{

        if(sortDirection === "asc"){
            return a.score - b.score;
        }else{
            return b.score - a.score;
        }

    });

    renderTable();

}

function addStudent(){

    const name = nameInput.value.trim();
    const score = Number(scoreInput.value);

    if(name === ""){
        alert("Họ tên không được trống");
        return;
    }

    if(isNaN(score) || score < 0 || score > 10){
        alert("Điểm phải từ 0 đến 10");
        return;
    }

    students.push({
        name: name,
        score: score
    });

    applyFilters();

    nameInput.value = "";
    scoreInput.value = "";

    nameInput.focus();

}

addBtn.addEventListener("click", addStudent);

scoreInput.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        addStudent();
    }
});

tableBody.addEventListener("click", function(e){

    if(e.target.tagName === "BUTTON"){

        const index = e.target.dataset.index;

        students.splice(index,1);

        applyFilters();

    }

});

searchInput.addEventListener("input", applyFilters);

filterRank.addEventListener("change", applyFilters);

scoreHeader.addEventListener("click", function(){

    sortDirection = sortDirection === "asc" ? "desc" : "asc";

    sortIcon.textContent = sortDirection === "asc" ? "▲" : "▼";

    applyFilters();

});

applyFilters();