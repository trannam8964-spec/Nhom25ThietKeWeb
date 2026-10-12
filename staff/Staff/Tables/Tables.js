/* Tables: các khung bàn được khai báo trong HTML; JS gắn dữ liệu và sự kiện chọn. */
function refreshStaffPage() {
    StaffData.updateStaffName();
    
    const grid = document.getElementById('tablesGrid');
    if (!grid) return;
    
    grid.innerHTML = StaffData.tables().map(t => `
        <article class="table-card">
            <div class="table-card-top">
                <i class="fa-solid fa-chair"></i>
                ${StaffData.badge(t.status)}
            </div>
            <h3>Bàn ${t.id}</h3>
            <p>Trạng thái: <strong>${StaffData.escape(t.status)}</strong></p>
            <label class="visually-hidden" for="table-${t.id}">Trạng thái bàn ${t.id}</label>
            <select class="table-select" id="table-${t.id}" data-table-id="${t.id}">
                <option ${t.status === 'Trống' ? 'selected' : ''}>Trống</option>
                <option ${t.status === 'Đang sử dụng' ? 'selected' : ''}>Đang sử dụng</option>
                <option ${t.status === 'Đặt trước' ? 'selected' : ''}>Đặt trước</option>
            </select>
        </article>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    StaffData.updateStaffName();
    
    document.getElementById('tablesGrid').addEventListener('change', e => {
        const select = e.target.closest('select[data-table-id]');
        if (!select) return;
        
        const tables = StaffData.tables();
        const table = tables.find(t => t.id === Number(select.dataset.tableId));
        
        if (table) {
            table.status = select.value;
            StaffData.saveTables(tables);
            refreshStaffPage();
        }
    });
    
    refreshStaffPage();
});