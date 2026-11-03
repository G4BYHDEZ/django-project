import { useFormik } from 'formik';
import { Button, Form } from 'semantic-ui-react';
import * as Yup from 'yup';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginApi } from '../api/user.js';
import { useAuth } from '../hooks/useAuth.js';

export function Login() {
  const { auth, login } = useAuth();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Escribe un correo válido.').required('El correo es obligatorio.'),
      password: Yup.string().required('La contraseña es obligatoria.'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const tokens = await loginApi(values);
        await login(tokens.access, tokens.refresh);
        navigate('/dashboard', { replace: true });
      } catch (error) {
        toast.error(error.message || 'No fue posible iniciar sesión.');
      } finally {
        setSubmitting(false);
      }
    },
  });
  if (auth) return <Navigate to="/dashboard" replace />;

  return (
    <section className="auth-card">
      <div className="brand brand-large"><span className="brand-mark">M</span> Mesa & Mercado</div>
      <p className="eyebrow">QUÉ BUENO VERTE</p>
      <h1>Inicia sesión</h1>
      <p className="muted">Entra a tu espacio y continúa donde lo dejaste.</p>
      <Form onSubmit={formik.handleSubmit}>
        <Form.Input label="Correo electrónico" name="email" type="email" placeholder="hola@ejemplo.com" autoComplete="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.email && formik.errors.email)} />
        {formik.touched.email && formik.errors.email && <small className="field-error">{formik.errors.email}</small>}
        <Form.Input label="Contraseña" name="password" type="password" placeholder="Tu contraseña" autoComplete="current-password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} error={Boolean(formik.touched.password && formik.errors.password)} />
        {formik.touched.password && formik.errors.password && <small className="field-error">{formik.errors.password}</small>}
        <Button className="primary-action" type="submit" fluid loading={formik.isSubmitting} disabled={formik.isSubmitting}>Entrar a mi cuenta</Button>
      </Form>
      <p className="form-footer">¿Primera vez aquí? <Link to="/register">Crea una cuenta</Link></p>
    </section>
  );
}
