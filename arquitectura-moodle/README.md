# Moodle sobre Ubuntu · Caso Petroworks

> **Moodle no era el problema: era la arquitectura.**
> Recuperación de una plataforma de formación que no podía avanzar a producción, migrada de Windows Server a una base estable en Ubuntu, Apache, PHP y MySQL, con H5P funcionando y login personalizado.

**Autor:** Andrés Felipe Rodríguez Barbosa · Dirección + Estrategia + Arquitectura + IA
**Cliente:** Petroworks · Bogotá D.C.
**Dossier técnico:** `/dossier/moodle/index.html`
**Publicación en LinkedIn:** https://lnkd.in/p/ePDQ2n2V

---

## Resumen

| | |
|---|---|
| **Problema** | Errores 500, actividades que no aparecían, H5P sin cargar y sin estrategia de continuidad sobre Windows Server. |
| **Causa raíz** | Arquitectura con incompatibilidades, no la aplicación Moodle. |
| **Solución** | Migración a Ubuntu Server 22.04 + Apache + PHP 8.1 + MySQL, con HTTPS y entorno validado antes de instalar H5P. |
| **Resultado** | Plataforma estable, H5P funcionando y lista para producción. |

## Arquitectura

```
ANTES    Windows Server → IIS/FastCGI → PHP → Moodle → MySQL    ✕ H5P  ✕ errores 500

DESPUÉS  Navegador → Apache :80 ─301→ :443 / :18080 (SSL)
                         ↓
                      PHP 8.1 → Moodle → MySQL
                         ↓
                     moodledata (www-data)
```

## Stack

Ubuntu Server 22.04 · Apache 2 · PHP 8.1 · MySQL · Moodle 4.4 · Tema Adaptable · H5P · SCORM · SSL/HSTS

## Metodología: del diagnóstico a la entrega

1. **Contexto:** revisar el estado del proyecto y los síntomas reportados.
2. **Diagnóstico:** contrastar hipótesis con datos (sistema operativo, servidor web, PHP, base de datos, permisos y logs).
3. **Decisiones:** definir la arquitectura destino y justificar cada cambio.
4. **Implementación:** instalar, migrar, configurar SSL, límites de PHP y permisos.
5. **Experiencia:** login propio y personalización del tema.
6. **Troubleshooting:** documentar cada fallo con su solución.
7. **Entrega:** manual operativo para el equipo del cliente.

## Decisiones clave

| # | Decisión | ¿Por qué? |
|---|---|---|
| 1 | No continuar sobre Windows Server | Compatibilidad |
| 2 | Migrar a Ubuntu | Mayor estabilidad |
| 3 | Mantener la misma versión de MySQL | Reducir riesgos durante la migración |
| 4 | Instalar H5P solo después de validar el entorno | Evitar falsos diagnósticos |

## Implementación (resumen)

### Verificación inicial

```bash
free -h && nproc && df -h
uname -a && lsb_release -a && php -v
sudo systemctl status apache2
sudo apache2ctl configtest      # Syntax OK
tail -f /var/log/apache2/error.log
```

### PHP (`php.ini`)

```ini
extension=pdo_mysql
memory_limit = 512M
post_max_size = 100M
upload_max_filesize = 100M
```

### Apache: puertos y HTTPS

```apache
# /etc/apache2/ports.conf
Listen 80
<IfModule ssl_module>
    Listen 443
    Listen 18080
</IfModule>
```

```apache
<VirtualHost *:80>
  ServerName apps.tudominio.com
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>
```

```bash
sudo a2enmod ssl rewrite headers
sudo apache2ctl configtest && sudo systemctl reload apache2
sudo lsof -i :443 ; sudo lsof -i :18080
openssl s_client -connect apps.tudominio.com:18080
```

### Permisos y caché

```bash
sudo chown -R www-data:www-data /var/www/moodledata
sudo chmod -R 755 /var/www/moodledata
sudo rm -rf /var/www/moodledata/cache/* /var/www/moodledata/localcache/*
php admin/cli/purge_caches.php
```

## Login personalizado

Página de acceso propia que envía el formulario al login nativo de Moodle (`../login/index.php`), sin modificar el núcleo.

- Alerta de credenciales inválidas con `?errorcode=3`.
- Mostrar/ocultar contraseña y recordar usuario.
- Animación “Somos Power / Somos Petroworks”, parallax y efecto de escritura.
- Galería de videos institucionales con reproducción en cadena.

```
moodle-petroworks/
└── login-petroworks/
    ├── index.html
    ├── style.css
    ├── script.js
    ├── images/
    ├── videos/
    └── audio/
```

## Personalización del tema Adaptable

| Ajuste | Valor |
|---|---|
| Fuente principal | Roboto |
| Verde de marca | `#26A146` |
| Enlaces / hover | `#707173` / `#153e3c` |
| Bloques y bordes | `#46635e` |
| Botones | `#656d64` (hover `#26A146`) |

Los estilos y scripts propios se cargan desde *Apariencia › HTML adicional* y *Personalizar CSS* del tema.

## Troubleshooting & resolución

| # | Síntoma | Causa | Solución |
|---|---|---|---|
| 1 | H5P “esperando a que se cargue” | Entorno Windows/IIS, permisos y versiones | Migrar a Ubuntu y validar antes de habilitar H5P |
| 2 | Error 500 y aviso SCORM de conexión inestable | Errores del servidor | Revisar logs y estabilizar el stack |
| 3 | Imágenes e iconos no cargan tras migrar | `moodledata`, `wwwroot`, contenido mixto y caché | Copiar `moodledata`, corregir `wwwroot` con `https`, permisos y purgar caché |
| 4 | Warning en `theme/adaptable/db/caches.php` | Permisos o archivo faltante | Corregir permisos o reinstalar el tema |
| 5 | Error de base de datos y fallos en actividades pesadas | `pdo_mysql` deshabilitado y memoria baja | Habilitar extensión; memoria 256M → 512M |
| 6 | Redirección HTTP→HTTPS y SSL en 18080 | Sitios y módulos sin habilitar | `a2enmod`, `a2ensite`, `Listen 18080` y regla 301 |
| 7 | Plataforma lenta | Caché y sesiones sin optimizar | Ajustar PHP, purgar caché y monitorear recursos |
| 8 | La alerta del login desaparecía | Se creaba antes de la redirección | Leer `errorcode` al cargar la página |
| 9 | Banner de cabecera cubría la pantalla | Posición absoluta y `@media` en `style` en línea | Mover a CSS del tema con media queries reales |
| 10 | Importación CSV y calificación máxima 10 | CSV mal formado y categoría bloqueada | Normalizar CSV; quitar bloqueos o nueva categoría |

El detalle completo (síntoma, causa, solución y verificación) está en el dossier técnico.

## Resultados

- Proyecto recuperado con problemas de infraestructura y compatibilidad.
- Moodle migrado a un entorno Linux más estable.
- H5P habilitado y funcionando.
- Plataforma preparada para producción con infraestructura más robusta.

## Lección aprendida

El principal riesgo no era Moodle, sino la ausencia de una arquitectura preparada para soportar continuidad operativa, respaldos y compatibilidad tecnológica. La tecnología rara vez falla por una sola aplicación: con frecuencia, el problema está en las decisiones de arquitectura que la sostienen.

## Seguridad

Este repositorio **no contiene** credenciales, IPs internas ni llaves. Los certificados, usuarios y contraseñas se gestionan fuera del código (gestor de contraseñas o variables de entorno).

## Estructura sugerida del repositorio

```
.
├── README.md
├── dossier/
│   └── moodle/
│       ├── index.html
│       ├── dossier.css
│       └── dossier.js
└── login-petroworks/        # opcional, sin videos pesados
```

## Contacto

**Andrés Felipe Rodríguez Barbosa**
anfelirod86@hotmail.com · +57 321 390 0071
Dirección + Estrategia + Arquitectura + IA

#Moodle #Ubuntu #Linux #Apache #PHP #MySQL #ArquitecturaTI #ContinuidadOperativa #TransformaciónDigital
