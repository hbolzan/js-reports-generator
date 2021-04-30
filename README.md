# JS Rerports Generator
A self contained JS reports generator

## About
Create templates, then just add data and some arguments. It will do the rest.

## Components

### ReportsIndex
Path: `components/report/reports-index.js`

Fetches list of available reports and create an index with links to report params.

### ReportParams
Path: `components/report/report-params.js`

Component responsible for fetching report definition from the server API. It keeps definition data cached.

### ReportDialog
Path: `components/report/report-dialog.js`

This component renders params dialog for a report.
