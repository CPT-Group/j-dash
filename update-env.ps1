# Update environment variables
$envContent = @"
JIRA_API_TOKEN=ATATT3xFfGF0W-2nvhmLAy2Lzlf7m9Vu_0rDoJkGTzQdJwuIKHJfloe9caGHaZqr2n3c-ZzJLqSLKXO8TJeob5-aefIyi8wck9pSj7EdDUk5PHa25kNXDtDQN18rgiZY-_zg61L4gJ4TKQemTWgJgfbfSPPHYUQML7AnVWeF8UTvN6sB2L6jipg=41E032CC
JIRA_USER_EMAIL=kyle@cptgroup.com
JIRA_DOMAIN=https://cptgroup.atlassian.net
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "Environment variables updated successfully!"
