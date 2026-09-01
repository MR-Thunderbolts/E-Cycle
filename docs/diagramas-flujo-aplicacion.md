# ⚙️ Diagramas de Flujo de la Aplicación (Application Logic Flowcharts)

Este documento detalla los diagramas de flujo técnico, las máquinas de estado y la lógica de negocio de la aplicación **E-Cycle**, diseñados con una paleta cromática estandarizada y accesible.

---

## 1. Ciclo de Vida de Inicialización y Carga de Recursos (Splash & Fonts)

```mermaid
flowchart TD
    classDef primary fill:#004D40,stroke:#00382E,stroke-width:2px,color:#FFFFFF,font-weight:bold;
    classDef step fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A,font-weight:600;
    classDef highlight fill:#E0F2F1,stroke:#004D40,stroke-width:2px,color:#004D40,font-weight:bold;
    classDef decision fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E,font-weight:bold;

    Start(["Usuario abre E-Cycle"]):::primary --> LoadIndex["Carga de index.html"]:::step
    LoadIndex --> Preconnect["Preconnect & Preload de Fuentes Web"]:::step
    LoadIndex --> RenderSplash["SplashScreen con Logo SVG Inmediato"]:::highlight
    
    subgraph FontGate ["Sincronización Inteligente de Fuentes"]
        InitTimer["Timer Mínimo: 1.5s"]:::step
        WaitFonts["document.fonts.ready"]:::highlight
        SafetyTimer["Timeout de Seguridad: 3.5s"]:::step
    end

    RenderSplash --> InitTimer & WaitFonts & SafetyTimer
    
    InitTimer & WaitFonts --> GateResolved["Fuentes Listas & Duración Cumplida"]:::highlight
    SafetyTimer -.->|"Fallback si red lenta"| GateResolved

    GateResolved --> AddClass["Añade clase .fonts-loaded"]:::step
    AddClass --> FadeOutSplash["Animación Fade Out de SplashScreen"]:::primary
    FadeOutSplash --> MountRouter["AppRouter renderiza la Vista Activa"]:::highlight
    MountRouter --> EndState(["Interfaz 100% Renderizada sin FOUT"]):::primary
```

---

## 2. Máquina de Estados del Módulo de Escáner (`ScanStep`)

```mermaid
stateDiagram-v2
    [*] --> camera: Montaje de Scan.tsx

    state camera {
        [*] --> VisorActivo
        VisorActivo --> SimuladorQR: Presiona 'Simular QR' o detecta código
    }

    camera --> analyzing: onSimulate() / QR Detectado

    state analyzing {
        [*] --> TimerVerificacion
        TimerVerificacion: "Verificando código QR..." (1.2s)
        TimerVerificacion --> TimerUbicacion: "Validando ubicación..." (1.2s)
        TimerUbicacion --> TimerIoT: "Conectando con contenedor B-103..." (1.2s)
    }

    analyzing --> input: Validación IoT completada (3.6s)

    state input {
        [*] --> FormularioCantidades
        FormularioCantidades --> AjusteItems: handleQty(categoryId, delta)
        AjusteItems --> CalculoPuntos: Puntos Base x Multiplicador Activo
    }

    input --> camera: onBack()
    input --> validating: onConfirm() con totalItems > 0

    state validating {
        [*] --> EjecutarDeposit
        EjecutarDeposit --> RecalcularNivel: calculateLevel(puntos, logros)
        RecalcularNivel --> GuardarLocalStorage: Actualiza estado global
    }

    validating --> success: Depósito completado (3.0s)

    state success {
        [*] --> PantallaCelebracion
        PantallaCelebracion --> RedirigirHub: onRedeem() -> Tab 'ehub' (sub-tab 'usar')
        PantallaCelebracion --> ReiniciarEscaneo: onContinue() -> Limpia items y vuelve a camera
    }

    ReiniciarEscaneo --> camera
    RedirigirHub --> [*]
```

---

## 3. Motor de Gamificación, Puntos y Progresión de Rangos

```mermaid
flowchart TD
    classDef primary fill:#004D40,stroke:#00382E,stroke-width:2px,color:#FFFFFF,font-weight:bold;
    classDef step fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A,font-weight:600;
    classDef highlight fill:#E0F2F1,stroke:#004D40,stroke-width:2px,color:#004D40,font-weight:bold;
    classDef decision fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E,font-weight:bold;

    classDef lvlReactivador fill:#EEF2FF,stroke:#6366F1,stroke-width:2px,color:#3730A3,font-weight:bold;
    classDef lvlRecolector fill:#FEF3C7,stroke:#F59E0B,stroke-width:2px,color:#92400E,font-weight:bold;
    classDef lvlEnsamblador fill:#E0F2F1,stroke:#004D40,stroke-width:2px,color:#004D40,font-weight:bold;
    classDef lvlDescubridor fill:#F1F5F9,stroke:#64748B,stroke-width:2px,color:#334155,font-weight:bold;

    A["Inicio de Cálculo de Depósito"]:::primary --> B["Obtener items depositados"]:::step
    B --> C["Calcular Puntos Base = Σ (cantidad × puntos_unidad)"]:::step
    C --> D["Obtener Multiplicador Activo del Usuario"]:::highlight
    D --> E["Puntos Totales = Round(Puntos Base × activeMultiplier)"]:::highlight
    
    E --> F["Actualizar Saldo de E-Points del Usuario"]:::primary
    E --> G["Actualizar Métricas de Residuos (Celulares, Baterías, etc.)"]:::step
    F & G --> H["Evaluar Cumplimiento de Misiones y Logros"]:::highlight
    
    subgraph EvaluacionRango ["Algoritmo calculateLevel()"]
        H --> I{"¿Puntos >= 5000 y Logros >= 4?"}:::decision
        I -->|"Sí"| L4["🟣 Reactivador (Multiplicador x2.0 VIP)"]:::lvlReactivador
        I -->|"No"| J{"¿Puntos >= 2500 y Logros >= 3?"}:::decision
        J -->|"Sí"| L3["🟡 Recolector (Multiplicador x1.5)"]:::lvlRecolector
        J -->|"No"| K{"¿Puntos >= 1000 y Logros >= 2?"}:::decision
        K -->|"Sí"| L2["🟢 Ensamblador (Multiplicador x1.2)"]:::lvlEnsamblador
        K -->|"No"| L1["🔘 Descubridor (Multiplicador x1.0 Base)"]:::lvlDescubridor
    end

    L4 & L3 & L2 & L1 --> M["Persistir nuevo Rango en LocalStorage"]:::primary
    M --> N["Actualizar UI, Colores Dinámicos e Indicadores"]:::highlight
```

---

## 4. Flujo Transaccional de Canje de Cupones

```mermaid
sequenceDiagram
    autonumber
    actor Usuario as 👤 Usuario
    participant Hub as 🏪 Hub Screen
    participant Modal as 🎟️ Modal Canje
    participant Auth as 🔐 AuthContext (redeem)
    participant Storage as 💾 LocalStorage

    Usuario->>Hub: Selecciona Cupón en el catálogo
    Hub->>Hub: Verifica si user.points >= coupon.cost
    alt Puntos Insuficientes
        Hub-->>Usuario: Deshabilita botón o muestra alerta de saldo insuficiente
    else Puntos Suficientes
        Hub->>Modal: Abre modal de confirmación con datos del cupón
        Usuario->>Modal: Presiona "Confirmar Canje"
        Modal->>Modal: Cambia estado a 'processing' (Spinner animado)
        Modal->>Auth: Ejecuta redeem(costo)
        Auth->>Auth: Nuevo Saldo = user.points - costo
        Auth->>Storage: Guarda usuario actualizado en LocalStorage
        Auth-->>Modal: Retorna true (Éxito)
        Modal->>Modal: Cambia estado a 'success'
        Modal-->>Usuario: Muestra Código de Descuento Único y botón de Copiar
    end
```

---

## 5. Arquitectura de Estado y Reactividad (Context Layer)

```mermaid
graph TD
    classDef primary fill:#004D40,stroke:#00382E,stroke-width:2px,color:#FFFFFF,font-weight:bold;
    classDef step fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A,font-weight:600;
    classDef highlight fill:#E0F2F1,stroke:#004D40,stroke-width:2px,color:#004D40,font-weight:bold;

    subgraph Providers ["Capa de Proveedores"]
        AuthProv["AuthProvider"]:::primary
        NotifProv["NotificationProvider"]:::highlight
    end

    subgraph Hooks ["Custom Hooks de Acceso"]
        useAuthHook["useAuth()"]:::highlight
        useNotifHook["useNotification()"]:::step
    end

    subgraph State ["Estado Reactivo"]
        UserState["user: User | null"]:::step
        LoadingState["loading: boolean"]:::step
        ThemeState["isDarkMode: boolean"]:::step
    end

    subgraph Services ["Servicios de Persistencia y API"]
        LocalStore[("LocalStorage: ecycle_user_data")]:::primary
        ThemeStore[("LocalStorage: theme")]:::step
        AnalyticsSvc["analytics utility"]:::step
    end

    AuthProv --> UserState & LoadingState & ThemeState
    LocalStore <-->|Sincronización| UserState
    ThemeStore <-->|Sincronización| ThemeState

    UserState & ThemeState --> useAuthHook
    useAuthHook --> FeatureComponents["Componentes de Vistas y Features"]:::primary
    FeatureComponents -->|Dispara Eventos| AnalyticsSvc
```
