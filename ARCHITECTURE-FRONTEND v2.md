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
│   │   ├── ModelSelector.tsx
│   │   └── ExecutionTypeSelector.tsx  (*NUEVO*)
│   ├── output/
│   │   ├── OutputDisplay.tsx
│   │   ├── DynamicOutputDisplay.tsx  (*NUEVO*)
│   │   └── ExportControls.tsx
│   ├── ui/
│   │   ├── ExportButton.tsx
│   │   ├── Navbar.tsx
│   │   └── tabs.tsx
├── hooks/
│   ├── useExecution.ts  (*ACTUALIZADO*)
│   ├── useSystemMetrics.ts  (*OPTIMIZADO*)
│   ├── useModels.ts
│   ├── useWebSocket.ts  (*TODO*)
│   └── useLiveStream.ts (*TODO*)
├── lib/
│   ├── api.ts  (*ACTUALIZADO*)
│   ├── types.ts  (*ACTUALIZADO*)
│   ├── utils.ts
│   ├── flowRegistry.ts  (*NUEVO*)
│   ├── flowDefinitions.ts  (*NUEVO*)
│   └── flowAdapter.ts  (*NUEVO*)
├── mocks/
│   ├── fullExecution.mock.ts
│   ├── logs.mock.ts
│   ├── metrics.mock.ts
│   ├── output.mock.ts
│   └── index.ts
├── store/
│   ├── configStore.ts  (*ACTUALIZADO*)
│   ├── streamStore.ts
│   └── useExecutionStore.ts (incluido en useExecution.ts)
├── next-env.d.ts
└── next.config.ts


---

## 📄 Descripción de Archivos Clave

### `app/`
- `page.tsx`: Página principal del Lab. Divide la vista en consola + tabs + detalle. Incluye ExecutionTypeSelector.
- `history/page.tsx`: Página completa del historial de ejecuciones.
- `layout.tsx`: Layout global de la aplicación.
- `providers.tsx`: Contextos globales (Zustand, QueryClient, etc).

### `components/`

#### `flow/`
- `FlowVisualizer.tsx`: Visualización del flujo de ejecución (simple LLM vs orchestrator).
- `NodeDetailPanel.tsx`: Muestra el detalle de un nodo seleccionado.

#### `panels/`
- `MetricsPanel.tsx`: Métricas del sistema y del modelo.
- `HistoryPanel.tsx`: Vista parcial del historial.
- `LiveStreamPanel.tsx`: (*TODO*) Tokens/logs en tiempo real.

#### `console/`
- `PromptConsole.tsx`: Entrada principal del prompt.
- `ModelSelector.tsx`: Selector de modelo y estrategia (standard/optimized/streaming).
- `ExecutionTypeSelector.tsx`: (*NUEVO*) Toggle entre Simple LLM y Orchestrator con configuración de agents/tools.

#### `output/`
- `OutputDisplay.tsx`: Muestra la salida generada.
- `ExportControls.tsx`: Botones de exportación inteligentes.
- `DynamicOutputDisplay.tsx`: (NUEVO) Visualización adaptable al tipo de flujo (linear, challenge, etc).

#### `ui/`
- `ExportButton.tsx`: Componente para descarga de archivos.
- `Navbar.tsx`: Navegación entre secciones.
- `tabs.tsx`: Tabs controlados por contexto.

### `hooks/`
- `useExecution.ts`: (*ACTUALIZADO*) Maneja ejecución de prompts + historial. Soporte para simple vs orchestrator.
- `useSystemMetrics.ts`: (*OPTIMIZADO*) Métricas GPU con polling reducido (30s).
- `useModels.ts`: (*En desarrollo*) Listado de modelos.
- `useWebSocket.ts`: (*TODO*) Conexión al servidor de stream.
- `useLiveStream.ts`: (*TODO*) Manejo de tokens/logs.

### `lib/`
- `api.ts`: (*ACTUALIZADO*) Cliente API con soporte para executeWithType() y URLs corregidas.
- `types.ts`: (*ACTUALIZADO*) Tipos globales incluyendo ExecutionRequest con execution_type.
- `utils.ts`: Helpers varios.
- `flowRegistry.ts`: (NUEVO) Registry singleton para gestión de flujos disponibles (linear, challenge, research).
- `flowDefinitions.ts`: (NUEVO) Tipos e interfaces para definir flujos de manera declarativa.
- `flowAdapter.ts`: (NUEVO) Adaptadores para enriquecer ExecutionResult con información de flujos y extraer outputs por nodo.

### `mocks/`
- `fullExecution.mock.ts`: Resultado completo de una ejecución.
- `logs.mock.ts`: Logs tipo consola.
- `metrics.mock.ts`: Métricas simuladas.
- `output.mock.ts`: Texto simulado por LLM.
- `index.ts`: Entrada común para importar mocks.

### `store/`
- `configStore.ts`: (*ACTUALIZADO*) Configuraciones expandidas con executionType y orchestrator settings.
- `streamStore.ts`: Estado del stream WebSocket.
- `useExecutionStore`: Dentro de `useExecution.ts`.

---



## v0.03 🆕 Cambios Principales Implementados  - 2025 - 16 - 08

### **Soporte para Orchestrator:**
1. **ExecutionTypeSelector**: Nuevo componente para toggle Simple LLM vs Orchestrator
2. **ConfigStore expandido**: Incluye orchestrator.agents, orchestrator.tools, orchestrator.verbose
3. **API actualizada**: Método executeWithType() para manejar ambos tipos de ejecución
4. **Types actualizados**: ExecutionRequest con execution_type y campos opcionales para orchestrator

### **Optimizaciones de Rendimiento:**
1. **Health checks optimizados**: Reducidos de 5s a 30s intervals
2. **URLs corregidas**: Barras finales para evitar 307 redirects
3. **React Query optimizado**: Singleton pattern y staleTime configurado

### **Arquitectura de Ejecución:**
- **Frontend Request**: → useExecution hook → api.executeWithType() → Backend routing → Lab Service
- **Simple LLM**: execution_type="simple" → Backend → Lab /inference/ → Direct model execution
- **Orchestrator**: execution_type="orchestrator" → Backend → Lab /orchestrate/ → LangGraph workers

---

## v0.02 🆕 Cambios Principales Implementados  - 2025 - 09- 05

## ✅ Buenas Prácticas Mantenidas
- Todos los mocks están en /mocks y centralizados vía index.ts.
- Hooks y stores están desacoplados y enfocados por responsabilidad.
- El componente ExportControls evita duplicación de lógica y usa ExportButton.
- El historial tiene su store reactivo (Zustand) pero también vista propia (page.tsx) y parcial (HistoryPanel.tsx).
- El layout usa Grid de 12 columnas para organización clara: 4 (consola) + 5 (tabs) + 3 (detalle).
- Componentes marcados con TODO: ya están placeholders y listos para reemplazar.

---

## 🆕 Cambios Principales Implementados

### Sistema de Flujos Dinámicos
- **FlowRegistry**: Sistema de registro para flujos configurables (linear, challenge, research).
- **DynamicOutputDisplay**: Componente genérico que adapta visualización según tipo de flujo.
- **Challenge Flow**: Soporte completo para flujo creator→challenger→refiner.
- **FlowAdapter**: Enriquece respuestas con definiciones de flujo y extrae outputs por nodo.

### Soporte Expandido para Ejecución
- **ExecutionTypeSelector**: Selector dinámico que lee flujos del registry.
- **ConfigStore expandido**: Incluye selectedFlowId, execution_type con 'challenge'.
- **API actualizada**: executeWithType() con soporte para flow_type.
- **Types actualizados**: `ExecutionRequest` incluye flow_type para especificar grafo a ejecutar.

### Arquitectura de Flujos
- **Simple LLM**: Ejecución directa con modelo único.
- **Linear Flow**: Orchestrator tradicional con agents y tools.
- **Challenge Flow**: Debate entre modelos (creator→challenger→refiner).
- **Extensible**: Nuevos flujos se agregan solo con configuración JSON.

### Optimizaciones de Rendimiento
- **Health checks optimizados**: Reducidos de 5s a 30s intervals.
- **URLs corregidas**: Barras finales para evitar 307 redirects.
- **React Query optimizado**: Singleton pattern y staleTime configurado.

---

## 🔄 Flujo de Ejecución Actualizado
1. **Usuario selecciona flujo** en ExecutionTypeSelector (simple/linear/challenge).
2. **FlowRegistry provee configuración** del flujo seleccionado.
3. **Submit prompt** → useExecution construye request con flow_type.
4. **API call** → executeWithType() incluye flow_type en request.
5. **Backend routing** → Lab ejecuta grafo específico según flow_type.
6. **Response processing** → FlowAdapter enriquece resultado con definición.
7. **UI rendering** → DynamicOutputDisplay adapta visualización al tipo de flujo.

---

## 🔧 Extensibilidad de Flujos
### Agregar un nuevo flujo
1. Crear definición en `flowRegistry.ts`:
   ```typescript
   flowRegistry.register({
     id: 'nuevo_flujo',
     name: 'Mi Nuevo Flujo',
     layout: 'horizontal',
     display: { type: 'tabs' },
     requestConfig: { execution_type: 'orchestrator', flow_type: 'nuevo_flujo' }
   })