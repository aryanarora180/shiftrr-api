import { ObjectId } from 'mongodb';
import { IService } from 'src/types';
import Request from '../models/request';
import Service from '../models/service';

export const getAllRequests = async () => {
  try {
    return {
      status: true,
      data: await Request.find()
        .populate('service')
        .populate('buyer')
        .populate('seller')
        .exec(),
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const getRequest = async (_id: string) => {
  try {
    const request = await Request.findOne({ _id })
      .populate('service')
      .populate('buyer')
      .populate('seller')
      .exec();
    if (request) {
      return {
        status: true,
        data: request,
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

export const createRequest = async (
  service: string,
  buyer: string,
  price: number,
  information: string
) => {
  try {
    const populatedService: IService | null = await Service.findOne({
      _id: service,
    });

    if (!populatedService) {
      return {
        status: false,
      };
    }

    const request = new Request({
      service,
      buyer,
      seller: populatedService.seller,
      price,
      information,
    });
    await request.save();

    if (request) {
      return {
        status: true,
        data: request,
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

export const updateRequest = async (
  id: string,
  updatingUserId: string,
  data: any
) => {
  try {
    const requestQuery = await getRequest(id);
    if (requestQuery.status) {
      const request = requestQuery.data;
      const requestService: any = request!.service;
      if (
        new ObjectId(requestService.seller).equals(new ObjectId(updatingUserId))
      ) {
        await request!.updateOne(data);
        return {
          status: true,
          data: (await getRequest(id)).data,
        };
      } else {
        return {
          status: false,
        };
      }
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

export const deleteRequest = async (id: string, deletingUserId: string) => {
  try {
    const requestQuery = await getRequest(id);
    if (requestQuery.status) {
      const request = requestQuery.data;
      const requestService: any = request!.service;
      if (
        new ObjectId(request!.buyer._id).equals(new ObjectId(deletingUserId)) ||
        new ObjectId(requestService.seller).equals(new ObjectId(deletingUserId))
      ) {
        await request!.deleteOne();
        return {
          status: true,
        };
      } else {
        return {
          status: false,
        };
      }
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
