import { Request, Response } from "express";
import { CreateProductDTO, UpdateProductDTO } from "../types/product.types";
import ProductService from "../services/Product.service";
import ProductValidator from "../validators/ProductValidator";
import { successResponse } from "../utils/responseFormatter";
import { handleError } from "../utils/errorHandler";

class ProductController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      const productData: CreateProductDTO = req.body;

      ProductValidator.validateCreateProduct(productData);

      const product = await ProductService.createProduct(userId, productData);

      return res.status(201).json(
        successResponse("Product created successfully", { product })
      );
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const { seller_id, search, min_price, max_price, in_stock } = req.query;

      const filters = {
        seller_id: seller_id as string | undefined,
        search: search as string | undefined,
        min_price: min_price ? parseFloat(min_price as string) : undefined,
        max_price: max_price ? parseFloat(max_price as string) : undefined,
        in_stock: in_stock === 'true'
      };

      const products = await ProductService.getAllProducts(filters);

      return res.status(200).json(
        successResponse("Products retrieved successfully", { products })
      );
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required"
        });
      }

      const product = await ProductService.getProductById(id);

      return res.status(200).json(
        successResponse("Product retrieved successfully", { product })
      );
    } catch (error) {
      return handleError(res, error);
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required"
        });
      }

      const updateData: UpdateProductDTO = req.body;

      ProductValidator.validateUpdateProduct(updateData);

      await ProductService.validateProductOwnership(id, userId);

      const updatedProduct = await ProductService.updateProduct(id, updateData);

      return res.status(200).json(
        successResponse("Product updated successfully", { product: updatedProduct })
      );
    } catch (error) {
      return handleError(res, error);
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized"
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Product I"
        });
      }

      await ProductService.validateProductOwnership(id, userId);
      await ProductService.deleteProduct(id);

      return res.status(200).json(
        successResponse("Product deleted successfully")
      );
    } catch (error) {
      return handleError(res, error);
    }
  }
}

export default new ProductController();
