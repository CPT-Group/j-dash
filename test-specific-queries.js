const https = require('https');

const JIRA_DOMAIN = 'cptgroup.atlassian.net';
const JIRA_EMAIL = 'kyle@cptgroup.com';
const JIRA_TOKEN = 'ATATT3xFfGF094ZodbyrvO7MeInXfjCMDGBNJ7S_6BVb0PQdpR1vsehHWBKT0VMESXc-DrRns62FTMZY6SnixCMGF8Iz0k1HZQLIp1W2muHwHAx2pqEqsX1sdFoMyKXnexvsTyM0DxiwTsY_0uf84hkkOUSoEgODPR-cMOhlA_XTIcPa8bo_xmk=07DF1E82';

function makeJiraRequest(path) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');
    
    const options = {
      hostname: JIRA_DOMAIN,
      path: path,
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
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function testSpecificQueries() {
  const queries = [
    {
      name: 'All Tickets (CM,OPRD)',
      jql: 'project in (CM,OPRD) ORDER BY updated DESC',
      path: '/rest/api/3/search?jql=' + encodeURIComponent('project in (CM,OPRD) ORDER BY updated DESC')
    },
    {
      name: 'Overdue Tickets',
      jql: 'project in (CM,OPRD) AND duedate < now() AND status != Done ORDER BY duedate ASC',
      path: '/rest/api/3/search?jql=' + encodeURIComponent('project in (CM,OPRD) AND duedate < now() AND status != Done ORDER BY duedate ASC')
    },
    {
      name: 'Missing Components',
      jql: 'project in (CM,OPRD) AND component is EMPTY ORDER BY updated DESC',
      path: '/rest/api/3/search?jql=' + encodeURIComponent('project in (CM,OPRD) AND component is EMPTY ORDER BY updated DESC')
    },
    {
      name: 'Data Team New',
      jql: 'project in (CM,OPRD) AND status = "Data Team New" ORDER BY updated DESC',
      path: '/rest/api/3/search?jql=' + encodeURIComponent('project in (CM,OPRD) AND status = "Data Team New" ORDER BY updated DESC')
    }
  ];

  for (const query of queries) {
    try {
      console.log(`\n🔍 Testing: ${query.name}`);
      console.log(`JQL: ${query.jql}`);
      const data = await makeJiraRequest(query.path);
      console.log(`✅ Success! Total issues: ${data.total}`);
      if (data.issues && data.issues.length > 0) {
        console.log(`📋 First issue: ${data.issues[0].key} - ${data.issues[0].fields.summary}`);
        console.log(`👤 Assignee: ${data.issues[0].fields.assignee?.displayName || 'Unassigned'}`);
        console.log(`📊 Status: ${data.issues[0].fields.status.name}`);
      }
    } catch (error) {
      console.error(`❌ Error for ${query.name}:`, error.message);
    }
  }
}

testSpecificQueries();
