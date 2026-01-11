/**
 * Script om te controleren welke server er draait op poort 3001
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🔍 Controleren welke server draait op poort 3001...\n');

try {
  // Windows netstat commando
  const { stdout } = await execAsync('netstat -ano | findstr :3001');
  console.log('Processen op poort 3001:');
  console.log(stdout);
  
  // Probeer te verbinden met de server
  console.log('\n📡 Testen server connectie...');
  try {
    const response = await fetch('http://localhost:3001/health');
    const data = await response.json();
    console.log('✅ Server is bereikbaar!');
    console.log('Response:', data);
    
    // Test routes endpoint
    try {
      const routesResponse = await fetch('http://localhost:3001/api/routes');
      const routesData = await routesResponse.json();
      console.log('\n✅ Routes endpoint werkt!');
      console.log('Available routes:', routesData);
    } catch (err) {
      console.log('\n❌ Routes endpoint werkt niet:', err.message);
    }
    
    // Test chat endpoint (zonder daadwerkelijk te chatten)
    try {
      const chatResponse = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [] })
      });
      
      if (chatResponse.status === 400) {
        console.log('\n✅ Chat endpoint bestaat! (400 is verwacht voor lege messages)');
      } else {
        console.log(`\n⚠️  Chat endpoint reageert met status: ${chatResponse.status}`);
        const errorData = await chatResponse.json();
        console.log('Response:', errorData);
      }
    } catch (err) {
      console.log('\n❌ Chat endpoint werkt niet:', err.message);
    }
    
  } catch (err) {
    console.log('❌ Kan niet verbinden met server:', err.message);
  }
  
} catch (error) {
  console.error('Error:', error.message);
}
