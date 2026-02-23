/* ======================================================
   US#2 – Registration Form JS Validation (signup.js)
   ====================================================== */

(function () {
  'use strict';

  const form       = document.getElementById('signupForm');
  const msgBox     = document.getElementById('formMsg');
  const successDiv = document.getElementById('successMsg');

  /* ---- Helpers ---- */
  function showError(inputEl, msgEl, msg) {
    inputEl.classList.remove('is-ok');
    inputEl.classList.add('is-error');
    msgEl.textContent = msg;
    msgEl.classList.add('show');
  }

  function showOk(inputEl, msgEl) {
    inputEl.classList.remove('is-error');
    inputEl.classList.add('is-ok');
    msgEl.classList.remove('show');
  }

  function clearState(inputEl, msgEl) {
    inputEl.classList.remove('is-error', 'is-ok');
    msgEl.classList.remove('show');
  }

  /* ---- Password strength ---- */
  const pwInput  = document.getElementById('password');
  const strFill  = document.getElementById('strengthFill');
  const strText  = document.getElementById('strengthText');

  function checkStrength(pw) {
    let score = 0;
    if (pw.length >= 8)                      score++;
    if (/[a-z]/.test(pw))                   score++;
    if (/[A-Z]/.test(pw))                   score++;
    if (/\d/.test(pw))                      score++;
    if (/[@#$%^&+=!?_\-]/.test(pw))        score++;

    const levels = [
      { label: '',           color: '#eee',    pct: '0%'   },
      { label: 'Very Weak',  color: '#e74c3c', pct: '20%'  },
      { label: 'Weak',       color: '#e67e22', pct: '40%'  },
      { label: 'Fair',       color: '#f1c40f', pct: '60%'  },
      { label: 'Strong',     color: '#2ecc71', pct: '80%'  },
      { label: 'Very Strong',color: '#27ae60', pct: '100%' },
    ];
    const l = levels[score];
    strFill.style.width      = l.pct;
    strFill.style.background = l.color;
    strText.textContent      = l.label ? 'Strength: ' + l.label : '';
  }

  pwInput.addEventListener('input', () => checkStrength(pwInput.value));

  /* ---- Live field validation ---- */
  function validateField(id) {
    const el   = document.getElementById(id);
    const errEl = document.getElementById(id + 'Err');
    const val  = el.value.trim();

    switch (id) {
      case 'fullname':
        if (!val) { showError(el, errEl, 'Full name is required.'); return false; }
        if (val.length < 3) { showError(el, errEl, 'Must be at least 3 characters.'); return false; }
        break;
      case 'username':
        if (!val) { showError(el, errEl, 'Username is required.'); return false; }
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(val)) { showError(el, errEl, '3-20 chars, letters/numbers/_ only.'); return false; }
        break;
      case 'email':
        if (!val) { showError(el, errEl, 'Email address is required.'); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showError(el, errEl, 'Enter a valid email address.'); return false; }
        break;
      case 'password':
        if (!val) { showError(el, errEl, 'Password is required.'); return false; }
        if (val.length < 8) { showError(el, errEl, 'Password must be at least 8 characters.'); return false; }
        if (!/[A-Z]/.test(val)) { showError(el, errEl, 'Must contain at least one uppercase letter.'); return false; }
        if (!/[a-z]/.test(val)) { showError(el, errEl, 'Must contain at least one lowercase letter.'); return false; }
        if (!/\d/.test(val)) { showError(el, errEl, 'Must contain at least one number.'); return false; }
        if (!/[@#$%^&+=!?_\-]/.test(val)) { showError(el, errEl, 'Must contain a special character (@#$%…).'); return false; }
        break;
      case 'confirmPassword': {
        const pw = document.getElementById('password').value;
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
      el.addEventListener('blur',  () => validateField(id));
      el.addEventListener('input', () => { clearState(el, document.getElementById(id + 'Err')); });
    }
  });

  /* ---- Toggle password visibility ---- */
  window.togglePw = function(fieldId) {
    const input = document.getElementById(fieldId);
    const icon  = document.getElementById(fieldId + 'Eye');
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  };

  /* ---- Form submit ---- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msgBox.style.display = 'none';

    const fields  = ['fullname', 'username', 'email', 'password', 'confirmPassword'];
    const results = fields.map(validateField);
    const agreed  = document.getElementById('terms').checked;

    if (!agreed) {
      msgBox.className = 'alert alert-error';
      msgBox.textContent = 'You must agree to the Terms of Service and Privacy Policy.';
      msgBox.style.display = 'block';
      msgBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (results.every(Boolean)) {
      form.style.display = 'none';
      successDiv.style.display = 'block';
    } else {
      msgBox.className = 'alert alert-error';
      msgBox.textContent = 'Please fix the errors above before submitting.';
      msgBox.style.display = 'block';
      msgBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  /* ---- Hamburger nav ---- */
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('navMenu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      menu.classList.toggle('open');
    });
  }

  /* ---- Back to top ---- */
  const backTop = document.getElementById('backTop');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 300);
    });
    backTop.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
