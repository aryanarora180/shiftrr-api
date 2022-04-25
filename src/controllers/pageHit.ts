import e from 'cors';
import mongoose, { Date } from 'mongoose';
import PageHit from '../models/pageHit';

export const getAllPageHits = async (onOrAfterDate?: Date) => {
  try {
    let pageHits;
    if (onOrAfterDate) {
      pageHits = await PageHit.find({
        createdAt: { $gte: onOrAfterDate },
      }).populate('user');
    } else {
      pageHits = await PageHit.find().populate('user').exec();
    }

    return {
      status: true,
      data: pageHits,
    };
  } catch (e: any) {
    console.log(e);
    return {
      status: false,
    };
  }
};

export const getPageHitById = async (_id: string) => {
  try {
    const pageHits = await PageHit.findOne({ _id }).populate('user').exec();

    if (pageHits) {
      return {
        status: true,
        data: pageHits,
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

export const getPageHitsByUser = async (
  userId: string,
  onOrAfterDate?: Date
) => {
  try {
    let pageHits;
    if (onOrAfterDate) {
      pageHits = await PageHit.find({
        userId: userId,
        createdAt: { $gte: onOrAfterDate },
      })
        .populate('user')
        .exec();
    } else {
      pageHits = await PageHit.find({ userId: userId }).populate('user').exec();
    }

    return {
      status: true,
      data: pageHits,
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const createPageHit = async (
  endpoint: string,
  logicalEndpoint: string,
  user: string
) => {
  try {
    const pageHit = new PageHit({
      endpoint,
      logicalEndpoint,
      user,
    });
    await pageHit.save();

    if (pageHit) {
      return {
        status: true,
        data: pageHit,
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
