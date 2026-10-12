/* Dashboard: chỉ cập nhật các số liệu thay đổi; bố cục nằm trong HTML. */
function refreshStaffPage() {
    StaffData.updateStaffName(); 
    
    const orders = StaffData.orders();
    const tables = StaffData.tables();
    
    const count = s => orders.filter(o => o.status === s).length;
    
    // Cập nhật các ô số liệu thống kê tổng quan
    document.getElementById('newOrderCount').textContent = count('Chờ xác nhận'); 
    document.getElementById('preparingCount').textContent = count('Đang chuẩn bị');
    document.getElementById('busyTableCount').textContent = tables.filter(t => t.status === 'Đang sử dụng').length; 
    document.getElementById('completedCount').textContent = count('Đã hoàn thành');
    
    // Cập nhật bảng tóm tắt trạng thái đơn hàng
    document.getElementById('pendingCount').textContent = count('Chờ xác nhận'); 
    document.getElementById('preparingSummary').textContent = count('Đang chuẩn bị'); 
    document.getElementById('deliveringCount').textContent = count('Đang giao'); 
    document.getElementById('doneSummary').textContent = count('Đã hoàn thành'); 
    document.getElementById('cancelledCount').textContent = count('Đã hủy');
    
    // Cập nhật tổng doanh thu
    const revenue = orders.filter(o => o.paid).reduce((sum, o) => sum + Number(o.total || 0), 0); 
    document.getElementById('totalRevenue').textContent = StaffData.money(revenue);
    
    // Cập nhật danh sách đơn hàng cần xử lý (tối đa 5 đơn gần nhất)
    const active = orders.filter(o => ['Chờ xác nhận', 'Đang chuẩn bị', 'Đang giao'].includes(o.status)); 
    document.getElementById('dashboardOrders').innerHTML = active.length 
        ? active.slice(0, 5).map(o => `
            <tr>
                <td>${StaffData.escape(o.id)}</td>
                <td>${StaffData.escape(StaffData.orderCustomer(o))}</td>
                <td>${StaffData.orderItems(o).map(StaffData.escape).join(', ')}</td>
                <td>${StaffData.money(o.total)}</td>
                <td>${StaffData.badge(o.status)}</td>
            </tr>
        `).join('') 
        : '<tr><td colspan="5" class="empty-state">Không có đơn cần xử lý</td></tr>';
    
    // Cập nhật trạng thái lưới bàn
    document.getElementById('dashboardTables').innerHTML = tables.map(t => `
        <div class="dashboard-table-tile ${t.status === 'Đang sử dụng' ? 'busy' : t.status === 'Đặt trước' ? 'reserved' : ''}">
            ${t.id}
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', refreshStaffPage);