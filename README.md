# Upload Files to Google Cloud Storage

Node application built to serve as reusable service for uploading and deleting files to/from Google Cloud Storage.

## Requirements

* NodeJS v12 or later

## How to run the application

### 1. Environment Variables

Environment variables are mandatory to run the application. Copy `.env.copy` to `.env`, and fill all mandatory variables.

### 2. Add Service Account key to root folder

Add service account JSON key for GCS to root folder using filename `key.json`

### 3. Install Dependencies

```bash
    npm install
```

### 4. Run Application

```bash
    npm start
```

## Docker Container

Docker Container is included in the repository.