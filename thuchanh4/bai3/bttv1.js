// UTILITY
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorSpan = document.getElementById(fieldId + "-error");
  if (field) field.classList.add("is-invalid");
  if (errorSpan) errorSpan.textContent = message;
}
function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorSpan = document.getElementById(fieldId + "-error");
  if (field) field.classList.remove("is-invalid");
  if (errorSpan) errorSpan.textContent = "";
}
function showGroupError(groupId, message) {
  document.getElementById(groupId + "-error").textContent = message;
  document.querySelectorAll(`input[name="${groupId}"]`).forEach(el => el.classList.add("is-invalid"));
}
function clearGroupError(groupId) {
  document.getElementById(groupId + "-error").textContent = "";
  document.querySelectorAll(`input[name="${groupId}"]`).forEach(el => el.classList.remove("is-invalid"));
}
function showCheckboxError(id, message) {
  const el = document.getElementById(id);
  if (el) el.classList.add("is-invalid");
  document.getElementById(id + "-error").textContent = message;
}
function clearCheckboxError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("is-invalid");
  document.getElementById(id + "-error").textContent = "";
}

// REGEX
const REGEX = {
  email:    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone:    /^0[0-9]{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  onlyText: /^[a-zA-ZÀ-ỹ\s]+$/,
};

// PASSWORD STRENGTH BAR
function updateStrength(val) {
  const bar = document.getElementById("strengthBar");
  const label = document.getElementById("strengthLabel");
  if (!val) {
    bar.style.width = "0%";
    label.textContent = "";
    return;
  }
  let score = 0;
  if (val.length >= 8) score++;
  if (val.length >= 12) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[a-z]/.test(val)) score++;
  if (/\d/.test(val)) score++;
  if (/[^a-zA-Z\d]/.test(val)) score++;

  if (score <= 2) {
    bar.style.width = "33%";
    bar.style.background = "#dc3545";
    label.textContent = "Yếu";
    label.className = "small text-danger";
  } else if (score <= 4) {
    bar.style.width = "66%";
    bar.style.background = "#ffc107";
    label.textContent = "Trung bình";
    label.className = "small text-warning";
  } else {
    bar.style.width = "100%";
    bar.style.background = "#198754";
    label.textContent = "Mạnh";
    label.className = "small text-success";
  }
}

// VALIDATE TỪNG TRƯỜNG
function validateFullname() {
  const val = document.getElementById("fullname").value.trim();
  if (!val) { showError("fullname", "* Họ và tên không được để trống."); return false; }
  if (val.length < 3) { showError("fullname", "* Họ và tên phải có ít nhất 3 ký tự."); return false; }
  if (!REGEX.onlyText.test(val)) { showError("fullname", "* Họ và tên chỉ được chứa chữ cái và khoảng trắng."); return false; }
  clearError("fullname");
  return true;
}
function validateEmail() {
  const val = document.getElementById("email").value.trim();
  if (!val) { showError("email", "* Email không được để trống."); return false; }
  if (!REGEX.email.test(val)) { showError("email", "* Email không đúng định dạng (vd: name@domain.com)."); return false; }
  clearError("email");
  return true;
}
function validatePhone() {
  const val = document.getElementById("phone").value.trim();
  if (!val) { showError("phone", "* Số điện thoại không được để trống."); return false; }
  if (!REGEX.phone.test(val)) { showError("phone", "* Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0."); return false; }
  clearError("phone");
  return true;
}
function validatePassword() {
  const val = document.getElementById("password").value;
  if (!val) { showError("password", "* Mật khẩu không được để trống."); return false; }
  if (!REGEX.password.test(val)) { showError("password", "* Mật khẩu ≥ 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường và 1 số."); return false; }
  clearError("password");
  return true;
}
function validateRepassword() {
  const pass = document.getElementById("password").value;
  const repass = document.getElementById("repassword").value;
  if (!repass) { showError("repassword", "* Xác nhận mật khẩu không được để trống."); return false; }
  if (repass !== pass) { showError("repassword", "* Xác nhận mật khẩu không khớp."); return false; }
  clearError("repassword");
  return true;
}
function validateGender() {
  if (!document.querySelector('input[name="gender"]:checked')) {
    showGroupError("gender", "* Vui lòng chọn giới tính."); return false;
  }
  clearGroupError("gender");
  return true;
}
function validateTerms() {
  if (!document.getElementById("terms").checked) {
    showCheckboxError("terms", "* Bạn phải đồng ý với điều khoản sử dụng."); return false;
  }
  clearCheckboxError("terms");
  return true;
}

// RESET
function resetForm() {
  const form = document.getElementById("registerForm");
  form.reset();
  form.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
  form.querySelectorAll("[id$='-error']").forEach(el => el.textContent = "");
  document.getElementById("fullnameCount").textContent = "0/50";
  document.getElementById("strengthBar").style.width = "0%";
  document.getElementById("strengthLabel").textContent = "";
  document.getElementById("successBox").style.display = "none";
  form.style.display = "block";
}

// GẮN SỰ KIỆN
document.addEventListener("DOMContentLoaded", function () {

  // Đếm ký tự họ tên
  document.getElementById("fullname").addEventListener("input", function () {
    const len = this.value.length;
    const counter = document.getElementById("fullnameCount");
    counter.textContent = len + "/50";
    counter.className = len > 45 ? "small text-warning" : "small text-muted";
    if (this.classList.contains("is-invalid")) clearError("fullname");
  });

  // Toggle hiện/ẩn mật khẩu
  document.getElementById("togglePassword").addEventListener("click", function () {
    const input = document.getElementById("password");
    input.type = input.type === "password" ? "text" : "password";
    document.getElementById(this.id === 'togglePassword' ? 'iconPassword' : 'iconRepassword').className = input.type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
  });
  document.getElementById("toggleRepassword").addEventListener("click", function () {
    const input = document.getElementById("repassword");
    input.type = input.type === "password" ? "text" : "password";
    document.getElementById(this.id === 'togglePassword' ? 'iconPassword' : 'iconRepassword').className = input.type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
  });

  // Strength bar realtime
  document.getElementById("password").addEventListener("input", function () {
    updateStrength(this.value);
    if (this.classList.contains("is-invalid")) clearError("password");
  });

  // BLUR
  document.getElementById("fullname").addEventListener("blur", validateFullname);
  document.getElementById("email").addEventListener("blur", validateEmail);
  document.getElementById("phone").addEventListener("blur", validatePhone);
  document.getElementById("password").addEventListener("blur", validatePassword);
  document.getElementById("repassword").addEventListener("blur", validateRepassword);
  document.querySelectorAll('input[name="gender"]').forEach(el => el.addEventListener("change", validateGender));
  document.getElementById("terms").addEventListener("change", validateTerms);

  // INPUT xóa lỗi
  ["email", "phone", "repassword"].forEach(id => {
    document.getElementById(id).addEventListener("input", function () {
      if (this.classList.contains("is-invalid")) clearError(id);
    });
  });

  // SUBMIT
  document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const isValid =
      validateFullname()   &
      validateEmail()      &
      validatePhone()      &
      validatePassword()   &
      validateRepassword() &
      validateGender()     &
      validateTerms();

    if (isValid) {
      document.getElementById("successName").textContent = document.getElementById("fullname").value.trim();
      document.getElementById("registerForm").style.display = "none";
      document.getElementById("successBox").style.display = "block";
    }
  });
});
