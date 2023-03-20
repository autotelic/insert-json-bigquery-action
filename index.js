const core = require('@actions/core');
const github = require('@actions/github');

// const { BigQuery } = require('@google-cloud/bigquery');

async function run() {
  try {
    // Get BigQuery Inputs
    // const application_credentials = core.getInput('application_credentials')
    // const projectId = core.getInput('projectId')
    // const datasetId = core.getInput('datasetId')
    // const tableId = core.getInput('tableId')

    // const bigQueryOptions = {
    //   keyFilename: '/tmp/account.json',
    //   projectId: projectId,
    // };

    // // Create an authorized BigQuery client
    // const bigqueryClient = new BigQuery(bigQueryOptions)

    // Get Report Data Inputs
    const reportFilename = core.getInput('reportFilename')
    const projectName = github.context.repository
    const branch = github.context.ref_name
    const sha = github.context.sha
    const reportTime = github.context.payload.created_at

    const rows = [
      {
        projectName,
        branch,
        sha,
        reportTime,
        report: JSON.stringify({reportFilename})
      }
    ]
    // Insert data into a table
    // core.info(`Inserting report ${reportFilename} into BigQuery Table ${tableId}`);

    core.info(rows)
    // await bigqueryClient
    //   .dataset(datasetId)
    //   .table(tableId)
    //   .insert(rows)

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
