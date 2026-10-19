# Chương 5. Kiểm thử hệ thống Coffee House

## 5.1. Mục tiêu kiểm thử

Kiểm thử nhằm xác nhận các trang và chức năng chính hoạt động đúng trước khi đưa hệ thống vào sử dụng. Trọng tâm là luồng đăng ký, đăng nhập, đặt hàng; việc đồng bộ dữ liệu giữa Customer, Staff và Manager; trạng thái bàn; thống kê doanh thu; và kiểm tra dữ liệu đầu vào.

## 5.2. Môi trường và cách kiểm thử

- Website được chạy tại `http://127.0.0.1:8765` bằng máy chủ tĩnh cục bộ.
- Trình duyệt: Microsoft Edge Headless 155.
- Dữ liệu kiểm thử được lưu trong hồ sơ trình duyệt thử nghiệm riêng, không ghi vào hồ sơ Chrome đang sử dụng.
- Các ca được chia thành ba nhóm: kiểm tra liên kết (LINK), kiểm tra chức năng (EF) và kiểm tra dữ liệu (DV).
- Các thao tác chính được thực hiện trên giao diện thật của website; kết quả đọc lại từ trang và `localStorage` dùng chung giữa các phân hệ.

## 5.3. Danh sách test case và kết quả

### 5.3.1. Kiểm tra liên kết

| Mã | Nội dung và thao tác | Kết quả mong đợi | Kết quả chạy |
|---|---|---|---|
| LINK-01 | Quét các thuộc tính `href`, `src`, `action` tĩnh trong HTML | Đường dẫn nội bộ trỏ tới tệp có thật | **Đạt** — 394 tham chiếu tĩnh được kiểm tra, không có đường dẫn hỏng. Các biểu thức mẫu JavaScript như `${...}` được loại khỏi phép quét tĩnh. |
| LINK-02 | Mở 21 địa chỉ chính thuộc Register, Customer, Manager và Staff | Trang trả về HTTP 200 | **Đạt** — 21/21 trang mở được. |
| LINK-03 | Mở lần lượt 27 trang bằng trình duyệt với đúng vai trò | Trang tải xong và không phát sinh lỗi JavaScript chưa xử lý | **Đạt** — 27/27 trang tải xong, không ghi nhận lỗi JavaScript. |

### 5.3.2. Kiểm tra chức năng

| Mã | Nội dung và thao tác | Kết quả mong đợi | Kết quả chạy |
|---|---|---|---|
| EF-01 | Mở thực đơn Customer | Danh sách sản phẩm được hiển thị | **Đạt** — hiển thị 32 sản phẩm ban đầu. |
| EF-02 | Gõ “cà phê muối” vào ô tìm kiếm | Chỉ hiển thị món phù hợp | **Đạt** — còn 1 sản phẩm đúng tên. |
| EF-03 | Nhấn vào ảnh sản phẩm trên thực đơn | Mở trang chi tiết món | **Đạt** — trang chi tiết hiển thị tên, mô tả, sao đánh giá và 3 món liên quan. |
| EF-04 | Nhấn biểu tượng giỏ hàng của món | Thêm đúng món vào giỏ | **Đạt** — giỏ lưu Cà phê muối với số lượng 1. |
| EF-05 | Mở trang đặt hàng khi Bàn 02 đang sử dụng, Bàn 03 đặt trước | Hiển thị đủ bàn; bàn không trống không được chọn | **Đạt** — có 12 bàn; Bàn 02 và Bàn 03 bị khóa chọn và hiện đúng trạng thái. |
| EF-06 | Thử đặt tại Bàn 02 đang sử dụng | Hệ thống từ chối đơn, không xóa giỏ | **Đạt** — không phát sinh đơn; giỏ vẫn còn sản phẩm. |
| EF-07 | Đặt một món tại Bàn 04 đang trống | Lưu đơn mới, thông tin khách và trạng thái bàn | **Đạt** — đơn `pending` được ghi vào `orders`, có tên, email, số điện thoại khách; tổng 35.000đ; giỏ được xóa và Bàn 04 chuyển thành “Đặt trước”. |
| EF-08 | Staff mở hàng đợi và bấm bắt đầu chuẩn bị | Đơn chuyển từ chờ xác nhận sang đang chuẩn bị | **Đạt** — đơn dùng chung đổi sang `preparing`; giao diện Staff hiện “Đang chuẩn bị”. |
| EF-09 | Manager mở cùng đơn rồi chuyển sang hoàn thành | Trạng thái được cập nhật trên cùng đơn | **Đạt** — Manager đọc được trạng thái `preparing`, chuyển đơn sang `completed`; bàn của đơn được giải phóng. |
| EF-10 | Mở Thống kê sau khi hoàn thành đơn 35.000đ | Doanh thu, số đơn và món bán chạy phản ánh đơn vừa xử lý | **Đạt** — doanh thu 35.000đ, 1 đơn, món bán chạy là Cà phê muối. |
| EF-11 | Customer mở lịch sử đơn hàng sau khi Manager hoàn thành đơn | Khách thấy đúng đơn và trạng thái mới nhất | **Đạt** — lịch sử hiển thị đơn ở trạng thái “Đã hoàn thành”. |
| EF-12 | Staff mở Thanh toán và xác nhận thanh toán cho đơn hoàn thành | Đơn được đánh dấu đã thanh toán | **Đạt** — trường `paid` thành `true`, nút xác nhận không còn hiển thị cho đơn đó. |
| EF-13 | Manager mở danh sách khách sau khi khách đặt đơn | Thông tin liên hệ của khách được lưu và tra cứu được | **Đạt** — danh sách có email `tester_coffee@example.com` và số `0912345678`. |
| EF-14 | Manager mở Quản lý bàn và đổi Bàn 02 sang “Đang sử dụng” | Manager có thể cập nhật trạng thái bàn | **Đạt** — giao diện có 12 bàn và 12 bộ điều khiển trạng thái; Bàn 02 được lưu đúng trạng thái. |
| EF-15 | Staff mở Quản lý bàn, xem Bàn 02 rồi đổi Bàn 05 sang “Đặt trước” | Staff thấy dữ liệu Manager đã đổi và có thể cập nhật bàn | **Đạt** — Staff thấy Bàn 02 đang sử dụng; Bàn 05 được lưu là đặt trước. |
| EF-16 | Customer mở trang chọn bàn sau hai thay đổi trên | Bảng bàn hiển thị dữ liệu chung và khóa bàn không trống | **Đạt** — hiển thị 12 bàn; Bàn 02 và Bàn 05 không chọn được, nhãn trạng thái đúng. |
| EF-17 | Tạo dữ liệu có một đơn cũ và một đơn mới rồi mở danh sách ở Customer, Staff, Manager | Đơn mới nhất xuất hiện ở đầu danh sách | **Đạt** — cả ba giao diện đều đưa `DH-NEW-TEST` lên đầu. |
| EF-18 | Manager mở danh sách sản phẩm | Danh sách quản lý khớp dữ liệu mẫu | **Đạt** — hiển thị 32 sản phẩm. |
| EF-19 | Manager thêm “Test Latte”, sau đó tìm món ở thực đơn Customer | Mã sản phẩm mới được tạo và đồng bộ qua Customer | **Đạt** — Manager tạo `P033`; Customer tìm thấy món vừa thêm. |
| EF-20 | Manager thử thêm sản phẩm trùng tên “Americano” | Từ chối tên trùng và giữ nguyên dữ liệu | **Đạt** — hiện thông báo tên sản phẩm đã tồn tại; số lượng dữ liệu không tăng. |

### 5.3.3. Kiểm tra dữ liệu nhập

| Mã | Dữ liệu/thao tác kiểm thử | Kết quả mong đợi | Kết quả chạy |
|---|---|---|---|
| DV-01 | Gửi biểu mẫu đăng ký khi để trống | Các trường bắt buộc được đánh dấu lỗi | **Đạt** — cả 6/6 trường đăng ký được đánh dấu. |
| DV-02 | Nhập email `bad-email` | Báo email sai định dạng và không tạo tài khoản | **Đạt** — email được đánh dấu lỗi. |
| DV-03 | Nhập số điện thoại có chữ hoặc thiếu chữ số | Chỉ chấp nhận 10 chữ số bắt đầu bằng 0 | **Đạt** — cả `09A2345678` và số 9 chữ số đều bị từ chối. |
| DV-04 | Nhập mật khẩu ngắn hơn 6 ký tự | Hiện yêu cầu tối thiểu 6 ký tự | **Đạt** — trường mật khẩu bị đánh dấu lỗi. |
| DV-05 | Thử mật khẩu lần lượt thiếu chữ hoa, chữ thường, chữ số hoặc ký tự đặc biệt | Mỗi điều kiện thiếu được báo tương ứng | **Đạt** — cả 4 trường hợp đều bị từ chối và hiện đúng loại lỗi. |
| DV-06 | Nhập mật khẩu xác nhận khác mật khẩu đăng ký | Báo hai mật khẩu chưa khớp | **Đạt** — trường xác nhận bị đánh dấu lỗi. |
| DV-07 | Dùng tên đăng nhập sai quy tắc hoặc đã được sử dụng | Báo lỗi, không tạo tài khoản mới | **Đạt** — username không hợp lệ và username trùng đều bị chặn. |
| DV-08 | Đăng nhập tài khoản chưa tồn tại | Hiện thông báo cần đăng ký tài khoản | **Đạt** — hệ thống báo không tìm thấy tài khoản. |
| DV-09 | Đăng nhập tài khoản có thật nhưng bỏ trống mật khẩu | Yêu cầu nhập mật khẩu | **Đạt** — trường mật khẩu được đánh dấu lỗi. |
| DV-10 | Đăng nhập tài khoản thử bằng mật khẩu sai | Báo sai mật khẩu và không tạo phiên | **Đạt** — hiện “Mật khẩu không đúng”; không có phiên đăng nhập mới. |
| DV-11 | Khôi phục mật khẩu với email hoặc số điện thoại không khớp tài khoản | Từ chối đổi mật khẩu | **Đạt** — cả email sai và số điện thoại sai đều bị từ chối. |
| DV-12 | Khôi phục bằng đúng username, email, số điện thoại và mật khẩu mới hợp lệ | Cập nhật mật khẩu, quay về đăng nhập, không tự đăng nhập | **Đạt** — mã băm mật khẩu thay đổi; phiên đăng nhập vẫn trống; mật khẩu cũ bị từ chối và mật khẩu mới đăng nhập được. |
| DV-13 | Đăng nhập bằng tài khoản demo `admin` và `staff` | Chuyển đúng khu vực theo vai trò | **Đạt** — `admin` vào Manager, `staff` vào Staff. |

## 5.4. Tổng hợp kết quả

- Kiểm tra liên kết và tải trang: **3/3 đạt**.
- Kiểm tra chức năng: **20/20 đạt**.
- Kiểm tra dữ liệu nhập và tài khoản: **13/13 đạt**.
- Tổng cộng: **36/36 ca đạt** trong phạm vi đã chạy.

## 5.5. Ghi chú phạm vi

Website hiện dùng `localStorage` trên trình duyệt để lưu tài khoản, đơn hàng, bàn và sản phẩm. Vì vậy, kết quả trên xác nhận luồng liên kết giữa các phân hệ khi cùng chạy trên một trình duyệt và cùng nguồn website; chưa xác nhận đồng bộ giữa nhiều thiết bị hoặc nhiều trình duyệt. Chức năng quên mật khẩu đã đổi được mật khẩu lưu cục bộ, nhưng hiện chưa gửi email hoặc mã xác minh qua máy chủ.
