import User from '../models/user';
import Service from '../models/service';
import Request from '../models/request';

export const getAllUsers = async () => {
  try {
    return {
      status: true,
      data: await User.find().exec(),
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const getUser = async (_id: string) => {
  try {
    const user = await User.findOne({ _id }).exec();
    if (user) {
      return {
        status: true,
        data: user,
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

export const updateUser = async (_id: string, data: any) => {
  try {
    const user = await User.findOne({ _id }).exec();
    if (user) {
      await user.updateOne(data);
      return {
        status: true,
        data: user,
      };
    } else {
      return { status: false };
    }
  } catch (e: any) {
    return { status: false };
  }
};

export const deleteUser = async (_id: string) => {
  try {
    const user = await User.findOne({ _id }).exec();
    if (user) {
      await user.deleteOne();
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

export const getRequestsOfUser = async (_id: string) => {
  try {
    return {
      status: true,
      data: await Request.find({ seller: _id })
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

export const getRequestedByUser = async (_id: string) => {
  try {
    return {
      status: true,
      data: await Request.find({ buyer: _id })
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
