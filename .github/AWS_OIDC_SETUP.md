# AWS OIDC setup for GitHub Actions deploys

One-time setup so GitHub Actions can deploy to S3 + CloudFront **without any long-lived AWS
keys**. GitHub requests a short-lived token, AWS trusts it, and hands back temporary credentials
scoped to just this repo's `production` environment.

Replace the placeholders throughout:

| Placeholder            | Meaning                                            |
|------------------------|----------------------------------------------------|
| `ACCOUNT_ID`           | your 12-digit AWS account ID                        |
| `YOUR-BUCKET`          | the S3 bucket serving the site                       |
| `DISTRIBUTION_ID`      | the CloudFront distribution ID (e.g. `E123ABC456`)  |
| `REGION`               | bucket region (e.g. `ap-south-1`)                   |

---

## 1. Create the GitHub OIDC identity provider (once per AWS account)

IAM → **Identity providers** → **Add provider** → **OpenID Connect**:

- **Provider URL:** `https://token.actions.githubusercontent.com`
- **Audience:** `sts.amazonaws.com`

(If it already exists from another repo, skip this.)

## 2. Create the deploy IAM role

IAM → **Roles** → **Create role** → **Custom trust policy**, paste this (scopes trust to *this
repo's* `production` environment only — nothing else can assume it):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:Jeffrin-Goldwin/Portfolio:environment:production"
        }
      }
    }
  ]
}
```

Name it e.g. `portfolio-deploy`. Then attach this **least-privilege permissions policy** (create
it inline or as a managed policy):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucket",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::YOUR-BUCKET"
    },
    {
      "Sid": "ReadWriteObjects",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::YOUR-BUCKET/*"
    },
    {
      "Sid": "InvalidateCDN",
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
    }
  ]
}
```

Copy the finished **Role ARN** (`arn:aws:iam::ACCOUNT_ID:role/portfolio-deploy`).

## 3. Create the `production` environment in GitHub

Repo → **Settings** → **Environments** → **New environment** → name it exactly `production`.
(Optional but nice: add yourself as a **required reviewer** so every deploy waits for a click.)

## 4. Add the repo secrets & variables

Repo → **Settings** → **Secrets and variables** → **Actions**:

**Secrets** (tab: Secrets):
- `AWS_ROLE_ARN` = the Role ARN from step 2

**Variables** (tab: Variables):
- `AWS_REGION` = `REGION`
- `S3_BUCKET` = `YOUR-BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID` = `DISTRIBUTION_ID`

## 5. Done

Push to `main` → the **Build (CI)** job compiles the bundle, then **Deploy (CD)** assumes the role,
syncs to S3, and invalidates CloudFront. Pull requests run **CI only** — they never deploy.

> Security notes
> - No AWS keys are ever stored in GitHub. Credentials are minted per-run and expire in ~1 hour.
> - The trust policy pins the exact repo **and** the `production` environment, so a fork or another
>   repo cannot assume the role.
> - The permissions policy grants only S3 object writes on this one bucket and invalidation on this
>   one distribution.
