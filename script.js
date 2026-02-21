// 1. Глобальные настройки
const SHEET_ID = '1Jm-C7y1Lc7yJ6YM8rRf4y4sUyq7PCblzikvGr9blRTc'; 
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/pub?output=csv`;

let allProducts = []; // Тот самый массив, который "пропал"

// 2. Главная функция загрузки
async function loadProducts() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        const rows = data.split('\n').slice(1);
        
        allProducts = rows.map(row => {
            const columns = row.split(/[;,]/);
            // Чистим цену от мусора, чтобы сортировка работала
            const rawPrice = columns[1]?.replace(/"/g, '').replace(/[^0-9]/g, '');
            
            return {
                title: columns[0]?.replace(/"/g, '').trim(),
                price: parseInt(rawPrice) || 0,
                category: columns[2]?.replace(/"/g, '').trim(),
                image: columns[3]?.replace(/"/g, '').trim()
            };
        }).filter(p => p.title); // Оставляем только реальные товары

        console.log("Товары загружены:", allProducts);
        renderProducts(allProducts); // Рисуем товары первый раз
        
    } catch (error) {
        console.error("Ошибка загрузки:", error);
    }
}

// 3. Функция отрисовки (создает HTML)
function renderProducts(productsToRender) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = ''; // Очищаем сетку перед новой отрисовкой

    productsToRender.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', p.category);
        
        card.innerHTML = `
            <button class="wishlist-btn"><span class="heart-icon">&#9825;</span></button>
            <img src="${p.image}" alt="${p.title}" class="product-image">
            <h3 class="product-title">${p.title}</h3>
            <p class="product-price">${p.price.toLocaleString()} руб.</p>
            <button class="add-to-cart-btn">В корзину</button>
        `;
        grid.appendChild(card);
    });

    initInteractivity(); // Включаем кнопки корзины и сердечки
}

// 4. Логика СОРТИРОВКИ
const sortMenu = document.getElementById('sort-select');
if (sortMenu) {
    sortMenu.addEventListener('change', (e) => {
        const mode = e.target.value;
        let sorted = [...allProducts];

        if (mode === 'low-to-high') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (mode === 'high-to-low') {
            sorted.sort((a, b) => b.price - a.price);
        }
        
        renderProducts(sorted);
    });
}

// 5. Логика ПОИСКА
const searchInput = document.getElementById('product-search');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        // Фильтруем массив данных, а не элементы на странице (так надежнее!)
        const filtered = allProducts.filter(p => p.title.toLowerCase().includes(term));
        renderProducts(filtered);
    });
}

// 6. Кнопки КОРЗИНЫ И СЕРДЕЧЕК
function initInteractivity() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.onclick = () => {
            btn.textContent = 'Добавлено ✓';
            setTimeout(() => btn.textContent = 'В корзину', 1000);
        };
    });

    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.onclick = () => {
            btn.classList.toggle('active');
            const icon = btn.querySelector('.heart-icon');
            icon.innerHTML = btn.classList.contains('active') ? '&#9829;' : '&#9825;';
        };
    });
}

// Запуск!
loadProducts();