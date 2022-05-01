import { ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Request from '../../src/models/request';

import {
  getAllRequests,
  getRequest,
  getRequestsOfUser,
  getRequestedByUser,
  createRequest,
  updateRequest,
  deleteRequest,
} from '../../src/controllers/request';

import { requestStatus } from '../../src/types';

import {
  mockBuyerUser,
  mockSellerService,
  mockBuyerRequest,
  mockBuyerRequest2,
  mockSellerUser,
} from '../helpers/review';

describe('Controller: Services', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    await mockBuyerUser.save();
    await mockSellerUser.save();
    await mockSellerService.save();
    await mockBuyerRequest.save();
  });

  afterAll(async () => {
    if (mongoServer) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongoServer.stop();
    }
  });

  it('Should be able to fetch all requests', async () => {
    let getAllRequestsQuery = await getAllRequests();
    expect(getAllRequestsQuery.status).toBe(true);
    expect(getAllRequestsQuery.data).toBeInstanceOf(Array);
    expect(getAllRequestsQuery.data?.length).toBe(1);

    await mockBuyerRequest2.save();

    getAllRequestsQuery = await getAllRequests();
    expect(getAllRequestsQuery.status).toBe(true);
    expect(getAllRequestsQuery.data).toBeInstanceOf(Array);
    expect(getAllRequestsQuery.data?.length).toBe(2);
    expect(getAllRequestsQuery.data?.at(0)?._id).toStrictEqual(
      mockBuyerRequest._id
    );
    expect(getAllRequestsQuery.data?.at(1)?._id).toStrictEqual(
      mockBuyerRequest2._id
    );
  });

  it('Should be able to fetch a request by ID', async () => {
    let getRequestQuery = await getRequest(new ObjectId().toString());
    expect(getRequestQuery.status).toBe(false);

    getRequestQuery = await getRequest(mockBuyerRequest._id.toString());
    expect(getRequestQuery.status).toBe(true);
    expect(getRequestQuery.data).toBeInstanceOf(Request);
    expect(getRequestQuery.data?._id).toStrictEqual(mockBuyerRequest._id);
  });

  it('Should be able to fetch requests by seller', async () => {
    let getRequestsOfUserQuery = await getRequestsOfUser(
      new ObjectId().toString()
    );
    expect(getRequestsOfUserQuery.status).toBe(true);
    expect(getRequestsOfUserQuery.data).toBeInstanceOf(Array);
    expect(getRequestsOfUserQuery.data?.length).toBe(0);

    getRequestsOfUserQuery = await getRequestsOfUser(
      mockSellerUser._id.toString()
    );
    expect(getRequestsOfUserQuery.status).toBe(true);
    expect(getRequestsOfUserQuery.data).toBeInstanceOf(Array);
    expect(getRequestsOfUserQuery.data?.length).toBe(2);
    expect(getRequestsOfUserQuery.data?.at(0)?._id).toStrictEqual(
      mockBuyerRequest._id
    );
    expect(getRequestsOfUserQuery.data?.at(1)?._id).toStrictEqual(
      mockBuyerRequest2._id
    );
  });

  it('Should be able to fetch requests by buyer', async () => {
    let getRequestedByUserQuery = await getRequestedByUser(
      new ObjectId().toString()
    );
    expect(getRequestedByUserQuery.status).toBe(true);
    expect(getRequestedByUserQuery.data).toBeInstanceOf(Array);
    expect(getRequestedByUserQuery.data?.length).toBe(0);

    getRequestedByUserQuery = await getRequestedByUser(
      mockBuyerUser._id.toString()
    );
    expect(getRequestedByUserQuery.status).toBe(true);
    expect(getRequestedByUserQuery.data).toBeInstanceOf(Array);
    expect(getRequestedByUserQuery.data?.length).toBe(2);
    expect(getRequestedByUserQuery.data?.at(0)?._id).toStrictEqual(
      mockBuyerRequest._id
    );
    expect(getRequestedByUserQuery.data?.at(1)?._id).toStrictEqual(
      mockBuyerRequest2._id
    );
  });

  it('Should be able to create a request', async () => {
    let createRequestQuery = await createRequest(
      mockSellerService._id.toString(),
      mockBuyerUser._id.toString(),
      420,
      'This is a test request'
    );
    expect(createRequestQuery.status).toBe(true);

    let findCreatedRequestQuery = await Request.findOne({
      _id: createRequestQuery.data?._id,
    });
    expect(findCreatedRequestQuery?.service).toStrictEqual(
      mockSellerService._id
    );
    expect(findCreatedRequestQuery?.buyer).toStrictEqual(mockBuyerUser._id);
    expect(findCreatedRequestQuery?.seller).toStrictEqual(mockSellerUser._id);
    expect(findCreatedRequestQuery?.price).toBe(420);
    expect(findCreatedRequestQuery?.information).toBe('This is a test request');
  });

  it('Should be able to update a request', async () => {
    let updateRequestQuery = await updateRequest(
      mockBuyerRequest._id.toString(),
      mockSellerUser._id.toString(),
      {
        status: requestStatus.accepted,
      }
    );
    expect(updateRequestQuery.status).toBe(true);

    let findCreatedRequestQuery = await Request.findOne({
      _id: mockBuyerRequest._id,
    });
    expect(findCreatedRequestQuery?.status).toBe(requestStatus.accepted);
  });

  it('Should be able to delete a request', async () => {
    const wrongUserDelete = await deleteRequest(
      mockBuyerRequest._id.toString(),
      new mongoose.Types.ObjectId().toString()
    );
    expect(wrongUserDelete.status).toBe(false);

    await deleteRequest(
      mockBuyerRequest._id.toString(),
      mockBuyerUser._id.toString()
    );

    const request = await getRequest(mockBuyerRequest._id.toString());

    expect(request.status).toBe(false);
  });
});
