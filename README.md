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

## Pendiente de confirmar con el cliente

Todo lo que no sabemos aparece marcado en la web con un recuadro amarillo rayado:

- `[aforo]` y `[m²]`
- Condiciones de comida/tarta propia, horarios de montaje, aseo adaptado y equipamiento para profesionales → `[confirmar con Luis y Yolanda]`
- Aviso legal y privacidad
- Fotos reales pendientes (montaje de dinosaurios, cumple de 3 años, Halloween…)
