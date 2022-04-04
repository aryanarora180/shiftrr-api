import User from '../models/user';

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

// TODO: Implement this method
export const getServicesOfUser = async (_id: string) => {
  // returns array of services that user is offering
};
