document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'http://localhost:3000'; // URL NestJS сервера

  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(signupForm);
    const data = {
      login: formData.get('login'),
      email: formData.get('email'),
      pswd: formData.get('pswd'),
    };

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Регистрация успешна');
        window.location.href = '../index.html';
      } else {
        alert(result.message || 'Ошибка при регистрации');
      }
    } catch (error) {
      alert('Произошла ошибка при подключении к серверу');
      console.error('Error:', error);
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const data = {
      login: formData.get('login'),
      pswd: formData.get('pswd'),
    };

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        const userData = {
          username: result.user.username,
          id: result.user.id,
          // другие нужные данные
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        alert('Вход выполнен успешно!');
        window.location.href = '../index.html';
      } else {
        alert(result.message || 'Ошибка при входе');
      }
    } catch (error) {
      alert('Произошла ошибка при подключении к серверу');
      console.error('Error:', error);
    }
  });
});
