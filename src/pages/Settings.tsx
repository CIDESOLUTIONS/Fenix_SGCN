import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Settings2, Shield, Database, Users, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const [ldapEnabled, setLdapEnabled] = useState(false);
  const [adEnabled, setAdEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // LDAP Configuration
  const [ldapServer, setLdapServer] = useState('');
  const [ldapPort, setLdapPort] = useState('389');
  const [ldapBaseDN, setLdapBaseDN] = useState('');
  const [ldapBindDN, setLdapBindDN] = useState('');
  const [ldapBindPassword, setLdapBindPassword] = useState('');
  const [ldapUserFilter, setLdapUserFilter] = useState('');
  
  // Active Directory Configuration
  const [adDomain, setAdDomain] = useState('');
  const [adServer, setAdServer] = useState('');
  const [adServiceAccount, setAdServiceAccount] = useState('');
  const [adServicePassword, setAdServicePassword] = useState('');

  const handleLdapSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to save LDAP configuration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configuración LDAP guardada",
        description: "La configuración LDAP se ha guardado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración LDAP.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to save AD configuration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configuración AD guardada",
        description: "La configuración de Active Directory se ha guardado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración de Active Directory.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async (type: 'ldap' | 'ad') => {
    setIsLoading(true);
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Conexión exitosa",
        description: `La conexión a ${type.toUpperCase()} se estableció correctamente.`,
      });
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: `No se pudo conectar a ${type.toUpperCase()}.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Configuración del Sistema</h1>
      </div>

      <Tabs defaultValue="authentication" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="authentication">Autenticación</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Integración con Directorio
              </CardTitle>
              <CardDescription>
                Configure la integración con LDAP o Active Directory para autenticación centralizada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  La integración con directorio permite a los usuarios autenticarse usando sus credenciales corporativas existentes.
                </AlertDescription>
              </Alert>

              <Tabs defaultValue="ldap" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ldap">LDAP</TabsTrigger>
                  <TabsTrigger value="active-directory">Active Directory</TabsTrigger>
                </TabsList>

                <TabsContent value="ldap" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Configuración LDAP</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure la conexión a su servidor LDAP
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={ldapEnabled}
                        onCheckedChange={setLdapEnabled}
                      />
                      {ldapEnabled && <Badge variant="secondary">Habilitado</Badge>}
                    </div>
                  </div>

                  {ldapEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="ldap-server">Servidor LDAP</Label>
                        <Input
                          id="ldap-server"
                          placeholder="ldap.empresa.com"
                          value={ldapServer}
                          onChange={(e) => setLdapServer(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ldap-port">Puerto</Label>
                        <Input
                          id="ldap-port"
                          placeholder="389"
                          value={ldapPort}
                          onChange={(e) => setLdapPort(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="ldap-base-dn">Base DN</Label>
                        <Input
                          id="ldap-base-dn"
                          placeholder="dc=empresa,dc=com"
                          value={ldapBaseDN}
                          onChange={(e) => setLdapBaseDN(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ldap-bind-dn">Bind DN</Label>
                        <Input
                          id="ldap-bind-dn"
                          placeholder="cn=admin,dc=empresa,dc=com"
                          value={ldapBindDN}
                          onChange={(e) => setLdapBindDN(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ldap-bind-password">Contraseña Bind</Label>
                        <Input
                          id="ldap-bind-password"
                          type="password"
                          value={ldapBindPassword}
                          onChange={(e) => setLdapBindPassword(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="ldap-user-filter">Filtro de Usuario</Label>
                        <Input
                          id="ldap-user-filter"
                          placeholder="(uid={username})"
                          value={ldapUserFilter}
                          onChange={(e) => setLdapUserFilter(e.target.value)}
                        />
                      </div>

                      <div className="md:col-span-2 flex gap-2">
                        <Button
                          onClick={() => testConnection('ldap')}
                          variant="outline"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Probando...' : 'Probar Conexión'}
                        </Button>
                        <Button
                          onClick={handleLdapSave}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Guardando...' : 'Guardar Configuración'}
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="active-directory" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Configuración Active Directory</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure la conexión a su dominio de Active Directory
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={adEnabled}
                        onCheckedChange={setAdEnabled}
                      />
                      {adEnabled && <Badge variant="secondary">Habilitado</Badge>}
                    </div>
                  </div>

                  {adEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="ad-domain">Dominio</Label>
                        <Input
                          id="ad-domain"
                          placeholder="empresa.local"
                          value={adDomain}
                          onChange={(e) => setAdDomain(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ad-server">Servidor AD</Label>
                        <Input
                          id="ad-server"
                          placeholder="dc01.empresa.local"
                          value={adServer}
                          onChange={(e) => setAdServer(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ad-service-account">Cuenta de Servicio</Label>
                        <Input
                          id="ad-service-account"
                          placeholder="svc-fenix@empresa.local"
                          value={adServiceAccount}
                          onChange={(e) => setAdServiceAccount(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ad-service-password">Contraseña de Servicio</Label>
                        <Input
                          id="ad-service-password"
                          type="password"
                          value={adServicePassword}
                          onChange={(e) => setAdServicePassword(e.target.value)}
                        />
                      </div>

                      <div className="md:col-span-2 flex gap-2">
                        <Button
                          onClick={() => testConnection('ad')}
                          variant="outline"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Probando...' : 'Probar Conexión'}
                        </Button>
                        <Button
                          onClick={handleAdSave}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Guardando...' : 'Guardar Configuración'}
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configuración de Seguridad
              </CardTitle>
              <CardDescription>
                Configure las políticas de seguridad del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Autenticación de dos factores</h4>
                  <p className="text-sm text-muted-foreground">Requiere 2FA para todos los usuarios</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Caducidad de sesión</h4>
                  <p className="text-sm text-muted-foreground">Tiempo de inactividad antes de cerrar sesión automáticamente</p>
                </div>
                <Input className="w-32" defaultValue="30 min" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Intentos de login fallidos</h4>
                  <p className="text-sm text-muted-foreground">Número máximo de intentos antes de bloquear cuenta</p>
                </div>
                <Input className="w-20" defaultValue="5" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Configuración General
              </CardTitle>
              <CardDescription>
                Configuraciones generales del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Idioma del sistema</h4>
                  <p className="text-sm text-muted-foreground">Idioma predeterminado para todos los usuarios</p>
                </div>
                <Input className="w-32" defaultValue="Español" readOnly />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Zona horaria</h4>
                  <p className="text-sm text-muted-foreground">Zona horaria del sistema</p>
                </div>
                <Input className="w-48" defaultValue="America/Bogota" readOnly />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notificaciones por email</h4>
                  <p className="text-sm text-muted-foreground">Enviar notificaciones importantes por correo</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;