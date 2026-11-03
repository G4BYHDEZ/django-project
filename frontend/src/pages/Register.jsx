import { useFormik } from 'formik';
import { Button, Form } from 'semantic-ui-react';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerApi } from '../api/user.js';

export function Register() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: { username: '', email: '', password: '', confirmPassword: '' },
    validationSchema: Yup.object({
      username: Yup.string().trim().required('El nombre de usuario es obligatorio.'),
      email: Yup.string().email('Escribe un correo válido.').required('El correo es obligatorio.'),
      password: Yup.string().min(8, 'Usa al menos 8 caracteres.').required('La contraseña es obligatoria.'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Las contraseñas no coinciden.').required('Confirma tu contraseña.'),
    }),
    onSubmit: async ({ confirmPassword, ...values }, { setSubmitting }) => {
      try {
        await registerApi(values);
        toast.success('Tu cuenta está lista. Ya puedes iniciar sesión.');
        navigate('/login', { replace: true });
      } catch (error) {
        toast.error(error.message || 'No fue posible crear la cuenta.');
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <section className="auth-card">
      <div className="brand brand-large"><span className="brand-mark">M</span> Mesa & Mercado</div>
      <p className="eyebrow">EMPIEZA POR AQUÍ</p>
      <h1>Crea tu cuenta</h1>
      <p className="muted">Un espacio sencillo para todo lo que necesitas.</p>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Input label="Nombre de usuario" name="username" placeholder="Tu nombre" autoComplete="username" value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.username && formik.errors.username)} />
        {formik.touched.username && formik.errors.username && <small className="field-error">{formik.errors.username}</small>}
        <Form.Input label="Correo electrónico" name="email" type="email" placeholder="hola@ejemplo.com" autoComplete="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.email && formik.errors.email)} />
        {formik.touched.email && formik.errors.email && <small className="field-error">{formik.errors.email}</small>}
        <Form.Input label="Contraseña" name="password" type="password" placeholder="Mínimo 8 caracteres" autoComplete="new-password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.password && formik.errors.password)} />
        {formik.touched.password && formik.errors.password && <small className="field-error">{formik.errors.password}</small>}
        <Form.Input label="Confirmar contraseña" name="confirmPassword" type="password" placeholder="Repite tu contraseña" autoComplete="new-password" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)} />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && <small className="field-error">{formik.errors.confirmPassword}</small>}
        <Button className="primary-action" type="submit" fluid loading={formik.isSubmitting} disabled={formik.isSubmitting}>Crear cuenta</Button>
      </Form>
      <p className="form-footer">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
    </section>
  );
}
