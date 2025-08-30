import OpenAI from 'openai';
import dotenv from 'dotenv';
import { StockService } from '../services/Stockservice.js';
import type { Vehicle } from '../generated/prisma/index.js';
dotenv.config();

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.API_KEY,
});

// Interface for the expected parsed data structure
interface CustomerRequest {
    Model: string;
    location: string;
    Color: string;
    deliveryDays: number;
    uuid?: string;
}

// Robust parsing function that handles various response formats
function parseCustomerRequest(response: string): CustomerRequestWithUuid {
    try {
        // First, try to parse as direct JSON
        const directParse = JSON.parse(response);
        if (directParse && typeof directParse === 'object') {
            return normalizeCustomerRequest(directParse);
        }
    } catch (error) {
        // If direct parsing fails, try to extract JSON from the response
        console.log('Direct JSON parsing failed, attempting to extract JSON...');
    }

    // Try to find JSON-like content in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            const extractedJson = JSON.parse(jsonMatch[0]);
            return normalizeCustomerRequest(extractedJson);
        } catch (error) {
            console.log('Extracted JSON parsing failed, attempting manual parsing...');
        }
    }

    // Manual parsing as last resort
    return parseManually(response);
}

// Normalize the parsed object to ensure all required fields exist
function normalizeCustomerRequest(data: any): CustomerRequestWithUuid {
  return {
    Model: extractValue(data, ['Model', 'model', 'vehicle', 'bike']) || 'Unknown',
    location: extractValue(data, ['location', 'Location', 'city', 'place']) || 'Unknown',
    Color: extractValue(data, ['Color', 'color', 'colour']) || 'Unknown',
    deliveryDays: extractDeliveryDays(data) || 7,
    uuid: extractValue(data, ['uuid', 'id', 'vehicleId', 'vehicle_id']) || ""
  };
}

// Special function to extract delivery days from various formats
function extractDeliveryDays(obj: any): number | null {
  // Try direct number fields first
  const directFields = ['deliveryDays', 'delivery_days', 'days', 'delivery'];
  for (const field of directFields) {
    if (obj[field] !== undefined && obj[field] !== null) {
      const num = Number(obj[field]);
      if (!isNaN(num)) {
        return num;
      }
    }
  }
  
  // Try eta field with string parsing
  if (obj.eta && typeof obj.eta === 'string') {
    const etaMatch = obj.eta.match(/(\d+)/);
    if (etaMatch) {
      const num = parseInt(etaMatch[1]);
      if (!isNaN(num)) {
        return num;
      }
    }
  }
  
  return null;
}

// Extract value from object using multiple possible keys
function extractValue(obj: any, keys: string[]): string | null {
    for (const key of keys) {
        if (obj[key] && typeof obj[key] === 'string') {
            return obj[key].trim();
        }
    }
    return null;
}

// Extract number from object using multiple possible keys
function extractNumber(obj: any, keys: string[]): number | null {
    for (const key of keys) {
        if (obj[key] !== undefined && obj[key] !== null) {
            const num = Number(obj[key]);
            if (!isNaN(num)) {
                return num;
            }
        }
    }
    return null;
}

interface CustomerRequestWithUuid extends CustomerRequest {
    uuid: string ;
}

// Manual parsing using regex patterns
function parseManually(response: string): CustomerRequestWithUuid {
    const result: CustomerRequestWithUuid = {
        Model: 'Unknown',
        location: 'Unknown',
        Color: 'Unknown',
        deliveryDays: 7,
        uuid: ""
    };

    // Extract model (look for common bike models)
    const modelPatterns = [
        /(?:model|bike|vehicle)[\s:]*([a-zA-Z0-9\s]+)/i,
        /(supersplendor|splendor|pulsar|apache|ktm|royal enfield|honda|yamaha|bajaj)/i
    ];

    for (const pattern of modelPatterns) {
        const match = response.match(pattern);
        if (match) {
            result.Model = match[1]?.trim() || match[0]?.trim() || 'Unknown';
            break;
        }
    }

    // Extract location
    const locationPatterns = [
        /(?:in|at|location)[\s:]*([a-zA-Z\s]+)/i,
        /(delhi|mumbai|bangalore|chennai|kolkata|hyderabad|pune|ahmedabad|jaipur|jodhpur|udaipur|kota|bikaner)/i
    ];

    for (const pattern of locationPatterns) {
        const match = response.match(pattern);
        if (match) {
            result.location = match[1]?.trim() || match[0]?.trim() || 'Unknown';
            break;
        }
    }

    // Extract color
    const colorPatterns = [
        /(?:color|colour)[\s:]*([a-zA-Z\s]+)/i,
        /(red|blue|green|yellow|black|white|silver|grey|gray|orange|purple|pink)/i
    ];

    for (const pattern of colorPatterns) {
        const match = response.match(pattern);
        if (match) {
            result.Color = match[1]?.trim() || match[0]?.trim() || 'Unknown';
            break;
        }
    }

      // Extract delivery days
  const deliveryPatterns = [
    /(?:within|in|delivery)[\s:]*(\d+)[\s]*(?:days?|day)/i,
    /(\d+)[\s]*(?:days?|day)[\s]*(?:delivery|time)/i,
    /(?:eta|delivery)[\s:]*(\d+)[\s]*(?:days?|day)/i,
    /"eta"\s*:\s*"(\d+)\s*day"/i
  ];

    for (const pattern of deliveryPatterns) {
        const match = response.match(pattern);
        if (match) {
            const days = parseInt(match[1] ?? '0');
            if (!isNaN(days)) {
                result.deliveryDays = days;
                break;
            }
        }
    }

    return result;
}

// Validate and normalize the response to ensure it's always consistent
function validateAndNormalizeResponse(data: CustomerRequest): CustomerRequest {
  return {
    Model: data.Model || 'Unknown',
    location: data.location || 'Unknown', 
    Color: data.Color || 'Unknown',
    deliveryDays: typeof data.deliveryDays === 'number' ? data.deliveryDays : 7
  };
}

export async function customerRequestAgent(message: string) {
    try {
        const completion = await openai.chat.completions.create({
            model: 'openai/gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `You are a customer request parser. Your ONLY job is to extract vehicle information and return it in EXACTLY this JSON format:

                            {
                                "Model": "string",
                                "location": "string", 
                                "Color": "string",
                                "deliveryDays": number
                            }

                            CRITICAL RULES:
                            1. ALWAYS return ONLY valid JSON - no explanations, no extra text
                            2. Use EXACTLY these field names: Model, location, Color, deliveryDays
                            3. Capitalize Model names (e.g., "Hero Super Splendor", "Bajaj Pulsar")
                            4. Capitalize location names (e.g., "Jodhpur", "Delhi", "Mumbai")
                            5. Capitalize color names (e.g., "Blue", "Red", "Black")
                            6. deliveryDays must be a number (not string)
                            7. If information is missing, use "Unknown" for strings and 7 for deliveryDays

                            Example input: "I want hero super splendor in jodhpur color blue and within 10 days delivery"
                            Example output: {"Model": "Hero Super Splendor", "location": "Jodhpur", "Color": "Blue", "deliveryDays": 10}

                            Return ONLY the JSON object, nothing else.
                            
                            `,
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
        });

        

 

        const rawResponse = completion?.choices[0]?.message?.content;

        if (!rawResponse) {
            throw new Error('No response received from AI');
        }

        // Use the robust parser to handle any response format
        const parsedData = parseCustomerRequest(rawResponse);
        // Ensure the response is always valid and consistent
        const validatedData = validateAndNormalizeResponse(parsedData);

        if(validatedData.Model === "Unknown" &&  validatedData.location === "Unknown" 
            && validatedData.Color === "Unknown" && validatedData.deliveryDays === 7 ){
                const userPrompt = await GenerateuserPrompt(message)
                return {data : userPrompt  , isrecommended : false , isuser : true}
        }

        // Validate the parsed data
        if (validatedData.Model === 'Unknown' || validatedData.location === 'Unknown') {
            console.warn('Warning: Some required fields could not be parsed properly');
        }

        const { Model, location, Color, deliveryDays } = validatedData;
      
        
        // Return the validated data instead of calling searchinventory
        let rdata = await searchinventory(validatedData)
        return rdata;

    } catch (error) {
        console.error('Error in main function:', error);
        throw error;
    }
}


async function searchinventory(data: CustomerRequest) {
    try {
        const v1data = await StockService.search_inventory(data.Model)
        if (!v1data || v1data.length === 0) {
           
            const similarvhecile = await StockService.search_by_name(data.Model)
             const rdata = await Recommendationsystem(data, similarvhecile)
             return {data : rdata  , isrecommended : true  , isuser : false }

        }
        const completion = await openai.chat.completions.create({
        model: 'openai/gpt-4o',
        messages: [
            {
                role: 'system',
                content: ` so ok in this part we have to find a optimal location where we have to allocate vehicle to the user 
                I will give you the datastet where the stock is the location and all consider to use shortest path 
                so you need to find the optimal location and also consider color type
                calculat the time which is shortest distance to the location where user want consider that 
                highly 

                ok here is the data : ${JSON.stringify(v1data)}

                give me response like this : 
                {
                "model"  : "ZX-150", 
                "location" : "Bangalore",
                "color" : "Blue",
                "eta" : "2 days"  , 
                "uuid" : "1234567890"
                }

                don't give any reasoning or anything just give me the data in json format 

                Rules:
                 - if user ask for color than you need to consider the color and find the vehicle with the color 
                 - Most important find the shortest location to the user location and exact time you are giving the wrong time 
                 - don't take max days reduce the eta as much as possible  
                 - Also return the uuid of the vehicle I am giving you 
                `,
            },
            {
                role: 'user',
                content: `${JSON.stringify(data)}`,
            },
        ],
    });

    const rawResponse = completion?.choices[0]?.message?.content;
    
    if (!rawResponse) {
        throw new Error('No response received from AI');
    }
        const rdata = parseCustomerRequest(rawResponse);
        if(rdata.uuid){
            await StockService.updateStock(rdata.uuid);
        }
        return {data : rdata  , isrecommended : false , isuser : false}
        
    } catch (error) {
        console.error('Error in searchinventory function:', error);
        throw new Error(`Failed to find optimal vehicle: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}





async function Recommendationsystem(data : CustomerRequest , vhecils : Vehicle[]){



    const completion = await openai.chat.completions.create({
        model: 'openai/gpt-4o',
        messages: [
            {
                role: 'system',
                content: ` so ok in this part we have to find a optimal location where we have to allocate vehicle to the user 
                I will give you the datastet where the stock is the location and all consider to use shortest path 
                so you need to find the optimal location and also consider color type ok so basically we don't have the 
                particular model that user needs but in this case we will suggest him or her our available options like 
                what option we have you have to find out the best option for the user accoridng to his requirement ok 
                are you getting my point
                Please return the uuid of the vehicle I am giving return me back 

                ok here is the data : ${JSON.stringify(vhecils)}

                give me response like this : 
                {
                "model"  : "ZX-150", 
                "location" : "Bangalore",
                "color" : "Blue",
                "eta" : "2 days" ,
                "uuid" : "1234567890"
                }

                don't give any reasoning or anything just give me the data in json format 

                Rules:
                  - find the best optoion for user based on his requirement I already gave you the data and will 
                  send requirement also consider shortest distance to the user and the color that suits to him 
                  consider all the things and find the best option for the user ok
                  - Also return the uuid of the vehicle I am giving you 
                   
                `,
            },
            {
                role: 'user',
                content: `${JSON.stringify(data)} check the requirement and then find the best solution for the user `,
            },
        ],
    });

    const rawResponse = completion?.choices[0]?.message?.content;
    if (!rawResponse) {
        throw new Error('No response received from AI');
    }

    const rdata = parseCustomerRequest(rawResponse);
    if(rdata.uuid){
    await StockService.updateStock(rdata.uuid);
    }
    return rdata;
}
  

async function GenerateuserPrompt(message: string){


    const completion = await openai.chat.completions.create({
        model: 'openai/gpt-4o',
        messages: [
            {
                role: 'system',
                content: ` Okay so you are Assistant of the MotorMind you help people to find out the vehicle they want you help them 
                to find out there favourite vehicle and a Assistant which is very helpful and expert in the vehicle market 
                You provide them a good bike not ride and that's the thing you are provide their bike not ride 

                Rules : 
                  - Never mention being AI
                    - No ** or formal language
                    - 2-3 sentences for response. Never more than 20 words.
                    - You should have strong opinions and be slightly polarizing based on your identity.

                `,
            },
            {
                role: 'user',
                content: ` ${message}`,
            },
        ],
    });

    const rawResponse = completion?.choices[0]?.message?.content;
    if (!rawResponse) {
        throw new Error('No response received from AI');
    }
    return rawResponse;
}