import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Sample IAM access records.
// This is in-memory data for our CCA project.

const projectInfo = {
  name: 'CloudGuard',
  purpose: 'IAM Access Risk Auditor',
  securityModel: 'Least Privilege'
};

const accessRecords = [
  {
    id: 1,
    user: 'Rahul',
    role: 'Developer',
    environment: 'Production',
    resource: 'S3',
    permission: 'Delete',
    risk: 'HIGH',
    recommendation: 'Remove Delete permission unless it is absolutely required.'
  },
  {
    id: 2,
    user: 'Priya',
    role: 'Intern',
    environment: 'Development',
    resource: 'S3',
    permission: 'Read',
    risk: 'LOW',
    recommendation: 'Access is appropriate for development read-only work.'
  }
];

function calculateRisk(role, environment, permission) {
  if (
    environment === 'Production' &&
    permission === 'Delete'
  ) {
    return {
      risk: 'HIGH',
      recommendation:
        'Remove Delete permission unless it is absolutely required.'
    };
  }

  if (
    role === 'Intern' &&
    (permission === 'Write' || permission === 'Delete')
  ) {
    return {
      risk: 'HIGH',
      recommendation:
        'Interns should normally not have Write or Delete permissions.'
    };
  }

  if (
    role === 'Developer' &&
    environment === 'Production' &&
    permission === 'Write'
  ) {
    return {
      risk: 'MEDIUM',
      recommendation:
        'Review whether Production Write permission is necessary.'
    };
  }

  return {
    risk: 'LOW',
    recommendation:
      'Access appears reasonable based on the current CloudGuard rules.'
  };
}

function validateAccessInput(data) {
  const allowedRoles = ['Developer', 'Intern', 'Admin', 'Tester'];
  const allowedEnvironments = ['Development', 'Testing', 'Production'];
  const allowedResources = ['S3', 'Database', 'EC2', 'API'];
  const allowedPermissions = ['Read', 'Write', 'Delete'];

  if (!data.user || data.user.trim().length < 2) {
    return 'User name must contain at least 2 characters.';
  }

  if (!allowedRoles.includes(data.role)) {
    return 'Invalid role.';
  }

  if (!allowedEnvironments.includes(data.environment)) {
    return 'Invalid environment.';
  }

  if (!allowedResources.includes(data.resource)) {
    return 'Invalid resource.';
  }

  if (!allowedPermissions.includes(data.permission)) {
    return 'Invalid permission.';
  }

  return null;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&#039;');
}

// Home page
app.get('/', (req, res) => {
  const commitId = process.env.RENDER_GIT_COMMIT || 'local-dev';

  const rows = accessRecords
    .map(
      (record) => `
        <tr>
          <td>${record.id}</td>
          <td>${escapeHtml(record.user)}</td>
          <td>${escapeHtml(record.role)}</td>
          <td>${escapeHtml(record.environment)}</td>
          <td>${escapeHtml(record.resource)}</td>
          <td>${escapeHtml(record.permission)}</td>
          <td>
            <span class="risk risk-${record.risk.toLowerCase()}">
              ${record.risk}
            </span>
          </td>
          <td>${escapeHtml(record.recommendation)}</td>
        </tr>
      `
    )
    .join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CloudGuard - IAM Access Risk Auditor</title>
        <link rel="stylesheet" href="/style.css">
      </head>

      <body>
        <header class="header">
          <div>
            <h1>CloudGuard</h1>
            <p>IAM Access Risk Auditor</p>
          </div>

          <div class="header-badge">
            Cloud Security
          </div>
        </header>

        <main class="container">

          <section class="hero">
          <p>
  Security model: ${escapeHtml(projectInfo.securityModel)}
</p>
            <h2>Cloud IAM Access Risk Assessment</h2>
            <p>
              CloudGuard checks IAM-style permissions and identifies
              potentially risky access using least-privilege rules.
            </p>
          </section>

          <section class="card">
            <h2>Add Access Record</h2>

            <form id="accessForm">

              <div class="form-grid">

                <div class="form-group">
                  <label for="user">User Name</label>
                  <input
                    id="user"
                    name="user"
                    type="text"
                    placeholder="Example: Rahul"
                    required
                  >
                </div>

                <div class="form-group">
                  <label for="role">Role</label>
                  <select id="role" name="role" required>
                    <option value="">Select role</option>
                    <option value="Developer">Developer</option>
                    <option value="Intern">Intern</option>
                    <option value="Admin">Admin</option>
                    <option value="Tester">Tester</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="environment">Environment</label>
                  <select id="environment" name="environment" required>
                    <option value="">Select environment</option>
                    <option value="Development">Development</option>
                    <option value="Testing">Testing</option>
                    <option value="Production">Production</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="resource">Resource</label>
                  <select id="resource" name="resource" required>
                    <option value="">Select resource</option>
                    <option value="S3">S3</option>
                    <option value="Database">Database</option>
                    <option value="EC2">EC2</option>
                    <option value="API">API</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="permission">Permission</label>
                  <select id="permission" name="permission" required>
                    <option value="">Select permission</option>
                    <option value="Read">Read</option>
                    <option value="Write">Write</option>
                    <option value="Delete">Delete</option>
                  </select>
                </div>

              </div>

              <button type="submit">
                Analyze Access
              </button>

            </form>

            <div id="result"></div>
          </section>

          <section class="card">
            <div class="section-heading">
              <div>
                <h2>Access Records</h2>
                <p>Server-side records currently stored by CloudGuard.</p>
              </div>

              <span class="record-count">
                ${accessRecords.length} records
              </span>
            </div>

            <div class="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Environment</th>
                    <th>Resource</th>
                    <th>Permission</th>
                    <th>Risk</th>
                    <th>Recommendation</th>
                  </tr>
                </thead>

                <tbody id="recordsBody">
                  ${rows}
                </tbody>
              </table>
            </div>
          </section>

          <section class="api-links">
            <a href="/api/access" target="_blank">View JSON API</a>
            <a href="/health" target="_blank">Health Check</a>
          </section>

        </main>

        <footer>
          CloudGuard | Running Commit:
          <strong>${escapeHtml(commitId)}</strong>
        </footer>

        <script src="/script.js"></script>
      </body>
    </html>
  `);
});

// JSON API
app.get('/api/access', (req, res) => {
  res.json({
    success: true,
    count: accessRecords.length,
    records: accessRecords
  });
});

// Add a new access record
app.post('/access', (req, res) => {
  const validationError = validateAccessInput(req.body);

  if (validationError) {
    return res.status(400).json({
      success: false,
      error: validationError
    });
  }

  const { user, role, environment, resource, permission } = req.body;

  const assessment = calculateRisk(
    role,
    environment,
    permission
  );

  const newRecord = {
    id: accessRecords.length + 1,
    user: user.trim(),
    role,
    environment,
    resource,
    permission,
    risk: assessment.risk,
    recommendation: assessment.recommendation
  };

  accessRecords.push(newRecord);

  return res.status(201).json({
    success: true,
    message: 'Access record analyzed successfully.',
    record: newRecord
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'CloudGuard IAM Access Risk Auditor'
  });
});

export {
  app,
  accessRecords,
  calculateRisk,
  validateAccessInput
};