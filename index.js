const core = require('@actions/core')
const github = require('@actions/github')

const { BigQuery } = require('@google-cloud/bigquery')
const fs = require('fs')

async function run() {
  try {
    // Get BigQuery Inputs
    const datasetId = core.getInput('datasetId')
    const tableId = core.getInput('tableId')
    const projectId = core.getInput('projectId')

    // Create an authorized BigQuery client
    const bigqueryClient = new BigQuery({ projectId })

    // Get Report Data Inputs
    const reportPath = core.getInput('reportPath')

    const reportString = fs.readFileSync(reportPath, 'utf8')

    // Define new data row values
    const projectName = github.context.payload.repository.name
    const branch = github.context.ref
    const sha = github.context.sha
    const reportTime = new Date()
    const reportArray = JSON.parse(reportString)

    const rows = [
      {
        projectName,
        branch,
        sha,
        reportTime,
        reportArray
      }
    ]

    // Insert data into a table
    await bigqueryClient
    .dataset(datasetId)
    .table(tableId)
    .insert(rows)

    core.notice(`Inserted report ${reportPath} into BigQuery Table ${tableId}`)

  } catch (error) {
    let { message } = error

    // Check for an Error missing the standard error.message property
    if (!message) {
      message = 'Something went wrong. Check Debug logs for details'
      // Debug log the entire error object for troubleshooting
      core.debug(JSON.stringify(error, null, 2))
    }

    core.setFailed(message)
  }
}

run()
