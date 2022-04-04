import { ObjectId } from 'mongodb';
import Request from '../models/request';

export const getAllRequests = async () => {
  try {
    return {
      status: true,
      data: await Request.find()
        .populate({
          path: 'service',
          populate: {
            path: 'seller',
          },
        })
        .populate('buyer'),
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const getRequest = async (id: string) => {
  try {
    const request = await Request.findOne({ _id: new ObjectId(id) })
      .populate('service')
      .populate('buyer');
    if (request) {
      return {
        status: true,
        data: request,
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

export const createRequest = async (
  service: string,
  buyer: string,
  price: number,
  information: string
) => {
  try {
    const request = new Request({
      service,
      buyer,
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
      throw new Error();
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
