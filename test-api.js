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

async function testJiraAPI() {
  try {
    console.log('Testing Jira API connection...');
    const data = await makeJiraRequest('/rest/api/3/search?jql=' + encodeURIComponent('assignee in ("kyle@cptgroup.com") ORDER BY updated DESC'));
    console.log('Success! Total issues:', data.total);
    console.log('First issue:', data.issues[0]?.key);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testJiraAPI();
