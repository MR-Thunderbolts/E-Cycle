# 📚 Documentación y Diagramas del Sistema - E-Cycle

Bienvenido a la suite de documentación técnica, arquitectura y flujos de **E-Cycle**. Esta documentación está organizada modularmente y escrita con diagramas interactivos en formato **Mermaid** usando la paleta oficial de la marca estandarizada con alto contraste (WCAG AAA).

---

## 🗂️ Índice de Documentación

1. [**`docs/arquitectura-informacion.md`**](file:///Users/amarolatoja/Library/CloudStorage/GoogleDrive-amarolatoja@gmail.com/Mi%20unidad/Pc%20Dell%20Backup%20Verano%2026/Proyectos/e-cycle/docs/arquitectura-informacion.md)
   - Mapa de Navegación del Sitio (Sitemap) jerárquico.
   - Matriz de componentes y pantallas asociadas.
   - Modelo de Entidades y Datos (ERD).
   - Estructura de reactividad y persistencia en LocalStorage.
   - Tokens de identidad cromática por rango de usuario.

2. [**`docs/flujos-usuario.md`**](file:///Users/amarolatoja/Library/CloudStorage/GoogleDrive-amarolatoja@gmail.com/Mi%20unidad/Pc%20Dell%20Backup%20Verano%2026/Proyectos/e-cycle/docs/flujos-usuario.md)
   - **Flujo 1**: Onboarding y Registro de Nuevo Usuario.
   - **Flujo 2**: Exploración del Mapa y Búsqueda de Puntos Limpios.
   - **Flujo 3**: Escaneo QR y Registro de Depósito de Residuos.
   - **Flujo 4**: E-Hub (Multiplicadores, Catálogo de Cupones y Misiones).
   - **Flujo 5**: Perfil de Usuario, Rango E-Cycler e Insignias 3D Flip Card.
   - **Flujo 6**: Retiro a Domicilio (Pickup).

3. [**`docs/diagramas-flujo-aplicacion.md`**](file:///Users/amarolatoja/Library/CloudStorage/GoogleDrive-amarolatoja@gmail.com/Mi%20unidad/Pc%20Dell%20Backup%20Verano%2026/Proyectos/e-cycle/docs/diagramas-flujo-aplicacion.md)
   - Ciclo de vida de inicialización y carga de fuentes web (Splash & Font Gate).
   - Máquina de estados del Escáner (`ScanStep`).
   - Motor de gamificación y progresión de rangos (`calculateLevel`).
   - Flujo transaccional de canje de cupones.
   - Arquitectura de estado global (`AuthContext`).

4. [**`docs/diagramas-avanzados.md`**](file:///Users/amarolatoja/Library/CloudStorage/GoogleDrive-amarolatoja@gmail.com/Mi%20unidad/Pc%20Dell%20Backup%20Verano%2026/Proyectos/e-cycle/docs/diagramas-avanzados.md)
   - Motor de geolocalización, filtrado espacial y sincronización de Bottom Sheet.
   - Algoritmo de cálculo de impacto ecológico (CO₂ evitado, árboles salvados y métricas por material).
   - Jerarquía del Design System en Atomic Design (Átomos, Moléculas, Organismos y Layouts).
   - Sistema de telemetría, analytics y detección de sesiones de test (Maze).
   - Máquina de estados del efecto 3D Flip Card en insignias.
   - Ciclo de vida logístico del retiro a domicilio.

---

## 🌐 Visualizador Web Interactivo

Puedes visualizar todos los diagramas vectoriales interactivos abriendo en tu navegador:
👉 **`http://localhost:5173/docs.html`** *(o en [public/docs.html](file:///Users/amarolatoja/Library/CloudStorage/GoogleDrive-amarolatoja@gmail.com/Mi%20unidad/Pc%20Dell%20Backup%20Verano%2026/Proyectos/e-cycle/public/docs.html))*.
