const core = require('@actions/core');
const github = require('@actions/github');

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');

async function run() {
  try {
    // Get BigQuery Inputs
    const projectId = core.getInput('projectId')
    const datasetId = core.getInput('datasetId')
    const tableId = core.getInput('tableId')

    // Create an authorized BigQuery client
    const bigqueryClient = new BigQuery({ projectId })

    // Get Report Data Inputs
    const reportFilename = core.getInput('reportFilename')

    const reportString = fs.readFileSync(reportFilename, 'utf8')
    core.info(reportString)
    const reportArray = JSON.parse(reportString)

    const projectName = github.context.payload.repository.name
    const branch = github.context.ref
    const sha = github.context.sha
    const reportTime = new Date()

    const rows = [
      {
        projectName,
        branch,
        sha,
        reportTime,
        report: reportString,
        reportArray
      }
    ]

    // Insert data into a table
    core.info(`Inserting report ${reportFilename} into BigQuery Table ${tableId}`);

    await bigqueryClient
    .dataset(datasetId)
    .table(tableId)
    .insert(rows)
    core.info(JSON.stringify(rows))

  } catch (error) {
    core.error('Caught an error')
    core.error(JSON.stringify(error))
    core.setFailed(error.message);
  }
}

run();
