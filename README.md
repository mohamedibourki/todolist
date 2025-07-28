# Fullstack Todo List - Simple DevOps

A fullstack todo list application with minimal DevOps setup for Vercel and Railway deployment.

## 🚀 Live Application

- **Frontend**: https://todolist-vert-sigma.vercel.app/
- **Backend API**: https://todolist-production-c816.up.railway.app
- **Health Check**: https://todolist-production-c816.up.railway.app/health

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: NestJS, PostgreSQL, TypeORM
- **Deployment**: Vercel (Frontend), Railway (Backend)
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Local Development

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd fullstack-todolist
   ```

2. **Backend setup**
   ```bash
   cd server
   npm install
   cp env.example .env
   # Edit .env with your database credentials
   npm run start:dev
   ```

3. **Frontend setup**
   ```bash
   cd client
   npm install
   cp env.example .env.local
   # Edit .env.local with your API URL
   npm run dev
   ```

### Environment Variables

#### Backend (.env)
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=todolist
PORT=8000
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚀 Deployment

### Automated Deployment (Recommended)

The app uses GitHub Actions for automatic deployment:

1. **Push to main branch** triggers deployment
2. **Tests run** to ensure code quality
3. **Automatic deployment** to Railway (backend) and Vercel (frontend)

### Manual Deployment

#### Backend (Railway)
```bash
cd server
npm install -g @railway/cli
railway login
railway up
```

#### Frontend (Vercel)
```bash
cd client
npm install -g vercel
vercel --prod
```

## 📊 Health Checks

- **Backend**: `GET /health`
- **Frontend**: `GET /api/health`

## 🔧 What You Need to Set Up

### GitHub Secrets (for CI/CD)

Add these secrets in your GitHub repository settings:

1. **RAILWAY_TOKEN**: Get from Railway dashboard
2. **VERCEL_TOKEN**: Get from Vercel dashboard  
3. **VERCEL_ORG_ID**: Get from Vercel dashboard
4. **VERCEL_PROJECT_ID**: Get from Vercel dashboard

### Railway Setup

1. Connect your GitHub repo to Railway
2. Set environment variables in Railway dashboard
3. Deploy your backend service

### Vercel Setup

1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy your frontend

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection**
   - Check Railway database credentials
   - Verify environment variables

2. **Frontend API Connection**
   - Check `NEXT_PUBLIC_API_URL` in Vercel
   - Verify CORS settings in backend

3. **Deployment Failures**
   - Check GitHub Actions logs
   - Verify all secrets are set correctly

### Debug Commands

```bash
# Test backend locally
curl http://localhost:8000/health

# Test frontend locally
curl http://localhost:3000/api/health

# Check Railway logs
railway logs

# Check Vercel logs
vercel logs
```

## 📝 What's Included

✅ **CI/CD Pipeline** - Automated testing and deployment  
✅ **Health Checks** - Monitor application status  
✅ **Environment Management** - Secure variable handling  
✅ **Error Handling** - Proper error responses  
✅ **CORS Configuration** - Cross-origin requests  
✅ **Database Migrations** - TypeORM migrations  

## 🚫 What's NOT Included (You Don't Need)

❌ Docker containers (Vercel/Railway handle this)  
❌ Nginx reverse proxy (Platforms handle this)  
❌ Complex monitoring (Platforms provide basic monitoring)  
❌ Load balancing (Platforms handle this)  
❌ SSL certificates (Platforms handle this)  

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests locally
5. Submit a pull request

## 📄 License

MIT License 