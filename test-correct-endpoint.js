const https = require('https');

const JIRA_DOMAIN = 'cptgroup.atlassian.net';
const JIRA_EMAIL = 'kyle@cptgroup.com';
const JIRA_TOKEN = 'ATATT3xFfGF094ZodbyrvO7MeInXfjCMDGBNJ7S_6BVb0PQdpR1vsehHWBKT0VMESXc-DrRns62FTMZY6SnixCMGF8Iz0k1HZQLIp1W2muHwHAx2pqEqsX1sdFoMyKXnexvsTyM0DxiwTsY_0uf84hkkOUSoEgODPR-cMOhlA_XTIcPa8bo_xmk=07DF1E82';

function makeJiraRequest(path) {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');
    
    const url = `https://${JIRA_DOMAIN}/rest/api/3${path}`;
    console.log('Making request to:', url);

    const options = {
      hostname: JIRA_DOMAIN,
      path: `/rest/api/3${path}`,
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
        console.log('Response status:', res.statusCode);
        if (res.statusCode >= 400) {
          console.error('Error response body:', data);
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        } else {
          try {
            const result = JSON.parse(data);
            console.log('Success! Total issues:', result.total);
            console.log('First issue key:', result.issues[0]?.key);
            console.log('First issue summary:', result.issues[0]?.fields?.summary);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function testCorrectEndpoint() {
  try {
    console.log('Testing correct Jira API endpoint...');
    const jql = 'project in (CM,OPRD) ORDER BY updated DESC';
    const path = `/search?jql=${encodeURIComponent(jql)}&maxResults=5`;
    console.log('JQL:', jql);
    console.log('Path:', path);
    
    const data = await makeJiraRequest(path);
    console.log('✅ API call successful!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCorrectEndpoint();
