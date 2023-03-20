# Insert JSON BigQuery Action

A Github JavaScript action to insert a supplied JSON to a BigQuery Table.

## Usage

You can consume this action by referencing the v1 branch

```yaml
    steps:
      - name: Upload Report to BigQuery
        uses: autotelic/insert-json-bigquery-action@v1
        with:
          projectId: gcp-project-id
          datasetId: gcp-dataset-id
          tableId: gcp-table-id
          jsonFilePath: ./path/to/data.json
```

All inputs are *required* and the calling workflow *must* be authenticated with GCP. See [GCP Authentication](#gcp-authentication)

Input | Required | Description
--- | --- | ---
`projectId` | **true** | The target BigQuery project id
`datasetId` | **true** | The target BigQuery dataset id
`tableId` | **true** | The target BigQuery table id
`jsonFilePath` | **true** | Path and filename of the JSON file to insert

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
          credentials_json: '${{ secrets.GOOGLE_CREDENTIALS }}'
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
