# Risk Engine Hotspot Detection Report BigQuery Upload Action

A Github JavaScript action to insert a supplied Json report to a BigQuery Table.

This action is used in the reusable workflow: [risk-engine-hotspot-detection-workflow](https://github.com/telus/risk-engine-hotspot-detection-workflow)

This action is currently only designed to process and upload [code-complexity](https://github.com/simonrenoult/code-complexity#readme) json output reports along with associated metadata to a specific BigQuery schema.

The expected BigQuery Table Schema is:

```json
[
    {
        "name": "projectName",
        "type": "STRING",
        "mode": "NULLABLE"
    },
    {
        "name": "branch",
        "type": "STRING",
        "mode": "NULLABLE"
    },
    {
        "name": "sha",
        "type": "STRING",
        "mode": "NULLABLE"
    },
    {
        "name": "reportTime",
        "type": "TIMESTAMP",
        "mode": "NULLABLE"
    },
    {
        "name": "reportArray",
        "type": "RECORD",
        "mode": "REPEATED",
        "fields": [
            {
                "name": "path",
                "type": "STRING",
                "mode": "NULLABLE"
            },
            {
                "name": "churn",
                "type": "INTEGER",
                "mode": "NULLABLE"
            },
            {
                "name": "complexity",
                "type": "INTEGER",
                "mode": "NULLABLE"
            },
            {
                "name": "score",
                "type": "INTEGER",
                "mode": "NULLABLE"
            }
        ]
    }
]
```

## Usage

You can consume this action by referencing the v1 branch

```yaml
    steps:
      - name: Upload Report to BigQuery
        uses: telus/risk-engine-upload-hotspot-bigquery-action@v1
        with:
          projectId: gcp-project-id
          datasetId: gcp-dataset-id
          tableId: gcp-table-id
          reportFilename: ./path/to/report.json
```

All inputs are *required* and the calling workflow *must* be authenticated with GCP. See [GCP Authentication](#gcp-authentication)

Input | Required | Description
--- | --- | ---
`projectId` | **true** | The target BigQuery project id
`datasetId` | **true** | The target BigQuery dataset id
`tableId` | **true** | The target BigQuery table id
`reportPath` | **true** | Path and filename of the code-complexity json report

### GCP Authentication

Note: The risk-engine-upload-hotspot-bigquery-action *requires* authentication with GCP *prior* to execution. The [google-github-actions/auth](https://github.com/google-github-actions/auth) action can be used to authenticate.

This action must be supplied with a `credentials_json` Github secret which contains a json credential file for a GCP service account with sufficient access to the target project, dataset, and table.

e.g.

```yaml
    steps:
      - name: Authenticate with GCP
        id: auth
        uses: google-github-actions/auth@v1
        with:
          credentials_json: '${{ secrets.HOTSPOT_UPLOAD_GOOGLE_CREDENTIALS }}'
```

## Local Development

Install the dependencies

```bash
npm install
```

## Package for distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos.  Packaging the action will create a packaged action in the dist folder.

Run prepare

```bash
npm run prepare
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

## Create a release branch

Users shouldn't consume the action from main since that would be latest code and actions can break compatibility between major versions.

Checkout to the v1 release branch

```bash
git checkout -b v1
git commit -a -m "v1 release"
```

```bash
git push origin v1
```
