// Common search functionality for games and utilities
const debounce = (fn, wait=120) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
};

function createItemElement(item) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    // Apply hoverable class if animations are enabled
    if (localStorage.getItem('forsyth-animations') !== 'false') {
        card.classList.add('hoverable');
    }
    
    card.innerHTML = `
        <div class="game-icon">${item.icon || '🎮'}</div>
        <div class="game-info">
            <h3 class="game-title">${item.name}</h3>
            <span class="game-category">${item.category || 'Game'}</span>
        </div>
        <div class="play-button">
            <i class="fas fa-play"></i>
        </div>
    `;
    
    card.addEventListener('click', () => {
        openItem(item.url + '?login.live.com');
    });
    
    return card;
}

function renderItems(items, searchEl, listEl, noResultsEl) {
    const q = (searchEl.value || '').toLowerCase();
    listEl.innerHTML = '';
    const frag = document.createDocumentFragment();
    let count = 0;

    // Group games by category for better organization
    const categorizedItems = {};
    
    for (const item of items) {
        if (item.name.toLowerCase().includes(q)) {
            const category = item.category || 'Other';
            if (!categorizedItems[category]) {
                categorizedItems[category] = [];
            }
            categorizedItems[category].push(item);
            count++;
        }
    }

    // Sort categories and create sections
    const categories = Object.keys(categorizedItems).sort();
    
    if (count > 0) {
        categories.forEach(category => {
            if (q === '' || categorizedItems[category].length > 0) {
                // Create category header only if there's a search query or items
                if (q === '' && categories.length > 1) {
                    const categoryHeader = document.createElement('div');
                    categoryHeader.className = 'category-header';
                    categoryHeader.textContent = category;
                    frag.appendChild(categoryHeader);
                }
                
                // Create games grid for this category
                const gamesGrid = document.createElement('div');
                gamesGrid.className = 'games-grid';
                
                categorizedItems[category].forEach(item => {
                    gamesGrid.appendChild(createItemElement(item));
                });
                
                frag.appendChild(gamesGrid);
            }
        });
    }

    listEl.appendChild(frag);
    noResultsEl.classList.toggle('hidden', count !== 0);
}

function openItem(url) {
    window.parent.postMessage({type: 'openItem', url: url}, '*');
}

function toggleAnimations(enabled) {
    const items = document.querySelectorAll('.game-card');
    items.forEach(item => {
        if (enabled) {
            item.classList.add('hoverable');
        } else {
            item.classList.remove('hoverable');
        }
    });
}

function initializeSearch(items, searchEl, listEl, noResultsEl) {
    function render() {
        renderItems(items, searchEl, listEl, noResultsEl);
    }

    searchEl.addEventListener('input', debounce(render));
    render();
}
