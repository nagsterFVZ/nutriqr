# Automated Deployment Setup Guide

This guide walks through setting up automated deployments from GitHub to the Hetzner VPS that already hosts `qk-property`. NutriQR reuses that VPS's existing Docker + Traefik setup — you do **not** need to install Docker, install Traefik, or create the `web` Docker network again; all of that is already in place.

## Overview

When you push to the `main` branch (with changes under `apps/web/`, `packages/ts/`, or the deploy config files), GitHub Actions will automatically:

1. Connect to the VPS via SSH
2. Pull the latest code
3. Rebuild and restart the Docker container
4. Verify the deployment was successful

## Prerequisites

- SSH access to the Hetzner VPS (the one already running `qk-property` + Traefik)
- This repo cloned locally, and a GitHub account with write access to it

## Step-by-Step Setup

### 1. Generate a dedicated SSH deploy key

On your **local machine**, generate a new SSH key pair just for NutriQR's deploys (don't reuse `qk-property-deploy` — per-project keys make it easy to revoke one without affecting the other):

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy-nutriqr" -f ~/.ssh/nutriqr-deploy
```

This creates:

- `nutriqr-deploy` (private key) — goes into GitHub Secrets
- `nutriqr-deploy.pub` (public key) — goes onto the VPS

### 2. Add the public key to the VPS

```bash
# Option 1: using ssh-copy-id
ssh-copy-id -i ~/.ssh/nutriqr-deploy.pub your-username@your-vps-ip

# Option 2: manually, on the VPS
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys  # paste the public key content
chmod 600 ~/.ssh/authorized_keys
```

### 3. Set up the project directory on the VPS

```bash
# On the VPS
sudo mkdir -p /opt/projects/nutriqr
sudo chown $USER:$USER /opt/projects/nutriqr

cd /opt/projects/nutriqr
git clone https://github.com/nagsterFVZ/nutriqr.git .

# The shared `web` Docker network already exists (created for qk-property) -
# no need to run `docker network create web` again.

# Create and configure .env
cp .env.example .env
nano .env  # confirm DOMAIN=nutriqr.dev and CERT_RESOLVER match your Traefik setup
```

### 4. Configure GitHub Secrets

Go to this repo on GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**, and add:

| Secret Name        | Value                    | Description                              |
| ------------------- | ------------------------ | ----------------------------------------- |
| `VPS_HOST`          | `your-vps-ip`             | Same IP as used for qk-property           |
| `VPS_USERNAME`      | `your-username`           | SSH username on the VPS                   |
| `VPS_SSH_KEY`       | `<nutriqr-deploy content>` | Content of the private key from step 1   |
| `VPS_PROJECT_PATH`  | `/opt/projects/nutriqr`   | Full path to the project on the VPS       |
| `VPS_PORT`          | `22`                      | SSH port (optional, defaults to 22)       |

**To get the private key content:**

```bash
# Windows (PowerShell)
Get-Content ~/.ssh/nutriqr-deploy | clip

# macOS/Linux
cat ~/.ssh/nutriqr-deploy | pbcopy  # macOS
cat ~/.ssh/nutriqr-deploy | xclip   # Linux
```

Copy the **entire content**, including the `-----BEGIN` and `-----END` lines.

### 5. Point DNS at the VPS

Add an `A` record (and `AAAA` if the VPS has IPv6) for `nutriqr.dev` pointing at the VPS's IP, with your DNS provider/registrar. Traefik will automatically request a Let's Encrypt certificate for `nutriqr.dev` the first time a request for that hostname reaches it — no manual Traefik configuration needed, but this only works once DNS actually resolves there.

### 6. Test the SSH connection

```bash
ssh -i ~/.ssh/nutriqr-deploy your-username@your-vps-ip
```

### 7. Initial manual deployment

Before relying on automation, do one manual deployment to confirm everything works:

```bash
# On the VPS
cd /opt/projects/nutriqr
docker compose up -d --build
docker compose logs -f app
```

Visit `https://nutriqr.dev` to verify the site is live and has a valid certificate.

### 8. Push to trigger automated deployment

```bash
git add .
git commit -m "Add automated deployment workflow"
git push origin main
```

### 9. Monitor the deployment

Go to the repo's **Actions** tab on GitHub — you should see the "Deploy to VPS" workflow running. Click it for real-time logs.

## Manual deployment trigger

You can also trigger a deploy without pushing:

1. Go to the **Actions** tab
2. Select **Deploy to VPS**
3. Click **Run workflow** → select `main` → **Run workflow**

## Since this VPS already runs Traefik for qk-property

- Router/service names in `docker-compose.yml` are namespaced (`nutriqr`, distinct from `qk-property`) so both apps coexist on the same Traefik instance without collision.
- Skip: installing Docker, installing/configuring Traefik, and `docker network create web` — all already done.

## Public repo note

This repo is public. That's fine for this setup (GitHub Secrets stay encrypted/redacted regardless of visibility, and the workflow only triggers on `push` to `main` / manual dispatch — never on `pull_request`, which is the trigger type that's actually risky for public repos). Since the project's whole point is to attract outside contributors, it's worth enabling **branch protection on `main` requiring PR review before merge** (Settings → Branches) — without it, anyone you ever add as a collaborator could push directly to `main`, including edits to `.github/workflows/deploy.yml` itself, and the deploy key would run whatever that file says on the VPS.

## Troubleshooting

### SSH connection fails

```bash
chmod 600 ~/.ssh/nutriqr-deploy
chmod 644 ~/.ssh/nutriqr-deploy.pub
ssh -v -i ~/.ssh/nutriqr-deploy your-username@your-vps-ip
```

### Docker permission denied

```bash
sudo usermod -aG docker $USER
# log out and back in
```

### Container won't start

```bash
cd /opt/projects/nutriqr
docker compose logs app
cat .env
docker compose down
docker compose build --no-cache
docker compose up -d
```

### "Module not found" at runtime

The Dockerfile ships a lean runtime image (just `.output/`, relying on Nitro's server bundle being self-contained — no `node_modules` copied in). If some dependency turns out not to be bundleable, Nitro emits its own `package.json` inside `.output/server/` listing any such deps. Fallback: add a step to the Dockerfile's runner stage to `COPY --from=builder /app/apps/web/.output/server/package.json ./.output/server/package.json` and `RUN cd .output/server && npm install --omit=dev` before the final `CMD`.

### Port already in use

```bash
sudo lsof -i :3000
# or
sudo netstat -tulpn | grep :3000
```

## Rollback procedure

```bash
cd /opt/projects/nutriqr
git log --oneline -10
git reset --hard <commit-hash>
docker compose down
docker compose up -d --build
```

## Deployment script usage

`deploy.sh` can be run manually on the VPS and includes automatic backups, health checks, rollback on failure, and log cleanup:

```bash
cd /opt/projects/nutriqr
chmod +x deploy.sh
./deploy.sh
```

## Environment variables

The VPS's `.env` should contain:

```env
NODE_ENV=production
DOMAIN=nutriqr.dev
CERT_RESOLVER=letsencrypt
NITRO_PORT=3000
NITRO_HOST=0.0.0.0
```
