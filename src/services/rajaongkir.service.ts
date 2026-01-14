import axios from "axios";
import crypto from "crypto";
import ShippingCache from "../../models/ShippingCache";

const KOMERCE_API_KEY = process.env.KOMERCE_API_KEY || "";
const KOMERCE_BASE_URL =
  process.env.KOMERCE_BASE_URL || "https://api.komerce.id/v1";
const CACHE_DURATION_DAYS = 30; // Cache selama 30 hari

interface CostParams {
  origin: string;
  destination: string;
  weight: number;
  courier: string;
}

interface ShippingCost {
  service: string;
  description: string;
  cost: Array<{
    value: number;
    etd: string;
    note: string;
  }>;
}

export class KomerceShippingService {
  /**
   * Generate cache key dari parameter
   */
  private generateCacheKey(params: CostParams): string {
    const { origin, destination, weight, courier } = params;
    const dataString = `${origin}-${destination}-${weight}-${courier}`;
    return crypto.createHash("md5").update(dataString).digest("hex");
  }

  /**
   * Get domestic destinations dari Komerce API
   */
  async getDomesticDestinations() {
    try {
      const response = await axios.get(
        `${KOMERCE_BASE_URL}/shipping/domestic-destination`,
        {
          headers: {
            "api-key": KOMERCE_API_KEY,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Error fetching destinations:",
        error.response?.data || error.message
      );
      throw new Error("Failed to fetch destinations");
    }
  }

  /**
   * Get shipping cost dengan caching
   */
  async getCost(params: CostParams) {
    const { origin, destination, weight, courier } = params;

    // Validasi input
    if (!origin || !destination || !weight || !courier) {
      throw new Error("Missing required parameters");
    }

    // Generate cache key
    const cacheKey = this.generateCacheKey(params);

    console.log("🔍 Checking cache for key:", cacheKey);

    // Check cache
    const cachedData = await ShippingCache.findOne({
      cache_key: cacheKey,
      expires_at: { $gt: new Date() },
    });

    if (cachedData) {
      console.log("✅ Cache HIT - Returning cached data");
      return {
        fromCache: true,
        data: cachedData.costs,
        cachedAt: cachedData.created_at,
        expiresAt: cachedData.expires_at,
      };
    }

    console.log("❌ Cache MISS - Calling Komerce API");

    // Call Komerce API
    try {
      const response = await axios.post(
        `${KOMERCE_BASE_URL}/shipping/domestic-cost`,
        {
          origin,
          destination,
          weight,
          courier,
        },
        {
          headers: {
            "api-key": KOMERCE_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      // Transform Komerce response to match our format
      const costs = this.transformKomerceResponse(response.data);

      // Save to cache
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + CACHE_DURATION_DAYS);

      await ShippingCache.findOneAndUpdate(
        { cache_key: cacheKey },
        {
          cache_key: cacheKey,
          origin,
          destination,
          weight,
          courier,
          costs,
          expires_at: expiresAt,
        },
        { upsert: true, new: true }
      );

      console.log("💾 Data saved to cache");

      return {
        fromCache: false,
        data: costs,
        cachedAt: new Date(),
        expiresAt,
      };
    } catch (error: any) {
      console.error(
        "Error calling Komerce API:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to get shipping cost"
      );
    }
  }

  /**
   * Transform Komerce API response to standard format
   */
  private transformKomerceResponse(data: any): ShippingCost[] {
    // Adjust this based on actual Komerce API response structure
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((item: any) => ({
        service: item.service || item.service_name || "Standard",
        description: item.description || item.service_description || "",
        cost: [
          {
            value: item.cost || item.price || 0,
            etd: item.etd || item.estimation || "2-3",
            note: item.note || "",
          },
        ],
      }));
    }

    // Fallback if structure is different
    return [];
  }

  /**
   * Clear expired cache (optional - untuk manual cleanup)
   */
  async clearExpiredCache() {
    const result = await ShippingCache.deleteMany({
      expires_at: { $lt: new Date() },
    });

    console.log(`🗑️ Cleared ${result.deletedCount} expired cache entries`);
    return result.deletedCount;
  }

  /**
   * Clear all cache (untuk testing/debugging)
   */
  async clearAllCache() {
    const result = await ShippingCache.deleteMany({});
    console.log(`🗑️ Cleared all cache (${result.deletedCount} entries)`);
    return result.deletedCount;
  }
}

export default new KomerceShippingService();
