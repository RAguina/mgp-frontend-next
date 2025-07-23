export const mockLogs = [
  {
    timestamp: '2025-07-12T20:01:00Z',
    event: 'run_initialized',
    model_key: 'mistral7b'
  },
  {
    timestamp: '2025-07-12T20:01:10Z',
    event: 'node_completed',
    node_id: 'validator',
    metrics: {
      execution_time_ms: 1150
    }
  },
  {
    timestamp: '2025-07-12T20:01:15Z',
    event: 'metrics_saved',
    metrics: {
      infer_time_sec: 10.53,
      output_length: 619
    }
  }
];
