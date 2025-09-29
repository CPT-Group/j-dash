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
    // Search for tickets with network folder references
    const folderSearchQueries = [
      'S:\\\\Admin Cases',
      'S:\\\\Pre Cert',
      'S:\\\\Post Cert',
      'S:\\\\Distribution',
      'S:\\\\Mailing',
      'Admin Cases',
      'Pre Cert',
      'Post Cert',
      'Distribution',
      'Mailing',
      'Case No:',
      'Case Number:',
      '23CV010356',
      '21CV001529',
      '24STCV03908'
    ];

    const allFolderTickets = new Map();
    
    for (const query of folderSearchQueries) {
      console.log(`🔍 Searching for: "${query}"`);
      
      try {
        const searchData = await makeJiraRequest(`/search?jql=${encodeURIComponent(
          `text ~ "${query}" AND assignee in (kyle@cptgroup.com, james@cptgroup.com, thomas@cptgroup.com) ORDER BY updated DESC`
        )}`);
        
        if (searchData.issues && searchData.issues.length > 0) {
          console.log(`  Found ${searchData.issues.length} tickets with "${query}"`);
          
          for (const issue of searchData.issues) {
            const key = issue.key;
            if (!allFolderTickets.has(key)) {
              allFolderTickets.set(key, {
                key: key,
                summary: issue.fields.summary,
                assignee: issue.fields.assignee?.displayName || 'Unassigned',
                status: issue.fields.status.name,
                priority: issue.fields.priority?.name || 'None',
                component: issue.fields.components?.[0]?.name || 'No Component',
                created: issue.fields.created,
                updated: issue.fields.updated,
                description: issue.fields.description || '',
                comments: [],
                folderReferences: new Set()
              });
            }
            
            // Add folder reference
            allFolderTickets.get(key).folderReferences.add(query);
          }
        }
      } catch (error) {
        console.log(`  Error searching for "${query}": ${error.message}`);
      }
    }

    // Get detailed comments for each ticket
    console.log('\n📝 Analyzing ticket comments and descriptions...\n');
    
    for (const [key, ticket] of allFolderTickets) {
      try {
        // Get comments
        const commentsData = await makeJiraRequest(`/issue/${key}/comment`);
        if (commentsData.comments) {
          ticket.comments = commentsData.comments.map(comment => ({
            author: comment.author.displayName,
            created: comment.created,
            body: comment.body
          }));
        }
        
        // Search for specific folder patterns in description and comments
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
          /Case Number:?\s*([A-Z0-9-]+)/gi
        ];
        
        for (const pattern of folderPatterns) {
          const matches = fullText.match(pattern);
          if (matches) {
            matches.forEach(match => ticket.folderReferences.add(match));
          }
        }
        
        console.log(`- ${key}: ${ticket.summary}`);
        console.log(`  Assignee: ${ticket.assignee} | Status: ${ticket.status} | Component: ${ticket.component}`);
        console.log(`  Folder References: ${Array.from(ticket.folderReferences).join(', ')}`);
        console.log(`  Comments: ${ticket.comments.length}`);
        console.log('');
        
      } catch (error) {
        console.log(`  Error getting details for ${key}: ${error.message}`);
      }
    }

    // Analyze case patterns
    console.log('📊 Case Pattern Analysis:\n');
    
    const casePatterns = new Map();
    for (const [key, ticket] of allFolderTickets) {
      for (const ref of ticket.folderReferences) {
        if (ref.includes('Case No:') || ref.includes('Case Number:')) {
          const caseMatch = ref.match(/Case No:?\s*([A-Z0-9-]+)/i) || ref.match(/Case Number:?\s*([A-Z0-9-]+)/i);
          if (caseMatch) {
            const caseNumber = caseMatch[1];
            if (!casePatterns.has(caseNumber)) {
              casePatterns.set(caseNumber, []);
            }
            casePatterns.get(caseNumber).push(ticket);
          }
        }
      }
    }

    for (const [caseNumber, tickets] of casePatterns) {
      console.log(`Case ${caseNumber}: ${tickets.length} tickets`);
      tickets.forEach(ticket => {
        console.log(`  - ${ticket.key}: ${ticket.summary} (${ticket.status})`);
      });
      console.log('');
    }

    // Analyze folder structure patterns
    console.log('📁 Folder Structure Analysis:\n');
    
    const folderStructure = {
      'Admin Cases': new Set(),
      'Pre Cert': new Set(),
      'Post Cert': new Set(),
      'Distribution': new Set(),
      'Mailing': new Set()
    };

    for (const [key, ticket] of allFolderTickets) {
      for (const ref of ticket.folderReferences) {
        if (ref.includes('Admin Cases\\')) {
          const match = ref.match(/Admin Cases\\([^\\]+)/);
          if (match) folderStructure['Admin Cases'].add(match[1]);
        }
        if (ref.includes('Pre Cert\\')) {
          const match = ref.match(/Pre Cert\\([^\\]+)/);
          if (match) folderStructure['Pre Cert'].add(match[1]);
        }
        if (ref.includes('Post Cert\\')) {
          const match = ref.match(/Post Cert\\([^\\]+)/);
          if (match) folderStructure['Post Cert'].add(match[1]);
        }
        if (ref.includes('Distribution\\')) {
          const match = ref.match(/Distribution\\([^\\]+)/);
          if (match) folderStructure['Distribution'].add(match[1]);
        }
        if (ref.includes('Mailing\\')) {
          const match = ref.match(/Mailing\\([^\\]+)/);
          if (match) folderStructure['Mailing'].add(match[1]);
        }
      }
    }

    for (const [folder, cases] of folderStructure) {
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

    console.log('✅ Network Folder Analysis Complete!');
    console.log(`📊 Total tickets with folder references: ${allFolderTickets.size}`);
    
  } catch (error) {
    console.error('Error in network folder analysis:', error);
  }
}

analyzeNetworkFolderConnections();
