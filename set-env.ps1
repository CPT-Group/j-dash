# Set environment variables for the current session
$env:JIRA_API_TOKEN = "ATATT3xFfGF094ZodbyrvO7MeInXfjCMDGBNJ7S_6BVb0PQdpR1vsehHWBKT0VMESXc-DrRns62FTMZY6SnixCMGF8Iz0k1HZQLIp1W2muHwHAx2pqEqsX1sdFoMyKXnexvsTyM0DxiwTsY_0uf84hkkOUSoEgODPR-cMOhlA_XTIcPa8bo_xmk=07DF1E82"
$env:JIRA_USER_EMAIL = "kyle@cptgroup.com"
$env:JIRA_BASE_URL = "https://cptgroup.atlassian.net"

Write-Host "Environment variables set:"
Write-Host "JIRA_API_TOKEN: $($env:JIRA_API_TOKEN -ne $null)"
Write-Host "JIRA_USER_EMAIL: $($env:JIRA_USER_EMAIL)"
Write-Host "JIRA_BASE_URL: $($env:JIRA_BASE_URL)"

Write-Host "Starting Next.js development server..."
npm run dev
