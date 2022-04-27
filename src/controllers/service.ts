import Service from '../models/service';

export const getAllServices = async () => {
  try {
    return {
      status: true,
      data: await Service.find().populate('seller').exec(),
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const getService = async (_id: string) => {
  try {
    const service = await Service.findOne({ _id }).populate('seller').exec();
    if (service) {
      return {
        status: true,
        data: service,
      };
    } else {
      return {
        status: false,
      };
    }
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const getServicesOfUser = async (_id: string) => {
  try {
    return {
      status: true,
      data: await Service.find({ seller: _id }).populate('seller').exec(),
    };
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
    return {
      status: true,
      data: service,
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const updateService = async (
  _id: string,
  updatingUserId: string,
  data: any
) => {
  try {
    const service = await Service.findOne({
      _id,
      seller: updatingUserId,
    });
    if (service) {
      await service.updateOne(data);
      return {
        status: true,
        data: service,
      };
    } else {
      return {
        status: false,
      };
    }
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const deleteService = async (_id: string, deletingUserId: string) => {
  try {
    const service = await Service.findOne({
      _id,
      seller: deletingUserId,
    });
    if (service) {
      await service.deleteOne();
      return {
        status: true,
      };
    } else {
      return {
        status: false,
      };
    }
  } catch (e: any) {
    return {
      status: false,
    };
  }
};
