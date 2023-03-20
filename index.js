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
    const jsonFilePath = core.getInput('jsonFilePath')

    const jsonRaw = fs.readFileSync(jsonFilePath, 'utf8')
    const jsonData = JSON.parse(jsonRaw)

    // Insert data into a table
    await bigqueryClient
    .dataset(datasetId)
    .table(tableId)
    .insert(jsonData)

    core.notice(`Inserted JSON data from \`${jsonFilePath}\` into BigQuery Table \`${tableId}\``)

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
