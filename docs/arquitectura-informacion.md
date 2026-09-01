# 🗺️ Arquitectura de la Información (IA) - E-Cycle

Este documento detalla la estructura y jerarquía de información, el mapa del sitio, el modelo de datos y la organización de componentes de la aplicación **E-Cycle**, con un diseño visual estandarizado de alto contraste.

---

## 1. Mapa de Navegación y Jerarquía de Pantallas (Sitemap)

```mermaid
graph TD
    classDef primary fill:#004D40,stroke:#00382E,stroke-width:2px,color:#FFFFFF,font-weight:bold;
    classDef step fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A,font-weight:600;
    classDef highlight fill:#E0F2F1,stroke:#004D40,stroke-width:2px,color:#004D40,font-weight:bold;
    classDef decision fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E,font-weight:bold;

    Root["🚀 App Root"]:::primary --> Splash["SplashScreen (Sync con Fuentes)"]:::highlight
    Splash --> OnboardingCheck{"¿Primer Ingreso?"}:::decision
    
    OnboardingCheck -->|"Sí"| Onboard["Onboarding Walkthrough (3 Slides)"]:::step
    Onboard --> Register["Modal Registro de Usuario"]:::highlight
    Register --> MainApp["MobileLayout Base"]:::primary
    
    OnboardingCheck -->|"No"| MainApp
    
    subgraph BottomNav ["🧭 Barra de Navegación Principal (BottomNavBar)"]
        MainApp --> Tab1["1. Explorar (Home)"]:::primary
        MainApp --> Tab2["2. Retiro (Pickup)"]:::step
        MainApp --> Tab3["3. Escáner (Scan)"]:::step
        MainApp --> Tab4["4. E-Hub (Beneficios)"]:::step
    end

    subgraph Tab1_Views ["Explorar (Home)"]
        Tab1 --> SearchOverlay["Búsqueda Avanzada: Dónde / Materiales"]:::step
        Tab1 --> PointSheet["Bottom Sheet Detalle Punto Limpio"]:::step
        Tab1 --> MissionBanner["Carrusel Misión Especial / Partner"]:::step
        Tab1 --> ProfileTrigger["Acceso al Perfil"]:::highlight
    end

    subgraph Tab3_Views ["Módulo Escáner"]
        Tab3 --> CamView["1. ScanCamera (Visor QR)"]:::step
        CamView --> Analisis["2. Validación IoT (Analyzing)"]:::step
        Analisis --> InputView["3. Conteo de Residuos (Input)"]:::step
        InputView --> Validacion["4. Procesamiento Puntos (Validating)"]:::step
        Validacion --> SuccessView["5. Celebración (Success)"]:::highlight
    end

    subgraph Tab4_Views ["E-Hub"]
        Tab4 --> SubTab1["Pestaña Beneficios (Multiplicadores)"]:::step
        Tab4 --> SubTab2["Pestaña Usar Puntos (Catálogo Cupones)"]:::step
        Tab4 --> SubTab3["Pestaña Tu Progreso (Misiones)"]:::step
        SubTab2 --> RedeemModal["Modal Confirmación de Canje"]:::highlight
    end

    subgraph Profile_Views ["Perfil y Gamificación"]
        ProfileTrigger --> ProfileModal["Drawer de Perfil"]:::step
        ProfileModal --> BadgeOverlay["Modal Rango E-Cycler & Insignias 3D"]:::highlight
        ProfileModal --> SettingsView["Panel Configuración & Tema Oscuro"]:::step
    end
```

---

## 2. Matriz de Vistas y Componentes

| Pestaña / Vista | Propósito Principal | Componentes Clave | Modales / Overlays Asociados |
| :--- | :--- | :--- | :--- |
| **Explorar (`/explorar`)** | Descubrir puntos limpios en el mapa interactivo, filtrar por residuos y ver campañas especiales del mes. | `InteractiveMap`, `SpecialMissionCard`, `Avatar`, `Button`, `IconButton` | • Overlay Búsqueda y Filtro de Materiales<br>• Bottom Sheet Detalle de Punto<br>• Drawer de Perfil |
| **Escáner (`/escaner`)** | Validar ubicación en punto de reciclaje mediante QR y registrar el depósito de materiales. | `ScanCamera`, `ScanInput`, `ScanSuccess`, `LoadingSpinner` | • Loading / Validación IoT de Contenedor<br>• Selector de Cantidades por Categoría<br>• Resumen de Puntos Ganados |
| **E-Hub (`/ehub`)** | Gestionar multiplicadores de puntos mensuales, canjear beneficios/cupones y monitorear misiones activas. | `Tabs`, `LevelIndicator`, `SearchBar`, `Chip`, `Card`, `Modal`, `EmptyState` | • Modal de Confirmación y Código de Canje<br>• Filtro de Categorías de Beneficios<br>• Acceso a Overlay Rango E-Cycler |
| **Retiro (`/retiro`)** | Solicitar retiros de residuos electrónicos a domicilio y consultar historial de solicitudes. | `IconBox`, `Button`, `EmptyState` | • Alerta de Cobertura Comunal |
| **Perfil (Drawer)** | Gestionar datos de usuario, ver nivel, insignias desbloqueadas, estadísticas de residuos e impacto ambiental. | `LevelIndicator`, `Avatar`, `MenuItem`, `Toggle`, `Button`, `Skeleton` | • **Rango E-Cycler Overlay**: Carrusel de niveles e insignias 3D con efecto Flip<br>• **Configuración**: Modo oscuro, notificaciones, privacidad |

---

## 3. Modelo de Entidades y Datos (ERD)

```mermaid
erDiagram
    USER ||--o{ USER_ACHIEVEMENT : possesses
    USER ||--o{ RECYCLE_DEPOSIT : performs
    USER ||--o{ REDEEMED_COUPON : redeems
    RECYCLE_POINT ||--o{ RECYCLE_CATEGORY : accepts
    RECYCLE_POINT ||--o{ SPECIAL_MISSION : hosts
    COUPON ||--|| PARTNER : belongs_to
    LEVEL_THRESHOLD ||--o{ USER : classifies

    USER {
        string id
        string name
        string email
        string commune
        number points
        string level
        number activeMultiplier
        number itemsThisMonth
        number phonesRecycled
        number computersRecycled
        number batteriesRecycled
        number cablesRecycledKg
    }

    RECYCLE_POINT {
        string id
        string name
        string address
        string commune
        number lat
        number lng
        string_array materials
        string hours
        boolean isPartner
        string specialMission
    }

    COUPON {
        string id
        string title
        string description
        string brand
        number cost
        string category
        string imageUrl
        string discountPercent
        boolean isCurrentMonthPerk
        string expiresAt
    }

    ACHIEVEMENT {
        string id
        string title
        string description
        number progress
        number max
        boolean completed
        number reward
        string icon
        string category
        boolean isMedal
    }

    LEVEL_THRESHOLD {
        string name
        number points
        number achievements
        string_array rewards
    }
```

---

## 4. Estructura de Estado y Flujo de Datos

```mermaid
flowchart LR
    classDef primary fill:#004D40,stroke:#00382E,stroke-width:2px,color:#FFFFFF,font-weight:bold;
    classDef step fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A,font-weight:600;
    classDef highlight fill:#E0F2F1,stroke:#004D40,stroke-width:2px,color:#004D40,font-weight:bold;

    subgraph Storage ["Almacenamiento Local"]
        LS["LocalStorage: ecycle_user_data"]:::primary
    end

    subgraph AuthCtx ["AuthContext / AuthProvider"]
        StateUser["Estado del Usuario"]:::step
        StateTheme["Tema Claro / Oscuro"]:::step
        FnDeposit["deposit() - Registrar Depósito"]:::highlight
        FnRedeem["redeem() - Canjear Cupón"]:::highlight
        FnToggleTheme["toggleTheme() - Alternar Tema"]:::step
    end

    subgraph Consumidores ["Componentes Consumidores"]
        HomeView["Home Screen"]:::primary
        ScanView["Scan Screen"]:::highlight
        HubView["Hub Screen"]:::step
        ProfileView["Profile Screen"]:::primary
    end

    LS <-->|Hidratación & Persistencia| AuthCtx
    AuthCtx -->|user, isDarkMode, actions| Consumidores
    ScanView -->|Ejecuta deposit| FnDeposit
    HubView -->|Ejecuta redeem| FnRedeem
    ProfileView -->|Ejecuta toggleTheme| FnToggleTheme
```

---

## 5. Tokens de Identidad Cromática por Rango

| Rango | Requisitos Mínimos | Color Primario / Tinte | Ícono / Medalla | Beneficios Destacados |
| :--- | :--- | :--- | :--- | :--- |
| **Descubridor** | 0 pts / 0 logros | Slate (`#64748B`) | `workspace_premium` | Multiplicador x1.0 base, acceso al mapa e historial de impacto. |
| **Ensamblador** | 1.000 pts / 2 logros | Teal / Primario (`#004D40` / `#1DE9B6`) | `workspace_premium` | Multiplicador x1.2 permanente, acceso completo a E-Hub y notificaciones flash. |
| **Recolector** | 2.500 pts / 3 logros | Ámbar / Oro (`#F59E0B` / `#D97706`) | `workspace_premium` | Multiplicador x1.5 permanente, badge de plata, 50% descuento en envíos. |
| **Reactivador** | 5.000 pts / 4 logros | Índigo / Púrpura (`#4F46E5` / `#6366F1`) | `workspace_premium` | Multiplicador x2.0 permanente, avatar dorado exclusivo, retiros prioritarios. |
