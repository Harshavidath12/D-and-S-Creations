# Cinema Management API

A clean, professional RESTful API for managing cinema details with full CRUD operations.

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, Delete cinemas
- **Advanced Search**: Search by cinema name or location
- **Pagination**: Efficient data loading with page-based pagination
- **Statistics**: Get cinema analytics and reporting
- **Clean Architecture**: Professional code structure with proper naming
- **Error Handling**: Comprehensive error handling and validation
- **RESTful Design**: Industry-standard REST API design

## 📋 API Endpoints

### Base URL
```
http://localhost:5000/api/cinemas
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cinemas` | Get all cinemas with pagination and search |
| GET | `/api/cinemas/:id` | Get single cinema by ID |
| POST | `/api/cinemas` | Create new cinema |
| PUT | `/api/cinemas/:id` | Update cinema by ID |
| DELETE | `/api/cinemas/:id` | Delete cinema by ID |
| GET | `/api/cinemas/stats` | Get cinema statistics |

## 🛠️ Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   npm start
   ```

3. **Test the API**
   ```bash
   node test-cinema-api.js
   ```

## 📊 Data Model

### Cinema Schema
```javascript
{
  cinema_name: String (required, 2-100 chars)
  cinema_location: String (required, 5-200 chars)
  ongoing_movies: {
    movie_1: String (required, max 100 chars)
    movie_2: String (required, max 100 chars)
    movie_3: String (required, max 100 chars)
    movie_4: String (required, max 100 chars)
  }
  upcoming_movie: String (required, max 100 chars)
  contact_info: {
    phone: String (optional, valid phone format)
    email: String (optional, valid email format)
  }
  is_active: Boolean (optional, default: true)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

## 🔧 Usage Examples

### 1. Create a Cinema
```bash
curl -X POST http://localhost:5000/api/cinemas \
  -H "Content-Type: application/json" \
  -d '{
    "cinema_name": "PVR Cinema",
    "cinema_location": "Galle Face, Colombo 02, Sri Lanka",
    "ongoing_movies": {
      "movie_1": "Saiyara",
      "movie_2": "Conjuring",
      "movie_3": "Clarence",
      "movie_4": "Walampuri"
    },
    "upcoming_movie": "Neera",
    "contact_info": {
      "phone": "+94112345678",
      "email": "info@pvr.com"
    }
  }'
```

### 2. Get All Cinemas
```bash
curl http://localhost:5000/api/cinemas
```

### 3. Search Cinemas
```bash
curl "http://localhost:5000/api/cinemas?search=PVR&page=1&limit=10"
```

### 4. Get Single Cinema
```bash
curl http://localhost:5000/api/cinemas/{cinema-id}
```

### 5. Update Cinema
```bash
curl -X PUT http://localhost:5000/api/cinemas/{cinema-id} \
  -H "Content-Type: application/json" \
  -d '{
    "cinema_name": "PVR Cinema Updated",
    "upcoming_movie": "Thor: Love and Thunder"
  }'
```

### 6. Delete Cinema
```bash
curl -X DELETE http://localhost:5000/api/cinemas/{cinema-id}
```

### 7. Get Statistics
```bash
curl http://localhost:5000/api/cinemas/stats
```

## 📝 Query Parameters

### GET /api/cinemas
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search term for cinema name or location
- `is_active` (optional): Filter by active status (true/false)

## 🔍 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "count": 10,
  "total": 100,
  "page": 1,
  "pages": 10
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "cinema_name",
      "message": "Cinema name is required"
    }
  ]
}
```

## 🧪 Testing

### Run All Tests
```bash
node test-cinema-api.js
```

This will test:
- ✅ Health check endpoint
- ✅ Create cinema
- ✅ Read single cinema
- ✅ Update cinema
- ✅ Read all cinemas
- ✅ Search cinemas
- ✅ Get statistics
- ✅ Pagination
- ✅ Validation
- ✅ Delete cinema
- ✅ Verify deletion

## 📁 Project Structure

```
Backend/
├── controllers/
│   └── cinemaController.js    # Cinema CRUD operations
├── middleware/
│   ├── errorHandler.js        # Error handling middleware
│   └── validation.js          # Input validation middleware
├── models/
│   └── Cinema.js              # Cinema data model
├── routes/
│   └── cinemaRoutes.js        # API routes
├── app.js                     # Main application file
├── package.json               # Dependencies and scripts
├── test-cinema-api.js         # Test suite
└── README.md                  # This file
```

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (Validation Error) |
| 404 | Not Found |
| 409 | Conflict (Duplicate) |
| 500 | Internal Server Error |

## 🌟 Features

- **Clean Architecture**: Professional code structure
- **Pagination**: Efficient data loading
- **Search**: Full-text search across cinema names and locations
- **Validation**: Comprehensive input validation
- **Error Handling**: Proper error responses
- **Logging**: Request and error logging
- **Statistics**: Analytics and reporting
- **RESTful**: Industry-standard API design

## 🔧 Development

### Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
```

### Environment Variables
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cinema-api
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

**Built with ❤️ using Node.js, Express, and MongoDB**