import { Request, Response } from "express";
import komerceShippingService from "../services/rajaongkir.service";

export class ShippingController {
  /**
   * Get list of domestic destinations
   */
  async getDestinations(req: Request, res: Response) {
    try {
      const result = await komerceShippingService.getDomesticDestinations();

      res.status(200).json({
        success: true,
        message: "Destinations retrieved successfully",
        data: result.data, // Extract the data array directly
      });
    } catch (error: any) {
      console.error("Error in getDestinations:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get destinations",
      });
    }
  }

  /**
   * Get list of provinces
   */
  async getProvinces(req: Request, res: Response) {
    try {
      const result = await komerceShippingService.getDomesticDestinations();
      const cities = result.data;

      // Extract unique provinces
      const provincesMap = new Map();
      cities.forEach((city: any, index: number) => {
        if (city.province && !provincesMap.has(city.province)) {
          provincesMap.set(city.province, {
            id: `prov-${index}`,
            province_id: `prov-${index}`,
            name: city.province,
            province: city.province,
          });
        }
      });

      res.status(200).json({
        success: true,
        message: "Provinces retrieved successfully",
        data: Array.from(provincesMap.values()),
      });
    } catch (error: any) {
      console.error("Error in getProvinces:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get provinces",
      });
    }
  }

  /**
   * Get list of regencies/cities by province
   */
  async getRegencies(req: Request, res: Response) {
    try {
      const { province_id } = req.query;
      const result = await komerceShippingService.getDomesticDestinations();
      let cities = result.data;

      // If province_id provided, filter by province
      if (province_id) {
        // First get all provinces to find the name
        const provincesMap = new Map();
        cities.forEach((city: any, index: number) => {
          if (city.province && !provincesMap.has(city.province)) {
            provincesMap.set(city.province, {
              id: `prov-${index}`,
              name: city.province,
            });
          }
        });

        // Find province name from id
        const province = Array.from(provincesMap.values()).find(
          (p: any) => p.id === province_id
        );

        if (province) {
          cities = cities.filter(
            (city: any) => city.province === province.name
          );
        }
      }

      // Format as regencies
      const regencies = cities.map((city: any) => ({
        id: city.id,
        city_id: city.id,
        province_id: province_id || "",
        province: city.province,
        type: city.type || "Kota",
        name: city.name,
        city_name: city.name,
        postal_code: "",
      }));

      res.status(200).json({
        success: true,
        message: "Regencies retrieved successfully",
        data: regencies,
      });
    } catch (error: any) {
      console.error("Error in getRegencies:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get regencies",
      });
    }
  }

  /**
   * Get list of districts (kecamatan) - returns empty as not needed
   */
  async getDistricts(req: Request, res: Response) {
    try {
      // Return empty array as we don't have district data
      // and it's not needed for shipping calculation
      res.status(200).json({
        success: true,
        message: "Districts not available",
        data: [],
      });
    } catch (error: any) {
      console.error("Error in getDistricts:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get districts",
      });
    }
  }

  /**
   * Calculate shipping cost with caching
   */
  async calculateCost(req: Request, res: Response) {
    try {
      const { origin, destination, weight, courier } = req.body;

      // Validasi input
      if (!origin || !destination || !weight || !courier) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: origin, destination, weight, courier",
        });
      }

      // Validasi weight (minimal 1 gram)
      if (weight < 1) {
        return res.status(400).json({
          success: false,
          message: "Weight must be at least 1 gram",
        });
      }

      const result = await komerceShippingService.getCost({
        origin,
        destination,
        weight: parseInt(weight),
        courier: courier.toLowerCase(),
      });

      res.status(200).json({
        success: true,
        message: "Shipping cost calculated successfully",
        data: {
          costs: result.data,
          fromCache: result.fromCache,
          cachedAt: result.cachedAt,
          expiresAt: result.expiresAt,
        },
      });
    } catch (error: any) {
      console.error("Error in calculateCost:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to calculate shipping cost",
      });
    }
  }

  /**
   * Clear expired cache (admin only)
   */
  async clearExpiredCache(req: Request, res: Response) {
    try {
      const deletedCount = await komerceShippingService.clearExpiredCache();

      res.status(200).json({
        success: true,
        message: `Cleared ${deletedCount} expired cache entries`,
        data: { deletedCount },
      });
    } catch (error: any) {
      console.error("Error in clearExpiredCache:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to clear cache",
      });
    }
  }

  /**
   * Clear all cache (admin only - for testing)
   */
  async clearAllCache(req: Request, res: Response) {
    try {
      const deletedCount = await komerceShippingService.clearAllCache();

      res.status(200).json({
        success: true,
        message: `Cleared all cache (${deletedCount} entries)`,
        data: { deletedCount },
      });
    } catch (error: any) {
      console.error("Error in clearAllCache:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to clear cache",
      });
    }
  }
}

export default new ShippingController();
