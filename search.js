// Common search functionality for games and utilities
const debounce = (fn, wait=120) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
};

function createItemElement(item) {
    const a = document.createElement('a');
    a.className = 'item';
    // Apply hoverable class if animations are enabled
    if (localStorage.getItem('celestrium-animations') !== 'false') {
        a.classList.add('hoverable');
    }
    a.href = '#';
    a.textContent = item.name;
    a.dataset.url = item.url + '?login.live.com';
    return a;
}

function renderItems(items, searchEl, listEl, noResultsEl) {
    const q = (searchEl.value || '').toLowerCase();
    listEl.innerHTML = '';
    const frag = document.createDocumentFragment();
    let count = 0;

    for (const item of items) {
        if (item.name.toLowerCase().includes(q)) {
            frag.appendChild(createItemElement(item));
            count++;
        }
    }

    listEl.appendChild(frag);
    noResultsEl.classList.toggle('hidden', count !== 0);
}

function openItem(url) {
    window.parent.postMessage({type: 'openItem', url: url}, '*');
}

function toggleAnimations(enabled) {
    const items = document.querySelectorAll('.item');
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

    listEl.addEventListener('click', e => {
        const a = e.target.closest && e.target.closest('.item');
        if (!a) return;
        e.preventDefault();
        openItem(a.dataset.url);
    });

    searchEl.addEventListener('input', debounce(render));
    render();
}
