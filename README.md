# MotorMind - Multi-Agent Vehicle Allocation System

## 🏆 Tequity Hackathon Challenge #16 Winner

**Project Name:** Multi-Agent Orchestration for Vehicle Allocation  
**Challenge:** Tequity Hackathon Challenge #16  
**Status:** 🥇 **WINNER** 

Deployed link : https://monitormindb.vercel.app/

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Multi-Agent System](#multi-agent-system)
- [Database Schema](#database-schema)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)

## 🚀 Overview

MotorMind is an intelligent vehicle allocation system that uses multi-agent orchestration to optimize vehicle distribution and customer requests. The system leverages AI agents to understand natural language customer requests, find optimal vehicle matches, and provide intelligent recommendations when exact matches aren't available.

### Key Capabilities

- **Natural Language Processing**: Understands customer requests in plain English
- **Intelligent Vehicle Matching**: Finds optimal vehicles based on model, location, color, and delivery time
- **Multi-Agent Orchestration**: Uses specialized AI agents for different tasks
- **Smart Recommendations**: Suggests alternatives when exact matches aren't available
- **Real-time Stock Management**: Tracks and updates vehicle inventory
- **Geographic Optimization**: Considers location proximity for delivery optimization

## ✨ Features

### 🤖 AI-Powered Customer Request Processing
- Natural language understanding of vehicle requests
- Robust parsing with fallback mechanisms
- Support for various input formats and languages
- Intelligent field extraction (model, location, color, delivery time)

### 🎯 Intelligent Vehicle Allocation
- **Exact Match Search**: Finds vehicles matching exact customer requirements
- **Similarity Search**: Uses fuzzy matching for model names
- **Geographic Optimization**: Considers shortest path algorithms for delivery
- **Color Preference Matching**: Prioritizes customer color preferences
- **Stock Availability**: Real-time inventory checking

### 🔄 Multi-Agent System
1. **Customer Request Agent**: Processes and parses customer messages
2. **Inventory Search Agent**: Finds optimal vehicle matches
3. **Recommendation Agent**: Suggests alternatives when exact matches unavailable
4. **Stock Management Agent**: Handles inventory updates and purchases

### 📊 Advanced Search Capabilities
- Case-insensitive model matching
- Fuzzy search with multiple patterns
- Relevance-based result sorting
- Stock availability filtering
- Location-based optimization

## 🛠 Technology Stack

### Backend Technologies
- **Node.js** - Runtime environment
- **TypeScript** - Type-safe JavaScript development
- **Express.js** - Web application framework
- **Prisma** - Modern database ORM
- **PostgreSQL** - Relational database
- **OpenAI GPT-4** - AI language model integration
- **OpenRouter** - AI model routing and management

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **Zod** - TypeScript-first schema validation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### AI & Machine Learning
- **OpenAI GPT-4o** - Advanced language understanding
- **Custom Prompt Engineering** - Optimized for vehicle allocation
- **Multi-Agent Orchestration** - Specialized AI workflows

## 🏗 Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │   Database      │
│   (React)   │◄──►│   (Express.js)   │◄──►│  (PostgreSQL)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   AI Agents      │
                       │  (OpenAI GPT-4)  │
                       └──────────────────┘
```

### System Components

1. **API Layer** (`src/routes/`)
   - RESTful endpoints for vehicle management
   - Customer request processing
   - Stock management operations

2. **Agent Layer** (`src/agents/`)
   - Customer request parsing agent
   - Inventory search agent
   - Recommendation system agent

3. **Service Layer** (`src/services/`)
   - Stock management service
   - Database operations
   - Data validation

4. **Data Layer** (`prisma/`)
   - Database schema definition
   - Migration management
   - Type-safe database access

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- pnpm package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MotorMind/backend-2
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/motormind"
   DIRECT_URL="postgresql://username:password@localhost:5432/motormind"
   API_KEY="your-openrouter-api-key"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate deploy
   
   # (Optional) Seed the database
   pnpm datatest
   ```

5. **Build and Start**
   ```bash
   # Development mode
   pnpm dev
   
   # Production build
   pnpm build
   pnpm start
   ```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Core Endpoints

#### Vehicle Management
- `GET /vehicles` - Get all vehicles
- `POST /vehicles` - Create new vehicle
- `GET /vehicles/:id` - Get vehicle by ID
- `POST /vehicles/:id` - Update vehicle
- `GET /delete/vehicles/:id` - Delete vehicle

#### AI Agent Endpoints
- `POST /agent` - Process customer request with AI
- `POST /buy` - Purchase vehicle (update stock)

### Example API Calls

#### Process Customer Request
```bash
curl -X POST http://localhost:3000/api/agent \
  -H "Content-Type: application/json" \
  -d '{"message": "I want a Hero Super Splendor in Jodhpur, blue color, within 5 days"}'
```

#### Create Vehicle
```bash
curl -X POST http://localhost:3000/api/vehicles \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Hero Super Splendor",
    "location": "Jodhpur",
    "stock": 10,
    "price": 75000,
    "color": "Blue",
    "type": "Bike"
  }'
```

## 🤖 Multi-Agent System

### Agent Architecture

The system uses a sophisticated multi-agent approach:

#### 1. Customer Request Agent
**Purpose**: Parse and understand natural language customer requests

**Capabilities**:
- Extracts vehicle model, location, color, and delivery requirements
- Handles various input formats and languages
- Robust error handling with fallback parsing
- Normalizes data for consistent processing

**Input**: Natural language text
**Output**: Structured customer request object

#### 2. Inventory Search Agent
**Purpose**: Find optimal vehicle matches from inventory

**Capabilities**:
- Exact model matching
- Geographic optimization using shortest path algorithms
- Color preference consideration
- Delivery time calculation
- Stock availability verification

**Input**: Structured customer request
**Output**: Optimal vehicle match with delivery details

#### 3. Recommendation Agent
**Purpose**: Suggest alternatives when exact matches unavailable

**Capabilities**:
- Fuzzy model matching
- Similar vehicle suggestions
- Requirement-based filtering
- Geographic proximity consideration
- Intelligent alternative selection

**Input**: Customer request + available vehicles
**Output**: Best alternative recommendation

#### 4. Stock Management Agent
**Purpose**: Handle inventory updates and purchases

**Capabilities**:
- Real-time stock tracking
- Purchase processing
- Inventory validation
- Stock level monitoring

### Agent Communication Flow

```
Customer Request → Customer Request Agent → Inventory Search Agent
                                                      ↓
                                              [Exact Match Found?]
                                                      ↓
                                              [Yes] → Return Match
                                                      ↓
                                              [No] → Recommendation Agent
                                                      ↓
                                              Return Alternative
```

## 🗄 Database Schema

### Vehicle Model
```sql
model Vehicle {
  id        String   @id @default(uuid())
  model     String
  location  String
  stock     Int
  price     Int
  type      VehicleType @default(Bike)
  color     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("vehicles")
  @@index([model, location])
}

enum VehicleType {
  Bike
  Activa
}
```

### Key Features
- **UUID Primary Keys**: Unique identification for all vehicles
- **Indexed Fields**: Optimized queries on model and location
- **Audit Trail**: Automatic timestamps for creation and updates
- **Type Safety**: Enum for vehicle types
- **Stock Tracking**: Real-time inventory management

## 💡 Usage Examples

### Example 1: Customer Request Processing
```typescript
// Input: Natural language request
const request = "I need a Bajaj Pulsar in Delhi, red color, within 3 days";

// Process through AI agent
const result = await customerRequestAgent(request);

// Output: Structured response
{
  "data": {
    "model": "Bajaj Pulsar 150",
    "location": "Delhi",
    "color": "Red",
    "eta": "2 days",
    "uuid": "123e4567-e89b-12d3-a456-426614174000"
  },
  "isrecommended": false,
  "success": true
}
```

### Example 2: Stock Management
```typescript
// Purchase a vehicle
const purchase = await StockService.updateStock(vehicleId);

// Result: Updated vehicle with decremented stock
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "model": "Hero Super Splendor",
  "stock": 4, // Decremented from 5
  "location": "Jodhpur",
  "price": 75000,
  "color": "Blue"
}
```

### Example 3: Intelligent Search
```typescript
// Search with fuzzy matching
const results = await StockService.search_by_name("Super Splendor");

// Returns similar models even with slight variations
[
  {
    "model": "Hero Super Splendor",
    "location": "Jodhpur",
    "stock": 5,
    "color": "Blue"
  },
  {
    "model": "Hero Splendor Plus",
    "location": "Delhi", 
    "stock": 3,
    "color": "Red"
  }
]
```

## 🎯 Key Innovations

### 1. Multi-Agent Orchestration
- Specialized AI agents for different tasks
- Intelligent handoff between agents
- Context-aware decision making

### 2. Geographic Optimization
- Shortest path algorithms for delivery
- Location-based vehicle allocation
- Distance-aware ETA calculations

### 3. Robust Natural Language Processing
- Multiple parsing strategies
- Fallback mechanisms for edge cases
- Support for various input formats

### 4. Intelligent Recommendation System
- Fuzzy matching algorithms
- Requirement-based filtering
- Alternative suggestion engine

## 🚀 Future Enhancements & Production Roadmap

### 🐳 Containerized Multi-Agent Architecture

#### Microservices Containerization
- **Agent Services**: Each AI agent in separate Docker containers
- **ECS Fargate**: Serverless container orchestration for auto-scaling
- **Dynamic Scaling**: Containers spin up on-demand for user requests
- **Resource Optimization**: Pay-per-use model with automatic scaling

#### Real-time Communication Layer
- **Redis Pub/Sub**: Message queuing between services
- **Socket.IO**: Real-time bidirectional communication
- **WebSocket Connections**: Live updates between frontend and backend
- **Event-Driven Architecture**: Asynchronous processing for better performance

### 🗺️ Geographic Intelligence Agent

#### Smart Location Filtering
- **City Proximity Agent**: Filters cities based on user location
- **Distance Calculation**: Real-time distance computation
- **Nearest Location Finder**: Optimized database queries
- **Geographic Clustering**: Groups nearby locations for efficient processing

#### Database Optimization
- **Spatial Indexing**: Geographic data optimization
- **Query Reduction**: Minimize database calls through intelligent caching
- **Location-Based Partitioning**: Distribute data by geographic regions
- **Edge Computing**: Process location data closer to users

### 🏗️ Production Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Load Balancer  │    │   API Gateway   │
│   (React)       │◄──►│   (ALB/NLB)      │◄──►│   (AWS API GW)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   ECS Fargate   │    │   Redis Cluster  │    │   PostgreSQL    │
│   Containers    │◄──►│   (Pub/Sub)      │◄──►│   (RDS)         │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │Customer     │ │    │ │Message Queue │ │    │ │Spatial      │ │
│ │Request Agent│ │    │ │& Caching     │ │    │ │Database     │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │                  │    │                 │
│ │Inventory    │ │    │                  │    │                 │
│ │Search Agent │ │    │                  │    │                 │
│ └─────────────┘ │    │                  │    │                 │
│ ┌─────────────┐ │    │                  │    │                 │
│ │Recommendation│ │    │                  │    │                 │
│ │Agent        │ │    │                  │    │                 │
│ └─────────────┘ │    │                  │    │                 │
│ ┌─────────────┐ │    │                  │    │                 │
│ │Geographic   │ │    │                  │    │                 │
│ │Intelligence │ │    │                  │    │                 │
│ │Agent        │ │    │                  │    │                 │
│ └─────────────┘ │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 🔧 Key Production Features

#### 1. Auto-Scaling Agent Containers
```yaml
# ECS Task Definition Example
services:
  customer-request-agent:
    image: motormind/customer-agent:latest
    cpu: 256
    memory: 512
    auto_scaling:
      min_capacity: 0
      max_capacity: 100
      target_cpu_utilization: 70
```

#### 2. Real-time Communication
```typescript
// Socket.IO Integration
io.on('connection', (socket) => {
  socket.on('vehicle-request', async (data) => {
    // Publish to Redis for agent processing
    await redis.publish('agent-queue', JSON.stringify({
      requestId: uuid(),
      data,
      socketId: socket.id
    }));
  });
  
  // Subscribe to results
  redis.subscribe('agent-results', (result) => {
    socket.emit('vehicle-response', result);
  });
});
```

#### 3. Geographic Intelligence
```typescript
// Location-based filtering agent
class GeographicIntelligenceAgent {
  async findNearestLocations(userLocation: string, radius: number) {
    // Spatial query optimization
    const nearbyCities = await this.spatialQuery(`
      SELECT * FROM cities 
      WHERE ST_DWithin(location, ST_Point($1, $2), $3)
      ORDER BY ST_Distance(location, ST_Point($1, $2))
      LIMIT 10
    `, [lat, lng, radius]);
    
    return nearbyCities;
  }
}
```

### 📊 Performance Optimizations

#### Database Efficiency
- **Connection Pooling**: Optimize database connections
- **Query Caching**: Redis-based result caching
- **Spatial Indexing**: Geographic data optimization
- **Read Replicas**: Distribute read operations

#### Container Optimization
- **Multi-stage Builds**: Smaller container images
- **Health Checks**: Automatic container monitoring
- **Resource Limits**: Prevent resource exhaustion
- **Graceful Shutdowns**: Clean container termination

### 🔄 Deployment Strategy

#### 1. Infrastructure as Code
```yaml
# Terraform/CloudFormation
resources:
  - ECS Cluster
  - Fargate Services
  - Application Load Balancer
  - RDS PostgreSQL
  - ElastiCache Redis
  - API Gateway
```

#### 2. CI/CD Pipeline
```yaml
# GitHub Actions
stages:
  - Build & Test
  - Security Scan
  - Build Docker Images
  - Deploy to Staging
  - Integration Tests
  - Deploy to Production
```

#### 3. Monitoring & Observability
- **CloudWatch**: Container and application metrics
- **X-Ray**: Distributed tracing
- **Prometheus**: Custom metrics collection
- **Grafana**: Visualization dashboards

### 🎯 Scalability Benefits

#### Cost Optimization
- **Pay-per-request**: Only pay for active containers
- **Auto-scaling**: Scale down during low usage
- **Resource efficiency**: Right-sized containers

#### Performance Improvements
- **Parallel Processing**: Multiple agents handle requests simultaneously
- **Reduced Latency**: Geographic proximity to users
- **Caching**: Faster response times for common queries

#### Reliability
- **Fault Tolerance**: Isolated agent failures don't affect entire system
- **High Availability**: Multi-AZ deployment
- **Disaster Recovery**: Automated backups and failover

## 🏆 Hackathon Achievement

**Tequity Hackathon Challenge #16 - Multi-Agent Orchestration for Vehicle Allocation**

This project successfully demonstrates:
- ✅ Advanced multi-agent system architecture
- ✅ Real-world problem solving with AI
- ✅ Scalable and maintainable codebase
- ✅ Comprehensive API design
- ✅ Intelligent vehicle allocation algorithms
- ✅ Natural language processing capabilities
- ✅ Production-ready scalability planning
- ✅ Modern DevOps and containerization strategies

## 🤝 Contributing

We welcome contributions to improve MotorMind! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🔗 Links

- **API Documentation**: `http://localhost:3000/api/docs`
- **Database Schema**: `prisma/schema.prisma`
- **Agent Implementation**: `src/agents/index.ts`

---

**Built with ❤️ for the Tequity Hackathon Challenge #16**

*MotorMind - Revolutionizing vehicle allocation through intelligent multi-agent orchestration*
