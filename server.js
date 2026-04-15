// Render fallback entrypoint:
// if the service is configured with `node server.js` at repo root,
// delegate execution to the actual backend app in /backend.
require('./backend/server');
