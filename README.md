## Temporal Sample: Orchestrate Lamdba Functions

* TODO -- will be a Temporal version of https://docs.aws.amazon.com/step-functions/latest/dg/sample-lambda-orchestration.html
* TODO -- write workflows
* TODO -- write AWS orchestration code for AWS Lambda

### Configuration (optional if using local Temporal dev server)
- Copy the `.env_example` file to `.env.development` and change settings to match your temporal installation.

### Run Temporal Server ([Guide](https://docs.temporal.io/kb/all-the-ways-to-run-a-cluster#temporal-cli))
- `brew install temporal`
- `temporal server start-dev` (Temporal Server web UI: localhost:8233)

### Install
- `npm install`

### Run Developer environment
  - `npm run start`

#### Run workers (required to execute workflows)
  - `npm run worker`

#### (Advanced) Debug/replay Workflow histories with the [Temporal VSCode Extension](https://marketplace.visualstudio.com/items?itemName=temporal-technologies.temporalio)
- Open /server as a VSCode project
- Run the replayer on a downloaded workflow JSON file

#### Start a workflow
- Go to `http://localhost:3000/runWorkflow`
