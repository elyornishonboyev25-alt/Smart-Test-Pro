const API_BASE = '/api/v1';

export async function getTests() {
  const res = await fetch(`${API_BASE}/tests`);
  return res.json();
}

export async function getTest(id: string) {
  const res = await fetch(`${API_BASE}/tests/${id}`);
  return res.json();
}

export async function saveSession(token: string, testId: string, state: unknown) {
  const res = await fetch(`${API_BASE}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ testId, state })
  });
  return res.json();
}

export async function getSession(token: string, testId: string) {
  const res = await fetch(`${API_BASE}/sessions/${testId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function submitResults(token: string, payload: unknown) {
  const res = await fetch(`${API_BASE}/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function adminCreateTest(token: string, body: unknown) {
  const res = await fetch(`${API_BASE}/tests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  return res.json();
}

