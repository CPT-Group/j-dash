const https = require('https');

// Jira API configuration
const JIRA_TOKEN = 'ATATT3xFfGF094ZodbyrvO7MeInXfjCMDGBNJ7S_6BVb0PQdpR1vsehHWBKT0VMESXc-DrRns62FTMZY6SnixCMGF8Iz0k1HZQLIp1W2muHwHAx2pqEqsX1sdFoMyKXnexvsTyM0DxiwTsY_0uf84hkkOUSoEgODPR-cMOhlA_XTIcPa8bo_xmk=07DF1E82';
const JIRA_EMAIL = 'kyle@cptgroup.com';
const JIRA_BASE_URL = 'https://cptgroup.atlassian.net';

// Helper function to make API calls
function makeJiraRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');
    
    const options = {
      hostname: 'cptgroup.atlassian.net',
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
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
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
    const customFields = fields.filter(field => field.custom);
    console.log(`Custom fields (${customFields.length}):`);
    customFields.forEach(field => {
      console.log(`- ${field.name} (${field.id}) - ${field.schema?.type || 'unknown type'}`);
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

async function researchDataTeamBoard() {
  console.log('\n🔍 Researching Data Team Board...');
  try {
    // Search for issues assigned to data team members
    const dataTeamMembers = ['kyle@cptgroup.com', 'james@cptgroup.com', 'thomas@cptgroup.com'];
    const jql = `assignee in (${dataTeamMembers.map(email => `"${email}"`).join(', ')}) ORDER BY updated DESC`;
    const encodedJql = encodeURIComponent(jql);
    
    const issues = await makeJiraRequest(`/search?jql=${encodedJql}&maxResults=50&expand=changelog`);
    console.log(`Found ${issues.total} issues assigned to data team:`);
    
    // Group by component
    const componentStats = {};
    const statusStats = {};
    const priorityStats = {};
    
    issues.issues.forEach(issue => {
      const component = issue.fields.components?.[0]?.name || 'No Component';
      const status = issue.fields.status.name;
      const priority = issue.fields.priority?.name || 'None';
      
      componentStats[component] = (componentStats[component] || 0) + 1;
      statusStats[status] = (statusStats[status] || 0) + 1;
      priorityStats[priority] = (priorityStats[priority] || 0) + 1;
      
      console.log(`- ${issue.key}: ${issue.fields.summary}`);
      console.log(`  Component: ${component}`);
      console.log(`  Status: ${status}`);
      console.log(`  Priority: ${priority}`);
      console.log(`  Assignee: ${issue.fields.assignee?.displayName || 'Unassigned'}`);
      console.log(`  Created: ${issue.fields.created}`);
      console.log(`  Updated: ${issue.fields.updated}`);
      if (issue.fields.duedate) {
        console.log(`  Due Date: ${issue.fields.duedate}`);
      }
      console.log('---');
    });
    
    console.log('\n📊 Component Statistics:');
    Object.entries(componentStats).forEach(([component, count]) => {
      console.log(`- ${component}: ${count} tickets`);
    });
    
    console.log('\n📊 Status Statistics:');
    Object.entries(statusStats).forEach(([status, count]) => {
      console.log(`- ${status}: ${count} tickets`);
    });
    
    console.log('\n📊 Priority Statistics:');
    Object.entries(priorityStats).forEach(([priority, count]) => {
      console.log(`- ${priority}: ${count} tickets`);
    });
    
    return { issues: issues.issues, componentStats, statusStats, priorityStats };
  } catch (error) {
    console.error('Error fetching data team board:', error.message);
    return { issues: [], componentStats: {}, statusStats: {}, priorityStats: {} };
  }
}

async function researchOverdueIssues() {
  console.log('\n🔍 Researching Overdue Issues...');
  try {
    const dataTeamMembers = ['kyle@cptgroup.com', 'james@cptgroup.com', 'thomas@cptgroup.com'];
    const jql = `assignee in (${dataTeamMembers.map(email => `"${email}"`).join(', ')}) AND duedate < now() AND status != Done ORDER BY duedate ASC`;
    const encodedJql = encodeURIComponent(jql);
    
    const issues = await makeJiraRequest(`/search?jql=${encodedJql}&maxResults=20`);
    console.log(`Found ${issues.total} overdue issues:`);
    
    issues.issues.forEach(issue => {
      const daysOverdue = Math.floor((new Date() - new Date(issue.fields.duedate)) / (1000 * 60 * 60 * 24));
      console.log(`- ${issue.key}: ${issue.fields.summary}`);
      console.log(`  Due: ${issue.fields.duedate} (${daysOverdue} days overdue)`);
      console.log(`  Status: ${issue.fields.status.name}`);
      console.log(`  Assignee: ${issue.fields.assignee?.displayName}`);
      console.log('---');
    });
    
    return issues.issues;
  } catch (error) {
    console.error('Error fetching overdue issues:', error.message);
    return [];
  }
}

async function researchDueTodayIssues() {
  console.log('\n🔍 Researching Due Today Issues...');
  try {
    const dataTeamMembers = ['kyle@cptgroup.com', 'james@cptgroup.com', 'thomas@cptgroup.com'];
    const today = new Date().toISOString().split('T')[0];
    const jql = `assignee in (${dataTeamMembers.map(email => `"${email}"`).join(', ')}) AND duedate = "${today}" AND status != Done ORDER BY priority DESC`;
    const encodedJql = encodeURIComponent(jql);
    
    const issues = await makeJiraRequest(`/search?jql=${encodedJql}&maxResults=20`);
    console.log(`Found ${issues.total} issues due today:`);
    
    issues.issues.forEach(issue => {
      console.log(`- ${issue.key}: ${issue.fields.summary}`);
      console.log(`  Due: ${issue.fields.duedate}`);
      console.log(`  Status: ${issue.fields.status.name}`);
      console.log(`  Priority: ${issue.fields.priority?.name || 'None'}`);
      console.log(`  Assignee: ${issue.fields.assignee?.displayName}`);
      console.log('---');
    });
    
    return issues.issues;
  } catch (error) {
    console.error('Error fetching due today issues:', error.message);
    return [];
  }
}

// Main research function
async function runResearch() {
  console.log('🚀 Starting Jira Research for CPT Group...\n');
  
  const results = {
    projects: await researchProjects(),
    issueTypes: await researchIssueTypes(),
    fields: await researchFields(),
    statuses: await researchStatuses(),
    priorities: await researchPriorities(),
    users: await researchUsers(),
    dataTeamBoard: await researchDataTeamBoard(),
    overdueIssues: await researchOverdueIssues(),
    dueTodayIssues: await researchDueTodayIssues()
  };
  
  console.log('\n✅ Research Complete!');
  return results;
}

// Run the research
runResearch().catch(console.error);
