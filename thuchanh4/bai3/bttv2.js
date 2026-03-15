// UTILITY
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const span = document.getElementById(fieldId + "-error");
  if (field) field.classList.add("is-invalid");
  if (span) span.textContent = message;
}
function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const span = document.getElementById(fieldId + "-error");
  if (field) field.classList.remove("is-invalid");
  if (span) span.textContent = "";
}
function showGroupError(groupId, message) {
  document.getElementById(groupId + "-error").textContent = message;
  document.querySelectorAll(`input[name="${groupId}"]`).forEach(el => el.classList.add("is-invalid"));
}
function clearGroupError(groupId) {
  document.getElementById(groupId + "-error").textContent = "";
  document.querySelectorAll(`input[name="${groupId}"]`).forEach(el => el.classList.remove("is-invalid"));
}

const REGEX = {
  email:    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  onlyText: /^[a-zA-ZÀ-ỹ\s]+$/,
};

// STRENGTH BAR
function updateStrength(val) {
  const bar = document.getElementById("strengthBar");
  const label = document.getElementById("strengthLabel");
  if (!val) { bar.style.width = "0%"; label.textContent = ""; return; }
  let score = 0;
  if (val.length >= 8) score++;
  if (val.length >= 12) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[a-z]/.test(val)) score++;
  if (/\d/.test(val)) score++;
  if (/[^a-zA-Z\d]/.test(val)) score++;
  if (score <= 2) {
    bar.style.width = "33%"; bar.style.background = "#dc3545";
    label.textContent = "Yếu"; label.className = "small text-danger";
  } else if (score <= 4) {
    bar.style.width = "66%"; bar.style.background = "#ffc107";
    label.textContent = "Trung bình"; label.className = "small text-warning";
  } else {
    bar.style.width = "100%"; bar.style.background = "#198754";
    label.textContent = "Mạnh"; label.className = "small text-success";
  }
}

// VALIDATE TỪNG BƯỚC
function validateStep1() {
  const fn = document.getElementById("fullname").value.trim();
  const dob = document.getElementById("dob").value;
  let ok = true;

  if (!fn) { showError("fullname", "* Họ và tên không được để trống."); ok = false; }
  else if (fn.length < 3) { showError("fullname", "* Họ và tên phải có ít nhất 3 ký tự."); ok = false; }
  else if (!REGEX.onlyText.test(fn)) { showError("fullname", "* Họ và tên chỉ được chứa chữ cái và khoảng trắng."); ok = false; }
  else clearError("fullname");

  if (!dob) { showError("dob", "* Ngày sinh không được để trống."); ok = false; }
  else {
    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    if (dobDate >= today) { showError("dob", "* Ngày sinh phải là ngày trong quá khứ."); ok = false; }
    else if (age < 6) { showError("dob", "* Tuổi phải từ 6 trở lên."); ok = false; }
    else clearError("dob");
  }

  
  clearGroupError("gender");
  return ok;
}

function validateStep2() {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value;
  const repass = document.getElementById("repassword").value;
  let ok = true;

  if (!email) { showError("email", "* Email không được để trống."); ok = false; }
  else if (!REGEX.email.test(email)) { showError("email", "* Email không đúng định dạng."); ok = false; }
  else clearError("email");

  if (!pass) { showError("password", "* Mật khẩu không được để trống."); ok = false; }
  else if (!REGEX.password.test(pass)) { showError("password", "* Mật khẩu ≥ 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường và 1 số."); ok = false; }
  else clearError("password");

  if (!repass) { showError("repassword", "* Xác nhận mật khẩu không được để trống."); ok = false; }
  else if (repass !== pass) { showError("repassword", "* Xác nhận mật khẩu không khớp."); ok = false; }
  else clearError("repassword");

  return ok;
}

// ĐIỀU HƯỚNG BƯỚC
let currentStep = 1;
const stepNames = ["Thông tin cá nhân", "Thông tin tài khoản", "Xác nhận"];

function updateProgress(step) {
  const pct = [33, 66, 100];
  document.getElementById("progressBar").style.width = pct[step - 1] + "%";
  document.getElementById("stepLabel").textContent = "Bước " + step + " / 3";
  document.getElementById("stepName").textContent = stepNames[step - 1];

  for (let i = 1; i <= 3; i++) {
    const c = document.getElementById("circle" + i);
   
    c.classList.remove("bg-primary","bg-success","bg-white","text-white","text-secondary","border-primary","border-success");
    if (i < step) {

      c.classList.add("bg-success","text-white","border-success");
      c.textContent = "✓";
    } else if (i === step) {

      c.classList.add("bg-primary","text-white","border-primary");
      c.textContent = i;
    } else {
      
      c.classList.add("bg-white","text-secondary");
      c.textContent = i;
    }
  }
  for (let i = 1; i <= 2; i++) {
    const l = document.getElementById("line" + i);
    if (i < step) {
      l.className = "flex-grow-1 border-top border-success";
    } else {
      l.className = "flex-grow-1 border-top border-secondary-subtle";
    }
    l.style.height = "2px";
  }
}

function showStep(step) {
  document.querySelectorAll(".step").forEach(el => el.classList.remove("active"));
  document.getElementById("step" + step).classList.add("active");
  updateProgress(step);
  currentStep = step;
}

function goNext(from) {
  if (from === 1 && !validateStep1()) return;
  if (from === 2 && !validateStep2()) return;
  if (from === 2) fillConfirm();
  showStep(from + 1);
}

function goBack(from) {
  showStep(from - 1);
}

function fillConfirm() {
  const dob = document.getElementById("dob").value;
  const [y, m, d] = dob.split("-");
  document.getElementById("cf-fullname").textContent = document.getElementById("fullname").value.trim();
  document.getElementById("cf-dob").textContent = d + "/" + m + "/" + y;
  document.getElementById("cf-gender").textContent = document.querySelector('input[name="gender"]:checked').value;
  document.getElementById("cf-email").textContent = document.getElementById("email").value.trim();
}

function submitForm() {
  document.getElementById("step3").classList.remove("active");
  document.getElementById("successName").textContent = document.getElementById("fullname").value.trim();
  document.getElementById("successBox").style.display = "block";
}

function resetAll() {
  
  ["fullname","dob","email","password","repassword"].forEach(id => {
    document.getElementById(id).value = "";
    clearError(id);
  });
  document.getElementById("genderMale").checked = true;
  document.getElementById("strengthBar").style.width = "0%";
  document.getElementById("strengthLabel").textContent = "";
  document.getElementById("successBox").style.display = "none";
  showStep(1);
}

// GẮN SỰ KIỆN
document.addEventListener("DOMContentLoaded", function () {

 
  document.getElementById("togglePw").addEventListener("click", function () {
    const inp = document.getElementById("password");
    inp.type = inp.type === "password" ? "text" : "password";
    document.getElementById(this.id === 'togglePw' ? 'iconPw' : 'iconRepw').className = inp.type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
  });
  document.getElementById("toggleRepw").addEventListener("click", function () {
    const inp = document.getElementById("repassword");
    inp.type = inp.type === "password" ? "text" : "password";
    document.getElementById(this.id === 'togglePw' ? 'iconPw' : 'iconRepw').className = inp.type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
  });

 
  document.getElementById("password").addEventListener("input", function () {
    updateStrength(this.value);
    if (this.classList.contains("is-invalid")) clearError("password");
  });

  
  document.getElementById("fullname").addEventListener("blur", function () {
    const v = this.value.trim();
    if (!v) showError("fullname", "* Họ và tên không được để trống.");
    else if (v.length < 3) showError("fullname", "* Họ và tên phải có ít nhất 3 ký tự.");
    else if (!REGEX.onlyText.test(v)) showError("fullname", "* Họ và tên chỉ được chứa chữ cái và khoảng trắng.");
    else clearError("fullname");
  });
  document.getElementById("dob").addEventListener("blur", function () {
    if (!this.value) showError("dob", "* Ngày sinh không được để trống.");
    else clearError("dob");
  });

  //
  document.getElementById("email").addEventListener("blur", function () {
    const v = this.value.trim();
    if (!v) showError("email", "* Email không được để trống.");
    else if (!REGEX.email.test(v)) showError("email", "* Email không đúng định dạng.");
    else clearError("email");
  });
  document.getElementById("password").addEventListener("blur", function () {
    if (!this.value) showError("password", "* Mật khẩu không được để trống.");
    else if (!REGEX.password.test(this.value)) showError("password", "* Mật khẩu ≥ 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường và 1 số.");
    else clearError("password");
  });
  document.getElementById("repassword").addEventListener("blur", function () {
    const pass = document.getElementById("password").value;
    if (!this.value) showError("repassword", "* Xác nhận mật khẩu không được để trống.");
    else if (this.value !== pass) showError("repassword", "* Xác nhận mật khẩu không khớp.");
    else clearError("repassword");
  });


  ["fullname","dob","email","repassword"].forEach(id => {
    document.getElementById(id).addEventListener("input", function () {
      if (this.classList.contains("is-invalid")) clearError(id);
    });
  });

  updateProgress(1);
});
