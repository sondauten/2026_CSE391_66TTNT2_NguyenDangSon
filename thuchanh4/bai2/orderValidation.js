// GIÁ SẢN PHẨM
const prices = {
  "Áo thun":       150000,
  "Quần jeans":    200000,
  "Giày sneaker":  350000,
  "Túi xách":      280000,
  "Mũ lưỡi trai":  90000,
};

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
  const errorSpan = document.getElementById(groupId + "-error");
  if (errorSpan) errorSpan.textContent = message;
  document.querySelectorAll(`input[name="${groupId}"]`).forEach(el => el.classList.add("is-invalid"));
}

function clearGroupError(groupId) {
  const errorSpan = document.getElementById(groupId + "-error");
  if (errorSpan) errorSpan.textContent = "";
  document.querySelectorAll(`input[name="${groupId}"]`).forEach(el => el.classList.remove("is-invalid"));
}

function formatVND(amount) {
  return Number(amount).toLocaleString("vi-VN") + " ₫";
}

// TÍNH TỔNG TIỀN
function calcTotal() {
  const product = document.getElementById("product").value;
  const qty = parseInt(document.getElementById("qty").value) || 0;
  const price = prices[product] || 0;
  const total = price * qty;
  document.getElementById("totalPrice").textContent = total > 0 ? formatVND(total) : "0 ₫";
  return total;
}

// VALIDATE TỪNG TRƯỜNG
function validateProduct() {
  const val = document.getElementById("product").value;
  if (!val) {
    showError("product", "* Vui lòng chọn sản phẩm.");
    return false;
  }
  clearError("product");
  return true;
}

function validateQty() {
  const val = document.getElementById("qty").value.trim();
  const num = Number(val);
  if (!val) {
    showError("qty", "* Số lượng không được để trống.");
    return false;
  }
  if (!Number.isInteger(num) || num < 1 || num > 99) {
    showError("qty", "* Số lượng phải là số nguyên từ 1 đến 99.");
    return false;
  }
  clearError("qty");
  return true;
}

function validateDate() {
  const val = document.getElementById("deliveryDate").value;
  if (!val) {
    showError("deliveryDate", "* Ngày giao hàng không được để trống.");
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(val);
  const max = new Date(today);
  max.setDate(max.getDate() + 30);

  if (selected < today) {
    showError("deliveryDate", "* Ngày giao hàng không được là ngày trong quá khứ.");
    return false;
  }
  if (selected > max) {
    showError("deliveryDate", "* Ngày giao hàng không được quá 30 ngày kể từ hôm nay.");
    return false;
  }
  clearError("deliveryDate");
  return true;
}

function validateAddress() {
  const val = document.getElementById("address").value.trim();
  if (!val) {
    showError("address", "* Địa chỉ giao hàng không được để trống.");
    return false;
  }
  if (val.length < 10) {
    showError("address", "* Địa chỉ phải có ít nhất 10 ký tự.");
    return false;
  }
  clearError("address");
  return true;
}

function validateNote() {
  const val = document.getElementById("note").value;
  if (val.length > 200) {
    showError("note", "* Ghi chú không được vượt quá 200 ký tự.");
    return false;
  }
  clearError("note");
  return true;
}
(function() {
    const today = new Date();
    const pad = n => String(n).padStart(2, '0');
    const fmt = d => d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate());
    const max = new Date(today);
    max.setDate(max.getDate() + 30);
    document.addEventListener('DOMContentLoaded', function() {
      const el = document.getElementById('deliveryDate');
      el.min = fmt(today);
      el.max = fmt(max);
    });
  })();


// ĐẾM KÝ TỰ GHI CHÚ REALTIME
function updateNoteCount() {
  const val = document.getElementById("note").value;
  const count = val.length;
  const counter = document.getElementById("noteCount");
  counter.textContent = count + "/200";
  if (count > 200) {
    counter.classList.add("text-danger");
    counter.classList.remove("text-muted");
  } else {
    counter.classList.remove("text-danger");
    counter.classList.add("text-muted");
  }
}

// HIỆN CONFIRM BOX
function showConfirm() {
  const product = document.getElementById("product").value;
  const qty = document.getElementById("qty").value;
  const date = document.getElementById("deliveryDate").value;
  const address = document.getElementById("address").value.trim();
  const payment = document.querySelector('input[name="payment"]:checked').value;
  const total = calcTotal();

  document.getElementById("cf-product").textContent = product;
  document.getElementById("cf-qty").textContent = qty;
  document.getElementById("cf-total").textContent = formatVND(total);
  // Định dạng ngày dd/mm/yyyy
  const [y, m, d] = date.split("-");
  document.getElementById("cf-date").textContent = d + "/" + m + "/" + y;
  document.getElementById("cf-address").textContent = address;
  document.getElementById("cf-payment").textContent = payment;

  document.getElementById("orderForm").style.display = "none";
  document.getElementById("confirmBox").style.display = "block";
}

function cancelConfirm() {
  document.getElementById("confirmBox").style.display = "none";
  document.getElementById("orderForm").style.display = "block";
}

function confirmOrder() {
  document.getElementById("confirmBox").style.display = "none";
  document.getElementById("successBox").style.display = "block";
}

// RESET
function resetAll() {
  const form = document.getElementById("orderForm");
  form.reset();
  form.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
  form.querySelectorAll("[id$='-error']").forEach(el => el.textContent = "");
  document.getElementById("totalPrice").textContent = "0 ₫";
  document.getElementById("noteCount").textContent = "0/200";
  document.getElementById("successBox").style.display = "none";
  form.style.display = "block";
}

// GẮN SỰ KIỆN
document.addEventListener("DOMContentLoaded", function () {

  // Tính tổng tiền realtime
  document.getElementById("product").addEventListener("change", calcTotal);
  document.getElementById("qty").addEventListener("input", calcTotal);

  // Đếm ký tự ghi chú
  document.getElementById("note").addEventListener("input", function () {
    updateNoteCount();
    if (this.classList.contains("is-invalid")) {
      clearError("note");
    }
  });

  // BLUR validation
  document.getElementById("product").addEventListener("blur", validateProduct);
  document.getElementById("qty").addEventListener("blur", validateQty);
  document.getElementById("deliveryDate").addEventListener("blur", validateDate);
  document.getElementById("address").addEventListener("blur", validateAddress);
  document.getElementById("note").addEventListener("blur", validateNote);
  document.querySelectorAll('input[name="payment"]').forEach(el => {
    el.addEventListener("change", validatePayment);
  });

  // INPUT: xóa lỗi khi nhập lại
  ["qty", "deliveryDate", "address"].forEach(id => {
    document.getElementById(id).addEventListener("input", function () {
      if (this.classList.contains("is-invalid")) clearError(id);
    });
  });

  // SUBMIT
  document.getElementById("orderForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const isValid =
      validateProduct()  &
      validateQty()      &
      validateDate()     &
      validateAddress()  &
      validateNote()     &
      validatePayment();

    if (isValid) {
      showConfirm();
    }
  });
});
