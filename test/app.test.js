import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

import { app } from '../app.js';

let server;
let baseUrl;

before(async () => {
  server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  const address = server.address();

  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
});

test('GET / should return the CloudGuard home page', async () => {
  const response = await fetch(`${baseUrl}/`);

  assert.equal(response.status, 200);

  const body = await response.text();

  assert.match(body, /CloudGuard/);
  assert.match(body, /IAM Access Risk Auditor/);
});

test('GET /health should return healthy status', async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);

  const body = await response.json();

  assert.equal(body.status, 'healthy');
});

test('GET /api/access should return access records', async () => {
  const response = await fetch(`${baseUrl}/api/access`);

  assert.equal(response.status, 200);

  const body = await response.json();

  assert.equal(body.success, true);
  assert.ok(Array.isArray(body.records));
  assert.ok(body.records.length >= 2);
});

test('POST /access should create a HIGH risk record for Production Delete access', async () => {
  const response = await fetch(`${baseUrl}/access`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: 'TestUser',
      role: 'Developer',
      environment: 'Production',
      resource: 'S3',
      permission: 'Delete'
    })
  });

  assert.equal(response.status, 201);

  const body = await response.json();

  assert.equal(body.success, true);
  assert.equal(body.record.risk, 'HIGH');
});

test('POST /access should reject invalid input', async () => {
  const response = await fetch(`${baseUrl}/access`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: 'A',
      role: 'Developer',
      environment: 'Production',
      resource: 'S3',
      permission: 'Delete'
    })
  });

  assert.equal(response.status, 400);

  const body = await response.json();

  assert.equal(body.success, false);
  assert.ok(body.error);
});