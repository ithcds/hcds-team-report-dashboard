const fs = require('fs');
const https = require('https');
const vm = require('vm');

const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxamhwZGhwZWpxa2Rtcnl3eGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MDY5NDIsImV4cCI6MjEwMzE4Mjk0Mn0.aMSBvgIXIl4qhQbUH2YV0nBpcPMH9exBwlkylSk8Vrk';
const SUPABASE_URL = 'https://zqjhpdhpejqkdmrywxdl.supabase.co';

const html = fs.readFileSync('dashboard.html', 'utf8');

const sandbox = {};
vm.createContext(sandbox);

const tasksStart = html.indexOf('const EXCEL_BASELINE_TASKS = [');
const tasksEnd = html.indexOf('];\n\nconst BIG_DATA_PIPELINES', tasksStart) + 2;
const tasksCode = 'var EXCEL_BASELINE_TASKS = ' + html.slice(tasksStart + 'const EXCEL_BASELINE_TASKS = '.length, tasksEnd);

const matrixStart = html.indexOf('const INITIAL_PRODUCT_MATRICES = {');
const matrixEnd = html.indexOf('};\n\nlet PRODUCT_MATRICES', matrixStart) + 2;
const matrixCode = 'var INITIAL_PRODUCT_MATRICES = ' + html.slice(matrixStart + 'const INITIAL_PRODUCT_MATRICES = '.length, matrixEnd);

vm.runInContext(tasksCode + '\n' + matrixCode, sandbox);

const tasks = sandbox.EXCEL_BASELINE_TASKS;
const matrices = sandbox.INITIAL_PRODUCT_MATRICES;

console.log(`Loaded ${tasks.length} baseline tasks and product matrices.`);

const teamTasksRows = tasks.map(t => ({
  id: t.id,
  task_date: t.date || new Date().toISOString().slice(0, 10),
  team_member: t.member || 'Unassigned',
  task_title: t.title || '',
  description: t.desc || '',
  product: t.product || 'General',
  priority: t.priority || 'Medium',
  status: t.status || 'On Progress',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}));

const matrixRows = [];
const addList = (pKey, sKey, arr) => {
  if (!arr || !Array.isArray(arr)) return;
  arr.forEach((feat, idx) => {
    matrixRows.push({
      id: `${pKey}_${sKey}_${idx}`,
      product_key: pKey,
      sub_key: sKey,
      feature_index: idx,
      feature_name: feat.name || '',
      status: feat.ok === true ? 'Active' : (feat.ok === false ? 'Error' : 'Testing'),
      is_ok: feat.ok !== undefined ? feat.ok : null,
      error_desc: feat.error || '',
      notes: feat.note || '',
      tester: feat.tester || '',
      tested_at: feat.testedAt || '',
      updated_at: new Date().toISOString()
    });
  });
};

if (matrices.ismart) {
  addList('ismart', 'patient', matrices.ismart.patient);
  addList('ismart', 'clinic', matrices.ismart.clinic);
  addList('ismart', 'provider', matrices.ismart.provider);
  addList('ismart', 'webclinic', matrices.ismart.webclinic);
}
if (matrices.enterprise) {
  addList('enterprise', 'allcare', matrices.enterprise.allcare);
  addList('enterprise', 'fmbo', matrices.enterprise.fmbo);
  addList('enterprise', 'sphinx', matrices.enterprise.sphinx);
}
if (matrices.annie) {
  addList('annie', 'annie', matrices.annie);
}

function upsert(endpoint, rows) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(rows);
    const req = https.request(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        console.log(`[${endpoint}] Response HTTP ${res.statusCode} ${b ? '- ' + b : '(Success)'}`);
        resolve();
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function seed() {
  console.log(`Seeding ${teamTasksRows.length} rows to team_tasks...`);
  await upsert('team_tasks', teamTasksRows);

  console.log(`Seeding ${matrixRows.length} rows to product_matrices...`);
  await upsert('product_matrices', matrixRows);

  console.log('🎉 Seeding successfully completed!');
}

seed().catch(console.error);
