const https = require('https');

// Jira API configuration
const JIRA_TOKEN = 'ATATT3xFfGF094ZodbyrvO7MeInXfjCMDGBNJ7S_6BVb0PQdpR1vsehHWBKT0VMESXc-DrRns62FTMZY6SnixCMGF8Iz0k1HZQLIp1W2muHwHAx2pqEqsX1sdFoMyKXnexvsTyM0DxiwTsY_0uf84hkkOUSoEgODPR-cMOhlA_XTIcPa8bo_xmk=07DF1E82';
const JIRA_EMAIL = 'user@domain.com'; // This needs to be extracted from token or provided
const JIRA_BASE_URL = 'https://domain.atlassian.net'; // This needs to be extracted from token

// Helper function to make API calls
function makeJiraRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');
    
    const options = {
      hostname: 'domain.atlassian.net',
      path: `/rest/api/3${endpoint}`,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Research functions
async function researchProjects() {
  console.log('🔍 Researching Projects...');
  try {
    const projects = await makeJiraRequest('/project');
    console.log(`Found ${projects.length} projects:`);
    projects.forEach(project => {
      console.log(`- ${project.key}: ${project.name} (${project.projectTypeKey})`);
    });
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    return [];
  }
}

async function researchIssueTypes() {
  console.log('\n🔍 Researching Issue Types...');
  try {
    const issueTypes = await makeJiraRequest('/issuetype');
    console.log(`Found ${issueTypes.length} issue types:`);
    issueTypes.forEach(type => {
      console.log(`- ${type.name} (${type.id}): ${type.description || 'No description'}`);
    });
    return issueTypes;
  } catch (error) {
    console.error('Error fetching issue types:', error.message);
    return [];
  }
}

async function researchFields() {
  console.log('\n🔍 Researching Custom Fields...');
  try {
    const fields = await makeJiraRequest('/field');
    console.log(`Found ${fields.length} fields:`);
    fields.forEach(field => {
      if (field.custom) {
        console.log(`- Custom: ${field.name} (${field.id}) - ${field.schema?.type || 'unknown type'}`);
      }
    });
    return fields;
  } catch (error) {
    console.error('Error fetching fields:', error.message);
    return [];
  }
}

async function researchStatuses() {
  console.log('\n🔍 Researching Statuses...');
  try {
    const statuses = await makeJiraRequest('/status');
    console.log(`Found ${statuses.length} statuses:`);
    statuses.forEach(status => {
      console.log(`- ${status.name} (${status.id}): ${status.description || 'No description'}`);
    });
    return statuses;
  } catch (error) {
    console.error('Error fetching statuses:', error.message);
    return [];
  }
}

async function researchPriorities() {
  console.log('\n🔍 Researching Priorities...');
  try {
    const priorities = await makeJiraRequest('/priority');
    console.log(`Found ${priorities.length} priorities:`);
    priorities.forEach(priority => {
      console.log(`- ${priority.name} (${priority.id}): ${priority.description || 'No description'}`);
    });
    return priorities;
  } catch (error) {
    console.error('Error fetching priorities:', error.message);
    return [];
  }
}

async function researchUsers() {
  console.log('\n🔍 Researching Users...');
  try {
    const users = await makeJiraRequest('/user/search?maxResults=50');
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ${user.displayName} (${user.emailAddress}) - ${user.accountType}`);
    });
    return users;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    return [];
  }
}

async function researchRecentIssues() {
  console.log('\n🔍 Researching Recent Issues...');
  try {
    const issues = await makeJiraRequest('/search?maxResults=20&orderBy=updated');
    console.log(`Found ${issues.total} total issues, showing recent 20:`);
    issues.issues.forEach(issue => {
      console.log(`- ${issue.key}: ${issue.fields.summary}`);
      console.log(`  Status: ${issue.fields.status.name}`);
      console.log(`  Type: ${issue.fields.issuetype.name}`);
      console.log(`  Priority: ${issue.fields.priority?.name || 'None'}`);
      console.log(`  Assignee: ${issue.fields.assignee?.displayName || 'Unassigned'}`);
      console.log(`  Created: ${issue.fields.created}`);
      console.log(`  Updated: ${issue.fields.updated}`);
      console.log('---');
    });
    return issues;
  } catch (error) {
    console.error('Error fetching recent issues:', error.message);
    return [];
  }
}

// Main research function
async function runResearch() {
  console.log('🚀 Starting Jira Research...\n');
  
  const results = {
    projects: await researchProjects(),
    issueTypes: await researchIssueTypes(),
    fields: await researchFields(),
    statuses: await researchStatuses(),
    priorities: await researchPriorities(),
    users: await researchUsers(),
    recentIssues: await researchRecentIssues()
  };
  
  console.log('\n✅ Research Complete!');
  return results;
}

// Run the research
runResearch().catch(console.error);
