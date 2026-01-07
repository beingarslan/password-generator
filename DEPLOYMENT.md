# Auto Deployment Guide

This repository is configured with automatic deployment to your server whenever code is pushed to the `main` branch.

## How It Works

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. **Triggers** on every push to the `main` branch
2. **Builds** the project using `npm ci` and `npm run build`
3. **Deploys** the built files to your server via SSH/rsync

## Server Configuration

- **Server**: 65.108.245.231
- **User**: root
- **Deployment Path**: /var/www/password-generator
- **SSH Key**: Uses the `DEPLOY_SSH_PRIVATE_KEY` secret (already configured in repository settings)

## Deployment Process

When you push to `main`:

```bash
git push origin main
```

The workflow will:
1. Check out the code
2. Set up Node.js 20
3. Install dependencies with `npm ci`
4. Build the project with `npm run build`
5. Deploy the `dist` folder contents to `/var/www/password-generator` on your server
6. Use `rsync` with `--delete` flag to ensure the server matches the build output

## Monitoring Deployments

You can monitor deployment progress in the GitHub Actions tab of your repository:
- Go to: https://github.com/beingarslan/password-generator/actions
- Click on the latest "Deploy to Server" workflow run
- View logs for each step

## Manual Deployment

If you ever need to deploy manually without pushing to GitHub:

```bash
# Build locally
npm run build

# Deploy via rsync (requires SSH access)
rsync -avz --delete -e "ssh" ./dist/ root@65.108.245.231:/var/www/password-generator/
```

## Troubleshooting

### Deployment Fails with SSH Error
- Verify the `DEPLOY_SSH_PRIVATE_KEY` secret is correctly set in repository settings
- Ensure the SSH key has proper permissions on the server
- Check that the key matches the public key in `/root/.ssh/authorized_keys` on the server

### Build Fails
- Check the GitHub Actions logs for specific error messages
- Ensure `package.json` dependencies are correctly specified
- Test the build locally with `npm run build`

### Files Not Updating on Server
- Verify the server path `/var/www/password-generator` exists
- Check web server configuration points to the correct directory
- Ensure proper file permissions on the server

## Server Setup Requirements

Your server should have:
- SSH access enabled
- The deployment path `/var/www/password-generator` created
- Web server (nginx/apache) configured to serve files from this directory
- Proper permissions for the `root` user to write to the deployment directory

## Security Notes

- The SSH private key is stored securely as a GitHub Secret
- The workflow uses `--delete` flag with rsync to remove old files
- SSH host key verification is performed during deployment
- The private key is cleaned up after each deployment
