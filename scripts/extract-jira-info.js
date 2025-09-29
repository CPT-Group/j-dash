// Extract Jira domain and email from token
const token = 'ATATT3xFfGF094ZodbyrvO7MeInXfjCMDGBNJ7S_6BVb0PQdpR1vsehHWBKT0VMESXc-DrRns62FTMZY6SnixCMGF8Iz0k1HZQLIp1W2muHwHAx2pqEqsX1sdFoMyKXnexvsTyM0DxiwTsY_0uf84hkkOUSoEgODPR-cMOhlA_XTIcPa8bo_xmk=07DF1E82';

// Decode the token to see its structure
console.log('Token analysis:');
console.log('Length:', token.length);
console.log('Starts with ATATT3:', token.startsWith('ATATT3'));

// The token format is typically: ATATT3...@domain.com
// Let's try to extract domain information
const domainMatch = token.match(/@([^=]+)/);
if (domainMatch) {
  console.log('Detected domain pattern:', domainMatch[1]);
} else {
  console.log('No domain pattern found in token');
}

// Let's also check if there are any other patterns
const emailMatch = token.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
if (emailMatch) {
  console.log('Detected email pattern:', emailMatch[1]);
} else {
  console.log('No email pattern found in token');
}

// The token appears to be a standard Atlassian API token
// We need the user to provide their email and domain
console.log('\nTo proceed with research, we need:');
console.log('1. Your Jira domain (e.g., yourcompany.atlassian.net)');
console.log('2. Your email address associated with the Jira account');
console.log('3. Confirmation that this token has the necessary permissions');
