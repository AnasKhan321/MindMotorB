

import { prisma } from "./Singleton.js";
import fs from "fs"
import { VehicleType } from "../generated/prisma/client.js";

export class StockService {

    static async get_all_vehicles() {
        try {
            const vehicles = await prisma.vehicle.findMany();
            return vehicles;
        } catch (error) {
            throw new Error(`Failed to fetch vehicles: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async create_vehicle(model: string, location: string, stock: number, price: number, color: string, type: VehicleType) {
        try {
            const vehicle = await prisma.vehicle.create({
                data: {
                    model,
                    location,
                    stock,
                    price,
                    color,
                    type,
                },
            });
            return vehicle;
        } catch (error) {
            throw new Error(`Failed to create vehicle: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async get_vehicle_by_id(id: string) {
        try {
            const vehicle = await prisma.vehicle.findUnique({
                where: {
                    id,
                },
            });
            return vehicle;
        } catch (error) {
            throw new Error(`Failed to fetch vehicle with id ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async update_vehicle(id: string, model: string, location: string, stock: number, price: number, color: string) {
        try {
            const vehicle = await prisma.vehicle.update({
                where: {
                    id,
                },
                data: {
                    model,
                    location,
                    stock,
                    price,
                    color,
                },
            });
            return vehicle;
        } catch (error) {
            throw new Error(`Failed to update vehicle with id ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async delete_vehicle(id: string) {
        try {
            const vehicle = await prisma.vehicle.delete({
                where: {
                    id,
                },
            });
            return vehicle;
        } catch (error) {
            throw new Error(`Failed to delete vehicle with id ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async search_inventory(model: string) {
        try {
            const vehicles = await prisma.vehicle.findMany({
                where: {
                    model: {
                        contains: model,
                        mode: 'insensitive' // Case-insensitive search
                    },
                    stock: {
                        gte: 1 // Only vehicles with stock >= 1
                    }
                },
            });
            return vehicles;
        } catch (error) {
            throw new Error(`Failed to search vehicles by model ${model}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async search_by_name(name: string) {
        try {
            // Clean and normalize the search term
            const cleanName = name.toLowerCase().trim();
            
            // Create multiple search patterns for better matching
            const searchPatterns = this.generateSearchPatterns(cleanName);
            
            const vehicles = await prisma.vehicle.findMany({
                where: {
                    OR: searchPatterns.map(pattern => ({
                        model: {
                            contains: pattern,
                            mode: 'insensitive'
                        }
                    })),
                    stock: {
                        gte: 1 // Only vehicles with stock >= 1
                    }
                },
                orderBy: [
                    // Prioritize exact matches first
                    {
                        model: 'asc'
                    }
                ]
            });
            
            // Sort results by relevance
            return this.sortByRelevance(vehicles, cleanName);
        } catch (error) {
            throw new Error(`Failed to search vehicles by name ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    static async updateStock(uuid: string) {
        try {
            // First, check if the vehicle exists and has stock
            const existingVehicle = await prisma.vehicle.findUnique({
                where: {
                    id: uuid,
                },
            });

            if (!existingVehicle) {
                throw new Error(`Vehicle with id ${uuid} not found`);
            }

            if (existingVehicle.stock <= 0) {
                throw new Error(`Vehicle with id ${uuid} is out of stock`);
            }

            // Update the stock by decrementing by 1
            const vehicle = await prisma.vehicle.update({
                where: {
                    id: uuid,
                },
                data: {
                    stock: existingVehicle.stock - 1,
                },
            });

            console.log(vehicle)

            console.log(`Stock updated for vehicle ${vehicle.model}: ${existingVehicle.stock} -> ${vehicle.stock}`);
            return vehicle;
        } catch (error) {
            console.error(`Failed to update stock for vehicle ${uuid}:`, error);
            throw new Error(`Failed to update stock: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    
    private static generateSearchPatterns(searchTerm: string): string[] {
        const patterns = [searchTerm]; 

        const coreTerms = searchTerm
            .replace(/\b(hero|honda|bajaj|tvs|yamaha|ktm|royal enfield)\b/g, '')
            .replace(/\b(super|plus|pro|max|deluxe|premium)\b/g, '')
            .trim()
            .split(/\s+/)
            .filter(term => term.length > 2);
        
        coreTerms.forEach(term => {
            if (!patterns.includes(term)) {
                patterns.push(term);
            }
        });
        

        if (searchTerm.includes('splendor')) {
            patterns.push('splendor');
        }
        if (searchTerm.includes('pulsar')) {
            patterns.push('pulsar');
        }
        if (searchTerm.includes('activa')) {
            patterns.push('activa');
        }
        if (searchTerm.includes('shine')) {
            patterns.push('shine');
        }
        
        return patterns;
    }


    private static sortByRelevance(vehicles: any[], searchTerm: string): any[] {
        return vehicles.sort((a, b) => {
            const aModel = a.model.toLowerCase();
            const bModel = b.model.toLowerCase();
            if (aModel === searchTerm) return -1;
            if (bModel === searchTerm) return 1;
    
            if (aModel.startsWith(searchTerm)) return -1;
            if (bModel.startsWith(searchTerm)) return 1;
   
            if (aModel.includes(searchTerm)) return -1;
            if (bModel.includes(searchTerm)) return 1;
            
    
            return aModel.localeCompare(bModel);
        });
    }

}


export const testIntelligentSearch = async () => {
    console.log("Testing intelligent search...");
    
    const testCases = [
        "Super Splendor",
        "Hero Splendor Plus", 
        "Pulsar 150",
        "Honda Activa",
        "Bajaj Pulsar NS200"
    ];
    
    for (const testCase of testCases) {
        console.log(`\nSearching for: "${testCase}"`);
        const results = await StockService.search_inventory(testCase);
        console.log(`Found ${results.length} vehicles:`);
        results.forEach(vehicle => {
            console.log(`- ${vehicle.model} (${vehicle.location}) - Stock: ${vehicle.stock}`);
        });
    }
};

export const populate_data = async () => {

    console.log("the champ is here ")
    const data = fs.readFileSync("./src/services/sample.json", "utf-8")
    const parsedData = JSON.parse(data)


    for (const item of parsedData) {


        const vehicle = await StockService.create_vehicle(item.model, item.location, item.stock, item.price, item.color, item.type)
        console.log(vehicle)
    }

}


