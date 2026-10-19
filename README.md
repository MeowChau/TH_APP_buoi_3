# Study / Space — Sổ tay học tập

Ứng dụng React Native CLI + TypeScript, tạo trực tiếp trong D:\TH_APP\TH3, không dùng Expo và không có thư mục dự án lồng bên trong. Áp dụng skill minimalist-ui: nền trắng ngà, tiêu đề serif, font Be Vietnam Pro, icon Phosphor đậm, viền mảnh và nhãn pastel.

## Cache khi chạy ứng dụng

`npm.cmd start`, `npm.cmd run android` và `npm.cmd run android:build` tự dùng `.cache` ngay trong dự án cho Gradle, npm và các tệp tạm của Java/Metro. Với dự án này, toàn bộ nằm trên ổ D. Không cần đặt biến môi trường thủ công mỗi lần mở terminal.

Lệnh Android chỉ build kiến trúc của thiết bị đang kết nối. Gradle giới hạn một worker, heap Java 1 GB và chạy trình biên dịch Kotlin trong cùng tiến trình để giảm RAM. Biên dịch C++ của ứng dụng dùng job pool một tác vụ.

Build APK debug mà không cài lên điện thoại:

```powershell
npm.cmd run android:build
```

Nếu chạy trực tiếp `android/gradlew.bat` hoặc `npx react-native`, các lệnh đó không đi qua launcher cấu hình cache; ưu tiên các npm script phía trên.

## Chạy Android

Cần Node.js >= 22.11, JDK 17, Android SDK Platform 37, Build Tools 37.0.0 và NDK 27.1.12297006. Khai báo SDK trong ANDROID_HOME hoặc android/local.properties. Các thư viện đã được cài trong phiên này.

Terminal thứ nhất, ngay thư mục TH3:

```powershell
npm.cmd start
```

Terminal thứ hai, sau khi kết nối điện thoại bật USB debugging hoặc mở Android Emulator:

```powershell
adb devices
npm.cmd run android
```

Nếu cài lại mã nguồn trên máy khác, chạy npm.cmd ci trước. Dùng npm.cmd/npx.cmd khi PowerShell chặn các tệp .ps1.

Nếu ổ C thiếu chỗ, chuyển cache và tệp tạm sang ổ D trước khi chạy Gradle:

```powershell
New-Item -ItemType Directory -Force .cache/tmp | Out-Null
$env:GRADLE_USER_HOME = "$PWD/.cache/gradle"
$env:TEMP = "$PWD/.cache/tmp"
$env:TMP = $env:TEMP
cd android
.\gradlew.bat assembleDebug --max-workers=1 -PreactNativeArchitectures=arm64-v8a -Pkotlin.compiler.execution.strategy=in-process
```

Giới hạn kiến trúc trên dành cho điện thoại ARM64. Với máy ảo x86_64, thay bằng -PreactNativeArchitectures=x86_64 hoặc bỏ tham số này. APK debug cần Metro khi chạy phát triển. Máy vẫn cần đủ dung lượng ổ hệ thống và RAM để biên dịch native.

## Chạy iOS

Cần Mac và Xcode. Cài Node dependencies, chạy bundle install, sau đó cd ios và bundle exec pod install. Quay về gốc dự án và chạy npm run ios. Font đã liên kết cho Android và iOS; iOS chưa được biên dịch trong môi trường Windows này.

## Chức năng

| Tab | Nội dung |
| --- | --- |
| Tổng quan | Họ tên, MSSV, tín chỉ, lịch hôm nay, bài sắp hạn, cảnh báo quá hạn, môn đang học |
| Môn học | FlatList, tìm tên/mã có hoặc không dấu, lọc tín chỉ, chi tiết học phần |
| Lịch học | Tuần trước/sau, chọn 7 ngày, quay về hôm nay, giờ/phòng học, lịch lặp hằng tuần |
| Bài tập | Tìm tên bài/môn, lọc trạng thái/quá hạn, cập nhật hoàn thành từ danh sách hoặc chi tiết |
| Cá nhân | Hồ sơ, sửa tên/email/điện thoại, bảng điểm, GPA theo tín chỉ, điểm thành phần |

Bottom Tab Navigator nằm trong Native Stack Navigator. Có 4 màn hình chi tiết nhận ID mục được chọn: môn học, buổi học, bài tập và kết quả học tập; thêm màn hình sửa hồ sơ. Các chi tiết hỗ trợ Back của Android và nút quay lại trên tiêu đề.

Có giao diện trống khi tìm/lọc không có kết quả hoặc ngày không có lịch. Form kiểm tra tên, email và điện thoại Việt Nam. Safe area, bàn phím, nhãn truy cập và tùy chọn giảm chuyển động được hỗ trợ.

## Dữ liệu và lưu trữ

- 5 môn, 15 tín chỉ, 7 buổi học/tuần, 7 bài tập và 5 kết quả. Hồ sơ/điểm là dữ liệu mẫu cho bài thực hành, không kết nối hệ thống trường.
- Các màn hình dùng chung mã môn và ID. Điểm môn có trọng số thành phần; GPA có trọng số tín chỉ. GPA mẫu là 3,40/4 và trung bình là 8,52/10.
- Hạn bài được tạo tương đối với ngày mở lần đầu, sau đó lưu cố định; không tự dịch ngày khi khởi động lại.
- AsyncStorage lưu hồ sơ và bài tập tại khóa @studyspace/state-v1. useState và useEffect quản lý trạng thái, nạp dữ liệu và cập nhật đồng hồ khi mở lại ứng dụng.
- Các lần ghi được xếp hàng để tránh mất thay đổi khi thao tác liên tiếp. Chỉ báo thành công sau khi lưu xong. Lỗi đọc không ghi đè dữ liệu cũ bằng dữ liệu mẫu; lỗi ghi giữ nguyên trạng thái trước đó và có thông báo thử lại.
- Muốn bắt đầu lại, xóa dữ liệu ứng dụng trong Cài đặt Android. Việc này xóa thông tin cá nhân đã chỉnh sửa.

## Mã nguồn

```text
App.tsx
src/
  components/     Giao diện dùng chung, thẻ, tìm kiếm và bộ lọc
  context/        StudyProvider và AsyncStorage
  data/           Dữ liệu mẫu dùng chung
  navigation/     Bottom Tabs và Native Stack
  screens/        5 màn hình chính, 4 chi tiết, sửa hồ sơ
  theme/          Màu và kiểu chữ
  types/          Kiểu dữ liệu và tham số điều hướng
  utils/          Tìm kiếm, ngày/tuần, hạn bài, điểm/GPA, kiểm tra hồ sơ
assets/fonts/     Be Vietnam Pro và giấy phép OFL
__tests__/        Kiểm thử dữ liệu, lưu trữ và mở ứng dụng
android/          Dự án Android native
ios/              Dự án iOS native
```

## Kiểm tra

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test:ci
```

17 kiểm thử đã đạt: quan hệ dữ liệu, tìm kiếm không dấu, hạn bài, tuần qua năm mới, điểm/GPA, dữ liệu nhập, đọc lại khi khởi động, lưu đồng thời, lỗi bộ nhớ và mở ứng dụng với 5 tab. TypeScript, ESLint và bundle Android production đã kiểm tra thành công.

Đã khắc phục cache ghi vào ổ C đầy. Bản Android debug đã build thành công và cài lên điện thoại Android kết nối qua USB. APK nằm ở android/app/build/outputs/apk/debug/app-debug.apk; log kiểm tra mới nhất nằm tại .cache/android-run.stdout.log và .cache/android-run.stderr.log. iOS chưa được kiểm tra biên dịch.

Bundle production:

```powershell
New-Item -ItemType Directory -Force .cache/bundle/assets | Out-Null
npx.cmd react-native bundle --platform android --dev false --entry-file index.js --bundle-output .cache/bundle/index.android.bundle --assets-dest .cache/bundle/assets --max-workers 2
```

.cache chỉ chứa cache và sản phẩm kiểm tra, không cần nộp cùng mã nguồn. Cũng không cần nộp node_modules, .gradle và các thư mục build.

## Skill và tài liệu

Skill nằm tại .agents/skills/minimalist-ui/SKILL.md, cài bằng lệnh:

```powershell
npx.cmd skills add https://github.com/leonxlnx/taste-skill --skill minimalist-ui --agent codex --yes
```

Tham khảo: [React Native CLI](https://reactnative.dev/docs/getting-started-without-a-framework), [Bottom Tabs](https://reactnavigation.org/docs/bottom-tab-navigator/), [Native Stack](https://reactnavigation.org/docs/native-stack-navigator/), [minimalist-ui](https://github.com/leonxlnx/taste-skill).
