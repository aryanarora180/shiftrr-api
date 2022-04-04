import { ObjectId } from 'mongodb';
import User from '../models/user';

export const getAllUsers = async () => {
  try {
    return {
      status: true,
      data: await User.find(),
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const getUser = async (id: string) => {
  try {
    const user = await User.findOne({ _id: new ObjectId(id) });
    if (user) {
      return {
        status: true,
        data: user,
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

export const updateUser = async (id: string, data: any) => {
  try {
    await User.findOneAndUpdate({ _id: new ObjectId(id) }, data);
    return {
      status: true,
      data: (await getUser(id)).data,
    };
  } catch (e: any) {
    return { status: false };
  }
};

export const deleteUser = async (id: string) => {
  try {
    await User.findOneAndDelete({ _id: new ObjectId(id) });
    return { status: true };
  } catch (e: any) {
    return { status: false };
  }
};

// TODO: Implement this method
export const getServicesOfUser = async (id: string) => {
  // returns array of services that user is offering
};
