import { ObjectId } from 'mongodb';
import Service from '../models/service';

export const getAllServices = async () => {
  try {
    return {
      status: true,
      data: await Service.find().populate('seller'),
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const getService = async (id: string) => {
  try {
    const service = await Service.findOne({ _id: new ObjectId(id) }).populate(
      'seller'
    );
    if (service) {
      return {
        status: true,
        data: service,
      };
    } else {
      throw new Error();
    }
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const createService = async (
  seller: string,
  name: string,
  description: string,
  image: string,
  startingPrice: number
) => {
  try {
    const service = new Service({
      seller,
      name,
      description,
      image,
      startingPrice,
    });
    await service.save();
    if (service) {
      return {
        status: true,
        data: service,
      };
    } else {
      throw new Error();
    }
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const updateService = async (
  id: string,
  updatingUserId: string,
  data: any
) => {
  try {
    const service = await Service.findOne({
      _id: new ObjectId(id),
      seller: new ObjectId(updatingUserId),
    });
    if (service) {
      try {
        await service.updateOne(data);
        return {
          status: true,
          data: (await getService(id)).data,
        };
      } catch (e: any) {
        throw new Error();
      }
    } else {
      throw new Error();
    }
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const deleteService = async (id: string, deletingUserId: string) => {
  try {
    const service = await Service.findOne({
      _id: new ObjectId(id),
      seller: new ObjectId(deletingUserId),
    });
    if (service) {
      await service.deleteOne();
      return {
        status: true,
      };
    } else {
      throw new Error();
    }
  } catch (e: any) {
    return {
      status: false,
    };
  }
};
