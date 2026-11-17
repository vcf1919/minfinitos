# Momentos Infinitos · landing de demostración

Landing one-page (HTML + CSS + JS, sin framework ni paso de build) para **Momentos Infinitos**, espacio para eventos privados con parque de bolas en Catarroja (Valencia).

```
index.html          → la página
css/styles.css      → estilos (mobile-first)
js/main.js          → configurador, carrusel, animaciones y mapa
assets/             → fotos originales (zips), versiones .webp optimizadas y símbolo SVG del logo
favicon.svg
_headers            → cabeceras de Cloudflare Pages (caché + seguridad básica)
robots.txt
```

Todas las rutas son relativas: funciona igual en `*.pages.dev` que en un dominio propio.
Única dependencia externa: MapLibre GL 4.7.1 (unpkg) para el mapa 3D con teselas de OpenFreeMap, cargado solo cuando el mapa se acerca a la pantalla. Fuentes: Google Fonts (Young Serif, Onest y Montserrat para el logotipo).

## Desplegar en Cloudflare Pages

1. En el panel de Cloudflare: **Workers & Pages → Create → Pages → Connect to Git** y elige el repositorio `minfinitos`.
2. Configuración de build:
   - **Framework preset:** None
   - **Build command:** *(vacío)*
   - **Build output directory:** `/`
3. **Save and Deploy**. Cada push a la rama de producción vuelve a publicar.

Alternativa sin Git (Wrangler):

```bash
npx wrangler pages deploy . --project-name=momentos-infinitos
```

### Dominio propio

En el proyecto de Pages → **Custom domains** → añade el dominio. Cuando esté, cambia en `index.html` las URLs relativas de `og:image` y del JSON-LD (`image`, `logo`) por absolutas (`https://dominio/assets/...`): Facebook y WhatsApp necesitan la URL completa para mostrar la vista previa.

## Probar en local

```bash
python3 -m http.server 8000
```

y abre <http://localhost:8000>.

## Datos de ejemplo (confirmar con Luis y Yolanda antes de publicar)

Para la demo se han rellenado con datos ficticios pero verosímiles:

- Aforo: **60 personas** y superficie: **150 m²** (`index.html`, JSON-LD y `js/main.js`).
- FAQ: se puede traer comida, catering y tarta; montaje de la decoración antes del evento; sin confeti ni clavar en paredes; local en planta baja sin escalones.
- Profesionales: wifi y enchufes repartidos por la sala.
- `aviso-legal.html` y `privacidad.html`: NIF `B-98765432`, datos registrales y correo `hola@momentosinfinitos.es` son **inventados**.
- Fotos de montajes temáticos (dinosaurios, Halloween, cumple de 3 años): se usan fotos reales del local mientras tanto.
