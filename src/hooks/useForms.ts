import { useEffect, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { validateAssignment, validateProfile } from '../utils/validators';
import { parseLocalDate } from '../utils/date';
import type { AssignmentInput, ProfileInput } from '../types';
export function useProfileForm() {
  const data = useAppData();
  const [input, setInput] = useState<ProfileInput>({
    fullName: '',
    email: '',
    phone: '',
  });
  const [initialized, setInitialized] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileInput, string>>
  >({});
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (data.student && !initialized) {
      setInput({
        fullName: data.student.fullName,
        email: data.student.email,
        phone: data.student.phone,
      });
      setInitialized(true);
    }
  }, [data.student, initialized]);
  const setField = (key: keyof ProfileInput, value: string) =>
    setInput(previous => ({ ...previous, [key]: value }));
  const save = async () => {
    const next = validateProfile(input);
    setErrors(next);
    if (Object.keys(next).length) {
      return false;
    }
    setSaving(true);
    try {
      await data.updateProfile(input);
      return true;
    } finally {
      setSaving(false);
    }
  };
  return {
    ...data.studentQuery,
    initialized,
    input,
    setField,
    errors,
    saving,
    save,
  };
}
export function useAssignmentForm() {
  const data = useAppData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [due, setDue] = useState('');
  const [errors, setErrors] = useState<
    Partial<Record<keyof AssignmentInput, string>>
  >({});
  const [saving, setSaving] = useState(false);
  const save = async () => {
    const input: AssignmentInput = {
      title,
      description,
      courseId:
        data.courses.find(item => String(item.id) === courseId)?.id ?? '',
      dueDate: parseLocalDate(due) ?? '',
    };
    const next = validateAssignment(input);
    setErrors(next);
    if (Object.keys(next).length) {
      return false;
    }
    setSaving(true);
    try {
      await data.addAssignment(input);
      return true;
    } finally {
      setSaving(false);
    }
  };
  return {
    ...data.courseQuery,
    title,
    setTitle,
    description,
    setDescription,
    courseId,
    setCourseId,
    due,
    setDue,
    errors,
    saving,
    save,
    options: data.courses.map(course => ({
      value: String(course.id),
      label: course.name,
    })),
  };
}
