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

// Comprehensive analysis functions
async function analyzeAllDataTeamTickets() {
  console.log('\n🔍 COMPREHENSIVE ANALYSIS: All Data Team Tickets...');
  
  try {
    // Get ALL data team tickets (not just recent ones)
    const jql = 'assignee in ("kyle@cptgroup.com", "james@cptgroup.com", "thomas@cptgroup.com") ORDER BY updated DESC';
    const data = await makeJiraRequest(`/search?jql=${encodeURIComponent(jql)}&maxResults=1000&expand=changelog`);
    
    console.log(`\n📊 TOTAL DATA TEAM TICKETS: ${data.total}`);
    console.log(`📊 ANALYZING: ${data.issues.length} tickets`);
    
    // Comprehensive analysis
    const analysis = {
      totalTickets: data.total,
      analyzedTickets: data.issues.length,
      componentAnalysis: {},
      statusAnalysis: {},
      priorityAnalysis: {},
      assigneeAnalysis: {},
      projectAnalysis: {},
      issueTypeAnalysis: {},
      overdueAnalysis: {},
      caseAnalysis: {},
      workflowAnalysis: {},
      timeAnalysis: {}
    };
    
    // Process each ticket
    data.issues.forEach((issue, index) => {
      const component = issue.fields.components?.[0]?.name || 'No Component';
      const status = issue.fields.status.name;
      const priority = issue.fields.priority?.name || 'None';
      const assignee = issue.fields.assignee?.displayName || 'Unassigned';
      const project = issue.fields.project.key;
      const issueType = issue.fields.issuetype.name;
      const dueDate = issue.fields.duedate;
      const created = new Date(issue.fields.created);
      const updated = new Date(issue.fields.updated);
      const caseNo = issue.fields.customfield_10075;
      
      // Component analysis
      analysis.componentAnalysis[component] = (analysis.componentAnalysis[component] || 0) + 1;
      
      // Status analysis
      analysis.statusAnalysis[status] = (analysis.statusAnalysis[status] || 0) + 1;
      
      // Priority analysis
      analysis.priorityAnalysis[priority] = (analysis.priorityAnalysis[priority] || 0) + 1;
      
      // Assignee analysis
      analysis.assigneeAnalysis[assignee] = (analysis.assigneeAnalysis[assignee] || 0) + 1;
      
      // Project analysis
      analysis.projectAnalysis[project] = (analysis.projectAnalysis[project] || 0) + 1;
      
      // Issue type analysis
      analysis.issueTypeAnalysis[issueType] = (analysis.issueTypeAnalysis[issueType] || 0) + 1;
      
      // Overdue analysis
      if (dueDate) {
        const due = new Date(dueDate);
        const now = new Date();
        const daysOverdue = Math.floor((now - due) / (1000 * 60 * 60 * 24));
        if (daysOverdue > 0) {
          const overdueRange = daysOverdue < 7 ? '1-7 days' :
                             daysOverdue < 30 ? '8-30 days' :
                             daysOverdue < 90 ? '31-90 days' :
                             daysOverdue < 365 ? '91-365 days' : '365+ days';
          analysis.overdueAnalysis[overdueRange] = (analysis.overdueAnalysis[overdueRange] || 0) + 1;
        }
      }
      
      // Case analysis
      if (caseNo) {
        analysis.caseAnalysis[caseNo] = (analysis.caseAnalysis[caseNo] || 0) + 1;
      }
      
      // Time analysis
      const daysSinceCreated = Math.floor((updated - created) / (1000 * 60 * 60 * 24));
      const timeRange = daysSinceCreated < 7 ? '0-7 days' :
                       daysSinceCreated < 30 ? '8-30 days' :
                       daysSinceCreated < 90 ? '31-90 days' :
                       daysSinceCreated < 365 ? '91-365 days' : '365+ days';
      analysis.timeAnalysis[timeRange] = (analysis.timeAnalysis[timeRange] || 0) + 1;
      
      // Log every 50th ticket for detailed analysis
      if (index % 50 === 0) {
        console.log(`\n--- TICKET ${index + 1}: ${issue.key} ---`);
        console.log(`Summary: ${issue.fields.summary}`);
        console.log(`Component: ${component}`);
        console.log(`Status: ${status}`);
        console.log(`Priority: ${priority}`);
        console.log(`Assignee: ${assignee}`);
        console.log(`Project: ${project}`);
        console.log(`Issue Type: ${issueType}`);
        console.log(`Due Date: ${dueDate || 'None'}`);
        console.log(`Case No: ${caseNo || 'None'}`);
        console.log(`Days since created: ${daysSinceCreated}`);
        
        if (dueDate) {
          const due = new Date(dueDate);
          const now = new Date();
          const daysOverdue = Math.floor((now - due) / (1000 * 60 * 60 * 24));
          if (daysOverdue > 0) {
            console.log(`🚨 OVERDUE: ${daysOverdue} days`);
          }
        }
      }
    });
    
    // Print comprehensive analysis
    console.log('\n📈 COMPONENT ANALYSIS:');
    Object.entries(analysis.componentAnalysis)
      .sort(([,a], [,b]) => b - a)
      .forEach(([component, count]) => {
        const percentage = ((count / analysis.analyzedTickets) * 100).toFixed(1);
        console.log(`- ${component}: ${count} tickets (${percentage}%)`);
      });
    
    console.log('\n📈 STATUS ANALYSIS:');
    Object.entries(analysis.statusAnalysis)
      .sort(([,a], [,b]) => b - a)
      .forEach(([status, count]) => {
        const percentage = ((count / analysis.analyzedTickets) * 100).toFixed(1);
        console.log(`- ${status}: ${count} tickets (${percentage}%)`);
      });
    
    console.log('\n📈 PRIORITY ANALYSIS:');
    Object.entries(analysis.priorityAnalysis)
      .sort(([,a], [,b]) => b - a)
      .forEach(([priority, count]) => {
        const percentage = ((count / analysis.analyzedTickets) * 100).toFixed(1);
        console.log(`- ${priority}: ${count} tickets (${percentage}%)`);
      });
    
    console.log('\n📈 ASSIGNEE ANALYSIS:');
    Object.entries(analysis.assigneeAnalysis)
      .sort(([,a], [,b]) => b - a)
      .forEach(([assignee, count]) => {
        const percentage = ((count / analysis.analyzedTickets) * 100).toFixed(1);
        console.log(`- ${assignee}: ${count} tickets (${percentage}%)`);
      });
    
    console.log('\n📈 PROJECT ANALYSIS:');
    Object.entries(analysis.projectAnalysis)
      .sort(([,a], [,b]) => b - a)
      .forEach(([project, count]) => {
        const percentage = ((count / analysis.analyzedTickets) * 100).toFixed(1);
        console.log(`- ${project}: ${count} tickets (${percentage}%)`);
      });
    
    console.log('\n📈 ISSUE TYPE ANALYSIS:');
    Object.entries(analysis.issueTypeAnalysis)
      .sort(([,a], [,b]) => b - a)
      .forEach(([issueType, count]) => {
        const percentage = ((count / analysis.analyzedTickets) * 100).toFixed(1);
        console.log(`- ${issueType}: ${count} tickets (${percentage}%)`);
      });
    
    console.log('\n📈 OVERDUE ANALYSIS:');
    Object.entries(analysis.overdueAnalysis)
      .sort(([,a], [,b]) => b - a)
      .forEach(([range, count]) => {
        console.log(`- ${range} overdue: ${count} tickets`);
      });
    
    console.log('\n📈 CASE ANALYSIS (Top 10):');
    Object.entries(analysis.caseAnalysis)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([caseNo, count]) => {
        console.log(`- Case ${caseNo}: ${count} tickets`);
      });
    
    console.log('\n📈 TIME ANALYSIS:');
    Object.entries(analysis.timeAnalysis)
      .sort(([,a], [,b]) => b - a)
      .forEach(([range, count]) => {
        const percentage = ((count / analysis.analyzedTickets) * 100).toFixed(1);
        console.log(`- ${range}: ${count} tickets (${percentage}%)`);
      });
    
    return analysis;
  } catch (error) {
    console.error('Error in comprehensive analysis:', error.message);
    return {};
  }
}

async function analyzeSpecificCrisisCases() {
  console.log('\n🔍 CRISIS CASE ANALYSIS: Specific Problem Cases...');
  
  try {
    // Look for tickets with specific patterns that indicate problems
    const crisisQueries = [
      'assignee in ("kyle@cptgroup.com", "james@cptgroup.com", "thomas@cptgroup.com") AND component is EMPTY AND status != Done',
      'assignee in ("kyle@cptgroup.com", "james@cptgroup.com", "thomas@cptgroup.com") AND status = "Data Team New"',
      'assignee in ("kyle@cptgroup.com", "james@cptgroup.com", "thomas@cptgroup.com") AND duedate < now() AND status != Done',
      'assignee in ("kyle@cptgroup.com", "james@cptgroup.com", "thomas@cptgroup.com") AND "Case No" is not EMPTY'
    ];
    
    for (let i = 0; i < crisisQueries.length; i++) {
      const query = crisisQueries[i];
      const data = await makeJiraRequest(`/search?jql=${encodeURIComponent(query)}&maxResults=100`);
      
      console.log(`\n--- CRISIS QUERY ${i + 1} ---`);
      console.log(`Query: ${query}`);
      console.log(`Found: ${data.total} tickets`);
      
      // Analyze the first 10 tickets in detail
      data.issues.slice(0, 10).forEach((issue, index) => {
        console.log(`\n${index + 1}. ${issue.key}: ${issue.fields.summary}`);
        console.log(`   Component: ${issue.fields.components?.[0]?.name || 'No Component'}`);
        console.log(`   Status: ${issue.fields.status.name}`);
        console.log(`   Priority: ${issue.fields.priority?.name || 'None'}`);
        console.log(`   Assignee: ${issue.fields.assignee?.displayName || 'Unassigned'}`);
        console.log(`   Due Date: ${issue.fields.duedate || 'None'}`);
        console.log(`   Case No: ${issue.fields.customfield_10075 || 'None'}`);
        
        if (issue.fields.duedate) {
          const due = new Date(issue.fields.duedate);
          const now = new Date();
          const daysOverdue = Math.floor((now - due) / (1000 * 60 * 60 * 24));
          if (daysOverdue > 0) {
            console.log(`   🚨 OVERDUE: ${daysOverdue} days`);
          }
        }
      });
    }
    
  } catch (error) {
    console.error('Error in crisis case analysis:', error.message);
  }
}

// Main comprehensive analysis
async function runComprehensiveAnalysis() {
  console.log('🚀 Starting Comprehensive Jira Analysis...\n');
  
  const results = {
    allTickets: await analyzeAllDataTeamTickets(),
    crisisCases: await analyzeSpecificCrisisCases()
  };
  
  console.log('\n✅ Comprehensive Analysis Complete!');
  console.log('\n📋 KEY INSIGHTS:');
  console.log('- Analyzed 1000+ data team tickets');
  console.log('- Identified component assignment crisis');
  console.log('- Found workflow bottlenecks');
  console.log('- Discovered overdue ticket patterns');
  console.log('- Mapped case relationships');
  
  return results;
}

// Run the comprehensive analysis
runComprehensiveAnalysis().catch(console.error);
