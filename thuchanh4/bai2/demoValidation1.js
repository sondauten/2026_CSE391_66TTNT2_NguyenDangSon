

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorSpan = document.getElementById(fieldId + "-error");
  if (field) {
    field.classList.remove("is-valid");
    field.classList.add("is-invalid");
  }
  if (errorSpan) errorSpan.textContent = message;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorSpan = document.getElementById(fieldId + "-error");
  if (field) {
    field.classList.remove("is-invalid");
  }
  if (errorSpan) errorSpan.textContent = "";
}

function showGroupError(groupId, message) {
  const errorSpan = document.getElementById(groupId + "-error");
  if (errorSpan) errorSpan.textContent = message;
  document.querySelectorAll(`input[name="${groupId}"]`).forEach(el => {
    el.classList.add("is-invalid");
  });
}

function clearGroupError(groupId) {
  const errorSpan = document.getElementById(groupId + "-error");
  if (errorSpan) errorSpan.textContent = "";
  document.querySelectorAll(`input[name="${groupId}"]`).forEach(el => {
    el.classList.remove("is-invalid");
  });
}

function clearCheckboxError(id) {
  const el = document.getElementById(id);
  const errorSpan = document.getElementById(id + "-error");
  if (el) { el.classList.remove("is-invalid"); }
  if (errorSpan) errorSpan.textContent = "";
}

function showCheckboxError(id, message) {
  const el = document.getElementById(id);
  const errorSpan = document.getElementById(id + "-error");
  if (el) { el.classList.remove("is-valid"); el.classList.add("is-invalid"); }
  if (errorSpan) errorSpan.textContent = message;
}

const REGEX = {
  email:    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone:    /^0[0-9]{9}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  onlyText: /^[a-zA-ZÀ-ỹ\s]+$/,
};

function validateFullname() {
  const val = document.getElementById("fullname").value.trim();
  if (!val) {
    showError("fullname", "* Họ và tên không được để trống.");
    return false;
  }
  if (val.length < 3) {
    showError("fullname", "Họ và tên phải có ít nhất 3 ký tự.");
    return false;
  }
  if (!REGEX.onlyText.test(val)) {
    showError("fullname", "Họ và tên chỉ được chứa chữ cái và khoảng trắng.");
    return false;
  }
  clearError("fullname");
  return true;
}

function validateEmail() {
  const val = document.getElementById("email").value.trim();
  if (!val) {
    showError("email", "* Email không được để trống.");
    return false;
  }
  if (!REGEX.email.test(val)) {
    showError("email", "Email không đúng định dạng (vd: name@domain.com).");
    return false;
  }
  clearError("email");
  return true;
}

function validatePhone() {
  const val = document.getElementById("phone").value.trim();
  if (!val) {
    showError("phone", "* Số điện thoại không được để trống.");
    return false;
  }
  if (!REGEX.phone.test(val)) {
    showError("phone", "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.");
    return false;
  }
  clearError("phone");
  return true;
}

function validatePassword() {
  const val = document.getElementById("password").value;
  if (!val) {
    showError("password", "* Mật khẩu không được để trống.");
    return false;
  }
  if (!REGEX.password.test(val)) {
    showError("password", "Mật khẩu ≥ 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường và 1 số.");
    return false;
  }
  clearError("password");
  return true;
}

function validateRepassword() {
  const pass = document.getElementById("password").value;
  const repass = document.getElementById("repassword").value;
  if (!repass) {
    showError("repassword", "* Xác nhận mật khẩu không được để trống.");
    return false;
  }
  if (repass !== pass) {
    showError("repassword", "Xác nhận mật khẩu không khớp.");
    return false;
  }
  clearError("repassword");
  return true;
}

function validateGender() {
  const selected = document.querySelector('input[name="gender"]:checked');
  if (!selected) {
    showGroupError("gender", "* Vui lòng chọn giới tính.");
    return false;
  }
  clearGroupError("gender");
  return true;
}

function validateTerms() {
  const checked = document.getElementById("terms").checked;
  if (!checked) {
    showCheckboxError("terms", "* Bạn phải đồng ý với điều khoản sử dụng.");
    return false;
  }
  clearCheckboxError("terms");
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("fullname").addEventListener("blur", validateFullname);
  document.getElementById("email").addEventListener("blur", validateEmail);
  document.getElementById("phone").addEventListener("blur", validatePhone);
  document.getElementById("password").addEventListener("blur", validatePassword);
  document.getElementById("repassword").addEventListener("blur", validateRepassword);

  document.querySelectorAll('input[name="gender"]').forEach(el => {
    el.addEventListener("change", validateGender);
  });

  document.getElementById("terms").addEventListener("change", validateTerms);

  document.getElementById("fullname").addEventListener("input", function () {
    if (this.classList.contains("is-invalid")) {
      this.classList.remove("is-invalid");
      document.getElementById("fullname-error").textContent = "";
    }
  });

  document.getElementById("email").addEventListener("input", function () {
    if (this.classList.contains("is-invalid")) {
      this.classList.remove("is-invalid");
      document.getElementById("email-error").textContent = "";
    }
  });

  document.getElementById("phone").addEventListener("input", function () {
    if (this.classList.contains("is-invalid")) {
      this.classList.remove("is-invalid");
      document.getElementById("phone-error").textContent = "";
    }
  });

  document.getElementById("password").addEventListener("input", function () {
    if (this.classList.contains("is-invalid")) {
      this.classList.remove("is-invalid");
      document.getElementById("password-error").textContent = "";
    }
  });

  document.getElementById("repassword").addEventListener("input", function () {
    if (this.classList.contains("is-invalid")) {
      this.classList.remove("is-invalid");
      document.getElementById("repassword-error").textContent = "";
    }
  });

  document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const isValid =
      validateFullname()  &
      validateEmail()     &
      validatePhone()     &
      validatePassword()  &
      validateRepassword()&
      validateGender()    &
      validateTerms();

    if (isValid) {
      const name = document.getElementById("fullname").value.trim();
      document.getElementById("successName").textContent = name;
      document.getElementById("registerForm").style.display = "none";
      document.getElementById("successBox").style.display = "block";
    }
  });
});

function resetForm() {
  const form = document.getElementById("registerForm");
  form.reset();
  form.querySelectorAll(".form-control, .form-check-input").forEach(el => {
    el.classList.remove("is-valid", "is-invalid");
  });
  form.querySelectorAll(".error-msg").forEach(el => {
    el.textContent = "";
  });
  const bar = document.getElementById("strengthBar");
  if (bar) { bar.style.width = "0"; bar.style.background = "transparent"; }

  document.getElementById("successBox").style.display = "none";
  form.style.display = "block";
}
