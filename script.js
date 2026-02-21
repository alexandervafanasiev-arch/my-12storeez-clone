// 1. Ссылка на твою таблицу
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7sCs3AKudSo95TBhdWKyvAxUcKqcojmsXxEZgp2Zj5AvwylCZHti_99TZ6rfvHjoz1wXCFD8KFDpr/pub?output=csv';
// 1. Глобальные переменные
//const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1Jm-C7y1Lc7yJ6YM8rRf4y4sUyq7PCblzikvGr9blRTc/pub?output=csv';
let allProducts = []; 
let cartCount = 0; // Переменная для счетчика

// 2. Загрузка данных из Google Таблицы
async function loadProducts() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        const rows = data.split('\n').slice(1);
        
        allProducts = rows.map(row => {
            const columns = row.split(/[;,]/);
            const rawPrice = columns[1]?.replace(/"/g, '').replace(/[^0-9]/g, '') || "0";
            return {
                title: columns[0]?.replace(/"/g, '').trim(),
                price: parseInt(rawPrice),
                category: columns[2]?.replace(/"/g, '').trim(),
                image: columns[3]?.replace(/"/g, '').trim()
            };
        }).filter(p => p.title);

        renderProducts(allProducts);
        initSearch();
        initSort();
        initFilters();
    } catch (e) {
        console.error("Ошибка загрузки:", e);
    }
}

// 3. Функция отрисовки карточек
function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <button class="wishlist-btn">♡</button>
            <img src="${p.image}" class="product-image" onerror="this.src='https://via.placeholder.com/400x600?text=No+Image'">
            <h3 class="product-title">${p.title}</h3>
            <p class="product-price">${p.price.toLocaleString()} руб.</p>
            <button class="add-to-cart-btn">В корзину</button>
        `;
        grid.appendChild(card);
    });
    
    // ВАЖНО: Прикрепляем события к НОВЫМ кнопкам
    initInteractivity(); 
}

// 4. Логика кнопок (Счетчик и Галочка)
function initInteractivity() {
    const cartCounterElement = document.getElementById('cart-count');

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        // Убираем старые события, если они были, и вешаем новое
        btn.onclick = (e) => {
            e.preventDefault();
            
            // Увеличиваем счетчик
            cartCount++;
            if (cartCounterElement) cartCounterElement.textContent = cartCount;

            // Эффект кнопки: меняем текст на галочку
            btn.textContent = 'Добавлено ✓';
            btn.classList.add('added'); // Можно добавить стиль в CSS

            // Таймер: через 1.5 секунды возвращаем текст назад
            setTimeout(() => {
                btn.textContent = 'В корзину';
                btn.classList.remove('added');
            }, 1500); 
        };
    });

    // Сердечки
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.onclick = () => {
            btn.classList.toggle('active');
            btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
        };
    });
}

// 5. Поиск
function initSearch() {
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allProducts.filter(p => p.title.toLowerCase().includes(term));
            renderProducts(filtered);
        };
    }
}

// 6. Сортировка
function initSort() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.onchange = (e) => {
            let sorted = [...allProducts];
            if (e.target.value === 'low-to-high') sorted.sort((a, b) => a.price - b.price);
            if (e.target.value === 'high-to-low') sorted.sort((a, b) => b.price - a.price);
            renderProducts(sorted);
        };
    }
}

// 7. Фильтры
function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.filter;
            const filtered = category === 'all' ? allProducts : allProducts.filter(p => p.category === category);
            renderProducts(filtered);
        };
    });
}

// ЗАПУСК
loadProducts();