
document.addEventListener('DOMContentLoaded', () => {
    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const compareBtn = document.getElementById('compareBtn');
    const resultsSection = document.getElementById('resultsSection');

    // BADGES
    const count1Badge = document.getElementById('count-1');
    const count2Badge = document.getElementById('count-2');

    // RESULT LISTS & COUNTS
    const listNew = document.getElementById('list-new');
    const listSame = document.getElementById('list-same');
    const listDelete = document.getElementById('list-delete');

    const countNew = document.getElementById('count-new');
    const countSame = document.getElementById('count-same');
    const countDelete = document.getElementById('count-delete');

    // COPY BUTTONS
    const btnCopyNew = document.getElementById('copy-new');
    const btnCopySame = document.getElementById('copy-same');
    const btnCopyDelete = document.getElementById('copy-delete');

    let currentNewItems = [];
    let currentSameItems = [];
    let currentDeleteItems = [];

    // Utility to parse input data (Excel copy-paste typically uses tabs/newlines)
    // Returns array of objects: { key: string, fullRow: string }
    function parseData(text) {
        if (!text) return [];
        return text.split(/\r?\n/).map(line => {
            if (!line.trim()) return null;
            const parts = line.split('\t');
            return {
                key: parts[0].trim(),
                fullRow: line
            };
        }).filter(item => item !== null);
    }

    // Live row count update
    function updateCount(input, badge) {
        const data = parseData(input.value);
        badge.textContent = `${data.length} Line${data.length > 1 ? 's' : ''}`;
    }

    input1.addEventListener('input', () => updateCount(input1, count1Badge));
    input2.addEventListener('input', () => updateCount(input2, count2Badge));

    // MAIN COMPARISON LOGIC
    compareBtn.addEventListener('click', () => {
        const data1 = parseData(input1.value);
        const data2 = parseData(input2.value);

        // Sets for O(1) lookup
        const set1 = new Set(data1.map(d => d.key));
        const set2 = new Set(data2.map(d => d.key));

        // 1. NEW: In List 2 but NOT in List 1 (keep full row from List 2)
        currentNewItems = data2.filter(item => !set1.has(item.key)).map(item => item.fullRow);

        // 2. SAME: In Both (keep full row from List 1, or List 2? logic: usually we want to see what matches)
        // We'll keep from List 1 for consistency with Delete
        currentSameItems = data1.filter(item => set2.has(item.key)).map(item => item.fullRow);

        // 3. DELETE: In List 1 but NOT in List 2 (keep full row from List 1)
        currentDeleteItems = data1.filter(item => !set2.has(item.key)).map(item => item.fullRow);

        // RENDER
        renderList(listNew, currentNewItems, countNew);
        renderList(listSame, currentSameItems, countSame);
        renderList(listDelete, currentDeleteItems, countDelete);

        // Unlock visual state
        resultsSection.style.opacity = '1';
        resultsSection.style.pointerEvents = 'all';

        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    function renderList(container, items, countBadge) {
        container.innerHTML = '';
        countBadge.textContent = items.length;

        if (items.length === 0) {
            const li = document.createElement('li');
            li.className = 'result-item';
            li.style.color = 'var(--text-secondary)';
            li.style.fontStyle = 'italic';
            li.textContent = 'No result';
            container.appendChild(li);
            return;
        }

        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'result-item';
            // Display tabs as spaces for better UI readability, but keep tabs in data for copy
            li.textContent = item.replace(/\t/g, ' ⟶ ');
            container.appendChild(li);
        });
    }

    // COPY FUNCTIONALITY
    async function copyToClipboard(items, btn) {
        if (!items || items.length === 0) return;

        const textToCopy = items.join('\n');

        try {
            await navigator.clipboard.writeText(textToCopy);

            // Visual feedback
            const originalIcon = btn.innerHTML;
            btn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
            btn.style.color = 'var(--success)';
            btn.style.borderColor = 'var(--success)';

            setTimeout(() => {
                btn.innerHTML = originalIcon;
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 2000);

        } catch (err) {
            console.error('Failed to copy!', err);
            alert('Error copying to clipboard');
        }
    }

    btnCopyNew.addEventListener('click', () => copyToClipboard(currentNewItems, btnCopyNew));
    btnCopySame.addEventListener('click', () => copyToClipboard(currentSameItems, btnCopySame));
    btnCopyDelete.addEventListener('click', () => copyToClipboard(currentDeleteItems, btnCopyDelete));
});
