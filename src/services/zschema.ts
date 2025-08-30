import { z } from "zod";
import { VehicleType } from "../generated/prisma/index.js";


const vehicleSchema = z.object({
    model: z.string(),
    location: z.string(),
    stock: z.number(),
    price: z.number(),
    color: z.string(),
    type: z.nativeEnum(VehicleType),
});

const updateVehicleSchema = z.object({
    model: z.string(),
    location: z.string(),
    stock: z.number(),
    price: z.number(),
    color: z.string(),
});

const aiagentschema = z.object({
    message : z.string() 
});

export { vehicleSchema, updateVehicleSchema , aiagentschema};
