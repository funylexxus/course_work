document.addEventListener('DOMContentLoaded', function () {
  const usernameElement = document.getElementById('username');
  const logoutBtn = document.getElementById('logoutBtn');
  const authLink = document.getElementById('authLink');
  const logoutDropdown = document.querySelector('.logout-dropdown');

  function updateAuthStatus() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      // Показываем имя пользователя
      usernameElement.textContent = user.username;
      // Показываем выпадающее меню для выхода
      logoutDropdown.style.display = 'block';
      // Скрываем ссылку на авторизацию
      authLink.style.display = 'none';

      // Добавляем обработчик для кнопки выхода
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('userData');
        window.location.href = '../auth/auth.html';
      });
    } else {
      // Скрываем выпадающее меню для выхода
      logoutDropdown.style.display = 'none';
      // Показываем ссылку на авторизацию
      authLink.style.display = 'block';
    }
  }

  updateAuthStatus();

  // Слушаем изменения в localStorage
  window.addEventListener('storage', function (e) {
    if (e.key === 'userData') {
      updateAuthStatus();
    }
  });
});
