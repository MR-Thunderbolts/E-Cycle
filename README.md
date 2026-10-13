# E-Cycle · Ciudadano

App web progresiva (PWA) para que cualquier persona de la casa recicle sus aparatos electrónicos sin complicarse: encuentra un punto limpio, pide un retiro a domicilio, escanea lo que entrega y canjea sus puntos por descuentos.

## Destinos

| Pestaña | Qué hace |
| --- | --- |
| **Explorar** | Mapa a pantalla completa con los puntos limpios, buscador por comuna o dirección, lista arrastrable y aviso de campaña. |
| **Retiro** | Retiro a domicilio en 4 pasos (qué, dónde, cuándo, revisión) y seguimiento. Gratis desde 5 kg. |
| **Escanear** | Solo en celular: lee el QR del punto, se declara lo que se entrega y se suman puntos. |
| **Beneficios** | Saldo de puntos, premios para canjear e historial. |

La cuenta es opcional y se crea con teléfono y código SMS. Sin cuenta, los puntos quedan guardados 30 días en el navegador y pasan a la cuenta al crearla.

## Desarrollo

Requiere Node.js 18 o superior.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run build      # build de producción en dist/
```

Variables de entorno opcionales (copiar `.env.example` a `.env.local`):

- `VITE_GA_MEASUREMENT_ID`: Google Analytics 4. Sin ella, los eventos solo se registran en la consola en desarrollo.

## Stack

React 19 · TypeScript · Vite · Framer Motion 11. Se despliega en Vercel (`vercel.json`).

## Estructura

```text
src/
├── app/            # Shell (celular / escritorio) y capas comunes (cuenta, registro, avisos)
├── components/
│   ├── ui/         # Primitivas del Design System v2 (Button, BottomSheet, Toast, MapPin…)
│   ├── layout/     # MobileLayout, BottomNavBar, TopBar
│   └── Welcome/    # Tarjeta de bienvenida (primera visita)
├── features/       # home (Explorar), pickup (Retiro), scan, hub (Beneficios), profile, auth
├── context/        # CiudadanoProvider: estado compartido de la capa
├── hooks/          # useCiudadano, useIsDesktop, useCanScan
├── constants/      # Datos de ejemplo (ciudadano.ts) y tokens de movimiento
├── styles/         # Tokens y clases ec-* del Design System v2
└── utils/          # Analytics, formato es-CL, localStorage seguro
```

## Design System v2

- Tokens (color, tipografía, espaciado, radios, elevación, movimiento) y clases `ec-*` en `src/styles/`.
- Tema oscuro por defecto; se cambia desde la cuenta y se guarda en el navegador.
- Transiciones con Framer Motion usando los tokens de `src/constants/motion.ts`. Con `prefers-reduced-motion` no hay animaciones.
- Áreas táctiles de 44 × 44 como mínimo. Textos en español de Chile.

La carpeta `design-system/` en la raíz es la copia v1, previa a este rediseño.

## Datos de ejemplo

Mientras no esté conectado el backend, `src/constants/ciudadano.ts` reúne los puntos limpios por comuna, el sector de retiro, la campaña, los premios y una cuenta demo. Tienen la misma forma que tendrán los datos reales, así que el cambio queda en ese archivo.

En la maqueta, el código SMS es `1234`. «Ingresar» abre la cuenta demo (Trinidad Rojas).
