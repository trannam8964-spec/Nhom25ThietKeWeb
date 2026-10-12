document.addEventListener('DOMContentLoaded', () => {
    const tableList = document.getElementById('tableList');
    const emptyState = document.getElementById('emptyState');
    const totalCount = document.getElementById('totalCount');
    const emptyCount = document.getElementById('emptyCount');
    const usingCount = document.getElementById('usingCount');
    const resultCount = document.getElementById('resultCount');
    const searchInput = document.getElementById('searchInput');
    const resetBtn = document.getElementById('resetBtn');

    const dialog = document.getElementById('tableDialog');
    const form = document.getElementById('tableForm');
    const addBtn = document.getElementById('addBtn');
    const closeBtn = document.getElementById('closeBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modalTitle = document.getElementById('modalTitle');

    let tables = JSON.parse(localStorage.getItem('coffee_tables')) || [
        { id: 'B01', name: 'Bàn 01', area: 'Tầng trệt', status: 'Trống' },
        { id: 'B02', name: 'Bàn 02', area: 'Tầng trệt', status: 'Đang sử dụng' },
        { id: 'B03', name: 'Bàn 03', area: 'Lầu 1', status: 'Đã đặt trước' }
    ];

    function saveData() {
        localStorage.setItem('coffee_tables', JSON.stringify(tables));
    }

    function render() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const filtered = tables.filter(t => 
            t.name.toLowerCase().includes(query) || t.area.toLowerCase().includes(query)
        );

        if (totalCount) totalCount.textContent = tables.length;
        if (emptyCount) emptyCount.textContent = tables.filter(t => t.status === 'Trống').length;
        if (usingCount) usingCount.textContent = tables.filter(t => t.status === 'Đang sử dụng').length;
        if (resultCount) resultCount.textContent = `${filtered.length} bàn`;

        if (filtered.length === 0) {
            tableList.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        tableList.innerHTML = filtered.map(t => {
            let badgeClass = 'badge-empty';
            if (t.status === 'Đang sử dụng') badgeClass = 'badge-using';
            if (t.status === 'Đã đặt trước') badgeClass = 'badge-reserved';

            return `
                <tr>
                    <td><strong>${t.id}</strong></td>
                    <td>${t.name}</td>
                    <td>${t.area}</td>
                    <td><span class="${badgeClass}">${t.status}</span></td>
                    <td>
                        <button onclick="editTable('${t.id}')" class="btn-secondary" style="padding: 4px 8px; margin-right: 4px;">Sửa</button>
                        <button onclick="deleteTable('${t.id}')" class="btn-secondary" style="padding: 4px 8px; color: #e74c3c; border-color: #e74c3c;">Xóa</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (form) form.reset();
            document.getElementById('tableId').value = '';
            if (modalTitle) modalTitle.textContent = 'Thêm bàn mới';
            if (dialog) dialog.showModal();
        });
    }

    const closeModal = () => dialog && dialog.close();
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('tableId').value;
            const name = document.getElementById('tableName').value.trim();
            const area = document.getElementById('area').value;
            const status = document.getElementById('tableStatus').value;

            if (id) {
                const idx = tables.findIndex(t => t.id === id);
                if (idx !== -1) tables[idx] = { id, name, area, status };
            } else {
                const newId = 'B' + String(tables.length + 1).padStart(2, '0');
                tables.push({ id: newId, name, area, status });
            }

            saveData();
            render();
            closeModal();
        });
    }

    window.editTable = (id) => {
        const t = tables.find(item => item.id === id);
        if (!t) return;

        document.getElementById('tableId').value = t.id;
        document.getElementById('tableName').value = t.name;
        document.getElementById('area').value = t.area;
        document.getElementById('tableStatus').value = t.status;

        if (modalTitle) modalTitle.textContent = 'Cập nhật bàn';
        if (dialog) dialog.showModal();
    };

    window.deleteTable = (id) => {
        if (confirm('Bạn muốn xóa bàn này?')) {
            tables = tables.filter(t => t.id !== id);
            saveData();
            render();
        }
    };

    if (searchInput) searchInput.addEventListener('input', render);
    if (resetBtn) resetBtn.addEventListener('click', () => { if (searchInput) searchInput.value = ''; render(); });

    saveData();
    render();
});