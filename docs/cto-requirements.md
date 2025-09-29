# CTO Dashboard Requirements - J-Dash

## Executive Summary
Based on extensive Jira API research, the CTO needs a real-time analytics dashboard focused on critical operational metrics for the data team (Kyle, James, Thomas) managing 977+ tickets across CM and OPRD projects.

## Critical Metrics Dashboard

### 1. **Overdue Tickets Alert** (HIGHEST PRIORITY)
- **Current State**: 294 overdue tickets (some 800+ days overdue!)
- **Display**: Prominent red alert banner with count
- **Details**: Show oldest overdue tickets, days overdue, assignee
- **Action**: Click to drill down to overdue ticket list

### 2. **Due Today Counter** (HIGH PRIORITY)
- **Current State**: 6 tickets due today
- **Display**: Large neon counter with urgent styling
- **Details**: List of tickets, assignee, priority level
- **Action**: Quick access to today's work queue

### 3. **Missing Components Alert** (MEDIUM PRIORITY)
- **Current State**: 13 tickets (13% of recent tickets) missing components
- **Display**: Warning indicator with count
- **Details**: List of tickets needing categorization
- **Action**: Direct link to component assignment

### 4. **Team Workload Distribution**
- **Kyle Dilbeck**: Website specialist (websites, passcodes, interactive sites)
- **James Cassidy**: Database specialist (database migration, data processing, bugs)
- **Thomas Williams**: Weekly reports specialist (report setup, weekly reports)

### 5. **Component Category Analysis**
- **Bug**: 19 tickets (highest volume)
- **No Component**: 13 tickets (needs attention)
- **Database Migration**: 4 tickets
- **Data Processing**: 4 tickets
- **Website Creation**: 1 ticket
- **Weekly Report Setup**: 2 tickets

### 6. **Status Distribution**
- **To Do**: 14 tickets (stuck in queue)
- **PEER TESTING**: 6 tickets (awaiting review)
- **Data Team New**: 7 tickets (new assignments)
- **Completed**: 7 tickets (recent completions)
- **DEVELOPMENT**: 8 tickets (active work)

### 7. **Priority Alerts**
- **Highest**: 5 tickets (urgent)
- **High**: 4 tickets (important)
- **Medium**: 41 tickets (standard)

## Dashboard Layout Requirements

### Header Section
- **Scrolling News Ticker**: "Active: 6 due today | Overdue: 294 tickets | Missing Components: 13"
- **Team Status**: Real-time indicators for each team member
- **Last Updated**: Timestamp of last data refresh

### Main Metrics Cards
1. **Overdue Tickets** - Large red counter with neon glow
2. **Due Today** - Urgent orange counter
3. **Missing Components** - Warning yellow counter
4. **Team Velocity** - Performance metric

### Charts Section
1. **Component Distribution** - Pie chart with neon colors
2. **Status Flow** - Sankey diagram showing ticket progression
3. **Team Workload** - Bar chart by assignee
4. **Overdue Trend** - Line chart showing overdue accumulation

### Real-time Activity Feed
- **Recent Completions**: Green highlights
- **New Assignments**: Blue highlights
- **Status Changes**: Yellow highlights
- **Overdue Alerts**: Red highlights

## Technical Requirements

### Data Sources
- **Primary**: Jira REST API v3 (cptgroup.atlassian.net)
- **Authentication**: API token (kyle@cptgroup.com)
- **Refresh Rate**: Real-time updates every 30 seconds
- **Projects**: CM (Case Management), OPRD (CPT Prod Support)

### Key API Endpoints
- `/rest/api/3/search` - Ticket queries with JQL
- `/rest/api/3/issue/{issueIdOrKey}` - Individual ticket details
- `/rest/api/3/project` - Project information
- `/rest/api/3/field` - Custom field definitions

### Critical JQL Queries
```jql
# Overdue tickets
assignee in (kyle@cptgroup.com, james@cptgroup.com, thomas@cptgroup.com) AND duedate < now() AND status != Done

# Due today
assignee in (kyle@cptgroup.com, james@cptgroup.com, thomas@cptgroup.com) AND duedate = "2024-09-29" AND status != Done

# Missing components
assignee in (kyle@cptgroup.com, james@cptgroup.com, thomas@cptgroup.com) AND component is EMPTY

# Data team new
assignee in (kyle@cptgroup.com, james@cptgroup.com, thomas@cptgroup.com) AND status = "Data Team New"
```

## Visual Design Requirements

### Theme
- **Base**: Dark Synth theme with neon purple accents
- **Background**: Deep purple (#0c0020) with darker cards (#07071b)
- **Text**: Light purple (#dbd4fa) with neon accents
- **Accents**: Neon purple (#ff7edb), cyan (#03edf9), green (#72f1b8)

### Animations
- **Neon Glow**: Pulsing effects on critical metrics
- **Scrolling Ticker**: Smooth horizontal scroll for alerts
- **Fade In**: Smooth transitions for data updates
- **Hover Effects**: Subtle neon highlights

### Responsive Design
- **Desktop**: Full dashboard with all metrics visible
- **Tablet**: Condensed layout with collapsible sections
- **Mobile**: Stacked cards with essential metrics only

## Success Metrics
1. **Reduced Overdue Tickets**: Track decrease in overdue count
2. **Improved Component Assignment**: Reduce missing component tickets
3. **Team Efficiency**: Monitor completion rates by team member
4. **Real-time Awareness**: CTO can see issues as they arise
5. **Data-driven Decisions**: Clear visibility into team workload and bottlenecks
