# 👤 Flujos de Usuario (User Flows) - E-Cycle

Este documento describe y diagrama los 6 flujos de usuario principales implementados en la aplicación **E-Cycle**, utilizando una paleta estandarizada de alto contraste.

---

## 1. Flujo de Onboarding y Registro de Nuevo Usuario

```mermaid
sequenceDiagram
    autonumber
    actor Usuario as 👤 Usuario
    participant App as 📱 AppRouter
    participant Onboarding as 📖 Onboarding
    participant Register as 📝 Registro
    participant Auth as 🔐 AuthContext

    Usuario->>App: Abre la aplicación por primera vez
    App->>Onboarding: Muestra Onboarding (3 slides ilustrados)
    Usuario->>Onboarding: Navega entre slides explicativos
    Usuario->>Onboarding: Presiona "Comenzar" o "Registrarme"
    Onboarding->>Register: Abre modal de Registro
    Usuario->>Register: Ingresa Nombre, Correo, Contraseña y Comuna
    Usuario->>Register: Presiona "Crear Cuenta"
    Register->>Auth: Ejecuta register() con datos iniciales
    Auth->>Auth: Inicializa usuario con nivel 'Descubridor' y 0 pts
    Auth-->>App: Actualiza estado global de autenticación
    App-->>Usuario: Muestra la pantalla principal 'Explorar'
```

---

## 2. Flujo de Exploración del Mapa y Búsqueda de Puntos Limpios

```mermaid
graph TD
    classDef primary fill:#004D40,stroke:#00382E,stroke-width:2px,color:#FFFFFF,font-weight:bold;
    classDef step fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A,font-weight:600;
    classDef highlight fill:#E0F2F1,stroke:#004D40,stroke-width:2px,color:#004D40,font-weight:bold;
    classDef decision fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E,font-weight:bold;

    A["Usuario en Pestaña 'Explorar'"]:::primary --> B{"¿Cómo interactúa?"}:::decision
    
    B -->|"Exploración Libre"| C["Interactúa con Mapa Interactivo"]:::step
    C --> D["Hace tap en Pin de Punto Limpio"]:::highlight
    
    B -->|"Búsqueda Dirigida"| E["Presiona Barra de Búsqueda"]:::step
    E --> F["Se despliega Overlay de Búsqueda"]:::step
    F --> G["Filtra por 'Dónde' - Comuna o Nombre"]:::step
    F --> H["Filtra por 'Materiales' - Chips de Residuos"]:::step
    G & H --> I["Presiona 'Buscar'"]:::primary
    I --> J["Mapa filtra los pines coincidentes"]:::step
    J --> D

    B -->|"Misión del Mes"| K["Toca Card en Carrusel de Misiones"]:::step
    K --> D

    D --> L["Bottom Sheet: Detalle del Punto Limpio"]:::primary
    L --> M["Visualiza Horarios, Dirección y Materiales"]:::step
    L --> N["Presiona 'Cómo Llegar' (Abre app externa de mapas)"]:::step
    L --> O["Presiona 'Escanear Aquí' (Redirige a Escáner)"]:::highlight
```

---

## 3. Flujo de Escaneo QR y Registro de Depósito de Residuos

```mermaid
graph TD
    classDef primary fill:#004D40,stroke:#00382E,stroke-width:2px,color:#FFFFFF,font-weight:bold;
    classDef step fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A,font-weight:600;
    classDef highlight fill:#E0F2F1,stroke:#004D40,stroke-width:2px,color:#004D40,font-weight:bold;
    classDef decision fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E,font-weight:bold;

    A["Usuario presiona Pestaña 'Escáner'"]:::primary --> B["Se activa ScanCamera con Visor en Vivo"]:::step
    B --> C["Apunta la cámara al código QR del contenedor"]:::step
    C --> D["Simulación / Detección exitosa del QR"]:::highlight
    
    D --> E["Paso 'Analyzing': Animación de Validación IoT"]:::step
    E -->|1.2s| E1["Verificando código QR..."]:::step
    E1 -->|1.2s| E2["Validando ubicación..."]:::step
    E2 -->|1.2s| E3["Conectando con contenedor B-103..."]:::step
    E3 --> F["Paso 'Input': Pantalla de Registro de Residuos"]:::step
    
    F --> G["Usuario ajusta cantidades con botones + / -"]:::step
    G --> H["Cálculo reactivo: Puntos Base x Multiplicador Activo"]:::highlight
    H --> I["Usuario presiona 'Confirmar Depósito'"]:::primary
    
    I --> J["Paso 'Validating': Procesamiento de Depósito"]:::step
    J --> K["Ejecuta deposit en AuthContext"]:::primary
    K --> L["Actualiza saldo de E-Points, estadísticas y recalcula Nivel"]:::highlight
    
    L --> M["Paso 'Success': Pantalla de Celebración y Éxito"]:::primary
    M --> N{"Decisión del Usuario"}:::decision
    N -->|"Presiona 'Canjear Puntos'"| O["Redirige a E-Hub en pestaña 'Usar'"]:::highlight
    N -->|"Presiona 'Seguir Reciclando'"| P["Reinicia el Escáner para nuevo depósito"]:::step
```

---

## 4. Flujo de E-Hub: Beneficios, Canje de Cupones y Misiones

```mermaid
graph TD
    classDef primary fill:#004D40,stroke:#00382E,stroke-width:2px,color:#FFFFFF,font-weight:bold;
    classDef step fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A,font-weight:600;
    classDef highlight fill:#E0F2F1,stroke:#004D40,stroke-width:2px,color:#004D40,font-weight:bold;
    classDef decision fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E,font-weight:bold;

    A["Usuario entra a 'E-Hub'"]:::primary --> B{"Selecciona Sub-Pestaña"}:::decision
    
    subgraph SubTab_Beneficios ["1. Pestaña Beneficios"]
        B -->|"Beneficios"| C1["Visualiza Multiplicador de Nivel Actual"]:::highlight
        C1 --> C2["Visualiza Cuenta Regresiva de Beneficio Mensual"]:::step
        C1 --> C3["Banner de Misión Destacada de Partner"]:::step
    end

    subgraph SubTab_Usar ["2. Pestaña Usar Puntos"]
        B -->|"Usar"| D1["Catálogo de Cupones de Descuento"]:::step
        D1 --> D2["Búsqueda por texto o filtro por Categoría"]:::step
        D2 --> D3["Toca un Cupón disponible"]:::step
        D3 --> D4{"¿Tiene puntos suficientes?"}:::decision
        D4 -->|"No"| D5["Botón Deshabilitado / Alerta de Saldo Insuficiente"]:::step
        D4 -->|"Sí"| D6["Abre Modal de Confirmación de Canje"]:::highlight
        D6 --> D7["Presiona 'Confirmar Canje'"]:::primary
        D7 --> D8["Animación de Procesamiento - 2 segundos"]:::step
        D8 --> D9["Descuenta puntos y muestra Código Único"]:::highlight
    end

    subgraph SubTab_Progreso ["3. Pestaña Tu Progreso"]
        B -->|"Tu Progreso"| E1["Lista de Misiones Semanales y Diarias"]:::step
        E1 --> E2["Filtra por: Todas / Completadas / Diarias / Semanales"]:::step
        E2 --> E3["Revisa barras de progreso y recompensas asociadas"]:::highlight
    end
```

---

## 5. Flujo de Perfil de Usuario, Rango E-Cycler e Insignias 3D

```mermaid
graph TD
    classDef primary fill:#004D40,stroke:#00382E,stroke-width:2px,color:#FFFFFF,font-weight:bold;
    classDef step fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A,font-weight:600;
    classDef highlight fill:#E0F2F1,stroke:#004D40,stroke-width:2px,color:#004D40,font-weight:bold;
    classDef decision fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#92400E,font-weight:bold;

    A["Usuario presiona Avatar / Nivel desde Home o E-Hub"]:::primary --> B["Se despliega Drawer de Perfil"]:::step
    
    B --> C{"Acciones en Perfil"}:::decision
    
    C -->|"Toca LevelIndicator"| D["Abre Modal 'Rango E-Cycler'"]:::highlight
    C --> D1["Explora rangos con gesto Swipe horizontal"]:::step
    D1 --> D2["Interfaz cambia dinámicamente de color según rango"]:::highlight
    D2 --> D3["Revisa beneficios del rango y requisitos"]:::step
    D1 --> D4["Galería de Insignias y Logros"]:::step
    D4 --> D5["Toca una Insignia bloqueada"]:::step
    D5 --> D6["Efecto 3D Flip Card - Revela cómo desbloquearla"]:::step

    C -->|"Toca Botón 'Configuración'"| E["Se desliza el Panel de Configuración"]:::step
    E --> E1["Alterna Modo Oscuro / Claro"]:::step
    E --> E2["Gestiona Notificaciones Push"]:::step
    E --> E3["Accede a Términos de Servicio y Privacidad"]:::step

    C -->|"Revisa Estadísticas"| F["Métricas de Unidades y Kg de Residuos Reciclados"]:::highlight
```

---

## 6. Flujo de Retiro a Domicilio (Pickup)

```mermaid
graph TD
    classDef primary fill:#004D40,stroke:#00382E,stroke-width:2px,color:#FFFFFF,font-weight:bold;
    classDef step fill:#FFFFFF,stroke:#94A3B8,stroke-width:1.5px,color:#0F172A,font-weight:600;

    A["Usuario presiona Pestaña 'Retiro'"]:::primary --> B["Se muestra Pantalla de Retiros a Domicilio"]:::step
    B --> C["Tarjeta Informativa del Servicio"]:::step
    B --> D["Estado Vacío: 'No tienes retiros pendientes'"]:::step
    B --> E["Banner Informativo de Cobertura por Comunas"]:::step
    C --> F["Botón 'Próximamente' - En fase piloto"]:::step
```
