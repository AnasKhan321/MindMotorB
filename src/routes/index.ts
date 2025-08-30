import { Router, type Router as ExpressRouter } from "express";
import { StockService } from "../services/Stockservice.js";
import { vehicleSchema, updateVehicleSchema, aiagentschema } from "../services/zschema.js";
import { customerRequestAgent } from "../agents/index.js";
const expressRouter: ExpressRouter = Router();

expressRouter.get("/vehicles", async (req, res) => {
  const vehicles = await StockService.get_all_vehicles();
  res.json(vehicles);
});

expressRouter.post("/vehicles", async (req, res) => {

    try {
  const parsedData = vehicleSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({ error: parsedData.error.message, success: false });
  }
  const { model, location, stock, price, color, type } = parsedData.data;
    const vehicle = await StockService.create_vehicle(model, location, stock, price, color, type);
    res.json({ vehicle, success: true});
  } catch (error) {
    res.json({ error: (error as Error).message  , success: false});
  }
});

expressRouter.get("/vehicles/:id", async (req, res) => {

    try {
        const { id } = req.params;
        const vehicle = await StockService.get_vehicle_by_id(id);
        res.json({ vehicle, success: true});
        
    } catch (error) {
        res.json({ error: (error as Error).message  , success: false});
    }

});

expressRouter.post("/vehicles/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const parsedData = updateVehicleSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({ error: parsedData.error.message, success: false });
        }
        const { model, location, stock, price, color } = parsedData.data;
        const vehicle = await StockService.update_vehicle(id, model, location, stock, price, color);
        res.json({ vehicle, success: true});
    }catch (error) {
        res.json({ error: (error as Error).message  , success: false});
    }
});

expressRouter.get("/delete/vehicles/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const vehicle = await StockService.delete_vehicle(id);
        res.json({ vehicle, success: true});
    }catch (error) {
        res.json({ error: (error as Error).message  , success: false});
    }
});

expressRouter.post("/agent", async (req, res) => {
    try {
        const parsedData = aiagentschema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({ error: parsedData.error.message, success: false });
        }
        const { message } = parsedData.data;
        const data = await customerRequestAgent(message);
        res.json({ data, success: true});
    }catch (error) {
        res.json({ error: (error as Error).message  , success: false});
    }
});


expressRouter.post("/buy", async (req, res) => {
    try {
        const { id } = req.body;
        const vehicle = await StockService.updateStock(id);
        res.json({ vehicle, success: true});
    }catch (error) {
        res.json({ error: (error as Error).message  , success: false});
    }
});


export default expressRouter;