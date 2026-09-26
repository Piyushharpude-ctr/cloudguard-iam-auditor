/* global FormData */

const form = document.getElementById('accessForm');
const result = document.getElementById('result');
const recordsBody = document.getElementById('recordsBody');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const data = {
    user: formData.get('user'),
    role: formData.get('role'),
    environment: formData.get('environment'),
    resource: formData.get('resource'),
    permission: formData.get('permission')
  };

  try {
    const response = await fetch('/access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (!response.ok) {
      result.innerHTML = `
        <div class="result error">
          <strong>Error:</strong>
          ${responseData.error}
        </div>
      `;

      return;
    }

    const record = responseData.record;

    result.innerHTML = `
      <div class="result ${record.risk.toLowerCase()}">
        <h3>Risk Assessment: ${record.risk}</h3>
        <p>
          <strong>User:</strong> ${record.user}
        </p>
        <p>
          <strong>Recommendation:</strong>
          ${record.recommendation}
        </p>
      </div>
    `;

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${record.id}</td>
      <td>${record.user}</td>
      <td>${record.role}</td>
      <td>${record.environment}</td>
      <td>${record.resource}</td>
      <td>${record.permission}</td>
      <td>
        <span class="risk risk-${record.risk.toLowerCase()}">
          ${record.risk}
        </span>
      </td>
      <td>${record.recommendation}</td>
    `;

    recordsBody.appendChild(newRow);

    form.reset();
  } catch {
    result.innerHTML = `
      <div class="result error">
        Unable to connect to the CloudGuard server.
      </div>
    `;
  }
});