# Playable Ads Backend

A robust backend system for creating, managing, and rendering playable advertisements. This Node.js application provides a complete API for handling projects, assets, render jobs, and analytics tracking.

##  Features

- **Project Management** - Create, read, update, and delete playable ad projects
- **Asset Upload** - Upload and manage images and videos with automatic file validation
- **Render Queue** - Background job processing for video rendering.
- **Analytics Tracking** - Track user interactions and generate analytics reports
- **RESTful API** - Clean API endpoints for all operations
- **File Processing** - Support for image and video files up to 100MB
- **PostgreSQL Integration** - Reliable data storage with proper relationships
- **In-Memory Queue** - Efficient job processing and caching

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **File Upload**: Multer
- **Video Processing**: FFmpeg
- **Authentication**: (Extendable for future features)

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (v14 or higher)
- PostgreSQL
- Redis
- FFmpeg

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/varun2799dev/Playable_adsSASS.git
   cd playable-ads-backend
2.  **Install Dependencies**
    ```bash
    npm install
3. **Set up environmental variables**
    ```bash
      PORT=3000
      NODE_ENV=development
      DB_HOST=localhost
      DB_PORT=5432
      DB_NAME=playable_ads
      DB_USER=your_db_user
      DB_PASSWORD=your_db_password
      UPLOAD_DIR=./uploads
      OUTPUT_DIR=./outputs
4. **Initialize the database**
   ```bash
     npm run db:migrate
5. **Start the application**
   ```bash
      //for development
      npm run dev
      //for production
      npm start
 
 ## Database Schema
The application uses four main tables:

projects - Store playable ad projects

assets - Manage uploaded images and videos

jobs - Track render job status and progress

analytics - Record user interaction events

## 📚 API Endpoints
## Projects
POST /projects - Create a new project

GET /projects - Get all projects

GET /projects/:id - Get specific project

PUT /projects/:id - Update project

DELETE /projects/:id - Delete project

## Assets
POST /projects/:id/assets - Upload asset to project

GET /projects/:id/assets - Get project assets

DELETE /projects/:id/assets/:assetId - Delete asset

## Jobs
POST /projects/:id/render - Create render job

GET /projects/:id/jobs - Get project jobs

GET /jobs/:id - Get job status

## Analytics
POST /analytics - Log analytics event

GET /analytics/projects/:projectId - Get project analytics

    
