document.addEventListener('DOMContentLoaded', () => {
    const promotionList = document.getElementById('promotionList');
    const emptyState = document.getElementById('emptyState');
    const totalCount = document.getElementById('totalCount');
    const activeCount = document.getElementById('activeCount');
    const resultCount = document.getElementById('resultCount');
    const searchInput = document.getElementById('searchInput');
    const resetBtn = document.getElementById('resetBtn');

    const dialog = document.getElementById('promotionDialog');
    const form = document.getElementById('promotionForm');
    const addBtn = document.getElementById('addBtn');
    const closeBtn = document.getElementById('closeBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modalTitle = document.getElementById('modalTitle');

    let promotions = JSON.parse(localStorage.getItem('coffee_promotions')) || [
        { id: 'KM01', name: 'Khai xuân giảm giá', discount: 10, expiryDate: '2026-12-31', status: 'Đang áp dụng' },
        { id: 'KM02', name: 'Mừng sinh nhật quán', discount: 20, expiryDate: '2026-05-01', status: 'Hết hạn' }
    ];

    function saveData() {
        localStorage.setItem('coffee_promotions', JSON.stringify(promotions));
    }

    function render() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const filtered = promotions.filter(p => p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query));

        if (totalCount) totalCount.textContent = promotions.length;
        if (activeCount) activeCount.textContent = promotions.filter(p => p.status === 'Đang áp dụng').length;
        if (resultCount) resultCount.textContent = `${filtered.length} chương trình`;

        if (filtered.length === 0) {
            promotionList.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        promotionList.innerHTML = filtered.map(p => {
            const badgeClass = p.status === 'Đang áp dụng' ? 'badge-active' : 'badge-expired';

            return `
                <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.name}</td>
                    <td><strong>${p.discount}%</strong></td>
                    <td>${p.expiryDate}</td>
                    <td><span class="${badgeClass}">${p.status}</span></td>
                    <td>
                        <button onclick="editPromotion('${p.id}')" class="btn-secondary" style="padding: 4px 8px; margin-right: 4px;">Sửa</button>
                        <button onclick="deletePromotion('${p.id}')" class="btn-secondary" style="padding: 4px 8px; color: #e74c3c; border-color: #e74c3c;">Xóa</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (form) form.reset();
            document.getElementById('promotionId').value = '';
            if (modalTitle) modalTitle.textContent = 'Thêm khuyến mãi';
            if (dialog) dialog.showModal();
        });
    }

    const closeModal = () => dialog && dialog.close();
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('promotionId').value;
            const name = document.getElementById('promoName').value.trim();
            const discount = Number(document.getElementById('discount').value);
            const expiryDate = document.getElementById('expiryDate').value;
            const status = document.getElementById('promoStatus').value;

            if (id) {
                const idx = promotions.findIndex(p => p.id === id);
                if (idx !== -1) promotions[idx] = { id, name, discount, expiryDate, status };
            } else {
                const newId = 'KM' + String(promotions.length + 1).padStart(2, '0');
                promotions.push({ id: newId, name, discount, expiryDate, status });
            }

            saveData();
            render();
            closeModal();
        });
    }

    window.editPromotion = (id) => {
        const p = promotions.find(item => item.id === id);
        if (!p) return;

        document.getElementById('promotionId').value = p.id;
        document.getElementById('promoName').value = p.name;
        document.getElementById('discount').value = p.discount;
        document.getElementById('expiryDate').value = p.expiryDate;
        document.getElementById('promoStatus').value = p.status;

        if (modalTitle) modalTitle.textContent = 'Sửa chương trình khuyến mãi';
        if (dialog) dialog.showModal();
    };

    window.deletePromotion = (id) => {
        if (confirm('Xóa mã khuyến mãi này?')) {
            promotions = promotions.filter(p => p.id !== id);
            saveData();
            render();
        }
    };

    if (searchInput) searchInput.addEventListener('input', render);
    if (resetBtn) resetBtn.addEventListener('click', () => { if (searchInput) searchInput.value = ''; render(); });

    saveData();
    render();
});