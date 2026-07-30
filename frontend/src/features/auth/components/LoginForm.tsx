// External packages
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Form from '@radix-ui/react-form';
import { useTranslation } from 'react-i18next';

// Components
import { Button } from '../../../components/ui/Button';
import { FormInput } from '../../../components/ui/FormInput';
import { createUserValidationSchema } from '../../user/validation';

// Context
import { useAuth } from '../context/AuthContext';

// API
import api from '../../../shared/api';

const LoginForm = () => {
  const { login } = useAuth();
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const loginSchema = useMemo(
    () =>
      createUserValidationSchema(t).pick({
        username: true,
        password: true,
      }),
    [t]
  );

  const handleLogin = async (username: string, password: string) => {
    try {
      setLoading(true);
      setServerError('');

      const response = await api.post('/auth/login', {
        username,
        password,
      });

      const { accessToken, refreshToken } = response.data;

      await login(accessToken, refreshToken);

      navigate('/');
    } catch (error: any) {
      if (error.response) {
        setServerError(
          error.response.data?.message ??
            t('ui.login.errors.invalidCredentials')
        );
      } else {
        setServerError(t('ui.login.errors.serverError'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (data: FormData) => {
    setErrors({ username: '', password: '' });
    setServerError('');

    const username = data.get('username') as string;
    const password = data.get('password') as string;

    const result = loginSchema.safeParse({ username, password });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        username: fieldErrors.username?.[0] || '',
        password: fieldErrors.password?.[0] || '',
      });
      return;
    }

    handleLogin(result.data.username, result.data.password);
  };

  return (
    <Form.Root
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        handleSubmit(formData);
      }}
      className="w-full max-w-md rounded-2xl border border-(--color-table-border) bg-(--color-table-surface) px-6 py-8 shadow-(--shadow-card) sm:px-8 sm:py-10"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-(--color-primaryblue) sm:text-4xl">
          {t('ui.login.title')}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-(--color-modal-label)">
          {t('ui.login.subtitle')}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Form.Field name="username" className="w-full">
          <Form.Control asChild>
            <FormInput
              id="login-username"
              data-testid="username"
              type="text"
              autoComplete="username"
              label={t('ui.login.fields.username')}
              placeholder={t('ui.login.placeholders.username')}
              error={!!errors.username}
              errorMessage={errors.username}
            />
          </Form.Control>
        </Form.Field>

        <Form.Field name="password" className="w-full">
          <Form.Control asChild>
            <FormInput
              id="login-password"
              data-testid="password"
              type="password"
              autoComplete="current-password"
              label={t('ui.login.fields.password')}
              placeholder={t('ui.login.placeholders.password')}
              error={!!errors.password}
              errorMessage={errors.password}
            />
          </Form.Control>
        </Form.Field>
      </div>

      {serverError && (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          {serverError}
        </p>
      )}

      <Form.Submit asChild>
        <Button
          data-testid="login-button"
          type="submit"
          className="mt-6 w-full font-semibold"
          disabled={loading}
        >
          {loading ? t('ui.login.loading') : t('ui.login.submit')}
        </Button>
      </Form.Submit>
    </Form.Root>
  );
};

export default LoginForm;
