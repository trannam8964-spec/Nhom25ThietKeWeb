(() => {
  const form = document.getElementById('loginForm');
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const error = document.getElementById('loginError');
  const toggle = document.getElementById('togglePassword');
  const DEMO_PASSWORD = '123456';
  if (sessionStorage.getItem('hoiAnCoffeeLoggedIn') === 'true') {
  }
  toggle.addEventListener('click', () => {
    const showing = password.type === 'text';
    password.type = showing ? 'password' : 'text';
    toggle.textContent = showing ? 'Hiện' : 'Ẩn';
    toggle.setAttribute('aria-label', showing ? 'Hiện mật khẩu' : 'Ẩn mật khẩu');
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const user = username.value.trim();
    const pass = password.value;
    if (user.length > 0 && pass === DEMO_PASSWORD) {
      sessionStorage.setItem('hoiAnCoffeeLoggedIn', 'true');
      sessionStorage.setItem('hoiAnCoffeeUsername', user);
      window.location.href = 'coffe.html';
      return;
    }
    error.textContent = 'Vui lòng nhập tên đăng nhập và mật khẩu demo 123456.';
    password.setAttribute('aria-invalid', 'true');
  });
  password.addEventListener('input', () => {
    error.textContent = '';
    password.removeAttribute('aria-invalid');
  });
})();
