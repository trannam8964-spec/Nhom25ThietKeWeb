document.addEventListener('DOMContentLoaded', () => {
    const saveAllBtn = document.getElementById('saveAllBtn');

    // Tải cấu hình từ LocalStorage
    const defaultSettings = {
        storeName: 'Hội An Coffee',
        storePhone: '0905 123 456',
        storeAddress: '123 Phố Cổ, Hội An, Quảng Nam',
        storeWifi: 'hoiancoffee2026',
        vatRate: 8,
        currency: 'VNĐ',
        autoPrint: true,
        showWifiOnReceipt: true
    };

    let settings = JSON.parse(localStorage.getItem('coffee_settings')) || defaultSettings;

    // Load dữ liệu lên giao diện
    function loadSettings() {
        document.getElementById('storeName').value = settings.storeName;
        document.getElementById('storePhone').value = settings.storePhone;
        document.getElementById('storeAddress').value = settings.storeAddress;
        document.getElementById('storeWifi').value = settings.storeWifi;
        document.getElementById('vatRate').value = settings.vatRate;
        document.getElementById('currency').value = settings.currency;
        document.getElementById('autoPrint').checked = settings.autoPrint;
        document.getElementById('showWifiOnReceipt').checked = settings.showWifiOnReceipt;
    }

    // Lưu cấu hình
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', () => {
            settings = {
                storeName: document.getElementById('storeName').value.trim(),
                storePhone: document.getElementById('storePhone').value.trim(),
                storeAddress: document.getElementById('storeAddress').value.trim(),
                storeWifi: document.getElementById('storeWifi').value.trim(),
                vatRate: Number(document.getElementById('vatRate').value),
                currency: document.getElementById('currency').value,
                autoPrint: document.getElementById('autoPrint').checked,
                showWifiOnReceipt: document.getElementById('showWifiOnReceipt').checked
            };

            localStorage.setItem('coffee_settings', JSON.stringify(settings));
            alert('Lưu cấu hình hệ thống thành công!');
        });
    }

    loadSettings();
});