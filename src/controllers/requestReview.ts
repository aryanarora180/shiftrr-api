import RequestReview from '../models/requestReview';

export const getAllRequestReviews = async () => {
  try {
    return {
      status: true,
      data: await RequestReview.find()
        .populate('target')
        .populate('poster')
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
      .populate('target')
      .populate('poster')
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

export const getRequestReviewsByTarget = async (targetId: string) => {
  try {
    return {
      status: true,
      data: await RequestReview.find({ target: targetId })
        .populate('target')
        .populate('poster')
        .exec(),
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const getRequestReviewsByPostingUser = async (posterId: string) => {
  try {
    return {
      status: true,
      data: await RequestReview.find({ poster: posterId })
        .populate('target')
        .populate('poster')
        .exec(),
    };
  } catch (e: any) {
    return {
      status: false,
    };
  }
};

export const createRequestReview = async (
  target: string,
  poster: string,
  comment: string,
  rating: number
) => {
  try {
    const review = new RequestReview({
      target,
      poster,
      comment,
      rating,
    });
    await review.save();
    return {
      status: true,
      data: review,
    };
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
