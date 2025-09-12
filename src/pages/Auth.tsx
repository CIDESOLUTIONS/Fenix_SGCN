import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Building, User, Mail, Phone, Lock, ArrowLeft, KeyRound } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { signIn, signUp, user, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await signIn(loginEmail, loginPassword);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Credenciales incorrectas. Verifica tu email y contraseña.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Por favor confirma tu email antes de iniciar sesión.');
        } else {
          setError(error.message);
        }
      } else {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión exitosamente.",
        });
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (signupPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(signupEmail, signupPassword, fullName, companyName, position, phone);
      
      if (error) {
        if (error.message.includes('User already registered')) {
          setError('Este email ya está registrado. Intenta iniciar sesión.');
        } else {
          setError(error.message);
        }
      } else {
        toast({
          title: "¡Registro exitoso!",
          description: "Revisa tu email para confirmar tu cuenta.",
        });
      }
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await resetPassword(resetEmail);
      
      if (error) {
        setError(error.message);
      } else {
        toast({
          title: "Email enviado",
          description: "Revisa tu correo para restablecer tu contraseña.",
        });
        setShowResetPassword(false);
        setResetEmail('');
      }
    } catch (err) {
      setError('Error inesperado. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-center flex-1">
            <img 
              src="/src/assets/phoenix-logo.png" 
              alt="Fenix-SGCN" 
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-white mb-2">Fenix-SGCN</h1>
            <p className="text-white/80">Sistema de Gestión de Continuidad de Negocio</p>
          </div>
          <div className="w-10"></div>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 border-white/20">
          {showResetPassword ? (
            <div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5" />
                  Restablecer Contraseña
                </CardTitle>
                <CardDescription>
                  Ingresa tu email para restablecer tu contraseña
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="tu@empresa.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowResetPassword(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                      {isLoading ? 'Enviando...' : 'Enviar'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </div>
          ) : (
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Registrarse</TabsTrigger>
              </TabsList>

            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Iniciar Sesión
                </CardTitle>
                <CardDescription>
                  Accede a tu plataforma SGCN
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@empresa.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                  
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-muted-foreground"
                      onClick={() => setShowResetPassword(true)}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                  </div>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Crear Cuenta Empresarial
                </CardTitle>
                <CardDescription>
                  Registra tu empresa en Fenix-SGCN
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Nombre Completo *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="full-name"
                          type="text"
                          placeholder="Juan Pérez"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Empresa *</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company-name"
                          type="text"
                          placeholder="Mi Empresa S.A.S."
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">Cargo</Label>
                      <Input
                        id="position"
                        type="text"
                        placeholder="Gerente de Riesgos"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+57 300 123 4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email Corporativo *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="tu@empresa.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Contraseña *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Contraseña *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
            </Tabs>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Auth;