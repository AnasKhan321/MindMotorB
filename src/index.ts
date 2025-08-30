import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import expressRouter from "./routes/index.js";
dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use("/api", expressRouter);


app.get("/", (req, res) => {
  res.json({message : "Welcome to MotorMind"});
});

// API Documentation endpoint
app.get("/api/docs", (req, res) => {
  const apiDocumentation = {
    title: "MotorMind Vehicle Management API",
    version: "1.0.0",
    description: "A comprehensive API for managing vehicle inventory, stock, and customer requests",
    baseUrl: "http://localhost:3000/api",
    endpoints: [
      {
        method: "GET",
        path: "/vehicles",
        description: "Get all vehicles in the inventory",
        parameters: "None",
        response: {
          success: true,
          data: [
            {
              id: "uuid",
              model: "string",
              location: "string", 
              stock: "number",
              price: "number",
              color: "string",
              createdAt: "datetime",
              updatedAt: "datetime"
            }
          ]
        },
        example: {
          request: "GET /api/vehicles",
          response: {
            success: true,
            data: [
              {
                id: "123e4567-e89b-12d3-a456-426614174000",
                model: "Supersplendor",
                location: "Jodhpur",
                stock: 5,
                price: 75000,
                color: "Blue",
                createdAt: "2024-01-15T10:30:00Z",
                updatedAt: "2024-01-15T10:30:00Z"
              }
            ]
          }
        }
      },
      {
        method: "POST",
        path: "/vehicles",
        description: "Create a new vehicle in the inventory",
        parameters: {
          model: "string (required) - Vehicle model name",
          location: "string (required) - Location where vehicle is available",
          stock: "number (required) - Number of vehicles in stock",
          price: "number (required) - Price of the vehicle",
          color: "string (required) - Color of the vehicle"
        },
        response: {
          success: true,
          vehicle: {
            id: "uuid",
            model: "string",
            location: "string",
            stock: "number", 
            price: "number",
            color: "string",
            createdAt: "datetime",
            updatedAt: "datetime"
          }
        },
        example: {
          request: "POST /api/vehicles",
          body: {
            model: "Pulsar 150",
            location: "Delhi",
            stock: 10,
            price: 95000,
            color: "Red"
          },
          response: {
            success: true,
            vehicle: {
              id: "123e4567-e89b-12d3-a456-426614174001",
              model: "Pulsar 150",
              location: "Delhi", 
              stock: 10,
              price: 95000,
              color: "Red",
              createdAt: "2024-01-15T11:00:00Z",
              updatedAt: "2024-01-15T11:00:00Z"
            }
          }
        }
      },
      {
        method: "GET",
        path: "/vehicles/:id",
        description: "Get a specific vehicle by ID",
        parameters: {
          id: "string (required) - UUID of the vehicle"
        },
        response: {
          success: true,
          vehicle: {
            id: "uuid",
            model: "string",
            location: "string",
            stock: "number",
            price: "number", 
            color: "string",
            createdAt: "datetime",
            updatedAt: "datetime"
          }
        },
        example: {
          request: "GET /api/vehicles/123e4567-e89b-12d3-a456-426614174000",
          response: {
            success: true,
            vehicle: {
              id: "123e4567-e89b-12d3-a456-426614174000",
              model: "Supersplendor",
              location: "Jodhpur",
              stock: 5,
              price: 75000,
              color: "Blue",
              createdAt: "2024-01-15T10:30:00Z",
              updatedAt: "2024-01-15T10:30:00Z"
            }
          }
        }
      },
      {
        method: "POST",
        path: "/vehicles/:id",
        description: "Update an existing vehicle",
        parameters: {
          id: "string (required) - UUID of the vehicle to update",
          model: "string (required) - Updated vehicle model name",
          location: "string (required) - Updated location",
          stock: "number (required) - Updated stock count",
          price: "number (required) - Updated price",
          color: "string (required) - Updated color"
        },
        response: {
          success: true,
          vehicle: {
            id: "uuid",
            model: "string",
            location: "string",
            stock: "number",
            price: "number",
            color: "string", 
            createdAt: "datetime",
            updatedAt: "datetime"
          }
        },
        example: {
          request: "POST /api/vehicles/123e4567-e89b-12d3-a456-426614174000",
          body: {
            model: "Supersplendor Pro",
            location: "Jodhpur",
            stock: 8,
            price: 78000,
            color: "Blue"
          },
          response: {
            success: true,
            vehicle: {
              id: "123e4567-e89b-12d3-a456-426614174000",
              model: "Supersplendor Pro",
              location: "Jodhpur",
              stock: 8,
              price: 78000,
              color: "Blue",
              createdAt: "2024-01-15T10:30:00Z",
              updatedAt: "2024-01-15T12:00:00Z"
            }
          }
        }
      },
      {
        method: "GET",
        path: "/delete/vehicles/:id",
        description: "Delete a vehicle from the inventory",
        parameters: {
          id: "string (required) - UUID of the vehicle to delete"
        },
        response: {
          success: true,
          vehicle: {
            id: "uuid",
            model: "string",
            location: "string",
            stock: "number",
            price: "number",
            color: "string",
            createdAt: "datetime",
            updatedAt: "datetime"
          }
        },
        example: {
          request: "GET /api/delete/vehicles/123e4567-e89b-12d3-a456-426614174000",
          response: {
            success: true,
            vehicle: {
              id: "123e4567-e89b-12d3-a456-426614174000",
              model: "Supersplendor",
              location: "Jodhpur",
              stock: 5,
              price: 75000,
              color: "Blue",
              createdAt: "2024-01-15T10:30:00Z",
              updatedAt: "2024-01-15T10:30:00Z"
            }
          }
        }
      }
    ],
    errorResponses: {
      validationError: {
        status: 400,
        response: {
          error: "Validation error message",
          success: false
        }
      },
      notFound: {
        status: 404,
        response: {
          error: "Vehicle not found",
          success: false
        }
      },
      serverError: {
        status: 500,
        response: {
          error: "Internal server error message",
          success: false
        }
      }
    },
    dataModels: {
      Vehicle: {
        id: "string (UUID) - Unique identifier",
        model: "string - Vehicle model name",
        location: "string - Location where vehicle is available",
        stock: "number - Number of vehicles in stock",
        price: "number - Price of the vehicle in INR",
        color: "string - Color of the vehicle",
        createdAt: "datetime - Creation timestamp",
        updatedAt: "datetime - Last update timestamp"
      }
    },
    usage: {
      authentication: "No authentication required for this API",
      rateLimiting: "No rate limiting currently implemented",
      cors: "CORS enabled for http://localhost:5173",
      contentType: "application/json"
    },
    examples: {
      curl: {
        getAllVehicles: "curl -X GET http://localhost:3000/api/vehicles",
        createVehicle: `curl -X POST http://localhost:3000/api/vehicles \\
  -H "Content-Type: application/json" \\
  -d '{"model": "Pulsar 150", "location": "Delhi", "stock": 10, "price": 95000, "color": "Red"}'`,
        getVehicle: "curl -X GET http://localhost:3000/api/vehicles/123e4567-e89b-12d3-a456-426614174000",
        updateVehicle: `curl -X POST http://localhost:3000/api/vehicles/123e4567-e89b-12d3-a456-426614174000 \\
  -H "Content-Type: application/json" \\
  -d '{"model": "Pulsar 150 Pro", "location": "Delhi", "stock": 15, "price": 98000, "color": "Red"}'`,
        deleteVehicle: "curl -X GET http://localhost:3000/api/delete/vehicles/123e4567-e89b-12d3-a456-426614174000"
      }
    }
  };

  res.json(apiDocumentation);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
