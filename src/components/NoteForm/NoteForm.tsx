import css from './NoteForm.module.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { NoteTag } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteServise';

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters')
    .required('Title is required'),
  content: Yup.string()
    .max(500, 'Content must be at most 500 characters')
    .required('Content is required'),
  tag: Yup.mixed<NoteTag>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required')
});

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: "Todo"
}

interface NoteFormProps {
  onClose: () => void;
}
export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    }
  });

  const handleSubmit = (values: NoteFormValues) => {
    mutation.mutate(values);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
    <Form className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <Field id="title" type="text" name="title" className={css.input} />
        <ErrorMessage name="title" className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <Field
          as="textarea"
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
        />
        <ErrorMessage name="content" className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <Field
          as="select"
          id="tag"
          name="tag"
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </Field>
        <ErrorMessage name="tag" className={css.error} />
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} >
          Create note
        </button>
      </div>
    </Form >
  </Formik>)
}