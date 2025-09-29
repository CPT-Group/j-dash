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

async function analyzeNetworkFolderConnections() {
  console.log('🔍 DEEP ANALYSIS: Network Folder Connections...\n');
  
  try {
    // Get all recent tickets first
    console.log('📋 Fetching recent tickets...');
    const recentTickets = await makeJiraRequest('/search?jql=' + encodeURIComponent(
      'assignee in (kyle@cptgroup.com, james@cptgroup.com, thomas@cptgroup.com) ORDER BY updated DESC'
    ));

    console.log(`Found ${recentTickets.issues.length} recent tickets\n`);

    const folderTickets = [];
    const casePatterns = new Map();
    const folderStructure = {
      'Admin Cases': new Set(),
      'Pre Cert': new Set(),
      'Post Cert': new Set(),
      'Distribution': new Set(),
      'Mailing': new Set()
    };

    // Analyze each ticket for folder references
    for (const issue of recentTickets.issues.slice(0, 50)) { // Limit to first 50 for performance
      try {
        console.log(`🔍 Analyzing ${issue.key}: ${issue.fields.summary}`);
        
        // Get full ticket details including comments
        const ticketData = await makeJiraRequest(`/issue/${issue.key}?expand=comments`);
        
        const ticket = {
          key: issue.key,
          summary: issue.fields.summary,
          assignee: issue.fields.assignee?.displayName || 'Unassigned',
          status: issue.fields.status.name,
          priority: issue.fields.priority?.name || 'None',
          component: issue.fields.components?.[0]?.name || 'No Component',
          created: issue.fields.created,
          updated: issue.fields.updated,
          description: issue.fields.description || '',
          comments: ticketData.comments?.comments || [],
          folderReferences: new Set(),
          caseNumber: null
        };

        // Search for folder patterns in description and comments
        const fullText = `${ticket.description} ${ticket.comments.map(c => c.body).join(' ')}`;
        
        // Look for specific folder patterns
        const folderPatterns = [
          /S:\\\\([^\\]+)\\([^\\]+)/g,
          /Admin Cases\\([^\\]+)/g,
          /Pre Cert\\([^\\]+)/g,
          /Post Cert\\([^\\]+)/g,
          /Distribution\\([^\\]+)/g,
          /Mailing\\([^\\]+)/g,
          /Case No:?\s*([A-Z0-9-]+)/gi,
          /Case Number:?\s*([A-Z0-9-]+)/gi,
          /23CV010356/gi,
          /21CV001529/gi,
          /24STCV03908/gi
        ];
        
        for (const pattern of folderPatterns) {
          const matches = fullText.match(pattern);
          if (matches) {
            matches.forEach(match => {
              ticket.folderReferences.add(match);
              
              // Extract case numbers
              const caseMatch = match.match(/Case No:?\s*([A-Z0-9-]+)/i) || match.match(/Case Number:?\s*([A-Z0-9-]+)/i);
              if (caseMatch) {
                ticket.caseNumber = caseMatch[1];
                if (!casePatterns.has(ticket.caseNumber)) {
                  casePatterns.set(ticket.caseNumber, []);
                }
                casePatterns.get(ticket.caseNumber).push(ticket);
              }
              
              // Extract folder structure
              if (match.includes('Admin Cases\\')) {
                const folderMatch = match.match(/Admin Cases\\([^\\]+)/);
                if (folderMatch) folderStructure['Admin Cases'].add(folderMatch[1]);
              }
              if (match.includes('Pre Cert\\')) {
                const folderMatch = match.match(/Pre Cert\\([^\\]+)/);
                if (folderMatch) folderStructure['Pre Cert'].add(folderMatch[1]);
              }
              if (match.includes('Post Cert\\')) {
                const folderMatch = match.match(/Post Cert\\([^\\]+)/);
                if (folderMatch) folderStructure['Post Cert'].add(folderMatch[1]);
              }
              if (match.includes('Distribution\\')) {
                const folderMatch = match.match(/Distribution\\([^\\]+)/);
                if (folderMatch) folderStructure['Distribution'].add(folderMatch[1]);
              }
              if (match.includes('Mailing\\')) {
                const folderMatch = match.match(/Mailing\\([^\\]+)/);
                if (folderMatch) folderStructure['Mailing'].add(folderMatch[1]);
              }
            });
          }
        }

        if (ticket.folderReferences.size > 0) {
          folderTickets.push(ticket);
          console.log(`  ✅ Found ${ticket.folderReferences.size} folder references`);
          console.log(`  📁 References: ${Array.from(ticket.folderReferences).join(', ')}`);
          if (ticket.caseNumber) {
            console.log(`  📋 Case Number: ${ticket.caseNumber}`);
          }
        } else {
          console.log(`  ❌ No folder references found`);
        }
        
        console.log('');
        
      } catch (error) {
        console.log(`  Error analyzing ${issue.key}: ${error.message}`);
      }
    }

    // Display results
    console.log('📊 NETWORK FOLDER CONNECTION ANALYSIS RESULTS:\n');
    
    console.log(`📋 Total tickets with folder references: ${folderTickets.length}\n`);

    // Case Pattern Analysis
    if (casePatterns.size > 0) {
      console.log('📋 Case Pattern Analysis:\n');
      for (const [caseNumber, tickets] of casePatterns) {
        console.log(`Case ${caseNumber}: ${tickets.length} tickets`);
        tickets.forEach(ticket => {
          console.log(`  - ${ticket.key}: ${ticket.summary} (${ticket.status})`);
        });
        console.log('');
      }
    }

    // Folder Structure Analysis
    console.log('📁 Folder Structure Analysis:\n');
    for (const [folder, cases] of Object.entries(folderStructure)) {
      if (cases.size > 0) {
        console.log(`${folder}: ${cases.size} cases`);
        Array.from(cases).slice(0, 10).forEach(caseName => {
          console.log(`  - ${caseName}`);
        });
        if (cases.size > 10) {
          console.log(`  ... and ${cases.size - 10} more`);
        }
        console.log('');
      }
    }

    // Specific Case Analysis
    console.log('🚨 CRITICAL CASE ANALYSIS:\n');
    
    const criticalCases = ['23CV010356', '21CV001529', '24STCV03908'];
    for (const caseNum of criticalCases) {
      const caseTickets = folderTickets.filter(t => t.caseNumber === caseNum);
      if (caseTickets.length > 0) {
        console.log(`Case ${caseNum}: ${caseTickets.length} tickets`);
        caseTickets.forEach(ticket => {
          console.log(`  - ${ticket.key}: ${ticket.summary}`);
          console.log(`    Status: ${ticket.status} | Assignee: ${ticket.assignee}`);
          console.log(`    Folder References: ${Array.from(ticket.folderReferences).join(', ')}`);
        });
        console.log('');
      }
    }

    console.log('✅ Network Folder Analysis Complete!');
    
  } catch (error) {
    console.error('Error in network folder analysis:', error);
  }
}

analyzeNetworkFolderConnections();
