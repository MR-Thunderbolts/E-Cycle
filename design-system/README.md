# 🎨 E-Cycle Design System

Este paquete/directorio contiene una **copia completa, desacoplada y documentada** del Design System de **E-Cycle**, listo para ser utilizado, exportado a otros proyectos o sincronizado con Figma.

---

## 📁 Estructura del Design System

```text
design-system/
├── tokens/
│   ├── tokens.ts              # Tokens tipados de colores, tipografía, radios y rangos
│   └── tokens.json            # Export JSON estándar compatible con Figma Tokens
├── styles/
│   └── design-system.css      # Utilidades CSS globales (3D Flip, fuentes, safe areas)
├── components/
│   ├── ui/                    # Componentes UI atómicos y moleculares
│   │   ├── Avatar/            # Avatares con badges de nivel y fallback SVG
│   │   ├── Badge/             # Pills numéricas y badges semánticos
│   │   ├── Button/            # Botones primarios, secundarios, ghost y outline
│   │   ├── BackButton.tsx     # Botón estándar de retroceso con soporte a11y
│   │   ├── Card/              # Contenedores con radio de 24-32px y sombras sutiles
│   │   ├── Chip/              # Chips de selección y filtros de materiales
│   │   ├── EmptyState/        # Ilustraciones y estados vacíos
│   │   ├── IconBox/           # Cajas de íconos con fondos tonales
│   │   ├── IconButton/        # Botones circulares de acción rápida
│   │   ├── Input/             # Campos de texto con validación y estados focus
│   │   ├── LevelIndicator/    # Indicador dinámico de Rango E-Cycler (Badge + Pill)
│   │   ├── LoadingSpinner/    # Indicadores circulares de carga
│   │   ├── MenuItem/          # Filas de configuración y menú con soporte Dark Mode
│   │   ├── Modal/             # Diálogos modales accesibles con backdrop blur
│   │   ├── ProgressBar/       # Barras de progreso lineal con acento dinámico
│   │   ├── SearchBar/         # Barra de búsqueda integrada con icono y clear
│   │   ├── Skeleton/          # Placeholders animados para estado de carga
│   │   ├── SpecialMissionCard # Tarjeta destacada de misión partner del mes
│   │   ├── SplashScreen/      # Pantalla de carga con logo SVG inmediato
│   │   ├── Tabs/              # Pestañas horizontales segmentadas
│   │   └── Toggle/            # Interruptores tipo switch para opciones booleanas
│   └── layout/
│       ├── BottomNavBar/      # Barra de navegación fija con 4 tabs e íconos activos
│       └── MobileLayout/      # Contenedor responsivo con ancho máximo móvil (430px)
├── index.ts                   # Exportación centralizada
└── README.md                  # Guía de uso y documentación completa
```

---

## 🎨 Tokens de Diseño Clave

### 1. Colores de Marca
- **Primary**: `#004D40` (Verde Bosque E-Cycle)
- **Primary Dark**: `#00382E` (Contenedores y fondos profundos)
- **Primary Light**: `#00695C` (Bordes e interacciones)
- **Accent**: `#1DE9B6` (Menta Neón / Brillo activo)
- **Secondary**: `#A6F8F2` (Cian Suave)
- **Surface Tint**: `#D0EBE8` / `#E0F2F1` (Fondos de tarjetas y badges activos)

### 2. Identidad de Rangos de Gamificación
| Rango | Color Principal | Color Tinte / Fondo | Multiplicador |
| :--- | :--- | :--- | :--- |
| **Descubridor** | Slate `#64748B` | `#F1F5F9` | `1.0x` |
| **Ensamblador** | Teal `#004D40` | `#D0EBE8` / `#1DE9B6` | `1.2x` |
| **Recolector** | Ámbar `#D97706` | `#FEF3C7` / `#F59E0B` | `1.5x` |
| **Reactivador** | Índigo `#4F46E5` | `#EEF2FF` / `#6366F1` | `2.0x` |

### 3. Tipografía
- **Fuente Principal**: `Plus Jakarta Sans`, sans-serif (pesos: 400, 500, 600, 700, 800)
- **Iconografía**: `Material Symbols Rounded` con renderizado optimizado (`font-feature-settings: 'liga'`).

### 4. Radios de Borde (Border Radius)
- **Tarjetas Principales**: `32px` (`rounded-[32px]`)
- **Contenedores y Modales**: `24px` (`rounded-[24px]`)
- **Botones y Pills**: `9999px` (`rounded-full`)

---

## 💻 Ejemplos de Uso

### Uso de Tokens en TypeScript / React
```tsx
import { COLORS, TYPOGRAPHY } from './design-system';

const badgeStyle = {
  backgroundColor: COLORS.primary.surface,
  color: COLORS.primary.DEFAULT,
  fontFamily: TYPOGRAPHY.fontFamily.sans.join(','),
};
```

### Uso de Componentes
```tsx
import { 
  Button, 
  LevelIndicator, 
  Card, 
  Avatar 
} from './design-system';

export const UserCard = () => (
  <Card className="p-6">
    <div className="flex items-center gap-4">
      <Avatar name="Alexandra" src="/avatar.jpg" size="lg" />
      <div>
        <h3 className="font-bold text-lg">Alexandra</h3>
        <LevelIndicator level="Recolector" variant="pill" />
      </div>
    </div>
    <Button variant="primary" className="mt-4 w-full">
      Ver Estadísticas
    </Button>
  </Card>
);
```
