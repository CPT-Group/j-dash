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

// Deep analysis functions
async function analyzeComponentPatterns() {
  console.log('\n🔍 DEEP ANALYSIS: Component Patterns and Categorization...');
  
  try {
    // Get all data team tickets with components
    const jql = 'assignee in ("kyle@cptgroup.com", "james@cptgroup.com", "thomas@cptgroup.com") AND component is not EMPTY ORDER BY updated DESC';
    const data = await makeJiraRequest(`/search?jql=${encodeURIComponent(jql)}&maxResults=100&expand=changelog`);
    
    console.log(`\n📊 Found ${data.total} tickets with components:`);
    
    // Analyze component usage patterns
    const componentAnalysis = {};
    const componentToAssignee = {};
    const componentToIssueType = {};
    const componentToPriority = {};
    
    data.issues.forEach(issue => {
      const component = issue.fields.components?.[0]?.name || 'Unknown';
      const assignee = issue.fields.assignee?.displayName || 'Unassigned';
      const issueType = issue.fields.issuetype.name;
      const priority = issue.fields.priority?.name || 'None';
      const summary = issue.fields.summary;
      
      // Component frequency
      componentAnalysis[component] = (componentAnalysis[component] || 0) + 1;
      
      // Component to assignee mapping
      if (!componentToAssignee[component]) componentToAssignee[component] = {};
      componentToAssignee[component][assignee] = (componentToAssignee[component][assignee] || 0) + 1;
      
      // Component to issue type mapping
      if (!componentToIssueType[component]) componentToIssueType[component] = {};
      componentToIssueType[component][issueType] = (componentToIssueType[component][issueType] || 0) + 1;
      
      // Component to priority mapping
      if (!componentToPriority[component]) componentToPriority[component] = {};
      componentToPriority[component][priority] = (componentToPriority[component][priority] || 0) + 1;
      
      console.log(`- ${issue.key}: ${summary}`);
      console.log(`  Component: ${component} | Assignee: ${assignee} | Type: ${issueType} | Priority: ${priority}`);
    });
    
    console.log('\n📈 Component Usage Analysis:');
    Object.entries(componentAnalysis)
      .sort(([,a], [,b]) => b - a)
      .forEach(([component, count]) => {
        console.log(`- ${component}: ${count} tickets`);
      });
    
    console.log('\n👥 Component to Assignee Mapping:');
    Object.entries(componentToAssignee).forEach(([component, assignees]) => {
      console.log(`\n${component}:`);
      Object.entries(assignees).forEach(([assignee, count]) => {
        console.log(`  - ${assignee}: ${count} tickets`);
      });
    });
    
    console.log('\n📋 Component to Issue Type Mapping:');
    Object.entries(componentToIssueType).forEach(([component, types]) => {
      console.log(`\n${component}:`);
      Object.entries(types).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count} tickets`);
      });
    });
    
    return { componentAnalysis, componentToAssignee, componentToIssueType, componentToPriority };
  } catch (error) {
    console.error('Error analyzing component patterns:', error.message);
    return {};
  }
}

async function analyzeCaseFolderRelationships() {
  console.log('\n🔍 DEEP ANALYSIS: Case Folder Relationships...');
  
  try {
    // Look for tickets with Case No custom field
    const jql = 'assignee in ("kyle@cptgroup.com", "james@cptgroup.com", "thomas@cptgroup.com") AND "Case No" is not EMPTY ORDER BY updated DESC';
    const data = await makeJiraRequest(`/search?jql=${encodeURIComponent(jql)}&maxResults=50&expand=changelog`);
    
    console.log(`\n📁 Found ${data.total} tickets with Case No (linking to S:\\Admin Cases):`);
    
    const caseFolderPatterns = {};
    const caseToComponent = {};
    const caseToAssignee = {};
    
    data.issues.forEach(issue => {
      const caseNo = issue.fields.customfield_10075; // Case No field
      const component = issue.fields.components?.[0]?.name || 'No Component';
      const assignee = issue.fields.assignee?.displayName || 'Unassigned';
      const summary = issue.fields.summary;
      const status = issue.fields.status.name;
      const priority = issue.fields.priority?.name || 'None';
      
      console.log(`\n- ${issue.key}: ${summary}`);
      console.log(`  Case No: ${caseNo}`);
      console.log(`  Component: ${component} | Assignee: ${assignee} | Status: ${status} | Priority: ${priority}`);
      
      // Analyze case folder patterns
      if (caseNo) {
        caseFolderPatterns[caseNo] = (caseFolderPatterns[caseNo] || 0) + 1;
        
        if (!caseToComponent[caseNo]) caseToComponent[caseNo] = new Set();
        caseToComponent[caseNo].add(component);
        
        if (!caseToAssignee[caseNo]) caseToAssignee[caseNo] = new Set();
        caseToAssignee[caseNo].add(assignee);
      }
    });
    
    console.log('\n📊 Case Folder Analysis:');
    Object.entries(caseFolderPatterns)
      .sort(([,a], [,b]) => b - a)
      .forEach(([caseNo, count]) => {
        console.log(`\nCase ${caseNo}: ${count} tickets`);
        console.log(`  Components: ${Array.from(caseToComponent[caseNo] || []).join(', ')}`);
        console.log(`  Assignees: ${Array.from(caseToAssignee[caseNo] || []).join(', ')}`);
      });
    
    return { caseFolderPatterns, caseToComponent, caseToAssignee };
  } catch (error) {
    console.error('Error analyzing case folder relationships:', error.message);
    return {};
  }
}

async function analyzeWorkflowPatterns() {
  console.log('\n🔍 DEEP ANALYSIS: Workflow and Status Patterns...');
  
  try {
    // Get recent tickets with changelog to understand workflow
    const jql = 'assignee in ("kyle@cptgroup.com", "james@cptgroup.com", "thomas@cptgroup.com") ORDER BY updated DESC';
    const data = await makeJiraRequest(`/search?jql=${encodeURIComponent(jql)}&maxResults=50&expand=changelog`);
    
    console.log(`\n🔄 Analyzing workflow patterns from ${data.total} recent tickets:`);
    
    const statusTransitions = {};
    const timeInStatus = {};
    const assigneeWorkflows = {};
    
    data.issues.forEach(issue => {
      const assignee = issue.fields.assignee?.displayName || 'Unassigned';
      const currentStatus = issue.fields.status.name;
      const created = new Date(issue.fields.created);
      const updated = new Date(issue.fields.updated);
      const daysSinceUpdate = Math.floor((updated - created) / (1000 * 60 * 60 * 24));
      
      console.log(`\n- ${issue.key}: ${issue.fields.summary}`);
      console.log(`  Current Status: ${currentStatus}`);
      console.log(`  Assignee: ${assignee}`);
      console.log(`  Days since creation: ${daysSinceUpdate}`);
      
      // Analyze changelog for status transitions
      if (issue.changelog && issue.changelog.histories) {
        const statusChanges = issue.changelog.histories.filter(history => 
          history.items.some(item => item.field === 'status')
        );
        
        console.log(`  Status Changes: ${statusChanges.length}`);
        statusChanges.forEach(change => {
          const statusItem = change.items.find(item => item.field === 'status');
          if (statusItem) {
            const fromStatus = statusItem.fromString;
            const toStatus = statusItem.toString;
            const transition = `${fromStatus} → ${toStatus}`;
            statusTransitions[transition] = (statusTransitions[transition] || 0) + 1;
            console.log(`    ${transition} (${new Date(change.created).toLocaleDateString()})`);
          }
        });
      }
      
      // Track time in current status
      if (!timeInStatus[currentStatus]) timeInStatus[currentStatus] = [];
      timeInStatus[currentStatus].push(daysSinceUpdate);
      
      // Track assignee workflows
      if (!assigneeWorkflows[assignee]) assigneeWorkflows[assignee] = {};
      assigneeWorkflows[assignee][currentStatus] = (assigneeWorkflows[assignee][currentStatus] || 0) + 1;
    });
    
    console.log('\n📈 Status Transition Analysis:');
    Object.entries(statusTransitions)
      .sort(([,a], [,b]) => b - a)
      .forEach(([transition, count]) => {
        console.log(`- ${transition}: ${count} times`);
      });
    
    console.log('\n⏱️ Average Time in Status:');
    Object.entries(timeInStatus).forEach(([status, times]) => {
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      console.log(`- ${status}: ${avgTime.toFixed(1)} days average`);
    });
    
    console.log('\n👥 Assignee Workflow Patterns:');
    Object.entries(assigneeWorkflows).forEach(([assignee, statuses]) => {
      console.log(`\n${assignee}:`);
      Object.entries(statuses).forEach(([status, count]) => {
        console.log(`  - ${status}: ${count} tickets`);
      });
    });
    
    return { statusTransitions, timeInStatus, assigneeWorkflows };
  } catch (error) {
    console.error('Error analyzing workflow patterns:', error.message);
    return {};
  }
}

async function analyzePriorityAndDueDatePatterns() {
  console.log('\n🔍 DEEP ANALYSIS: Priority and Due Date Patterns...');
  
  try {
    const jql = 'assignee in ("kyle@cptgroup.com", "james@cptgroup.com", "thomas@cptgroup.com") ORDER BY duedate ASC';
    const data = await makeJiraRequest(`/search?jql=${encodeURIComponent(jql)}&maxResults=100`);
    
    console.log(`\n⏰ Analyzing priority and due date patterns from ${data.total} tickets:`);
    
    const priorityAnalysis = {};
    const dueDateAnalysis = {};
    const overdueAnalysis = {};
    const componentPriority = {};
    
    data.issues.forEach(issue => {
      const priority = issue.fields.priority?.name || 'None';
      const dueDate = issue.fields.duedate;
      const component = issue.fields.components?.[0]?.name || 'No Component';
      const assignee = issue.fields.assignee?.displayName || 'Unassigned';
      const status = issue.fields.status.name;
      
      // Priority analysis
      priorityAnalysis[priority] = (priorityAnalysis[priority] || 0) + 1;
      
      // Due date analysis
      if (dueDate) {
        const due = new Date(dueDate);
        const now = new Date();
        const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue < 0) {
          overdueAnalysis[Math.abs(daysUntilDue)] = (overdueAnalysis[Math.abs(daysUntilDue)] || 0) + 1;
        } else {
          dueDateAnalysis[daysUntilDue] = (dueDateAnalysis[daysUntilDue] || 0) + 1;
        }
        
        console.log(`- ${issue.key}: Due ${dueDate} (${daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days from now`})`);
        console.log(`  Priority: ${priority} | Component: ${component} | Assignee: ${assignee} | Status: ${status}`);
      }
      
      // Component priority mapping
      if (!componentPriority[component]) componentPriority[component] = {};
      componentPriority[component][priority] = (componentPriority[component][priority] || 0) + 1;
    });
    
    console.log('\n📊 Priority Distribution:');
    Object.entries(priorityAnalysis)
      .sort(([,a], [,b]) => b - a)
      .forEach(([priority, count]) => {
        console.log(`- ${priority}: ${count} tickets`);
      });
    
    console.log('\n⏰ Due Date Analysis:');
    const sortedDueDates = Object.entries(dueDateAnalysis)
      .sort(([a], [b]) => parseInt(a) - parseInt(b));
    sortedDueDates.forEach(([days, count]) => {
      console.log(`- ${days} days from now: ${count} tickets`);
    });
    
    console.log('\n🚨 Overdue Analysis:');
    const sortedOverdue = Object.entries(overdueAnalysis)
      .sort(([a], [b]) => parseInt(b) - parseInt(a));
    sortedOverdue.forEach(([days, count]) => {
      console.log(`- ${days} days overdue: ${count} tickets`);
    });
    
    console.log('\n🔧 Component Priority Patterns:');
    Object.entries(componentPriority).forEach(([component, priorities]) => {
      console.log(`\n${component}:`);
      Object.entries(priorities).forEach(([priority, count]) => {
        console.log(`  - ${priority}: ${count} tickets`);
      });
    });
    
    return { priorityAnalysis, dueDateAnalysis, overdueAnalysis, componentPriority };
  } catch (error) {
    console.error('Error analyzing priority and due date patterns:', error.message);
    return {};
  }
}

async function analyzeCustomFields() {
  console.log('\n🔍 DEEP ANALYSIS: Custom Fields Usage...');
  
  try {
    // Get tickets with various custom fields
    const jql = 'assignee in ("kyle@cptgroup.com", "james@cptgroup.com", "thomas@cptgroup.com") ORDER BY updated DESC';
    const data = await makeJiraRequest(`/search?jql=${encodeURIComponent(jql)}&maxResults=50`);
    
    console.log(`\n📋 Analyzing custom fields usage from ${data.total} tickets:`);
    
    const customFieldUsage = {};
    const caseTypeAnalysis = {};
    const websiteTypeAnalysis = {};
    
    data.issues.forEach(issue => {
      const fields = issue.fields;
      
      // Analyze custom fields
      Object.keys(fields).forEach(fieldKey => {
        if (fieldKey.startsWith('customfield_') && fields[fieldKey]) {
          const fieldName = fieldKey;
          const fieldValue = fields[fieldKey];
          
          if (!customFieldUsage[fieldName]) customFieldUsage[fieldName] = 0;
          customFieldUsage[fieldName]++;
          
          // Specific field analysis
          if (fieldKey === 'customfield_10075' && fieldValue) { // Case No
            console.log(`- ${issue.key}: Case No = ${fieldValue}`);
          }
          if (fieldKey === 'customfield_10077' && fieldValue) { // Website Type
            websiteTypeAnalysis[fieldValue.value] = (websiteTypeAnalysis[fieldValue.value] || 0) + 1;
            console.log(`- ${issue.key}: Website Type = ${fieldValue.value}`);
          }
          if (fieldKey === 'customfield_10057' && fieldValue) { // Case Type
            caseTypeAnalysis[fieldValue.value] = (caseTypeAnalysis[fieldValue.value] || 0) + 1;
            console.log(`- ${issue.key}: Case Type = ${fieldValue.value}`);
          }
        }
      });
    });
    
    console.log('\n📊 Custom Field Usage:');
    Object.entries(customFieldUsage)
      .sort(([,a], [,b]) => b - a)
      .forEach(([field, count]) => {
        console.log(`- ${field}: ${count} tickets`);
      });
    
    console.log('\n🌐 Website Type Analysis:');
    Object.entries(websiteTypeAnalysis).forEach(([type, count]) => {
      console.log(`- ${type}: ${count} tickets`);
    });
    
    console.log('\n📁 Case Type Analysis:');
    Object.entries(caseTypeAnalysis).forEach(([type, count]) => {
      console.log(`- ${type}: ${count} tickets`);
    });
    
    return { customFieldUsage, caseTypeAnalysis, websiteTypeAnalysis };
  } catch (error) {
    console.error('Error analyzing custom fields:', error.message);
    return {};
  }
}

// Main analysis function
async function runDeepAnalysis() {
  console.log('🚀 Starting Deep Jira Analysis for CPT Group...\n');
  
  const results = {
    componentPatterns: await analyzeComponentPatterns(),
    caseFolderRelationships: await analyzeCaseFolderRelationships(),
    workflowPatterns: await analyzeWorkflowPatterns(),
    priorityAndDueDatePatterns: await analyzePriorityAndDueDatePatterns(),
    customFields: await analyzeCustomFields()
  };
  
  console.log('\n✅ Deep Analysis Complete!');
  console.log('\n📋 Summary of Key Findings:');
  console.log('- Component categorization patterns identified');
  console.log('- Case folder relationships mapped');
  console.log('- Workflow and status transition patterns documented');
  console.log('- Priority and due date patterns analyzed');
  console.log('- Custom field usage patterns identified');
  
  return results;
}

// Run the deep analysis
runDeepAnalysis().catch(console.error);
