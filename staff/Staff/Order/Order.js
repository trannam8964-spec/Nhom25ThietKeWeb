/* Order: HTML giữ nguyên bảng, JS chỉ lọc dữ liệu và xử lý nút thao tác. */
function refreshStaffPage() {
    StaffData.updateStaffName(); 
    drawOrders();
}

function drawOrders() {
    const body = document.getElementById('ordersTableBody'); 
    if (!body) return; 

    const q = document.getElementById('orderSearch').value.trim().toLowerCase();
    const filter = document.getElementById('orderFilter').value; 
    
    const rows = StaffData.orders().filter(o => 
        (String(o.id).toLowerCase().includes(q) || StaffData.orderCustomer(o).toLowerCase().includes(q)) && 
        (!filter || o.status === filter)
    );

    body.innerHTML = rows.length ? rows.map(o => {
        let action = ''; 
        
        if (o.status === 'Chờ xác nhận') {
            action = `<button class="btn" data-id="${StaffData.escape(o.id)}" data-status="Đang chuẩn bị">Đang chuẩn bị</button>`; 
        } else if (o.status === 'Đang chuẩn bị') {
            action = `<button class="btn" data-id="${StaffData.escape(o.id)}" data-status="Đang giao">Đang giao</button>`; 
        } else if (o.status === 'Đang giao') {
            action = `<button class="btn" data-id="${StaffData.escape(o.id)}" data-status="Đã hoàn thành">Đã hoàn thành</button>`; 
        }
        
        if (!['Đã hoàn thành', 'Đã hủy'].includes(o.status)) {
            action += ` <button class="btn btn-danger" data-id="${StaffData.escape(o.id)}" data-status="Đã hủy">Hủy</button>`;
        } 
        
        return `
            <tr>
                <td><strong>${StaffData.escape(o.id)}</strong></td>
                <td>${StaffData.escape(StaffData.orderCustomer(o))}</td>
                <td>${StaffData.escape(StaffData.orderTime(o))}</td>
                <td>${StaffData.orderItems(o).map(StaffData.escape).join('<br>')}</td>
                <td><strong>${StaffData.money(o.total)}</strong></td>
                <td>${StaffData.badge(o.status)}</td>
                <td>${action || '—'}</td>
            </tr>
        `;
    }).join('') : '<tr><td colspan="7" class="empty-state">Không tìm thấy đơn hàng</td></tr>'; 
}

document.addEventListener('DOMContentLoaded', () => {
    StaffData.updateStaffName();
    
    document.getElementById('orderSearch').addEventListener('input', drawOrders);
    document.getElementById('orderFilter').addEventListener('change', drawOrders);
    
    document.getElementById('ordersTableBody').addEventListener('click', e => {
        const button = e.target.closest('button[data-id]');
        if (!button) return;
        
        const orders = StaffData.orders();
        const order = orders.find(o => o.id === button.dataset.id);
        if (!order) return;
        
        order.status = button.dataset.status;
        if (order.status === 'Đã hủy') order.paid = false;
        
        StaffData.saveOrders(orders);
        refreshStaffPage();
    });
    
    refreshStaffPage();
});