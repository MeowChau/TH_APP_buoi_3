export function validateProfile(fields: {
  name: string;
  email: string;
  phone: string;
}) {
  const errors: { name?: string; email?: string; phone?: string } = {};
  if (fields.name.trim().length < 2 || fields.name.trim().length > 80) {
    errors.name = 'Họ tên cần từ 2 đến 80 ký tự.';
  }
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim()) ||
    fields.email.trim().length > 120
  ) {
    errors.email = 'Nhập địa chỉ email hợp lệ.';
  }
  if (!/^(0\d{9}|\+84\d{9})$/.test(fields.phone.replace(/[\s.-]/g, ''))) {
    errors.phone = 'Nhập 10 chữ số bắt đầu bằng 0 hoặc +84 và 9 chữ số.';
  }
  return errors;
}
