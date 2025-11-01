# Nginx Proxy Manager Setup Guide

## Setting up fall.projecthaywire.com

### Prerequisites
- Nginx Proxy Manager (NPM) installed and running
- Docker container deployed and running on port 8085
- DNS A record pointing `fall.projecthaywire.com` to your server's IP

### Step-by-Step Setup in NPM

#### 1. Deploy Your Container First
```bash
docker-compose up -d --build
```

Verify it's running:
```bash
docker ps | grep fall-activities
```

Test locally:
```bash
curl http://localhost:8085
```

#### 2. Configure Nginx Proxy Manager

1. **Access NPM Admin Panel**
   - Navigate to your NPM instance (usually `http://your-server:81`)
   - Log in with your credentials

2. **Add Proxy Host**
   - Click **Hosts** → **Proxy Hosts**
   - Click **Add Proxy Host**

3. **Details Tab Configuration**
   - **Domain Names**: `fall.projecthaywire.com`
   - **Scheme**: `http`
   - **Forward Hostname / IP**: `fall-activities` (container name) or `localhost`
   - **Forward Port**: `8085`
   - **Cache Assets**: ✅ Enable
   - **Block Common Exploits**: ✅ Enable
   - **Websockets Support**: ✅ Enable (optional, but recommended)

4. **SSL Tab Configuration**
   - **SSL Certificate**: Select existing or create new Let's Encrypt certificate
   - **Force SSL**: ✅ Enable
   - **HTTP/2 Support**: ✅ Enable
   - **HSTS Enabled**: ✅ Enable (recommended)
   - **HSTS Subdomains**: ✅ Enable (if applicable)

5. **Advanced Tab (Optional)**
   Add custom nginx configuration if needed:
   ```nginx
   # Additional security headers (optional, already in nginx.conf)
   add_header X-Frame-Options "SAMEORIGIN" always;
   add_header X-Content-Type-Options "nosniff" always;
   add_header X-XSS-Protection "1; mode=block" always;
   
   # Increase client body size if needed
   client_max_body_size 10M;
   ```

6. **Save**
   - Click **Save**
   - NPM will automatically configure nginx and obtain SSL certificate

#### 3. Verify Setup

1. **Check DNS**
   ```bash
   nslookup fall.projecthaywire.com
   ```
   Should return your server's IP

2. **Test HTTP → HTTPS Redirect**
   ```bash
   curl -I http://fall.projecthaywire.com
   ```
   Should redirect to HTTPS

3. **Test HTTPS**
   ```bash
   curl -I https://fall.projecthaywire.com
   ```
   Should return 200 OK

4. **Open in Browser**
   - Navigate to: `https://fall.projecthaywire.com`
   - Should show your Fall Activities site with valid SSL

### Troubleshooting

#### "502 Bad Gateway"
- Check if container is running: `docker ps`
- Check container logs: `docker logs fall-activities`
- Verify port 8085 is accessible: `curl http://localhost:8085`
- Ensure both containers are on same network or use `localhost` as hostname

#### "Unable to obtain SSL certificate"
- Verify DNS is pointing to your server
- Check port 80 and 443 are open on your firewall
- Ensure no other service is using port 80/443
- Wait a few minutes for DNS propagation

#### Container not accessible from NPM
If using container name doesn't work, try:
- Use `host.docker.internal:8085` (Docker Desktop)
- Use `172.17.0.1:8085` (Docker bridge IP)
- Use your server's local IP: `192.168.x.x:8085`

### Network Configuration

The container is connected to two networks:
1. **fall-activities-network**: Internal network for the app
2. **nginx-proxy-manager**: External network for NPM communication

If NPM network doesn't exist, create it:
```bash
docker network create nginx-proxy-manager
```

Then restart your container:
```bash
docker-compose down
docker-compose up -d
```

### Alternative: Using Host Network

If you have issues with container networking, you can use host network mode:

Edit `docker-compose.yml`:
```yaml
services:
  fall-activities:
    network_mode: "host"
    # Remove ports section when using host mode
```

Then in NPM, use:
- **Forward Hostname / IP**: `localhost`
- **Forward Port**: `8085`

### Security Recommendations

1. **Keep NPM Updated**: Regularly update Nginx Proxy Manager
2. **Use Strong Passwords**: For NPM admin panel
3. **Enable Fail2Ban**: Protect against brute force attacks
4. **Regular Backups**: Backup NPM configuration
5. **Monitor Logs**: Check NPM and container logs regularly

### Accessing Your Site

Once configured:
- **Production URL**: https://fall.projecthaywire.com
- **Local Access**: http://localhost:8085 (for testing)
- **Container Access**: http://fall-activities:80 (from other containers)

### Updating the Application

When you update your app:
```bash
docker-compose down
docker-compose up -d --build
```

NPM configuration will remain unchanged - no need to reconfigure!
