import SellerReview from '../models/sellerReview';
import Request from '../models/request';

export const getAllSellerReviews = async () => {
  try {
    return {
      status: true,
      data: await SellerReview.find()
        .populate('target')
        .populate('poster')
        .populate('request')
        .exec(),
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const getSellerReview = async (_id: string) => {
  try {
    const service = await SellerReview.findOne({ _id })
      .populate('target')
      .populate('poster')
      .populate('request')
      .exec();
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

export const getSellerReviews = async (seller_id: string) => {
  try {
    return {
      status: true,
      data: await SellerReview.find({ target: seller_id })
        .populate('target')
        .populate('poster')
        .populate('request')
        .exec(),
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const getPosterSellerReviews = async (user_id: string) => {
  try {
    return {
      status: true,
      data: await SellerReview.find({ poster: user_id })
        .populate('target')
        .populate('poster')
        .populate('request')
        .exec(),
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const createSellerReview = async (
  request: string,
  poster: string,
  comment: string,
  rating: number
) => {
  try {
    const serviceRequest = await Request.findOne({
      _id: request,
    }).exec();
    if (serviceRequest?.seller !== null) {
      const review = new SellerReview({
        target: serviceRequest?.seller,
        poster: poster,
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

export const deleteSellerReview = async (
  _id: string,
  deletingUserId: string
) => {
  try {
    const review = await SellerReview.findOne({
      _id,
      poster: deletingUserId,
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
