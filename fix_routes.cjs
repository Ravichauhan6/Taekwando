const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const markerStart = '// --- Dynamic Admin APIs generated below ---';
const markerEnd = 'app.listen(PORT';

if (content.indexOf(markerStart) > content.indexOf('app.use(vite.middlewares)')) {
  // Extract the routes
  const startIdx = content.indexOf(markerStart);
  const endIdx = content.indexOf(markerEnd);
  const routesStr = content.substring(startIdx, endIdx);
  
  // Remove them from current position
  content = content.slice(0, startIdx) + content.slice(endIdx);
  
  // Insert before Vite middleware
  const target = '// --- Vite middleware for development ---';
  content = content.replace(target, routesStr + '\n' + target);
  
  fs.writeFileSync('server.ts', content);
  console.log('Fixed API route ordering!');
} else {
  console.log('Routes already in correct order.');
}
