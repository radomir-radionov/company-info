const form = document.getElementById("form-add-teammate");
const h2 = form.querySelector("h2");
const nameLabel = form.querySelector('label[for="avatar"]');
const confirmPasswordLabel = form.querySelector(
  'label[for="confirm-password"]'
);
const submitBtn = form.querySelector(".btn-primary");

// Select the toggle button from the DOM
const toggleBtn = document.getElementById("toggle-auth-mode");

let isSignUp = true;

toggleBtn.addEventListener("click", () => {
  isSignUp = !isSignUp;
  if (isSignUp) {
    h2.textContent = "Sign Up";
    toggleBtn.textContent = "Switch to Sign In";
    nameLabel.style.display = "";
    confirmPasswordLabel.style.display = "";
    submitBtn.textContent = "Sign Up";
  } else {
    h2.textContent = "Sign In";
    toggleBtn.textContent = "Switch to Sign Up";
    nameLabel.style.display = "none";
    confirmPasswordLabel.style.display = "none";
    submitBtn.textContent = "Sign In";
  }
});

// Validation functions
function validateName() {
  const name = form.querySelector("#name").value.trim();
  const errorDiv = form.querySelector("#name-error");
  errorDiv.textContent = !name && isSignUp ? errorDiv.dataset.error : "";
}

function validateEmail() {
  const email = form.querySelector("#email").value.trim();
  const errorDiv = form.querySelector("#email-error");
  const valid = /^\S+@\S+\.\S+$/.test(email);
  errorDiv.textContent = !email || !valid ? errorDiv.dataset.error : "";
}

function validatePassword() {
  const password = form.querySelector("#password").value;
  const errorDiv = form.querySelector("#password-error");
  if (isSignUp) {
    errorDiv.textContent =
      !password || password.length < 6 ? errorDiv.dataset.error : "";
  } else {
    errorDiv.textContent = !password ? errorDiv.dataset.error : "";
  }
}

function validateConfirmPassword() {
  const password = form.querySelector("#password").value;
  const confirmPassword = form.querySelector("#confirm-password").value;
  const errorDiv = form.querySelector("#confirm-password-error");
  errorDiv.textContent =
    isSignUp && password !== confirmPassword ? errorDiv.dataset.error : "";
}

// Attach input listeners
form.querySelector("#name").addEventListener("input", validateName);
form.querySelector("#email").addEventListener("input", validateEmail);
form.querySelector("#password").addEventListener("input", () => {
  validatePassword();
  validateConfirmPassword();
});
form
  .querySelector("#confirm-password")
  .addEventListener("input", validateConfirmPassword);

// Optional: handle form submit differently for sign up/sign in
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get field values
  const name = form.querySelector("#name").value.trim();
  const email = form.querySelector("#email").value.trim();
  const password = form.querySelector("#password").value;
  const confirmPassword = form.querySelector("#confirm-password").value;

  // Clear previous field errors
  form
    .querySelectorAll(".field-error")
    .forEach((div) => (div.textContent = ""));

  let hasError = false;

  if (isSignUp) {
    if (!name) {
      form.querySelector("#name-error").textContent =
        form.querySelector("#name-error").dataset.error;
      hasError = true;
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      form.querySelector("#email-error").textContent =
        form.querySelector("#email-error").dataset.error;
      hasError = true;
    }
    if (!password || password.length < 6) {
      form.querySelector("#password-error").textContent =
        form.querySelector("#password-error").dataset.error;
      hasError = true;
    }
    if (password !== confirmPassword) {
      form.querySelector("#confirm-password-error").textContent =
        form.querySelector("#confirm-password-error").dataset.error;
      hasError = true;
    }
  } else {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      form.querySelector("#email-error").textContent =
        form.querySelector("#email-error").dataset.error;
      hasError = true;
    }
    if (!password) {
      form.querySelector("#password-error").textContent =
        form.querySelector("#password-error").dataset.error;
      hasError = true;
    }
  }

  if (hasError) return;

  // If no error, proceed
  if (isSignUp) {
    // Sign up logic
    console.log("Sign up:", { name, email, password });
  } else {
    // Sign in logic
    console.log("Sign in:", { email, password });
  }
});
