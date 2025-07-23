# Arquitectura del Frontend — AI Agent Lab

Este documento describe la estructura, propósito y contenidos de cada carpeta y archivo del frontend. Está diseñado para prevenir duplicaciones, mejorar la escalabilidad y facilitar el reemplazo de mocks por datos reales.

---

## 📁 Estructura General

frontend/
├── app/
│   ├── history/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── flow/
│   │   ├── FlowVisualizer.tsx
│   │   └── NodeDetailPanel.tsx
│   ├── panels/
│   │   ├── MetricsPanel.tsx
│   │   ├── HistoryPanel.tsx
│   │   └── LiveStreamPanel.tsx  (*TODO*)
│   ├── console/
│   │   ├── PromptConsole.tsx
│   │   └── ModelSelector.tsx
│   ├── output/
│   │   ├── OutputDisplay.tsx
│   │   └── ExportControls.tsx
│   ├── ui/
│   │   ├── ExportButton.tsx
│   │   ├── Navbar.tsx
│   │   └── tabs.tsx
├── hooks/
│   ├── useExecution.ts
│   ├── useSystemMetrics.ts
│   ├── useModels.ts
│   ├── useWebSocket.ts  (*TODO*)
│   └── useLiveStream.ts (*TODO*)
├── lib/
│   ├── api.ts
│   ├── types.ts
│   └── utils.ts
├── mocks/
│   ├── fullExecution.mock.ts
│   ├── logs.mock.ts
│   ├── metrics.mock.ts
│   ├── output.mock.ts
│   └── index.ts
├── store/
│   ├── configStore.ts
│   ├── streamStore.ts
│   └── useExecutionStore.ts (incluido en useExecution.ts)
├── next-env.d.ts
└── next.config.ts

---

## 📄 Descripción de Archivos Clave

### `app/`
- `page.tsx`: Página principal del Lab. Divide la vista en consola + tabs + detalle.
- `history/page.tsx`: Página completa del historial de ejecuciones.
- `layout.tsx`: Layout global de la aplicación.
- `providers.tsx`: Contextos globales (Zustand, QueryClient, etc).

### `components/`

#### `flow/`
- `FlowVisualizer.tsx`: Visualización del flujo de ejecución.
- `NodeDetailPanel.tsx`: Muestra el detalle de un nodo seleccionado.

#### `panels/`
- `MetricsPanel.tsx`: Métricas del sistema y del modelo.
- `HistoryPanel.tsx`: Vista parcial del historial.
- `LiveStreamPanel.tsx`: (*TODO*) Tokens/logs en tiempo real.

#### `console/`
- `PromptConsole.tsx`: Entrada principal del prompt.
- `ModelSelector.tsx`: Selector de modelo y estrategia.

#### `output/`
- `OutputDisplay.tsx`: Muestra la salida generada.
- `ExportControls.tsx`: Botones de exportación inteligentes.

#### `ui/`
- `ExportButton.tsx`: Componente para descarga de archivos.
- `Navbar.tsx`: Navegación entre secciones.
- `tabs.tsx`: Tabs controlados por contexto.

### `hooks/`
- `useExecution.ts`: Maneja ejecución de prompts + historial.
- `useSystemMetrics.ts`: Métricas GPU simuladas.
- `useModels.ts`: (*En desarrollo*) Listado de modelos.
- `useWebSocket.ts`: (*TODO*) Conexión al servidor de stream.
- `useLiveStream.ts`: (*TODO*) Manejo de tokens/logs.

### `lib/`
- `api.ts`: Simula peticiones a una API real.
- `types.ts`: Tipos globales (nodos, métricas, ejecución).
- `utils.ts`: Helpers varios.

### `mocks/`
- `fullExecution.mock.ts`: Resultado completo de una ejecución.
- `logs.mock.ts`: Logs tipo consola.
- `metrics.mock.ts`: Métricas simuladas.
- `output.mock.ts`: Texto simulado por LLM.
- `index.ts`: Entrada común para importar mocks.

### `store/`
- `configStore.ts`: Configuraciones como modelo, estrategia, temperatura.
- `streamStore.ts`: Estado del stream WebSocket.
- `useExecutionStore`: Dentro de `useExecution.ts`.



✅ Buenas Prácticas
Todos los mocks están en /mocks y centralizados vía index.ts.

Hooks y stores están desacoplados y enfocados por responsabilidad.

El componente ExportControls evita duplicación de lógica y usa ExportButton.

El historial tiene su store reactivo (Zustand) pero también vista propia (page.tsx) y parcial (HistoryPanel.tsx).

El layout usa Grid de 12 columnas para organización clara: 4 (consola) + 5 (tabs) + 3 (detalle).

Componentes marcados con TODO: ya están placeholders y listos para reemplazar.