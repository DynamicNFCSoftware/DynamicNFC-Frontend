# Switching on automatic deploys (one-time setup by Oguzhan)

`.github/workflows/deploy.yml` deploys dynamicnfc.ca whenever `main` changes, **after** lint, build, unit tests, browser tests and the build-output check pass, and then confirms the live site is the real app. It does nothing until the two repository variables in step 3 exist.

Login is keyless (Workload Identity Federation). JSON key files are blocked by the GCP org policy, so this is the only route.

**Status: written by Claude on 2026-10-07, never run.** The commands below are the standard setup; the exact roles Firebase Hosting needs, and whether the org policy allows creating the pool, are not verified. Run them once, then trigger the workflow by hand (Actions → Deploy hosting → Run workflow) and read the log.

## 1. Google Cloud (PowerShell, logged in as the project owner)

```powershell
$P = "dynamicnfc-prod-68b4e"
$REPO = "DynamicNFCSoftware/DynamicNFC-Frontend"
$NUM = gcloud projects describe $P --format="value(projectNumber)"

gcloud iam workload-identity-pools create github --project=$P --location=global --display-name="GitHub Actions"
gcloud iam workload-identity-pools providers create-oidc github-repo --project=$P --location=global --workload-identity-pool=github --issuer-uri="https://token.actions.githubusercontent.com" --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" --attribute-condition="assertion.repository=='$REPO'"

gcloud iam service-accounts create github-hosting-deploy --project=$P --display-name="GitHub hosting deploy"
gcloud projects add-iam-policy-binding $P --member="serviceAccount:github-hosting-deploy@$P.iam.gserviceaccount.com" --role="roles/firebasehosting.admin"
gcloud iam service-accounts add-iam-policy-binding "github-hosting-deploy@$P.iam.gserviceaccount.com" --project=$P --role="roles/iam.workloadIdentityUser" --member="principalSet://iam.googleapis.com/projects/$NUM/locations/global/workloadIdentityPools/github/attribute.repository/$REPO"
```

The provider only trusts this one GitHub repository, and the service account can only manage Hosting.

## 2. If the first run fails on permissions

Read the error in the workflow log; it names the missing permission. Add only that role to the service account. Do not grant Owner or Editor.

## 3. GitHub → repository → Settings → Secrets and variables → Actions → Variables


| Name                             | Value                                                                                           |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/<project number>/locations/global/workloadIdentityPools/github/providers/github-repo` |
| `GCP_SERVICE_ACCOUNT`            | `github-hosting-deploy@dynamicnfc-prod-68b4e.iam.gserviceaccount.com`                           |


