/* Các hàm dữ liệu dùng chung giữa các trang Staff. */
const StaffData = {
    get(key, fallback) { 
        try { 
            const value = localStorage.getItem('coffeeStaff_' + key); 
            return value === null ? fallback : JSON.parse(value); 
        } catch { 
            return fallback; 
        } 
    },
    
    set(key, value) { 
        localStorage.setItem('coffeeStaff_' + key, JSON.stringify(value)); 
    },
    
    money(value) { 
        return Number(value || 0).toLocaleString('vi-VN') + 'đ'; 
    },
    
    orders() {
        const storedOrders = localStorage.getItem('orders');
        let orders = storedOrders ? JSON.parse(storedOrders) : [];
        if (!Array.isArray(orders)) {
            throw new TypeError('Dữ liệu đơn hàng không hợp lệ.');
        }

        const legacyOrders = this.get('orders', []);
        if (Array.isArray(legacyOrders) && legacyOrders.length) {
            const existingIds = new Set(orders.map(order => String(order.id)));
            const migratedOrders = legacyOrders
                .filter(order => !existingIds.has(String(order.id)))
                .map(order => ({
                    ...order,
                    username: order.username || order.customer || 'Khách hàng',
                    customer: order.customer || order.username || 'Khách hàng',
                    date: order.date || order.time || '',
                    time: order.time || order.date || '',
                    paymentMethod: order.paymentMethod || order.method || ''
                }));
            orders = orders.concat(migratedOrders);
            localStorage.setItem('orders', JSON.stringify(orders));
            localStorage.removeItem('coffeeStaff_orders');
        }

        return orders;
    },
    
    saveOrders(value) { 
        localStorage.setItem('orders', JSON.stringify(value));
    },

    orderCustomer(order) {
        return order.customer || order.displayName || order.username || 'Khách hàng';
    },

    orderTime(order) {
        return order.time || order.date || '';
    },

    orderItems(order) {
        return (Array.isArray(order.items) ? order.items : []).map(item =>
            typeof item === 'string'
                ? item
                : `${item.name || 'Sản phẩm'} x${Number(item.quantity) || 1}`
        );
    },

    paymentMethod(order) {
        const methods = { cash: 'Tiền mặt', bank: 'Chuyển khoản' };
        return methods[order.paymentMethod] || order.paymentMethod || order.method || 'Tiền mặt';
    },
    
    tables() { 
        return this.get('tables', Array.from({length: 12}, (_, index) => ({ 
            id: index + 1, 
            status: [2, 6, 9].includes(index + 1) ? 'Đang sử dụng' : [4, 11].includes(index + 1) ? 'Đặt trước' : 'Trống' 
        }))); 
    },
    
    saveTables(value) { 
        this.set('tables', value); 
    },
    
    profile() { 
        return this.get('profile', {
            name: 'Nhân viên', 
            email: '', 
            phone: '', 
            shift: 'Sáng (07:00 - 12:00)'
        }); 
    },
    
    escape(value) { 
        return String(value ?? '').replace(/[&<>"']/g, ch => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[ch])); 
    },
    
    badge(status) { 
        const classes = {
            'Chờ xác nhận': 'status-pending',
            'Đang chuẩn bị': 'status-preparing',
            'Đang giao': 'status-delivering',
            'Đã hoàn thành': 'status-done',
            'Đã hủy': 'status-cancel',
            'Trống': 'table-empty',
            'Đang sử dụng': 'table-busy',
            'Đặt trước': 'table-reserved'
        }; 
        return `<span class="status ${classes[status] || ''}">${this.escape(status)}</span>`; 
    },
    
    updateStaffName() { 
        const name = this.profile().name || 'Nhân viên'; 
        document.querySelectorAll('#staffname, #dashboardStaffName').forEach(el => el.textContent = name); 
    }
};

window.addEventListener('storage', () => { 
    if (typeof window.refreshStaffPage === 'function') {
        window.refreshStaffPage(); 
    }
});