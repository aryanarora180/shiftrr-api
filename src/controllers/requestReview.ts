import RequestReview from '../models/requestReview';
import Request from '../models/request';

export const getAllRequestReviews = async () => {
  try {
    return {
      status: true,
      data: await RequestReview.find()
        .populate('seller')
        .populate('buyer')
        .populate('request')
        .populate('service')
        .exec(),
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const getRequestReviewById = async (_id: string) => {
  try {
    const review = await RequestReview.findOne({ _id })
      .populate('seller')
      .populate('buyer')
      .populate('request')
      .populate('service')
      .exec();
    if (review) {
      return {
        status: true,
        data: review,
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

export const getRequestReviewsByRequest = async (requestId: string) => {
  try {
    return {
      status: true,
      data: await RequestReview.find({ request: requestId })
        .populate('seller')
        .populate('buyer')
        .populate('request')
        .populate('service')
        .exec(),
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const getRequestReviewsByService = async (serviceId: string) => {
  try {
    return {
      status: true,
      data: await RequestReview.find({ service: serviceId })
        .populate('seller')
        .populate('buyer')
        .populate('request')
        .populate('service')
        .exec(),
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const getRequestReviewsByBuyer = async (buyerId: string) => {
  try {
    return {
      status: true,
      data: await RequestReview.find({ buyer: buyerId })
        .populate('seller')
        .populate('buyer')
        .populate('request')
        .populate('service')
        .exec(),
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const createRequestReview = async (
  request: string,
  comment: string,
  rating: number
) => {
  try {
    const populatedRequest = await Request.findOne({
      _id: request,
    }).exec();

    if (populatedRequest?.seller !== null) {
      const review = new RequestReview({
        seller: populatedRequest?.seller,
        buyer: populatedRequest?.buyer,
        service: populatedRequest?.service,
        request: request,
        comment: comment,
        rating: rating,
      });
      await review.save();

      return {
        status: true,
        data: review,
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

export const deleteRequestReview = async (
  _id: string,
  deletingUserId: string
) => {
  try {
    const review = await RequestReview.findOne({
      _id,
      buyer: deletingUserId,
    });
    if (review) {
      await review.deleteOne();
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
