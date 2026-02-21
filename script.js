// 1. Ссылка на твою таблицу
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7sCs3AKudSo95TBhdWKyvAxUcKqcojmsXxEZgp2Zj5AvwylCZHti_99TZ6rfvHjoz1wXCFD8KFDpr/pub?output=csv';

let allProducts = []; 

// 2. Загрузка данных
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
        initFilters();
    } catch (e) {
        console.error("Ошибка:", e);
        document.getElementById('product-grid').innerHTML = "Ошибка загрузки :(";
    }
}

// 3. Отрисовка карточек
function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <button class="wishlist-btn">♡</button>
            <img src="${p.image}" class="product-image">
            <h3 class="product-title">${p.title}</h3>
            <p class="product-price">${p.price.toLocaleString()} руб.</p>
            <button class="add-to-cart-btn">В корзину</button>
        `;
        grid.appendChild(card);
    });
    
    // Включаем кнопки после отрисовки
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.onclick = () => btn.textContent = 'Добавлено ✓';
    });
}

// 4. Сортировка
document.getElementById('sort-select').onchange = (e) => {
    let sorted = [...allProducts];
    if (e.target.value === 'low-to-high') sorted.sort((a, b) => a.price - b.price);
    if (e.target.value === 'high-to-low') sorted.sort((a, b) => b.price - a.price);
    renderProducts(sorted);
};

// 5. Поиск
function initSearch() {
    document.getElementById('product-search').oninput = (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p => p.title.toLowerCase().includes(term));
        renderProducts(filtered);
    };
}

// 6. Фильтры категорий
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

loadProducts();