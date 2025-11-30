import { Request, Response } from 'express';
import * as shippingService from '../services/shipping.service';

export const getProvinces = (req: Request, res: Response) => {
  try {
    const provinces = shippingService.getProvinces();
    res.status(200).json({ success: true, data: provinces });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch provinces' });
  }
};

export const getRegencies = (req: Request, res: Response) => {
  try {
    const { provinceId } = req.params;
    const regencies = shippingService.getRegencies(provinceId);
    res.status(200).json({ success: true, data: regencies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch regencies' });
  }
};

export const getDistricts = (req: Request, res: Response) => {
  try {
    const { regencyId } = req.params;
    const districts = shippingService.getDistricts(regencyId);
    res.status(200).json({ success: true, data: districts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch districts' });
  }
};

export const calculateCost = (req: Request, res: Response) => {
  try {
    const { provinceId, provinceName, weight } = req.body;
    
    const provinceIdentifier = provinceId || provinceName;

    if (!provinceIdentifier || weight === undefined) {
      return res.status(400).json({ success: false, message: 'Province (ID or Name) and weight are required' });
    }

    const cost = shippingService.calculateShippingCost(provinceIdentifier, Number(weight));
    res.status(200).json({ success: true, data: { cost, courier: "JNE (Estimasi)", etd: "2-3 Hari" } });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
