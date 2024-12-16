class Cart {
  constructor() {
    this.items = [];
    this.modal = document.getElementById('cartModal');
    this.cartItems = document.getElementById('cartItems');
    this.emptyMessage = document.getElementById('emptyCartMessage');
    this.confirmBtn = document.getElementById('confirmOrder');
    this.cartCount = document.getElementById('cartCount');

    this.currentUser = this.getCurrentUser();

    this.loadCart();
    this.initEventListeners();
    this.initProductLinks();
    this.initHeroLinks();
    this.initSidebarLinks();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleLogout();
      });
    }

    this.updateUserDisplay();

    window.addEventListener('storage', (e) => {
      if (e.key === 'userData') {
        const newUser = this.getCurrentUser();
        if (this.currentUser?.id !== newUser?.id) {
          this.currentUser = newUser;
          this.items = [];
          this.loadCart();
          this.updateCartDisplay();
        }
      }
    });
  }

  initSidebarLinks() {
    document
      .querySelectorAll('.product__sidebar__view__item h5 a')
      .forEach((link) => {
        link.onclick = (e) => {
          e.preventDefault();
          const sidebarItem = link.closest('.product__sidebar__view__item');
          const title = link.textContent;
          const rating = sidebarItem.querySelector('.ep').textContent;

          const genreClasses = sidebarItem.className
            .split(' ')
            .filter((className) =>
              ['day', 'week', 'month', 'years'].includes(className)
            );

          // Преобразуем классы в читаемые жанры
          const genreMap = {
            day: 'New',
            week: 'Popular',
            month: 'Trending',
            years: 'Classic',
          };

          const genres = genreClasses.map((cls) => genreMap[cls]).join(', ');

          this.addItem({
            title: title,
            genre: genres,
            rating: rating,
          });
        };

        // Делаем весь блок фильма кликабельным
        const itemBlock = link.closest('.product__sidebar__view__item');
        if (itemBlock) {
          itemBlock.style.cursor = 'pointer';
          itemBlock.onclick = (e) => {
            if (!e.target.matches('a')) {
              e.preventDefault();
              link.click();
            }
          };
        }
      });
  }

  initHeroLinks() {
    // Обработчики для заголовков в секции hero
    document.querySelectorAll('.hero__text h2').forEach((titleElement) => {
      titleElement.style.cursor = 'pointer';
      titleElement.onclick = (e) => {
        e.preventDefault();
        const heroItem = titleElement.closest('.hero__items');
        const title = titleElement.textContent;
        const genre = heroItem.querySelector('.label').textContent;
        this.addItem({ title, genre });
      };
    });

    // Обработчики для кнопок "Buy ticket Now"
    document.querySelectorAll('.hero__text a').forEach((button) => {
      button.onclick = (e) => {
        e.preventDefault();
        const heroItem = button.closest('.hero__items');
        const title = heroItem.querySelector('h2').textContent;
        const genre = heroItem.querySelector('.label').textContent;
        this.addItem({ title, genre });
      };
    });
  }

  initProductLinks() {
    document.querySelectorAll('.product__item__text h5 a').forEach((link) => {
      link.onclick = (e) => {
        e.preventDefault();
        const productItem = link.closest('.product__item');
        const title = link.textContent;
        const genres = Array.from(
          productItem.querySelectorAll('.product__item__text ul li')
        )
          .map((genre) => genre.textContent)
          .join(', ');
        this.addItem({ title, genre: genres });
      };
    });
  }

  initEventListeners() {
    const closeBtn = document.querySelector('.close-cart');
    if (closeBtn) {
      closeBtn.onclick = () => {
        this.modal.style.display = 'none';
      };
    }

    window.onclick = (event) => {
      if (event.target === this.modal) {
        this.modal.style.display = 'none';
      }
    };

    if (this.confirmBtn) {
      this.confirmBtn.onclick = () => this.confirmOrder();
    }
  }

  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  addItem(item) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      alert('Пожалуйста, войдите в систему для добавления товаров в корзину');
      window.location.href = './auth/auth.html';
      return;
    }

    if (!this.items.some((i) => i.title === item.title)) {
      this.items.push({
        ...item,
        id: Date.now(),
        date: new Date().toLocaleDateString(),
      });
      this.saveCart();
      this.updateCartDisplay();
      this.openCart();
    } else {
      alert('Этот фильм уже в корзине!');
    }
  }

  loadCart() {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const cartKey = `cart_${currentUser.id}`;
      const savedCart = localStorage.getItem(cartKey);
      this.items = savedCart ? JSON.parse(savedCart) : [];
    } else {
      this.items = [];
    }
    this.updateCartDisplay();
  }

  saveCart() {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const cartKey = `cart_${currentUser.id}`;
      localStorage.setItem(cartKey, JSON.stringify(this.items));
    }
    this.updateCartDisplay();
  }

  handleLogout() {
    localStorage.removeItem('userData');
    localStorage.removeItem('cart');
    this.items = [];
    this.updateCartDisplay();
    this.updateCartCount();
    this.updateUserDisplay();
    window.location.href = './auth/auth.html';
  }

  removeItem(id) {
    this.items = this.items.filter((item) => item.id !== id);
    this.saveCart();
    this.updateCartDisplay();
  }

  updateCartCount() {
    if (this.cartCount) {
      this.cartCount.textContent = this.items.length;
    }
  }

  updateCartDisplay() {
    if (!this.cartItems) return;

    this.cartItems.innerHTML = '';

    if (this.items.length === 0) {
      if (this.emptyMessage) {
        this.emptyMessage.style.display = 'block';
      }
      if (this.confirmBtn) {
        this.confirmBtn.style.display = 'none';
      }
    } else {
      if (this.emptyMessage) {
        this.emptyMessage.style.display = 'none';
      }
      if (this.confirmBtn) {
        this.confirmBtn.style.display = 'block';
      }

      this.items.forEach((item) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
          <div class="cart-item-info">
            <h4>${item.title}</h4>
            <p>Жанр: ${item.genre}</p>
            ${item.rating ? `<p>Возрастной рейтинг: ${item.rating}</p>` : ''}
            <p>Дата добавления: ${item.date}</p>
          </div>
          <button class="remove-item" data-id="${item.id}">×</button>
        `;
        this.cartItems.appendChild(itemElement);

        const removeButton = itemElement.querySelector('.remove-item');
        removeButton.onclick = () => this.removeItem(item.id);
      });
    }

    if (this.cartCount) {
      this.cartCount.textContent = this.items.length;
    }
  }

  updateUserDisplay() {
    const username = document.getElementById('username');
    if (!username) return;

    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      username.textContent = user.username || user.email;
    } else {
      username.textContent = '';
    }
  }

  openCart() {
    this.modal.style.display = 'block';
  }

  confirmOrder() {
    if (!this.items.length) return;

    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      alert('Пожалуйста, войдите в систему для оформления заказа');
      window.location.href = './auth/auth.html';
      return;
    }

    try {
      const orderData = {
        userId: currentUser.id,
        items: this.items,
        orderDate: new Date().toISOString(),
      };

      // Здесь можно добавить отправку orderData на сервер, если необходимо

      alert('Заказ успешно оформлен! Мы свяжемся с вами для подтверждения.');
      this.items = [];
      this.saveCart();
      this.updateCartDisplay();
      if (this.modal) {
        this.modal.style.display = 'none';
      }
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      alert(
        'Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте позже.'
      );
    }
  }
}

function handleLogin(userData) {
  // Очищаем старую корзину перед входом нового пользователя
  localStorage.setItem('userData', JSON.stringify(userData));
  window.location.href = '../index.html';
}

// Инициализируем корзину после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  window.cart = new Cart();
});
