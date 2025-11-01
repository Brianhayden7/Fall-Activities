# Deployment Guide for 100 Fall Adventures

## Docker Deployment with Portainer

### Prerequisites
- Docker installed on your server
- Portainer installed and running
- Access to Portainer web interface

### Deployment Steps

#### Option 1: Using Portainer Stacks (Recommended)

1. **Access Portainer**
   - Navigate to your Portainer instance (e.g., `http://your-server:9000`)
   - Log in with your credentials

2. **Create a New Stack**
   - Go to **Stacks** in the left sidebar
   - Click **+ Add stack**
   - Give it a name: `fall-activities`

3. **Upload or Paste the Compose File**
   - Choose **Web editor**
   - Copy and paste the contents of `docker-compose.yml`
   - Or use **Upload** to upload the `docker-compose.yml` file

4. **Build Context**
   - Since we're building from source, you need to upload the entire project
   - Use **Git Repository** option:
     - Repository URL: (your git repo URL if you have one)
     - Or use **Upload** and upload the entire project folder as a zip

5. **Deploy the Stack**
   - Click **Deploy the stack**
   - Wait for the build and deployment to complete

6. **Access Your Application**
   - Once deployed, access at: `http://your-server:8080`

#### Option 2: Using Docker CLI

1. **Navigate to Project Directory**
   ```bash
   cd /path/to/Fall-Activities
   ```

2. **Build and Run with Docker Compose**
   ```bash
   docker-compose up -d --build
   ```

3. **Check Status**
   ```bash
   docker-compose ps
   ```

4. **View Logs**
   ```bash
   docker-compose logs -f fall-activities
   ```

#### Option 3: Pre-built Image (Manual Build)

1. **Build the Docker Image**
   ```bash
   docker build -t fall-activities:latest .
   ```

2. **Run the Container**
   ```bash
   docker run -d \
     --name fall-activities \
     -p 8080:80 \
     --restart unless-stopped \
     fall-activities:latest
   ```

3. **Add to Portainer**
   - Go to **Containers** in Portainer
   - Your container should appear automatically
   - Or add it manually using the container name

### Configuration

#### Changing the Port
Edit `docker-compose.yml` and change the port mapping:
```yaml
ports:
  - "YOUR_PORT:80"  # Change YOUR_PORT to desired port
```

#### Environment Variables
Add any environment variables in the `docker-compose.yml`:
```yaml
environment:
  - NODE_ENV=production
  - YOUR_VAR=value
```

### Updating the Application

1. **Pull Latest Changes** (if using Git)
   ```bash
   git pull origin main
   ```

2. **Rebuild and Restart**
   ```bash
   docker-compose up -d --build
   ```

   Or in Portainer:
   - Go to your stack
   - Click **Update the stack**
   - Enable **Re-pull image and redeploy**
   - Click **Update**

### Troubleshooting

#### Container Won't Start
```bash
docker-compose logs fall-activities
```

#### Port Already in Use
Change the port in `docker-compose.yml` to an available port.

#### Build Fails
Ensure all dependencies are installed:
```bash
npm install
```

#### Images Not Loading
The application includes fallback images. If Unsplash images fail to load, placeholder images will be shown automatically.

### Monitoring

In Portainer:
- View container stats (CPU, Memory, Network)
- Access logs in real-time
- Restart/stop/start the container
- View port mappings and environment variables

### Backup

To backup your deployment:
```bash
docker-compose down
tar -czf fall-activities-backup.tar.gz .
```

To restore:
```bash
tar -xzf fall-activities-backup.tar.gz
docker-compose up -d --build
```

### Security Notes

- The application runs on port 8080 by default
- Consider using a reverse proxy (nginx/traefik) for HTTPS
- Update the nginx.conf for additional security headers if needed
- Keep Docker and Portainer updated

### Support

For issues or questions:
- Check container logs in Portainer
- Review Docker Compose logs
- Ensure all files (Dockerfile, nginx.conf, docker-compose.yml) are present
