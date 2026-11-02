# Kịch bản video Thực hành 4 (3–5 phút)

Chạy API và cài APK độc lập theo mục **APK chạy độc lập để demo offline** trong README. Bản này có JS bundle nên khởi động lại khi máy bay không cần Metro. Khi có mạng và cần kết nối API, dùng USB với `adb reverse tcp:3000 tcp:3000` hoặc IP LAN như hướng dẫn. Có thể dùng bản debug với Metro qua USB, nhưng nên dùng APK độc lập cho video kiểm tra cold-start offline.

## Chuẩn bị

- Sao lưu `db.json` trước khi demo nếu muốn giữ dữ liệu ban đầu. Các POST/PATCH thật sẽ sửa file này.
- Đảm bảo có ít nhất hai bài `todo`, ít nhất một bài còn hạn 7 ngày tới; khi cần, sửa hạn trong `db.json` rồi kéo làm mới.
- Sinh viên chính ở `/students/1`. Lưu giờ tự động trên PC và điện thoại.
- Kịch bản 1 cần một lần cài/môi trường thử chưa có cache TH4. Chỉ xóa dữ liệu ứng dụng nếu chấp nhận mất cache và thao tác chưa đồng bộ trên thiết bị đó; không cần xóa thư mục dự án.

## Bảy kịch bản

| #   | Thao tác                                                                                                                                                                       | Quan sát cần quay                                                                                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Tắt terminal json-server, mở app lần đầu chưa cache; sau đó bật `npm.cmd run api` và bấm Thử lại.                                                                              | Hiện lỗi và nút Thử lại; app không crash; sau khi thử lại tải được dữ liệu.                                                              |
| 2   | Sau khi tải đủ 5 tab, bật chế độ máy bay, đóng/mở lại app.                                                                                                                     | Dữ liệu cache vẫn có; banner “Bạn đang offline”; dòng thời điểm cập nhật.                                                                |
| 3   | Khi offline, đánh dấu 2 bài xong; thêm 1 bài có tiêu đề và hạn hợp lệ.                                                                                                         | Trạng thái đổi ngay, bài mới xuất hiện, nhãn “Chưa đồng bộ”; Tổng quan có 3 thay đổi; badge bài chưa xong đổi theo.                      |
| 4   | Tắt chế độ máy bay, chờ kết nối lại; nếu USB bị ngắt, chạy lại hai lệnh `adb reverse` trong README.                                                                            | Tự gửi 3 thao tác theo thứ tự; nhãn biến mất; thông báo “Đã đồng bộ 3 thay đổi”; mở `db.json` thấy POST/PATCH đúng, không trùng bản ghi. |
| 5   | Offline: sửa tên trong Cá nhân rồi lưu. Trên PC sửa tên khác tại `students[0].fullName`, và đặt `updatedAt` là thời điểm ISO sau thao tác offline. Lưu file, rồi bật mạng lại. | Tên mới hơn trên server được giữ, tên offline được thay thế, có thông báo xung đột, hàng đợi giảm về 0.                                  |
| 6   | Tab Môn học: tìm `mon-khong-ton-tai`; thử tìm có dấu/không dấu và lọc học kỳ.                                                                                                  | Trạng thái rỗng thân thiện, không lỗi; xóa từ khóa trả lại danh sách; lọc/tìm vẫn dùng được khi offline.                                 |
| 7   | Kéo làm mới Tổng quan, Môn học, Lịch học, Bài tập, Cá nhân và danh sách điểm.                                                                                                  | Spinner refreshing, dữ liệu được tải lại; sửa một tiêu đề bài trên server để thấy thay đổi.                                              |

## Demo thêm hai phần điểm cộng

1. **SQLite:** nâng cấp/cài APK mới bằng `adb install -r`, tải dữ liệu rồi tắt mạng và mở lại. Đổi trạng thái/thêm bài khi offline, khởi động lại để thấy hàng đợi còn nguyên; bật mạng để đồng bộ. README giải thích transaction chuyển dữ liệu AsyncStorage cũ và schema `studyspace.sqlite`. Không xóa dữ liệu ứng dụng khi thử chuyển đổi, vì sẽ xóa cả bản cũ.
2. **Thông báo:** vào Cá nhân → Nhắc hạn bài tập, bật công tắc; Android 13+ cần cấp quyền thông báo, Android 12+ cấp quyền “Báo thức và lời nhắc” để nhắc đúng giờ. Bấm Gửi thông báo thử để thấy thông báo thực tế.
3. Muốn kiểm tra trigger 24 giờ mà không chờ một ngày: thêm một bản ghi kiểm tra trên server có `dueDate` bằng thời điểm hiện tại **cộng 24 giờ và 2 phút**, trạng thái `todo`; kéo làm mới. Sau khoảng 2 phút sẽ nhận nhắc. Đặt cùng thời điểm này bằng ISO có múi giờ (có thể dùng `new Date(Date.now() + 24*60*60*1000 + 2*60*1000).toISOString()` trong Node). Form chỉ nhập ngày/23:59 nên kiểm tra theo phút này cần sửa `db.json` hoặc POST trực tiếp API.
4. Với một bài còn lịch nhắc, đánh dấu xong: số lịch giảm. Đổi `dueDate` trên server rồi làm mới: lịch đổi theo, không thêm trùng. Tắt công tắc cuối demo nếu không muốn tiếp tục nhận nhắc.

## Phần giới thiệu ngắn cuối video mở rộng

Mở một chi tiết môn, buổi học, bài tập, kết quả và quay lại để minh họa từng Stack. Vào Cá nhân → Điểm theo học kỳ; nêu công thức GPA có trọng số và môn F không được tính tín chỉ tích lũy. Thử form tiêu đề trống/ngày quá khứ để thấy validation.

Đây là hướng dẫn thực hiện video; video và link GitHub là phần bài nộp người dùng cần cung cấp hoặc tự xuất bản, không được ứng dụng tự tạo.
