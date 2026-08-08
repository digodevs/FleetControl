import { FormEvent, useState } from 'react';
import { Car, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { login, register } from '../services/authApi';

type AuthMode = 'login' | 'register';

export function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const isRegister = mode === 'register';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = isRegister
        ? await register({ name: name.trim(), email: email.trim(), password })
        : await login({ email: email.trim(), password });

      setSession(response.accessToken, response.refreshToken);
      navigate('/dashboard', { replace: true });
    } catch {
      setError(isRegister ? 'Não foi possível criar a conta. Confira os dados e tente novamente.' : 'E-mail ou senha inválidos.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-surface-950 text-slate-100 lg:grid-cols-[minmax(0,1fr)_480px]">
      <section className="hidden border-r border-slate-800 bg-surface-900 px-10 py-12 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-accent-500 text-surface-950">
              <Car size={25} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-400">FleetControl</p>
              <p className="text-sm text-slate-400">Gestão profissional de frotas</p>
            </div>
          </div>

          <div className="mt-20 max-w-xl">
            <p className="text-sm font-medium text-sky-300">Painel administrativo</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">Controle sua frota com indicadores reais e operação segura.</h1>
            <p className="mt-5 text-base leading-7 text-slate-400">
              Entre para acessar dashboard, veículos e recursos administrativos do FleetControl.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500">API protegida por JWT, dados persistidos em PostgreSQL e migrations Flyway.</p>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded bg-accent-500 text-surface-950">
              <Car size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-400">FleetControl</p>
              <p className="text-xs text-slate-400">Gestão profissional de frotas</p>
            </div>
          </div>

          <div className="rounded border border-slate-800 bg-surface-900 p-6 shadow-xl shadow-black/20">
            <div>
              <h2 className="text-xl font-semibold text-white">{isRegister ? 'Criar conta' : 'Entrar'}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {isRegister ? 'O primeiro usuário cadastrado será administrador.' : 'Use sua conta para acessar o painel.'}
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {isRegister ? <Input label="Nome" value={name} onChange={(event) => setName(event.target.value)} required /> : null}
              <Input label="E-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              <Input label="Senha" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />

              {error ? <p className="rounded border border-red-900/70 bg-red-950/30 px-3 py-2 text-sm text-red-100">{error}</p> : null}

              <Button className="w-full" type="submit" disabled={isSubmitting} icon={isRegister ? <UserPlus size={17} /> : <LogIn size={17} />}>
                {isSubmitting ? 'Processando...' : isRegister ? 'Criar conta' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-5 border-t border-slate-800 pt-5 text-center">
              <button
                type="button"
                className="text-sm font-medium text-accent-400 hover:text-accent-300"
                onClick={() => {
                  setMode(isRegister ? 'login' : 'register');
                  setError('');
                }}
              >
                {isRegister ? 'Já tenho uma conta' : 'Criar primeira conta'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
