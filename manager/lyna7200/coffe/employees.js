document.addEventListener('DOMContentLoaded', () => {
    // Lấy các element từ HTML
    const employeeList = document.getElementById('employeeList');
    const emptyState = document.getElementById('emptyState');
    const totalCount = document.getElementById('totalCount');
    const activeCount = document.getElementById('activeCount');
    const resultCount = document.getElementById('resultCount');
    const searchInput = document.getElementById('searchInput');
    const resetBtn = document.getElementById('resetBtn');

    const dialog = document.getElementById('employeeDialog');
    const form = document.getElementById('employeeForm');
    const addBtn = document.getElementById('addBtn');
    const closeBtn = document.getElementById('closeBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const modalTitle = document.getElementById('modalTitle');
    const formError = document.getElementById('formError');

    // Dữ liệu mẫu ban đầu nếu chưa có trong LocalStorage
    let employees = JSON.parse(localStorage.getItem('coffee_employees')) || [
        { id: 'NV01', name: 'Nguyễn Văn A', phone: '0901234567', role: 'Quản lý', status: 'Đang làm việc' },
        { id: 'NV02', name: 'Trần Thị B', phone: '0912345678', role: 'Thu ngân', status: 'Đang làm việc' },
        { id: 'NV03', name: 'Lê Văn C', phone: '0923456789', role: 'Pha chế', status: 'Nghỉ việc' }
    ];

    // Hàm lưu vào LocalStorage
    function saveData() {
        localStorage.setItem('coffee_employees', JSON.stringify(employees));
    }

    // Hàm hiển thị danh sách
    function render() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const filtered = employees.filter(emp => 
            emp.name.toLowerCase().includes(query) || emp.phone.includes(query) || emp.id.toLowerCase().includes(query)
        );

        // Cập nhật thống kê
        if (totalCount) totalCount.textContent = employees.length;
        if (activeCount) activeCount.textContent = employees.filter(e => e.status === 'Đang làm việc').length;
        if (resultCount) resultCount.textContent = `${filtered.length} nhân viên`;

        if (filtered.length === 0) {
            employeeList.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        employeeList.innerHTML = filtered.map(emp => `
            <tr>
                <td><strong>${emp.id}</strong></td>
                <td>${emp.name}</td>
                <td>${emp.phone}</td>
                <td>${emp.role}</td>
                <td>
                    <span style="color: ${emp.status === 'Đang làm việc' ? '#20a779' : '#e74c3c'}; font-weight: bold;">
                        ${emp.status}
                    </span>
                </td>
                <td>
                    <button onclick="editEmployee('${emp.id}')" class="btn-secondary" style="padding: 4px 8px; margin-right: 4px;">Sửa</button>
                    <button onclick="deleteEmployee('${emp.id}')" class="btn-secondary" style="padding: 4px 8px; color: #e74c3c; border-color: #e74c3c;">Xóa</button>
                </td>
            </tr>
        `).join('');
    }

    // Mở Modal Thêm mới
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            if (form) form.reset();
            document.getElementById('employeeId').value = '';
            if (modalTitle) modalTitle.textContent = 'Thêm nhân viên';
            if (formError) formError.textContent = '';
            if (dialog) dialog.showModal();
        });
    }

    // Đóng Modal
    const closeModal = () => dialog && dialog.close();
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Xử lý nộp Form
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('employeeId').value;
            const name = document.getElementById('employeeName').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const role = document.getElementById('role').value;
            const status = document.getElementById('status').value;

            if (id) {
                // Sửa
                const index = employees.findIndex(e => e.id === id);
                if (index !== -1) {
                    employees[index] = { id, name, phone, role, status };
                }
            } else {
                // Thêm mới
                const newId = 'NV' + String(employees.length + 1).padStart(2, '0');
                employees.push({ id: newId, name, phone, role, status });
            }

            saveData();
            render();
            closeModal();
        });
    }

    // Sửa nhân viên
    window.editEmployee = (id) => {
        const emp = employees.find(e => e.id === id);
        if (!emp) return;

        document.getElementById('employeeId').value = emp.id;
        document.getElementById('employeeName').value = emp.name;
        document.getElementById('phone').value = emp.phone;
        document.getElementById('role').value = emp.role;
        document.getElementById('status').value = emp.status;

        if (modalTitle) modalTitle.textContent = 'Sửa thông tin nhân viên';
        if (formError) formError.textContent = '';
        if (dialog) dialog.showModal();
    };

    // Xóa nhân viên
    window.deleteEmployee = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
            employees = employees.filter(e => e.id !== id);
            saveData();
            render();
        }
    };

    // Tìm kiếm & Đặt lại
    if (searchInput) searchInput.addEventListener('input', render);
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            render();
        });
    }

    saveData();
    render();
});