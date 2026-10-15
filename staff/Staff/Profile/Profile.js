/* Profile: form đã viết sẵn trong HTML; JS chỉ nạp và lưu dữ liệu. */
document.addEventListener('DOMContentLoaded', () => {
    StaffData.updateStaffName();
    
    const form = document.getElementById('profileForm');
    const profile = StaffData.profile();
    
    // Nạp dữ liệu cũ vào form
    form.elements.name.value = profile.name || '';
    form.elements.email.value = profile.email || '';
    form.elements.phone.value = profile.phone || '';
    form.elements.shift.value = profile.shift || 'Sáng (07:00 - 12:00)';
    
    // Xử lý sự kiện khi submit form lưu thông tin
    form.addEventListener('submit', event => {
        event.preventDefault();
        
        StaffData.set('profile', {
            name: form.elements.name.value.trim(),
            email: form.elements.email.value.trim(),
            phone: form.elements.phone.value.trim(),
            shift: form.elements.shift.value
        });
        
        StaffData.updateStaffName();
        document.getElementById('profileNotice').textContent = 'Đã lưu thông tin.';
    });
});