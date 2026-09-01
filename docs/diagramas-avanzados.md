# 🚀 Diagramas Avanzados y Arquitectura de Negocio - E-Cycle

Este documento complementa la suite de documentación con **6 diagramas especializados** extraídos de la lógica técnica, reactividad y modelos de gamificación del repositorio.

---

## 1. 📍 Motor de Geolocalización, Filtrado Espacial y Sincronización del Mapa

```mermaid
flowchart TD
    classDef primary fill:#004D40,stroke:#00382E,stroke-width:2px,color:#FFFFFF,font-weight:bold;
    classDef step fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A,font-weight:600;
    classDef highlight fill:#E0F2F1,stroke:#004D40,stroke-width:2px,color:#004D40,font-weight:bold;
    classDef decision fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E,font-weight:bold;

    Start(["Montaje de Home.tsx"]):::primary --> LoadData["Cargar RECYCLE_POINTS (Puntos Limpios)"]:::step
    LoadData --> CheckTheme{"Tema Activo (isDarkMode)"}:::decision
    
    CheckTheme -->|"Oscuro"| DarkMap["Carga Map Asset: map-bg.jpg"]:::step
    CheckTheme -->|"Claro"| LightMap["Carga Map Asset: map-bg-light.jpg"]:::step

    DarkMap & LightMap --> UserAction{"Interacción del Usuario"}:::decision

    UserAction -->|"Búsqueda por Texto"| TextFilter["Filtra point.name / point.address"]:::step
    UserAction -->|"Filtro por Materiales"| MatFilter["Filtra point.materials con chips activos"]:::step
    UserAction -->|"Toca Pin en Mapa"| SelectPin["setSelectedPoint(point)"]:::highlight

    TextFilter & MatFilter --> ApplyFilter["Calcular filteredPoints"]:::highlight
    ApplyFilter --> RenderMarkers["Renderiza Marcadores Dinámicos en InteractiveMap"]:::step

    SelectPin --> OpenSheet["Despliega Bottom Sheet Animado (Framer Motion)"]:::primary
    OpenSheet --> SheetActions{"Acciones en Bottom Sheet"}:::decision
    SheetActions -->|"Cómo Llegar"| OpenGPS["Lanza enlace externo de navegación"]:::step
    SheetActions -->|"Escanear Aquí"| RedirectScan["Navega a Pestaña 'Escáner'"]:::highlight
    SheetActions -->|"Arrastra hacia abajo"| DragDismiss["handleDragEnd: Cierra Bottom Sheet"]:::step
```

---

## 2. 🌲 Motor de Métricas de Impacto Ecológico y Huella Ambiental

```mermaid
flowchart TD
    classDef primary fill:#004D40,stroke:#00382E,stroke-width:2px,color:#FFFFFF,font-weight:bold;
    classDef step fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A,font-weight:600;
    classDef highlight fill:#E0F2F1,stroke:#004D40,stroke-width:2px,color:#004D40,font-weight:bold;
    classDef decision fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E,font-weight:bold;

    A["Depósito Confirmado: submitDropoff()"]:::primary --> B["Obtener itemCount = Σ unidades"]:::step
    B --> C["Calcular Puntos Finales = Round(basePoints × multiplier)"]:::highlight

    subgraph CalculoImpacto ["Fórmulas de Conversión Ambiental"]
        C --> D["CO₂ Evitado = co2_actual + (itemCount × 0.5 kg)"]:::step
        C --> E{"¿Puntos Finales > 200?"}:::decision
        E -->|"Sí"| F["Árboles = trees_actual + 1"]:::highlight
        E -->|"No"| G["Árboles = trees_actual (sin incremento)"]:::step
    end

    subgraph DesgloseMateriales ["Métricas Específicas por Residuo"]
        B --> H["phonesRecycled += celulares"]:::step
        B --> I["computersRecycled += laptops"]:::step
        B --> J["batteriesRecycled += baterias"]:::step
        B --> K["cablesRecycledKg += cables (kg)"]:::step
    end

    D & F & G & H & I & J & K --> SaveUser["Actualizar Objeto user.impact en LocalStorage"]:::primary
    SaveUser --> RenderProfile["Visualizar Tarjetas de Impacto en Perfil"]:::highlight
```

---

## 3. 🧩 Jerarquía del Design System (Atomic Design)

```mermaid
graph TD
    classDef primary fill:#004D40,stroke:#00382E,stroke-width:2px,color:#FFFFFF,font-weight:bold;
    classDef step fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A,font-weight:600;
    classDef highlight fill:#E0F2F1,stroke:#004D40,stroke-width:2px,color:#004D40,font-weight:bold;

    subgraph Atomos ["⚛️ Átomos (src/components/ui)"]
        A1["Avatar"]:::step
        A2["Badge"]:::step
        A3["Button / BackButton"]:::step
        A4["IconButton"]:::step
        A5["Chip"]:::step
        A6["Toggle"]:::step
        A7["Skeleton"]:::step
        A8["IconBox"]:::step
        A9["LoadingSpinner"]:::step
    end

    subgraph Moleculas ["🧬 Moléculas"]
        M1["LevelIndicator (Badge + Pill)"]:::highlight
        M2["SearchBar"]:::step
        M3["MenuItem"]:::step
        M4["Tabs"]:::step
        M5["ProgressBar"]:::step
        M6["CountdownTimer"]:::step
        M7["Modal"]:::step
    end

    subgraph Organismos ["🦠 Organismos"]
        O1["InteractiveMap"]:::highlight
        O2["ScanCamera"]:::highlight
        O3["ECyclerProfileBadgeOverlay (3D Flip)"]:::highlight
        O4["SpecialMissionCard"]:::step
        O5["BottomNavBar"]:::primary
        O6["SplashScreen"]:::primary
    end

    subgraph LayoutsViews ["📱 Layouts y Pantallas"]
        L1["MobileLayout Base"]:::primary
        V1["Home (Explorar)"]:::step
        V2["Scan (Escáner)"]:::step
        V3["Hub (E-Hub)"]:::step
        V4["Pickup (Retiro)"]:::step
        V5["Profile (Drawer)"]:::step
    end

    Atomos --> Moleculas
    Moleculas --> Organismos
    Organismos --> LayoutsViews
```

---

## 4. 🔔 Sistema de Telemetría, Analytics y Detección de Sesión

```mermaid
sequenceDiagram
    autonumber
    actor Usuario as 👤 Usuario
    participant Provider as 🛡️ AuthProvider
    participant Analytics as 📊 Analytics Utility
    participant Maze as 🧪 Maze Session Detector
    participant Features as 📱 Componentes de Vistas

    Provider->>Analytics: initializeAnalytics() al montar App
    Provider->>Maze: detectMazeSession() (Comprueba test params)
    
    Usuario->>Features: Cambia Tema (Dark / Light)
    Features->>Analytics: analytics.themeToggled(isDarkMode)

    Usuario->>Features: Aplica Filtro de Materiales en Mapa
    Features->>Analytics: analytics.materialFilterApplied(materials, matchCount)

    Usuario->>Features: Confirma Depósito de Residuos
    Features->>Analytics: analytics.dropoffConfirmed(itemCount, totalPoints)

    Usuario->>Features: Canjea Cupón de Descuento
    Features->>Analytics: analytics.couponRedeemed(couponId, cost)
```

---

## 5. 🎖️ Matriz de Gamificación, Logros y Máquina de Estados 3D Flip Card

```mermaid
stateDiagram-v2
    [*] --> GridInsignias: Usuario abre 'Rango E-Cycler'

    state GridInsignias {
        [*] --> RenderCards
        RenderCards --> EvaluacionEstado: ¿ach.completed?
        EvaluacionEstado --> InsigniaDesbloqueada: Sí (Colorido y Activo)
        EvaluacionEstado --> InsigniaBloqueada: No (Opaco / Candado)
    }

    InsigniaBloqueada --> CardFlipped: Tap en Insignia (onClick)

    state CardFlipped {
        [*] --> AnimacionCSS: .perspective-1000 + .rotate-y-180
        AnimacionCSS --> CaraPosterior: Muestra Requisitos y Barra de Progreso
        CaraPosterior --> CaraFrontal: Segundo Tap (Vuelve a rotar)
    }

    CardFlipped --> GridInsignias: Swipe horizontal a otro Nivel
```

---

## 6. 🚚 Ciclo de Vida y Logística de Retiro a Domicilio (Roadmap Pickup)

```mermaid
stateDiagram-v2
    [*] --> Solicitud: Usuario presiona 'Solicitar Retiro'

    state Solicitud {
        [*] --> ValidarComuna: Verifica cobertura comunal
        ValidarComuna --> CoberturaValida: Comuna en zona piloto
        ValidarComuna --> SinCobertura: Fuera de radio
    }

    SinCobertura --> [*]: Muestra modal de expansión de cobertura
    
    CoberturaValida --> Agendamiento: Selecciona Fecha y Franja Horaria
    Agendamiento --> EnRuta: Conductor asignado y en trayecto
    
    state EnRuta {
        [*] --> NotificacionLlegada
        NotificacionLlegada --> PesajeInSitu: Operador valida residuos con báscula IoT
    }

    PesajeInSitu --> DepositoAcreditado: Transmisión digital de datos a AuthContext
    DepositoAcreditado --> [*]: Puntos y Multiplicadores Acreditados en cuenta
```
