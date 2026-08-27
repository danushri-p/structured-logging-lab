# Cloud logging mapping

The API writes one JSON object per line to standard output. A cloud log collector
can parse these objects into searchable fields without changing the application.

- Google Cloud Logging can ingest container stdout and expose `severity`, `timestamp`,
  `service`, `reqId`, and custom fields such as `orderId` for Logs Explorer queries.
- Grafana Loki can label the service and search parsed JSON fields with LogQL, for
  example `{service="orders-api"} | json | level="error"`.

The local equivalent is `docker logs orders-api | jq 'select(.level=="error")'`.
The request ID makes the same failure traceable across requests and services, while
the logs intentionally contain identifiers and error messages, never passwords,
tokens, card numbers, or database credentials.