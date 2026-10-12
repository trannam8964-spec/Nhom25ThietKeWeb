HOI AN COFFEE - BỘ QUẢN LÝ ĐÃ ĐỒNG BỘ

CÁC TRANG CHÍNH
- index.html: Đăng nhập
- login.css / login.js: Giao diện và xử lý đăng nhập
- coffe.html: Trang chủ / Tổng quan
- products.html: Quản lý sản phẩm
- orders.html: Quản lý đơn hàng
- customers.html: Quản lý khách hàng
- statistics.html: Thống kê doanh thu theo hôm nay, 7 ngày, tháng, năm hoặc toàn bộ dữ liệu

CÁCH CHẠY
1. Giải nén toàn bộ thư mục. Không tách riêng các file JS/CSS khỏi thư mục.
2. Mở thư mục bằng VS Code.
3. Cài Live Server nếu chưa có. Nhấn chuột phải coffe.html > Open with Live Server.
4. Mở index.html để đăng nhập; tài khoản demo là admin, mật khẩu 123456.
5. Sau khi đăng nhập, chuyển trang bằng menu bên trái.
6. Nút Đăng xuất sẽ xóa trạng thái đăng nhập của phiên hiện tại và quay về trang đăng nhập.

ĐỒNG BỘ DỮ LIỆU
Các trang dùng chung localStorage trên cùng trình duyệt: hoianCoffeeProducts, hoianCoffeeOrders, hoiAnCoffeeCustomers. Khi tạo/sửa đơn hàng, thống kê và trang chủ sẽ lấy cùng dữ liệu; doanh thu chỉ tính đơn có trạng thái Hoàn thành.

LƯU Ý
- Đây là phiên bản frontend chạy bằng Live Server, dữ liệu lưu trong trình duyệt hiện tại, chưa phải cơ sở dữ liệu dùng chung nhiều máy. Đăng nhập demo phía frontend chỉ minh họa giao diện/luồng sử dụng, không phải cơ chế bảo mật cho hệ thống thật.
- Không xóa dữ liệu trình duyệt nếu muốn giữ dữ liệu đã nhập.
- Trang nhân viên/bàn/kho/khuyến mãi/cài đặt là liên kết giữ chỗ theo cấu trúc menu hiện tại; phạm vi sửa trong gói này gồm Trang chủ, Sản phẩm, Đơn hàng, Khách hàng và Thống kê.


Tính năng bổ sung: nút ☰ đóng/mở menu trên máy tính và mở/đóng menu trên điện thoại. Tên ở phần Admin lấy từ tên đăng nhập. Tài khoản demo hiện tại: admin / 123456.
