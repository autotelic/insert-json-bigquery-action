const core = require('@actions/core');
const github = require('@actions/github');

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');

async function run() {
  try {
    // Get BigQuery Inputs
    const datasetId = core.getInput('datasetId')
    const tableId = core.getInput('tableId')
    const projectId = core.getInput('projectId')

    // Create an authorized BigQuery client
    const bigqueryClient = new BigQuery({ projectId })

    // Get Report Data Inputs
    const reportFilename = core.getInput('reportFilename')

    const reportString = fs.readFileSync(reportFilename, 'utf8')

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

    core.notice(`Inserted report ${reportFilename} into BigQuery Table ${tableId}`);

  } catch (error) {
    if (!error.message) {
      core.error('Something went wrong. Check Debug logs for details')
      core.debug(JSON.stringify(error, null, 2))
    } else {
      core.error(error.message)
    }
    core.setFailed(error.message);
  }
}

run();
