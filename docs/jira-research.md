# Jira API Research - CPT Group Analysis

## API Configuration
- **Domain**: cptgroup.atlassian.net
- **Email**: kyle@cptgroup.com
- **Token**: ATATT3xFfGF094ZodbyrvO7MeInXfjCMDGBNJ7S_6BVb0PQdpR1vsehHWBKT0VMESXc-DrRns62FTMZY6SnixCMGF8Iz0k1HZQLIp1W2muHwHAx2pqEqsX1sdFoMyKXnexvsTyM0DxiwTsY_0uf84hkkOUSoEgODPR-cMOhlA_XTIcPa8bo_xmk=07DF1E82

## Key Findings

### Projects (11 total)
- **CS**: CaseSolidate (software)
- **CM**: Case Management (software) - **PRIMARY PROJECT**
- **OPRD**: CPT Prod Support (software) - **PRIMARY PROJECT**
- **NA**: NCOA_Alteryx (software)
- **FEDA**: FormElemenets_DataEntry_App (software)
- **SFDC**: Salesforce (software)
- **HWCW**: Help with Case Website (business)
- **CTPT**: Consumer Team Project Tracker (software)
- **CW**: Case Workflow (software)
- **CWTEST**: Case Workflow Test Project (software)
- **CPTES**: Enterprise Systems (software)

### Data Team Members
- **Kyle Dilbeck** (kyle@cptgroup.com) - Website specialist
- **James Cassidy** (james@cptgroup.com) - Database specialist
- **Thomas Williams** (thomas@cptgroup.com) - Weekly reports specialist

### Critical Statuses for Data Team
- **Data Team New** (10054) - New tickets assigned to data team
- **Data Team In Progress** (10055) - Active work
- **Data Team Testing** (10056) - QA phase
- **Data Team Complete** (10057) - Completed
- **Requested** (10058) - Initial request
- **Request Complete** (10059) - Request fulfilled

### Component Categories (Key for CTO Analytics)
1. **Bug** (19 tickets) - Bug fixes and issues
2. **No Component** (13 tickets) - Missing categorization (needs attention)
3. **Generate Passcodes** (2 tickets) - Website passcode generation
4. **Process NCOA/ACS** (2 tickets) - Data processing
5. **Website Creation** (1 ticket) - New website setup
6. **Report** (1 ticket) - Report generation
7. **Web** (2 tickets) - Web-related tasks
8. **Database Migration** (4 tickets) - Database work
9. **Data** (4 tickets) - Data processing
10. **Weekly Report Setup** (2 tickets) - Report configuration

### Priority Distribution
- **Medium**: 41 tickets (most common)
- **Highest**: 5 tickets (urgent)
- **High**: 4 tickets (important)

### Critical Metrics for CTO Dashboard
- **Total Data Team Issues**: 977 tickets
- **Overdue Issues**: 294 tickets (some 800+ days overdue!)
- **Due Today**: 6 tickets
- **Missing Components**: 13 tickets (13% of recent tickets)

### Key Custom Fields for Analytics
- **Case No** (customfield_10075) - Links to S:\Admin Cases
- **Website Type** (customfield_10077) - Website categorization
- **Case Name** (customfield_10060) - Case identification
- **Case Type** (customfield_10057) - Case categorization
- **Story Points** (customfield_10028) - Effort estimation
- **Due Date** - Critical for overdue tracking

### Workflow Analysis
1. **Requested** → **Data Team New** → **Data Team In Progress** → **Data Team Testing** → **Data Team Complete**
2. Many tickets stuck in "To Do" status (14 recent tickets)
3. High number of "PEER TESTING" status (6 recent tickets)

### Critical Issues Identified
1. **294 overdue tickets** - Some extremely overdue (800+ days)
2. **13 tickets missing components** - Categorization issue
3. **High volume of bugs** (19 recent tickets)
4. **Multiple tickets due today** (6 tickets)

## CTO Dashboard Requirements
Based on this data, the CTO needs to see:
1. **Overdue tickets** (294 total, some 800+ days overdue)
2. **Due today** (6 tickets)
3. **Missing components** (13 tickets need categorization)
4. **Component distribution** (Bug, Web, Database, Reports)
5. **Team workload** (Kyle: websites, James: database, Thomas: reports)
6. **Status distribution** (To Do, In Progress, Testing, Complete)
7. **Priority alerts** (5 Highest priority tickets)
