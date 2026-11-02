const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const jsonServer = require('json-server');

async function main() {
  const root = path.resolve(__dirname, '..');
  const directory = path.join(root, '.cache', 'api-check');
  fs.mkdirSync(directory, { recursive: true });
  const filename = path.join(directory, 'db.json');
  fs.copyFileSync(path.join(root, 'db.json'), filename);
  const app = jsonServer.create();
  app.use(jsonServer.defaults({ logger: false, static: directory }));
  app.use(jsonServer.bodyParser);
  app.use(jsonServer.router(filename));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  async function call(url, method = 'GET', body = undefined) {
    const response = await globalThis.fetch(base + url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    assert.ok(response.ok, `${method} ${url}: ${response.status}`);
    return response.json();
  }
  try {
    const counts = {};
    for (const resource of [
      'students',
      'courses',
      'sessions',
      'assignments',
      'grades',
    ]) {
      counts[resource] = (await call('/' + resource)).length;
      assert.ok(counts[resource] >= 5, `${resource}: too few records`);
    }
    assert.equal((await call('/students/1')).studentCode, '2351120042');
    assert.ok((await call('/courses/1')).name);
    for (const resource of ['sessions', 'assignments', 'grades']) {
      const items = await call(`/${resource}?_expand=course`);
      assert.ok(items.every(item => item.course?.id === item.courseId));
    }
    const sorted = await call(
      '/assignments?_expand=course&_sort=dueDate&_order=asc',
    );
    assert.deepEqual(
      sorted.map(item => item.dueDate),
      sorted.map(item => item.dueDate).sort(),
    );
    const updatedAt = new Date().toISOString();
    const created = await call('/assignments', 'POST', {
      id: 'api-check-client-id',
      courseId: 1,
      title: 'API test only',
      description: '',
      dueDate: '2099-11-09T16:59:00.000Z',
      status: 'todo',
      updatedAt,
    });
    assert.equal(created.id, 'api-check-client-id');
    const patched = await call(`/assignments/${created.id}`, 'PATCH', {
      status: 'done',
      updatedAt,
    });
    assert.equal(patched.status, 'done');
    assert.equal(
      (await call(`/assignments/${created.id}?_expand=course`)).course.id,
      1,
    );
    await call('/students/1', 'PATCH', {
      fullName: 'API test only',
      updatedAt,
    });
    const persisted = JSON.parse(fs.readFileSync(filename, 'utf8'));
    assert.equal(persisted.students[0].fullName, 'API test only');
    assert.equal(
      persisted.assignments.find(item => item.id === created.id).status,
      'done',
    );
    console.log(
      'PASS: real json-server GET/expand/sort, POST with stable string ID, PATCH and disk persistence.',
    );
    console.log('Sample counts:', counts);
    console.log('Only .cache/api-check/db.json was mutated.');
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
}
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
