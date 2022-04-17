import BuyerReview from '../models/buyerReview';
import Request from '../models/request';

export const getAllBuyerReviews = async () => {
  try {
    return {
      status: true,
      data: await BuyerReview.find()
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

export const getBuyerReviewById = async (_id: string) => {
  try {
    const review = await BuyerReview.findOne({ _id })
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

export const getBuyerReviewsByBuyerUser = async (buyer_id: string) => {
  try {
    return {
      status: true,
      data: await BuyerReview.find({ buyer: buyer_id })
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

export const getBuyerReviewsByPostingUser = async (user_id: string) => {
  try {
    return {
      status: true,
      data: await BuyerReview.find({ buyer: user_id })
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

export const createBuyerReview = async (
  creatingUserId: string,
  request: string,
  comment: string,
  rating: number
) => {
  try {
    const populatedRequest = await Request.findOne({
      _id: request,
    }).exec();

    if (
      populatedRequest?.seller.toString() === creatingUserId &&
      populatedRequest?.buyer !== null
    ) {
      const review = new BuyerReview({
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

export const deleteBuyerReview = async (
  _id: string,
  deletingUserId: string
) => {
  try {
    const review = await BuyerReview.findOne({
      _id,
      seller: deletingUserId,
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
