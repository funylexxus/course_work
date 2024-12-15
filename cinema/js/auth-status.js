document.addEventListener('DOMContentLoaded', () => {
  const checkAuthStatus = () => {
    // Получаем данные пользователя из localStorage
    const userData = localStorage.getItem('userData');
    const usernameElement = document.getElementById('username');
    const authLink = document.getElementById('authLink');
    const authSection = document.querySelector('.auth-section');

    if (userData) {
      const user = JSON.parse(userData);
      usernameElement.textContent = user.username;
      authSection.classList.add('authenticated');

      // Изменяем поведение клика на иконку профиля
      authLink.href = '#'; // Можно изменить на страницу профиля

      // Добавляем выпадающее меню при наведении
      const dropdownMenu = document.createElement('div');
      dropdownMenu.className = 'profile-dropdown';
      dropdownMenu.innerHTML = `
        <ul>
          <li><a href="#" id="logoutBtn">Выйти</a></li>
        </ul>
      `;

      authSection.appendChild(dropdownMenu);

      // Добавляем обработчик для кнопки выхода
      document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('userData');
        window.location.reload();
      });
    } else {
      usernameElement.textContent = '';
      authSection.classList.remove('authenticated');
      authLink.href = './auth/auth.html';
    }
  };

  checkAuthStatus();
});
