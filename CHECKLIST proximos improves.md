🧱 FASE 1: Reestructuración Básica y Renombrado
 Renombrar PromptInput.tsx → PromptConsole.tsx

 Actualizar todos los imports que apuntan a PromptInput

 Crear nueva carpeta components/console/ y mover allí:

 PromptConsole.tsx

 Crear stub ModelSelector.tsx (componente vacío con TODO)

 Crear carpeta components/stream/ con:

 LiveStreamPanel.tsx (estructura vacía)

 TokenDisplay.tsx (vacío)

 ProcessingStatus.tsx (vacío)

 Crear carpeta components/output/ y mover allí:

 OutputDisplay.tsx

 Crear ExportControls.tsx (puede reusar lógica de ExportButton)

 Mover ExportButton.tsx a components/ui/ si aún no está allí

 Validar que components/flow/ y panels/ ya están bien estructurados

🧠 FASE 2: Tipos y API
 En lib/types.ts, agregar:

 ExecutionPayload

 WebSocketEvent

 StreamState

 En lib/api.ts, agregar:

 execute(payload: ExecutionPayload)

 getHistory(userId?: string)

 createWebSocketConnection()

🧪 FASE 3: Hooks y Store (estructura vacía/mock)
 Crear hooks/useWebSocket.ts (conectado a mock local o ws://localhost)

 Crear hooks/useLiveStream.ts (wrapper sobre useWebSocket)

 Crear store/streamStore.ts con estructura inicial:

 connectionStatus, currentExecution, acciones básicas

🧩 FASE 4: Layout + Integración Progresiva
 En app/page.tsx, aplicar layout 3 columnas:

 Columna izquierda: PromptConsole, ModelSelector, MetricsPanel

 Centro: tabs para LiveStreamPanel, FlowVisualizer, OutputDisplay

 Derecha: NodeDetailPanel, HistoryPanel (mock)

 Validar que Tabs y TanStack sigan funcionando

 Ajustar lógica condicional de carga (isExecuting, output, etc.)

🧼 FASE 5 (Opcional): Limpieza y Mocks
 Crear mocks/stream.mock.ts si querés simular WebSocket

 Extraer lógica de exportación desde Output hacia ExportControls.tsx

 Confirmar que useExecutionStore no mezcla lógica de streamStore