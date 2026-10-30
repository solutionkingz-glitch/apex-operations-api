
const metrics = {
  totalRequests: 0,
  totalDurationMs: 0,
  requests: new Map()
};

export function recordRequest(method, statusCode, durationMs) {
  metrics.totalRequests += 1;
  metrics.totalDurationMs += durationMs;

  const key = `${method}_${statusCode}`;

  metrics.requests.set(
    key,
    (metrics.requests.get(key) || 0) + 1
  );
}

export function getMetrics() {
  const lines = [
    '# HELP http_requests_total Total HTTP requests',
    '# TYPE http_requests_total counter',
    `http_requests_total ${metrics.totalRequests}`,
    '',
    '# HELP http_request_duration_ms_total Total HTTP request duration in milliseconds',
    '# TYPE http_request_duration_ms_total counter',
    `http_request_duration_ms_total ${metrics.totalDurationMs}`
  ];

  for (const [key, count] of metrics.requests) {
    const [method, statusCode] = key.split('_');

    lines.push(
      `http_requests_by_method_status_total{method="${method}",status="${statusCode}"} ${count}`
    );
  }

  return `${lines.join('\n')}\n`;
}
