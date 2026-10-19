import { Course, Result, Session, StudyState } from '../types';

export const courses: Course[] = [
  {
    id: 'IT3050',
    name: 'Phát triển ứng dụng di động',
    credits: 3,
    lecturer: 'ThS. Nguyễn Hoàng Nam',
    color: 'green',
    progress: 65,
    description:
      'Xây dựng ứng dụng di động đa nền tảng với React Native. Thực hành thiết kế giao diện, điều hướng, quản lý trạng thái và lưu trữ dữ liệu.',
    assessment: 'Chuyên cần 10% · Thực hành 30% · Đồ án 60%',
  },
  {
    id: 'IT3080',
    name: 'Cơ sở dữ liệu',
    credits: 3,
    lecturer: 'TS. Trần Thị Thu Hà',
    color: 'blue',
    progress: 58,
    description:
      'Mô hình dữ liệu quan hệ, thiết kế cơ sở dữ liệu, ngôn ngữ SQL và tối ưu truy vấn. Thực hành trên PostgreSQL.',
    assessment: 'Chuyên cần 10% · Giữa kỳ 30% · Cuối kỳ 60%',
  },
  {
    id: 'IT3010',
    name: 'Cấu trúc dữ liệu và giải thuật',
    credits: 4,
    lecturer: 'TS. Lê Minh Quân',
    color: 'yellow',
    progress: 72,
    description:
      'Phân tích độ phức tạp, cấu trúc dữ liệu tuyến tính, cây, đồ thị và các chiến lược thiết kế giải thuật.',
    assessment: 'Chuyên cần 10% · Bài tập 30% · Cuối kỳ 60%',
  },
  {
    id: 'IT3070',
    name: 'Thiết kế giao diện người dùng',
    credits: 3,
    lecturer: 'ThS. Phạm Ngọc Linh',
    color: 'red',
    progress: 48,
    description:
      'Nghiên cứu người dùng, kiến trúc thông tin, tạo mẫu tương tác và kiểm thử tính khả dụng của giao diện số.',
    assessment: 'Chuyên cần 10% · Nghiên cứu 30% · Đồ án 60%',
  },
  {
    id: 'FL2010',
    name: 'Tiếng Anh chuyên ngành',
    credits: 2,
    lecturer: 'ThS. Võ Thanh Hương',
    color: 'blue',
    progress: 60,
    description:
      'Đọc hiểu tài liệu công nghệ thông tin, viết báo cáo kỹ thuật và thuyết trình bằng tiếng Anh.',
    assessment: 'Chuyên cần 10% · Giữa kỳ 30% · Cuối kỳ 60%',
  },
];
export const sessions: Session[] = [
  {
    id: 's1',
    courseId: 'IT3050',
    day: 1,
    start: '07:30',
    end: '10:00',
    room: 'B1.302',
    topic: 'Bottom Tab Navigation và Stack Navigation',
    type: 'Thực hành',
  },
  {
    id: 's2',
    courseId: 'IT3080',
    day: 1,
    start: '13:00',
    end: '15:30',
    room: 'A2.205',
    topic: 'Chuẩn hóa cơ sở dữ liệu',
    type: 'Lý thuyết',
  },
  {
    id: 's3',
    courseId: 'IT3010',
    day: 2,
    start: '07:30',
    end: '10:50',
    room: 'A1.401',
    topic: 'Cây nhị phân tìm kiếm và cây AVL',
    type: 'Lý thuyết',
  },
  {
    id: 's4',
    courseId: 'IT3070',
    day: 3,
    start: '09:10',
    end: '11:40',
    room: 'B2.201',
    topic: 'Thiết kế prototype và kiểm thử người dùng',
    type: 'Thực hành',
  },
  {
    id: 's5',
    courseId: 'FL2010',
    day: 4,
    start: '13:00',
    end: '14:40',
    room: 'C1.103',
    topic: 'Presenting a software project',
    type: 'Thảo luận',
  },
  {
    id: 's6',
    courseId: 'IT3050',
    day: 5,
    start: '07:30',
    end: '10:00',
    room: 'B1.302',
    topic: 'Lưu trữ dữ liệu với AsyncStorage',
    type: 'Thực hành',
  },
  {
    id: 's7',
    courseId: 'IT3080',
    day: 5,
    start: '13:00',
    end: '15:30',
    room: 'B1.203',
    topic: 'Thực hành JOIN, GROUP BY và truy vấn con',
    type: 'Thực hành',
  },
];
export const results: Result[] = [
  {
    id: 'r1',
    courseId: 'IT3050',
    semester: 'Học kỳ hiện tại',
    parts: [
      { name: 'Chuyên cần', weight: 10, score: 10 },
      { name: 'Thực hành', weight: 30, score: 8.5 },
      { name: 'Đồ án', weight: 60, score: 9 },
    ],
    feedback:
      'Điều hướng mạch lạc, tổ chức thành phần rõ ràng. Tiếp tục cải thiện xử lý lỗi và khả năng truy cập.',
  },
  {
    id: 'r2',
    courseId: 'IT3080',
    semester: 'Học kỳ hiện tại',
    parts: [
      { name: 'Chuyên cần', weight: 10, score: 9 },
      { name: 'Giữa kỳ', weight: 30, score: 8 },
      { name: 'Cuối kỳ', weight: 60, score: 8.5 },
    ],
    feedback:
      'Thiết kế lược đồ tốt. Cần luyện thêm truy vấn lồng nhau và phân tích kế hoạch thực thi.',
  },
  {
    id: 'r3',
    courseId: 'IT3010',
    semester: 'Học kỳ hiện tại',
    parts: [
      { name: 'Chuyên cần', weight: 10, score: 10 },
      { name: 'Bài tập', weight: 30, score: 8 },
      { name: 'Cuối kỳ', weight: 60, score: 8 },
    ],
    feedback:
      'Nắm vững cấu trúc dữ liệu cơ bản. Nên bổ sung các trường hợp biên khi kiểm thử giải thuật.',
  },
  {
    id: 'r4',
    courseId: 'IT3070',
    semester: 'Học kỳ hiện tại',
    parts: [
      { name: 'Chuyên cần', weight: 10, score: 10 },
      { name: 'Nghiên cứu', weight: 30, score: 9 },
      { name: 'Đồ án', weight: 60, score: 9 },
    ],
    feedback:
      'Bố cục có hệ thống, lựa chọn màu sắc phù hợp. Phần nghiên cứu người dùng có dẫn chứng cụ thể.',
  },
  {
    id: 'r5',
    courseId: 'FL2010',
    semester: 'Học kỳ hiện tại',
    parts: [
      { name: 'Chuyên cần', weight: 10, score: 9 },
      { name: 'Giữa kỳ', weight: 30, score: 7 },
      { name: 'Cuối kỳ', weight: 60, score: 8 },
    ],
    feedback:
      'Đọc hiểu tài liệu tốt. Luyện tập thêm cách trình bày và phát âm thuật ngữ chuyên ngành.',
  },
];
export function createInitialState(now = new Date()): StudyState {
  const due = (offset: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + offset);
    date.setHours(23, 59, 0, 0);
    return date.toISOString();
  };
  return {
    version: 1,
    profile: {
      studentId: '2351120042',
      name: 'Nguyễn Minh Anh',
      email: 'minhanh.nguyen@sv.edu.vn',
      phone: '0912345678',
      className: 'CNTT K23A',
      major: 'Công nghệ thông tin',
      school: 'Khoa Công nghệ thông tin',
    },
    assignments: [
      {
        id: 'a1',
        courseId: 'IT3050',
        title: 'Ứng dụng quản lý học tập',
        due: due(1),
        completed: false,
        description:
          'Xây dựng ứng dụng React Native hỗ trợ sinh viên quản lý môn học, thời khóa biểu, bài tập và kết quả học tập.',
        requirements: [
          'Có 5 tab chính và các màn hình chi tiết bằng Native Stack.',
          'Dùng FlatList, useState và useEffect.',
          'Lưu thông tin cá nhân và trạng thái bài tập bằng AsyncStorage.',
          'Nộp mã nguồn, báo cáo và video demo.',
        ],
        format: 'Link kho mã nguồn và báo cáo PDF',
      },
      {
        id: 'a2',
        courseId: 'IT3080',
        title: 'Thiết kế cơ sở dữ liệu thư viện',
        due: due(2),
        completed: false,
        description:
          'Phân tích và thiết kế cơ sở dữ liệu cho hệ thống quản lý thư viện trường đại học.',
        requirements: [
          'Vẽ sơ đồ ERD với sách, độc giả, phiếu mượn.',
          'Chuẩn hóa các bảng đến dạng chuẩn 3NF.',
          'Viết script tạo bảng và 10 truy vấn SQL.',
        ],
        format: 'Tệp .sql và báo cáo PDF',
      },
      {
        id: 'a3',
        courseId: 'IT3010',
        title: 'Cài đặt cây nhị phân tìm kiếm',
        due: due(4),
        completed: false,
        description:
          'Cài đặt cấu trúc cây nhị phân tìm kiếm và so sánh hiệu năng với mảng có thứ tự.',
        requirements: [
          'Cài đặt thêm, xóa, tìm kiếm và duyệt cây.',
          'Phân tích độ phức tạp của từng thao tác.',
          'Kiểm thử cây rỗng, cây một phần tử và dữ liệu trùng.',
        ],
        format: 'Mã nguồn C++ hoặc Java và báo cáo',
      },
      {
        id: 'a4',
        courseId: 'IT3070',
        title: 'Prototype ứng dụng sinh viên',
        due: due(6),
        completed: false,
        description:
          'Thiết kế prototype tương tác cho ứng dụng hỗ trợ sinh viên trong hoạt động học tập.',
        requirements: [
          'Phác thảo luồng người dùng.',
          'Thiết kế ít nhất 5 màn hình trên Figma.',
          'Kiểm thử với 3 người dùng và tổng hợp nhận xét.',
        ],
        format: 'Link Figma và báo cáo PDF',
      },
      {
        id: 'a5',
        courseId: 'FL2010',
        title: 'Thuyết trình về một sản phẩm số',
        due: due(8),
        completed: false,
        description:
          'Chuẩn bị bài thuyết trình tiếng Anh giới thiệu một sản phẩm công nghệ và trải nghiệm người dùng.',
        requirements: [
          'Thuyết trình từ 5 đến 7 phút.',
          'Chuẩn bị 8–10 slide.',
          'Sử dụng ít nhất 10 thuật ngữ chuyên ngành.',
        ],
        format: 'Slide PDF và video MP4',
      },
      {
        id: 'a6',
        courseId: 'IT3050',
        title: 'Bài thực hành: giao diện đăng nhập',
        due: due(-2),
        completed: true,
        description:
          'Xây dựng giao diện đăng nhập và kiểm tra dữ liệu nhập trên React Native.',
        requirements: [
          'Có trường email và mật khẩu.',
          'Hiển thị lỗi nhập liệu.',
          'Giao diện thích ứng với bàn phím.',
        ],
        format: 'Link kho mã nguồn',
      },
      {
        id: 'a7',
        courseId: 'IT3010',
        title: 'Phân tích độ phức tạp giải thuật',
        due: due(-1),
        completed: false,
        description:
          'Đánh giá độ phức tạp thời gian và bộ nhớ của các giải thuật sắp xếp đã học.',
        requirements: [
          'So sánh Bubble Sort, Merge Sort và Quick Sort.',
          'Đo thời gian trên 3 kích thước dữ liệu.',
          'Giải thích sự khác nhau giữa trường hợp tốt và xấu nhất.',
        ],
        format: 'Báo cáo PDF',
      },
    ],
  };
}
