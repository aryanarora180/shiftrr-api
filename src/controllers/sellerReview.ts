import SellerReview from '../models/sellerReview';
import Request from '../models/request';

export const getAllSellerReviews = async () => {
  try {
    return {
      status: true,
      data: await SellerReview.find()
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

export const getSellerReviewById = async (_id: string) => {
  try {
    const review = await SellerReview.findOne({ _id })
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

export const getSellerReviewsBySellerUser = async (seller_id: string) => {
  try {
    return {
      status: true,
      data: await SellerReview.find({ seller: seller_id })
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

export const getSellerReviewsByPostingUser = async (user_id: string) => {
  try {
    return {
      status: true,
      data: await SellerReview.find({ buyer: user_id })
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

export const createSellerReview = async (
  request: string,
  comment: string,
  rating: number
) => {
  try {
    const populatedRequest = await Request.findOne({
      _id: request,
    }).exec();

    if (populatedRequest?.seller !== null) {
      const review = new SellerReview({
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

export const deleteSellerReview = async (
  _id: string,
  deletingUserId: string
) => {
  try {
    const review = await SellerReview.findOne({
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
