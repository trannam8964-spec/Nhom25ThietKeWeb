/* Payment: HTML định nghĩa bảng, JS cập nhật các dòng và xác nhận thanh toán. */
function refreshStaffPage() {
    StaffData.updateStaffName();
    
    const body = document.getElementById('paymentTableBody');
    if (!body) return;
    
    const orders = StaffData.orders().filter(o => ['Đang giao', 'Đã hoàn thành'].includes(o.status));
    
    body.innerHTML = orders.length 
        ? orders.map(o => `
            <tr>
                <td><strong>${StaffData.escape(o.id)}</strong></td>
                <td>${StaffData.escape(o.customer)}</td>
                <td>${StaffData.escape(StaffData.paymentMethod(o))}</td>
                <td><strong>${StaffData.money(o.total)}</strong></td>
                <td>${o.paid ? StaffData.badge('Đã hoàn thành') : StaffData.badge(o.status)}</td>
                <td>
                    ${o.paid 
                        ? '<span class="muted">Đã xác nhận</span>' 
                        : `<button class="btn" data-payment-id="${StaffData.escape(o.id)}">Xác nhận thanh toán</button>`
                    }
                </td>
            </tr>
        `).join('') 
        : '<tr><td colspan="6" class="empty-state">Chưa có đơn phù hợp để thanh toán</td></tr>';
}

document.addEventListener('DOMContentLoaded', () => {
    StaffData.updateStaffName();
    
    document.getElementById('paymentTableBody').addEventListener('click', e => {
        const button = e.target.closest('[data-payment-id]');
        if (!button) return;
        
        const orders = StaffData.orders();
        const order = orders.find(o => o.id === button.dataset.paymentId);
        if (!order || order.paid) return;
        
        order.paid = true;
        order.status = 'Đã hoàn thành';
        
        StaffData.saveOrders(orders);
        refreshStaffPage();
    });
    
    refreshStaffPage();
});