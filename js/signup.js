/* ======================================================
   GoTrip – Login & Sign Up JS  (signup.js)
   ====================================================== */

(function () {
  'use strict';

  /* ============================================================
     TAB SWITCHER
     ============================================================ */
  window.switchTab = function (tab) {
    const panels   = document.querySelectorAll('.form-panel');
    const tabBtns  = document.querySelectorAll('.tab-btn');

    panels.forEach(p => p.classList.remove('active'));
    tabBtns.forEach(b => b.classList.remove('active'));

    document.getElementById('panel' + capitalise(tab)).classList.add('active');
    document.getElementById('tab'   + capitalise(tab)).classList.add('active');
  };

  function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ============================================================
     SHARED HELPERS
     ============================================================ */
  function showError(inputEl, msgEl, msg) {
    if (!inputEl || !msgEl) return;
    inputEl.classList.remove('is-ok');
    inputEl.classList.add('is-error');
    msgEl.textContent = msg;
    msgEl.classList.add('show');
  }

  function showOk(inputEl, msgEl) {
    if (!inputEl || !msgEl) return;
    inputEl.classList.remove('is-error');
    inputEl.classList.add('is-ok');
    msgEl.classList.remove('show');
  }

  function clearState(inputEl, msgEl) {
    if (!inputEl || !msgEl) return;
    inputEl.classList.remove('is-error', 'is-ok');
    msgEl.classList.remove('show');
  }

  function showAlert(boxId, type, msg) {
    const box = document.getElementById(boxId);
    if (!box) return;
    box.className = 'alert alert-' + type;
    box.textContent = msg;
    box.style.display = 'block';
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideAlert(boxId) {
    const box = document.getElementById(boxId);
    if (box) box.style.display = 'none';
  }

  /* ============================================================
     TOGGLE PASSWORD VISIBILITY  (shared)
     ============================================================ */
  window.togglePw = function (fieldId) {
    const input = document.getElementById(fieldId);
    const icon  = document.getElementById(fieldId + 'Eye');
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      if (icon) icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      if (icon) icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  };

  /* ============================================================
     LOGIN FORM
     ============================================================ */
  const loginForm    = document.getElementById('loginForm');
  const loginSuccess = document.getElementById('loginSuccess');

  function validateLoginField(id) {
    const el    = document.getElementById(id);
    const errEl = document.getElementById(id + 'Err');
    if (!el) return true;
    const val = el.value.trim();

    switch (id) {
      case 'loginEmail':
        if (!val) { showError(el, errEl, 'Email address is required.'); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showError(el, errEl, 'Enter a valid email address.'); return false; }
        break;
      case 'loginPassword':
        if (!val) { showError(el, errEl, 'Password is required.'); return false; }
        if (val.length < 6) { showError(el, errEl, 'Password must be at least 6 characters.'); return false; }
        break;
      default: break;
    }
    showOk(el, errEl);
    return true;
  }

  ['loginEmail', 'loginPassword'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur',  () => validateLoginField(id));
      el.addEventListener('input', () => clearState(el, document.getElementById(id + 'Err')));
    }
  });

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      hideAlert('loginMsg');

      const fields  = ['loginEmail', 'loginPassword'];
      const results = fields.map(validateLoginField);

      if (results.every(Boolean)) {
        // Simulate successful login (client-side demo)
        loginForm.style.display    = 'none';
        loginSuccess.style.display = 'block';
      } else {
        showAlert('loginMsg', 'error', 'Please fix the errors above before submitting.');
      }
    });
  }

  /* ============================================================
     SIGNUP FORM
     ============================================================ */
  const signupForm    = document.getElementById('signupForm');
  const signupSuccess = document.getElementById('signupSuccess');

  /* Password strength meter */
  const pwInput = document.getElementById('password');
  const strFill = document.getElementById('strengthFill');
  const strText = document.getElementById('strengthText');

  function checkStrength(pw) {
    let score = 0;
    if (pw.length >= 8)                    score++;
    if (/[a-z]/.test(pw))                 score++;
    if (/[A-Z]/.test(pw))                 score++;
    if (/\d/.test(pw))                    score++;
    if (/[@#$%^&+=!?_\-]/.test(pw))      score++;

    const levels = [
      { label: '',            color: '#eee',    pct: '0%'   },
      { label: 'Very Weak',   color: '#e74c3c', pct: '20%'  },
      { label: 'Weak',        color: '#e67e22', pct: '40%'  },
      { label: 'Fair',        color: '#f1c40f', pct: '60%'  },
      { label: 'Strong',      color: '#2ecc71', pct: '80%'  },
      { label: 'Very Strong', color: '#27ae60', pct: '100%' },
    ];
    const l = levels[score];
    if (strFill) { strFill.style.width = l.pct; strFill.style.background = l.color; }
    if (strText)   strText.textContent = l.label ? 'Strength: ' + l.label : '';
  }

  if (pwInput) pwInput.addEventListener('input', () => checkStrength(pwInput.value));

  /* Signup field validation */
  function validateSignupField(id) {
    const el    = document.getElementById(id);
    const errEl = document.getElementById(id + 'Err');
    if (!el) return true;
    const val = el.value.trim();

    switch (id) {
      case 'fullname':
        if (!val) { showError(el, errEl, 'Full name is required.'); return false; }
        if (val.length < 3) { showError(el, errEl, 'Must be at least 3 characters.'); return false; }
        break;
      case 'username':
        if (!val) { showError(el, errEl, 'Username is required.'); return false; }
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(val)) { showError(el, errEl, '3–20 chars, letters/numbers/_ only.'); return false; }
        break;
      case 'email':
        if (!val) { showError(el, errEl, 'Email address is required.'); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showError(el, errEl, 'Enter a valid email address.'); return false; }
        break;
      case 'password':
        if (!val) { showError(el, errEl, 'Password is required.'); return false; }
        if (val.length < 8)       { showError(el, errEl, 'Password must be at least 8 characters.'); return false; }
        if (!/[A-Z]/.test(val))   { showError(el, errEl, 'Must contain at least one uppercase letter.'); return false; }
        if (!/[a-z]/.test(val))   { showError(el, errEl, 'Must contain at least one lowercase letter.'); return false; }
        if (!/\d/.test(val))      { showError(el, errEl, 'Must contain at least one number.'); return false; }
        if (!/[@#$%^&+=!?_\-]/.test(val)) { showError(el, errEl, 'Must contain a special character (@#$%…).'); return false; }
        break;
      case 'confirmPassword': {
        const pw = document.getElementById('password') ? document.getElementById('password').value : '';
        if (!val) { showError(el, errEl, 'Please confirm your password.'); return false; }
        if (val !== pw) { showError(el, errEl, 'Passwords do not match.'); return false; }
        break;
      }
      default: break;
    }
    showOk(el, errEl);
    return true;
  }

  ['fullname', 'username', 'email', 'password', 'confirmPassword'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur',  () => validateSignupField(id));
      el.addEventListener('input', () => clearState(el, document.getElementById(id + 'Err')));
    }
  });

  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      hideAlert('signupMsg');

      const fields  = ['fullname', 'username', 'email', 'password', 'confirmPassword'];
      const results = fields.map(validateSignupField);
      const agreed  = document.getElementById('terms') && document.getElementById('terms').checked;

      if (!agreed) {
        showAlert('signupMsg', 'error', 'You must agree to the Terms of Service and Privacy Policy.');
        return;
      }

      if (results.every(Boolean)) {
        signupForm.style.display    = 'none';
        signupSuccess.style.display = 'block';
      } else {
        showAlert('signupMsg', 'error', 'Please fix the errors above before submitting.');
      }
    });
  }

  /* ============================================================
     CHECK URL PARAM ?tab=login|signup
     ============================================================ */
  const params = new URLSearchParams(window.location.search);
  const tabParam = params.get('tab');
  if (tabParam === 'login' || tabParam === 'signup') {
    switchTab(tabParam);
  }

})();
