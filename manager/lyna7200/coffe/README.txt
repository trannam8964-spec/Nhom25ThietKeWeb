HOI AN COFFEE - BỘ QUẢN LÝ ĐÃ ĐỒNG BỘ

CÁC TRANG CHÍNH
- index.html: Chuyển đến trang đăng nhập chung trong thư mục register
- coffe.html: Trang chủ / Tổng quan
- products.html: Quản lý sản phẩm
- orders.html: Quản lý đơn hàng
- customers.html: Quản lý khách hàng
- statistics.html: Thống kê doanh thu theo hôm nay, 7 ngày, tháng, năm hoặc toàn bộ dữ liệu

CÁCH CHẠY
1. Giải nén toàn bộ thư mục. Không tách riêng các file JS/CSS khỏi thư mục.
2. Mở thư mục bằng VS Code.
3. Cài Live Server nếu chưa có. Mở thư mục dự án bằng Live Server.
4. Mở /register/login.html để đăng nhập; tài khoản quản lý demo là admin, mật khẩu 123456.
5. Sau khi đăng nhập, chuyển trang bằng menu bên trái.
6. Nút Đăng xuất sẽ xóa trạng thái đăng nhập của phiên hiện tại và quay về trang đăng nhập.

ĐỒNG BỘ DỮ LIỆU
Manager, staff, customer, and register pages share localStorage keys orders and customers on the same browser origin. Manager products remain in hoianCoffeeProducts. Revenue includes completed orders.

LƯU Ý
- Đây là phiên bản frontend chạy bằng Live Server, dữ liệu lưu trong trình duyệt hiện tại, chưa phải cơ sở dữ liệu dùng chung nhiều máy. Đăng nhập demo phía frontend chỉ minh họa giao diện/luồng sử dụng, không phải cơ chế bảo mật cho hệ thống thật.
- Không xóa dữ liệu trình duyệt nếu muốn giữ dữ liệu đã nhập.
- Các trang Staff, Bàn, Kho, Khuyến mãi và Cài đặt có giao diện và luồng lưu riêng trong trình duyệt. Trạng thái bàn, đơn hàng, khách hàng và danh mục sản phẩm được chia sẻ giữa các trang trên cùng origin.


Tính năng bổ sung: nút ☰ đóng/mở menu trên máy tính và mở/đóng menu trên điện thoại. Tên ở phần Admin lấy từ tên đăng nhập. Tài khoản demo hiện tại: admin / 123456.
