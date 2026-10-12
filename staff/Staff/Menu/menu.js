
let products = [
  
    // 1. CÀ PHÊ (ID: 1 - 10)

    { id: 1, name: 'Americano', category: 'Cà Phê', price: 30000, img: './Pics/cà phê/americano.jpg', desc: 'Cà phê Espresso pha loãng với nước nóng, hương vị nhẹ nhàng.' },
    { id: 2, name: 'Bạc Xỉu', category: 'Cà Phê', price: 32000, img: './Pics/cà phê/bacxiu.jpg', desc: 'Cà phê hòa quyện cùng sữa đặc và sữa tươi ngọt béo.' },
    { id: 3, name: 'Capuchino', category: 'Cà Phê', price: 40000, img: './Pics/cà phê/capuchinno.jpg', desc: 'Cà phê Ý kết hợp bọt sữa mịn màng và thơm ngậy.' },
    { id: 4, name: 'Cà Phê Cốt Dừa', category: 'Cà Phê', price: 42000, img: './Pics/cà phê/cotdua.jpg', desc: 'Sự kết hợp hoàn hảo giữa cà phê đắng nhẹ và cốt dừa đá xay béo ngậy.' },
    { id: 5, name: 'Cà Phê Đen', category: 'Cà Phê', price: 25000, img: './Pics/cà phê/den.jpg', desc: 'Cà phê đen nguyên chất pha phin đậm đà truyền thống.' },
    { id: 6, name: 'Espresso', category: 'Cà Phê', price: 30000, img: './Pics/cà phê/espresso.jpg', desc: 'Cà phê nguyên chất đậm đặc chiết xuất dưới áp suất cao.' },
    { id: 7, name: 'Cà Phê Kem Trứng', category: 'Cà Phê', price: 45000, img: './Pics/cà phê/kemtrung.jpg', desc: 'Lớp kem trứng đánh bông béo ngậy phủ trên nền cà phê đậm vị.' },
    { id: 8, name: 'Cà Phê Mocha', category: 'Cà Phê', price: 45000, img: './Pics/cà phê/mocha.jpg', desc: 'Cà phê Espresso kết hợp sốt socola và kem tươi đánh bông.' },
    { id: 9, name: 'Cà Phê Muối', category: 'Cà Phê', price: 35000, img: './Pics/cà phê/muoi.jpg', desc: 'Sự kết hợp độc đáo giữa vị mặn nhẹ của kem muối và cà phê đậm đà.' },
    { id: 10, name: 'Cà Phê Nâu', category: 'Cà Phê', price: 29000, img: './Pics/cà phê/nau.jpg', desc: 'Cà phê pha phin kết hợp sữa đặc ngọt ngào chuẩn vị.' },

    
    // 2. ĐỒ ĂN (ID: 11 - 17)

    { id: 11, name: 'Bánh Bông Lan Trứng Muối', category: 'Đồ Ăn', price: 35000, img: './Pics/đồ ăn/bonglantrungmuoi.jpg', desc: 'Bông lan mềm mịn kết hợp chà bông và sốt trứng muối đậm đà.' },
    { id: 12, name: 'Cơm Cháy Chà Bông', category: 'Đồ Ăn', price: 25000, img: './Pics/đồ ăn/comchaychabong.jpg', desc: 'Cơm cháy giòn rụm phủ lớp chà bông đậm vị.' },
    { id: 13, name: 'Bánh Croissant Bơ Tỏi', category: 'Đồ Ăn', price: 30000, img: './Pics/đồ ăn/croissantBoToi.jpg', desc: 'Bánh sừng bò ngàn lớp thơm lừng hương vị bơ tỏi.' },
    { id: 14, name: 'Bánh Flan Caramel', category: 'Đồ Ăn', price: 20000, img: './Pics/đồ ăn/flanCaramel.jpg', desc: 'Flan béo ngậy, đắng nhẹ vị caramel ăn kèm đá bào.' },
    { id: 15, name: 'Hạt Hướng Dương', category: 'Đồ Ăn', price: 15000, img: './Pics/đồ ăn/HuongDuong.jpg', desc: 'Hạt hướng dưỡng rang thơm nhâm nhi cùng trà và cà phê.' },
    { id: 16, name: 'Khô Bò', category: 'Đồ Ăn', price: 40000, img: './Pics/đồ ăn/khobo.jpg', desc: 'Khô bò xé sợi cay nhẹ đậm đà.' },
    { id: 17, name: 'Khô Gà Lá Chanh', category: 'Đồ Ăn', price: 35000, img: './Pics/đồ ăn/Khoga.jpg', desc: 'Khô gà xé giòn thơm phức mùi lá chanh.' },


    // 3. NƯỚC ÉP (ID: 18 - 20)

    { id: 18, name: 'Nước Ép Cam', category: 'Nước Ép', price: 38000, img: './Pics/nước ép/cam.jpg', desc: 'Cam tươi nguyên chất 100% giàu Vitamin C tốt cho sức khỏe.' },
    { id: 19, name: 'Nước Ép Dứa', category: 'Nước Ép', price: 38000, img: './Pics/nước ép/dua.jpg', desc: 'Nước ép dứa thơm ngon, thanh mát giải nhiệt mùa hè.' },
    { id: 20, name: 'Nước Ép Dưa Hấu', category: 'Nước Ép', price: 35000, img: './Pics/nước ép/duahau.jpg', desc: 'Dưa hấu tươi ép ngọt tự nhiên và vô cùng mát lạnh.' },


    // 4. TRÀ (ID: 21 - 27)

    { id: 21, name: 'Hồng Trà Việt Quất', category: 'Trà', price: 38000, img: './Pics/trà/hongtravietquat.jpg', desc: 'Hồng trà thanh mát kết hợp đậm vị việt quất.' },
    { id: 22, name: 'Trà Sen Vàng', category: 'Trà', price: 45000, img: './Pics/trà/senvang.jpg', desc: 'Trà sen thơm mát ăn kèm hạt sen thanh ngọt và lớp màng macchiato.' },
    { id: 23, name: 'Trà Đào Cam Sả', category: 'Trà', price: 40000, img: './Pics/trà/tradaocamsa.jpg', desc: 'Trà đào thơm nức kết hợp vị cam tươi và hương sả sảng khoái.' },
    { id: 24, name: 'Trà Mãng Cầu', category: 'Trà', price: 38000, img: './Pics/trà/tramangcau.jpg', desc: 'Mãng cầu tươi dầm đậm vị chua ngọt cùng nền trà đậm đà.' },
    { id: 25, name: 'Trà Tắc Xí Muội', category: 'Trà', price: 32000, img: './Pics/trà/tratacximuoi.jpg', desc: 'Trà tắc chua chua ngọt ngọt kết hợp vị xí muội mặn nhẹ cực giải khát.' },
    { id: 26, name: 'Trà Vải Hoa Lài', category: 'Trà', price: 38000, img: './Pics/trà/travaihoalai.jpg', desc: 'Trà ướp hoa lài thơm dịu nhẹ ăn kèm quả vải giòn ngọt.' },
    { id: 27, name: 'Trà Xoài', category: 'Trà', price: 38000, img: './Pics/trà/traxoai.jpg', desc: 'Trà trái cây vị xoài chín ngọt lịm thơm mát.' },


    // 5. TRÀ SỮA (ID: 28 - 32)

    { id: 28, name: 'Trà Sữa Trân Châu Đường Đen', category: 'Trà Sữa', price: 42000, img: './Pics/trà sữa/tranchauduongden.jpg', desc: 'Trà sữa đậm đà kết hợp trân châu đường đen dẻo thơm.' },
    { id: 29, name: 'Trà Sữa Chanh Leo', category: 'Trà Sữa', price: 38000, img: './Pics/trà sữa/tsChanhLeo.jpg', desc: 'Vị chua nhẹ của chanh leo kết hợp trà sữa béo ngậy.' },
    { id: 30, name: 'Trà Sữa Matcha', category: 'Trà Sữa', price: 40000, img: './Pics/trà sữa/tsmatcha.jpg', desc: 'Trà xanh Nhật Bản thơm thanh hòa quyện cùng lớp sữa béo.' },
    { id: 31, name: 'Trà Sữa Socola', category: 'Trà Sữa', price: 40000, img: './Pics/trà sữa/tsSocola.jpg', desc: 'Hương vị socola đậm đà kết hợp trà sữa truyền thống.' },
    { id: 32, name: 'Trà Sữa Việt Quất', category: 'Trà Sữa', price: 42000, img: './Pics/trà sữa/tsvietquat.jpg', desc: 'Trà sữa kết hợp sốt việt quất chua ngọt hấp dẫn.' }
];


const recipes = {
    // ---------- CÀ PHÊ ----------
    1: { ingredients: [['Espresso (2 shot)', '60ml'], ['Nước nóng', '150ml'], ['Đá viên (nếu uống lạnh)', '100g']],
         steps: ['Chiết 2 shot Espresso vào ly.', 'Thêm nước nóng 90°C vào ly và khuấy nhẹ.', 'Nếu uống lạnh: cho đá vào ly trước khi rót Espresso và nước lạnh.'] },
    2: { ingredients: [['Cà phê pha phin', '40ml'], ['Sữa đặc', '30ml'], ['Sữa tươi', '100ml'], ['Đá viên', '120g']],
         steps: ['Cho sữa đặc và sữa tươi vào ly, khuấy đều.', 'Thêm đá viên đầy ly.', 'Rót cà phê phin lên trên, khuấy nhẹ khi phục vụ.'] },
    3: { ingredients: [['Espresso (2 shot)', '60ml'], ['Sữa tươi', '150ml'], ['Bọt sữa', '2 thìa'], ['Bột cacao (rắc mặt)', '1g']],
         steps: ['Chiết 2 shot Espresso vào ly.', 'Đánh nóng sữa tươi bằng vòi hơi đến khi có bọt mịn.', 'Rót sữa vào ly, phủ lớp bọt sữa lên trên.', 'Rắc bột cacao lên mặt.'] },
    4: { ingredients: [['Cà phê pha phin', '40ml'], ['Cốt dừa', '60ml'], ['Sữa đặc', '20ml'], ['Đá viên', '120g']],
         steps: ['Xay nhuyễn cốt dừa, sữa đặc và đá thành hỗn hợp sinh tố mịn.', 'Đổ hỗn hợp ra ly.', 'Rót cà phê phin lên trên.'] },
    5: { ingredients: [['Cà phê bột', '20g'], ['Nước nóng 95°C', '70ml'], ['Đường', '10g'], ['Đá viên', '100g']],
         steps: ['Tráng phin bằng nước nóng, cho cà phê bột vào, nén nhẹ.', 'Rót 20ml nước nóng để ủ cà phê 30 giây.', 'Rót phần nước còn lại, chờ cà phê nhỏ giọt xuống ly.', 'Thêm đường và đá nếu uống lạnh.'] },
    6: { ingredients: [['Cà phê hạt xay', '18g'], ['Nước (chiết xuất)', '30ml']],
         steps: ['Xay cà phê, nén đều trong tay cầm (tamper) với lực khoảng 15kg.', 'Lắp vào máy, chiết xuất 25–30 giây ra khoảng 30ml.', 'Phục vụ ngay khi còn lớp crema.'] },
    7: { ingredients: [['Cà phê pha phin', '50ml'], ['Lòng đỏ trứng gà', '1 quả'], ['Sữa đặc', '20ml'], ['Đường', '10g']],
         steps: ['Đánh lòng đỏ trứng cùng sữa đặc và đường đến khi bông, mịn.', 'Rót cà phê phin ra ly.', 'Múc lớp kem trứng phủ lên trên.'] },
    8: { ingredients: [['Espresso (2 shot)', '60ml'], ['Sốt socola', '25ml'], ['Sữa tươi', '120ml'], ['Kem tươi', '30g']],
         steps: ['Cho sốt socola vào ly, rót Espresso vào khuấy tan.', 'Đánh nóng sữa tươi rồi rót vào ly.', 'Phủ kem tươi lên trên, rưới thêm một ít sốt socola.'] },
    9: { ingredients: [['Cà phê pha phin', '40ml'], ['Sữa đặc', '25ml'], ['Sữa tươi', '60ml'], ['Kem muối', '40g'], ['Đá viên', '120g']],
         steps: ['Cho sữa đặc, sữa tươi và đá vào ly, khuấy đều.', 'Rót cà phê phin vào ly.', 'Phủ lớp kem muối lên trên.'] },
    10: { ingredients: [['Cà phê pha phin', '50ml'], ['Sữa đặc', '30ml'], ['Đá viên', '100g']],
          steps: ['Cho sữa đặc vào ly.', 'Rót cà phê phin vào, khuấy đều đến khi sữa tan.', 'Thêm đá viên, khuấy nhẹ rồi phục vụ.'] },

    // ---------- NƯỚC ÉP ----------
    18: { ingredients: [['Cam tươi', '3 quả'], ['Đường nước', '10ml'], ['Đá viên', '100g']],
          steps: ['Vắt lấy nước cam, lọc bỏ hạt.', 'Thêm đường nước nếu cần.', 'Rót ra ly có đá.'] },
    19: { ingredients: [['Dứa gọt vỏ', '200g'], ['Nước lọc', '50ml'], ['Đường nước', '15ml'], ['Đá viên', '100g']],
          steps: ['Cắt dứa thành miếng nhỏ, cho vào máy ép cùng nước lọc.', 'Lọc lấy nước, thêm đường nước.', 'Rót ra ly có đá.'] },
    20: { ingredients: [['Dưa hấu bỏ vỏ, bỏ hạt', '300g'], ['Đường nước', '10ml'], ['Đá viên', '100g']],
          steps: ['Cắt dưa hấu thành miếng, cho vào máy ép.', 'Lọc lấy nước, thêm đường nước.', 'Rót ra ly có đá.'] },

    // ---------- TRÀ ----------
    21: { ingredients: [['Hồng trà đã ủ', '150ml'], ['Mứt việt quất', '30g'], ['Đường nước', '20ml'], ['Đá viên', '120g']],
          steps: ['Cho mứt việt quất và đường nước vào bình lắc.', 'Thêm hồng trà và đá, lắc đều 10–15 giây.', 'Rót ra ly, thêm vài quả việt quất để trang trí.'] },
    22: { ingredients: [['Trà sen đã ủ', '150ml'], ['Hạt sen đã nấu', '40g'], ['Đường nước', '20ml'], ['Lớp macchiato (kem sữa)', '40g'], ['Đá viên', '100g']],
          steps: ['Cho hạt sen, đường nước vào ly.', 'Thêm đá và rót trà sen vào.', 'Phủ lớp macchiato lên trên.'] },
    23: { ingredients: [['Trà đen đã ủ', '120ml'], ['Siro đào', '30ml'], ['Đào miếng', '3 miếng'], ['Cam tươi', '2 lát'], ['Sả (đập dập)', '1 cây'], ['Đá viên', '120g']],
          steps: ['Cho siro đào, đào miếng, lát cam và sả vào bình lắc.', 'Thêm trà đen và đá, lắc đều.', 'Rót ra ly, trang trí thêm lát cam và sả.'] },
    24: { ingredients: [['Trà đã ủ', '130ml'], ['Mãng cầu xiêm tươi (xay nhuyễn)', '60g'], ['Đường nước', '20ml'], ['Đá viên', '120g']],
          steps: ['Cho mãng cầu xay, đường nước vào ly.', 'Thêm đá, rót trà vào.', 'Khuấy đều và phục vụ.'] },
    25: { ingredients: [['Trà đã ủ', '120ml'], ['Tắc (quất) tươi', '4 trái'], ['Xí muội', '3 quả'], ['Đường nước', '25ml'], ['Đá viên', '120g']],
          steps: ['Vắt tắc lấy nước, bỏ hạt.', 'Cho nước tắc, xí muội, đường nước và trà vào bình lắc cùng đá.', 'Lắc đều, rót ra ly.'] },
    26: { ingredients: [['Trà hoa lài đã ủ', '150ml'], ['Vải (bỏ hạt)', '4 trái'], ['Siro vải', '20ml'], ['Đá viên', '120g']],
          steps: ['Cho vải và siro vải vào ly.', 'Thêm đá, rót trà hoa lài vào.', 'Khuấy nhẹ rồi phục vụ.'] },
    27: { ingredients: [['Trà đã ủ', '130ml'], ['Xoài chín (xay nhuyễn)', '80g'], ['Đường nước', '15ml'], ['Đá viên', '120g']],
          steps: ['Xay xoài với một ít đá thành hỗn hợp mịn.', 'Cho đá vào ly, rót trà vào.', 'Thêm hỗn hợp xoài lên trên, khuấy nhẹ.'] },

    // ---------- TRÀ SỮA ----------
    28: { ingredients: [['Trà đen đã ủ', '120ml'], ['Sữa tươi', '60ml'], ['Bột kem béo', '20g'], ['Đường đen (nấu sệt)', '30ml'], ['Trân châu đường đen', '50g'], ['Đá viên', '100g']],
          steps: ['Rưới đường đen quanh thành ly, cho trân châu vào.', 'Lắc trà, sữa tươi, bột kem béo và đá trong bình lắc.', 'Rót hỗn hợp vào ly.'] },
    29: { ingredients: [['Trà đen đã ủ', '120ml'], ['Sữa tươi', '50ml'], ['Bột kem béo', '20g'], ['Chanh leo (lấy ruột)', '1 trái'], ['Đường nước', '20ml'], ['Đá viên', '100g']],
          steps: ['Cho ruột chanh leo và đường nước vào ly.', 'Lắc trà, sữa, bột kem béo cùng đá.', 'Rót vào ly, khuấy nhẹ để hòa vị chua ngọt.'] },
    30: { ingredients: [['Bột matcha', '8g'], ['Nước nóng 80°C', '60ml'], ['Sữa tươi', '120ml'], ['Bột kem béo', '15g'], ['Đường nước', '25ml'], ['Đá viên', '100g']],
          steps: ['Hòa bột matcha với nước nóng, đánh mịn.', 'Lắc matcha cùng sữa tươi, bột kem béo, đường nước và đá.', 'Rót ra ly và phục vụ.'] },
    31: { ingredients: [['Trà đen đã ủ', '100ml'], ['Sữa tươi', '70ml'], ['Bột kem béo', '20g'], ['Sốt socola', '30ml'], ['Đá viên', '100g']],
          steps: ['Rưới sốt socola quanh thành ly.', 'Lắc trà, sữa tươi, bột kem béo và đá.', 'Rót vào ly, rưới thêm sốt socola lên mặt.'] },
    32: { ingredients: [['Trà đen đã ủ', '120ml'], ['Sữa tươi', '60ml'], ['Bột kem béo', '20g'], ['Mứt việt quất', '30g'], ['Đá viên', '100g']],
          steps: ['Cho mứt việt quất vào ly.', 'Lắc trà, sữa, bột kem béo cùng đá.', 'Rót vào ly, khuấy nhẹ trước khi phục vụ.'] }
};

let selectedCategory = 'Tất cả';

function loadManagedMenu() {
    try {
        const saved = JSON.parse(localStorage.getItem('hoianCoffeeProducts') || '[]');
        if (Array.isArray(saved) && saved.length) {
            return saved.filter(item => item.active !== false).map(item => ({
                ...item,
                img: item.image?.startsWith('/')
                    ? item.image
                    : '/manager/lyna7200/coffe/' + String(item.image || ''),
                desc: item.description || ''
            }));
        }
    } catch {
        // Use the bundled staff menu until the manager catalog is initialized.
    }
    return products;
}

products = loadManagedMenu();

function normalizeCategory(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('vi')
        .trim();
}

document.addEventListener('DOMContentLoaded', () => {
    renderMenuListUI();
});

function renderMenuListUI() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    const headerTitle = document.getElementById('headerTitle');
    if (headerTitle) headerTitle.textContent = 'Menu';

    mainContent.innerHTML = `
        <div class="page-title">
            <h1>Danh sách Menu</h1>
            <p>Xem thực đơn và công thức pha chế</p>
        </div>

        <div class="menu-tools">
            <div class="search-box">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="searchInput" placeholder="Tìm kiếm món..."/>
            </div>
        </div>

        <div class="categories">
            <button class="category-btn ${selectedCategory === 'Tất cả' ? 'active' : ''}" data-category="Tất cả">Tất cả</button>
            <button class="category-btn ${selectedCategory === 'Cà Phê' ? 'active' : ''}" data-category="Cà Phê">Cà Phê</button>
            <button class="category-btn ${selectedCategory === 'Đồ Ăn' ? 'active' : ''}" data-category="Đồ Ăn">Đồ Ăn</button>
            <button class="category-btn ${selectedCategory === 'Nước Ép' ? 'active' : ''}" data-category="Nước Ép">Nước Ép</button>
            <button class="category-btn ${selectedCategory === 'Trà' ? 'active' : ''}" data-category="Trà">Trà</button>
            <button class="category-btn ${selectedCategory === 'Trà Sữa' ? 'active' : ''}" data-category="Trà Sữa">Trà Sữa</button>
        </div>

        <div class="product-grid" id="menuProducts"></div>
    `;

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedCategory = btn.getAttribute('data-category');
            renderMenuListUI();
        });
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', renderProductsGrid);
    }

    renderProductsGrid();
}

function renderProductsGrid() {
    const grid = document.getElementById('menuProducts');
    if (!grid) return;

    const searchInput = document.getElementById('searchInput');
    const searchValue = (searchInput ? searchInput.value : '').toLowerCase().trim();

    const filtered = products.filter(p => {
        const matchesCat = normalizeCategory(selectedCategory) === normalizeCategory('Tất cả') || normalizeCategory(p.category) === normalizeCategory(selectedCategory);
        const matchesSearch = p.name.toLowerCase().includes(searchValue);
        return matchesCat && matchesSearch;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; color: #888; text-align: center; padding: 20px;">Không tìm thấy sản phẩm phù hợp.</p>`;
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}" class="product-img" onerror="this.src='https://via.placeholder.com/300x160?text=Coffee+House'">
            <div class="product-info">
                <span class="product-category">${p.category}</span>
                <h4 class="product-title">${p.name}</h4>
                <div class="product-price">${p.price.toLocaleString('vi-VN')}đ</div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            loadProductDetailUI(p.id);
        });

        grid.appendChild(card);
    });
}

function renderRecipeHTML(productId) {
    const recipe = recipes[productId];
    if (!recipe) return '';

    const ingredientsHTML = recipe.ingredients
        .map(([name, amount]) => `<li><span>${name}</span><strong>${amount}</strong></li>`)
        .join('');
    const stepsHTML = recipe.steps.map(step => `<li>${step}</li>`).join('');

    return `
        <div class="detail-recipe">
            <h3><i class="fa-solid fa-flask-vial"></i> Công thức pha chế</h3>
            <div class="recipe-block">
                <h4>Nguyên liệu</h4>
                <ul class="recipe-ingredients">${ingredientsHTML}</ul>
            </div>
            <div class="recipe-block">
                <h4>Các bước thực hiện</h4>
                <ol class="recipe-steps">${stepsHTML}</ol>
            </div>
        </div>
    `;
}

function loadProductDetailUI(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div class="product-detail-wrapper">
            <button class="btn-back" id="btnBackToMenu">
                <i class="fa-solid fa-arrow-left"></i> Quay lại Danh sách Menu
            </button>

            <div class="product-detail-card">
                <div class="detail-image-box">
                    <img id="detailImg" src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/350x350?text=Coffee+House'">
                </div>

                <div class="detail-info-box">
                    <span class="detail-category">${product.category}</span>
                    <h1 class="detail-title">${product.name}</h1>
                    <div class="detail-price-tag" id="detailPrice">${product.price.toLocaleString('vi-VN')}đ</div>

                    <div class="detail-description">
                        <h3><i class="fa-solid fa-circle-info"></i> Mô tả sản phẩm</h3>
                        <p>${product.desc || 'Thông tin món ăn chưa được cập nhật.'}</p>
                    </div>

                    ${renderRecipeHTML(product.id)}
                </div>
            </div>
        </div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const btnBack = document.getElementById('btnBackToMenu');
    if (btnBack) {
        btnBack.onclick = () => renderMenuListUI();
    }
}

window.addEventListener("storage", (event) => {
    if (event.key === "hoianCoffeeProducts") {
        products = loadManagedMenu();
        renderMenuListUI();
    }
});