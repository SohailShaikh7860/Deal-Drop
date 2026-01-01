import Firecrawl from "@mendable/firecrawl-js";

export async function scrapeProduct(url) {
  try {
    const cleanUrl = String(url).trim();
    
    // Validate URL format
    let urlObj;
    try {
      urlObj = new URL(cleanUrl);
    } catch (urlError) {
      throw new Error(`Invalid URL format: ${cleanUrl}`);
    }

    // Ensure URL is absolute
    if (!urlObj.protocol || !urlObj.hostname) {
      throw new Error(`URL must be absolute: ${cleanUrl}`);
    }

    // Initialize Firecrawl client (do this inside function to ensure env vars are available)
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      throw new Error("FIRECRAWL_API_KEY environment variable is not set");
    }
    
    const firecrawl = new Firecrawl({ apiKey });
    
    const schema = {
      type: "object",
      properties: {
        productName: { type: "string" },
        currentPrice: { type: "number" },
        currencyCode: { type: "string" },
        productImageUrl: { type: "string" },
      },
      required: ["productName", "currentPrice"],
    };

    // Use extract method with a single object parameter (as shown in README)
    const result = await firecrawl.extract({
      urls: [cleanUrl],
      prompt: "Extract the product name as 'productName', current price as a number as 'currentPrice', currency code (USD, EUR, etc) as 'currencyCode', and product image URL as 'productImageUrl' if available",
      schema: schema,
    });

    if (!result) {
      throw new Error("Extraction failed - no result returned");
    }

    if (!result.success || result.error) {
      throw new Error(result.error || "Extraction failed");
    }

    const extractData = result.data;

    if(!extractData || !extractData.productName){
        throw new Error("No data extracted from url");
    }

    return extractData;
  } catch (error) {
     console.error("Firecrawl scrape error:", error);
     throw new Error(`Failed to scrape product data: ${error.message}`);
     
  }
}

