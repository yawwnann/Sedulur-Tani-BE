import { Request, Response } from "express";
import komerceShippingService from "../services/rajaongkir.service";

export class ShippingController {
  /**
   * Get list of domestic destinations
   */
  async getDestinations(req: Request, res: Response) {
    try {
      const destinations =
        await komerceShippingService.getDomesticDestinations();

      res.status(200).json({
        success: true,
        message: "Destinations retrieved successfully",
        data: destinations,
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
