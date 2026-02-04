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
        <div class="game-icon" title="${item.name}">${item.icon || '🎮'}</div>
        <div class="game-info">
            <h3 class="game-title">${item.icon || '🎮'}</h3>
            <span class="game-category">${item.name}</span>
        </div>
        <div class="play-button">
            <i class="fas fa-play"></i>
        </div>
    `;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', item.name);
    function openGameWithFavicon() {
        const win = window.open('', '_blank');
        if (!win) return;
        // Try to use favicon.png from the game folder
        let faviconUrl = item.url + 'favicon.png';
        // If the game is in a subfolder, ensure the path is correct
        if (!faviconUrl.startsWith('./')) {
            faviconUrl = './' + faviconUrl;
        }
        win.document.write(`<!DOCTYPE html><html><head><title>${item.name}</title><link rel='icon' href='${faviconUrl}'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><style>body,html{margin:0;padding:0;height:100%;width:100%;overflow:hidden;}iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:none;}</style></head><body><iframe src='${item.url + '?login.live.com'}' allowfullscreen></iframe></body></html>`);
        win.document.close();
    }
    card.addEventListener('click', openGameWithFavicon);
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            openGameWithFavicon();
        }
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
