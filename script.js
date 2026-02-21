// 1. НАСТРОЙКИ "АДМИНКИ"
// Просто вставь сюда ВСЮ ссылку, которую ты только что скопировал в Google Таблицах
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7sCs3AKudSo95TBhdWKyvAxUcKqcojmsXxEZgp2Zj5AvwylCZHti_99TZ6rfvHjoz1wXCFD8KFDpr/pub?output=csv';

async function loadProducts() {
    try {
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error('Ошибка сети или доступа');
        
        const data = await response.text();

       
        // Превращаем текст таблицы в строки
        const rows = data.split('\n').slice(1); 
        const grid = document.getElementById('product-grid');
        grid.innerHTML = ''; // Очищаем сетку

        rows.forEach(row => {
            if (!row.trim()) return; // Пропускаем пустые строки

            // Улучшенное разделение: ищем запятую ИЛИ точку с запятой
            const columns = row.split(/[;,]/); 
            
            // Очищаем данные от лишних кавычек и пробелов
            const title = columns[0]?.replace(/"/g, '').trim();
            const price = columns[1]?.replace(/"/g, '').trim();
            const category = columns[2]?.replace(/"/g, '').trim();
            const image = columns[3]?.replace(/"/g, '').trim();

            // Если обязательные поля пусты, не создаем карточку
            if (!title || !price) return;

            const card = document.createElement('div');
            card.className = 'product-card';
            card.setAttribute('data-category', category);
            
            card.innerHTML = `
                <button class="wishlist-btn"><span class="heart-icon">&#9825;</span></button>
                <img src="${image}" alt="${title}" class="product-image">
                <h3 class="product-title">${title}</h3>
                <p class="product-price">${price} руб.</p>
                <button class="add-to-cart-btn">В корзину</button>
            `;
            
            grid.appendChild(card);
        });

        // После того как товары созданы, нужно заново "включить" кнопки корзины и сердечки
        initInteractivity();

    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
    }
}

// 3. ИНТЕРАКТИВ (Корзина, Сердечки, Фильтры)
function initInteractivity() {
    // --- Логика корзины ---
    let count = 0;
    const countDisplay = document.getElementById('cart-count');
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.onclick = () => {
            count++;
            countDisplay.textContent = count;
            btn.textContent = 'Добавлено ✓';
            setTimeout(() => btn.textContent = 'В корзину', 1000);
        };
    });

    // --- Логика сердечек ---
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.onclick = () => {
            btn.classList.toggle('active');
            const icon = btn.querySelector('.heart-icon');
            icon.innerHTML = btn.classList.contains('active') ? '&#9829;' : '&#9825;';
        };
    });
}

// 4. ЛОГИКА ФИЛЬТРОВ (Работает всегда)
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterValue = btn.getAttribute('data-filter');
        
        document.querySelectorAll('.product-card').forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    };
});

// Запускаем всё!
loadProducts();
