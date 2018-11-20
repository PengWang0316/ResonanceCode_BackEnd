import { ObjectId } from 'mongodb';

import Hexagram from '../../src/models/Hexagram';

const COLLECTION_HEXAGRAMS = 'hexagrams';
const mockFind = jest.fn();
const mockUpdate = jest.fn();
const mockCollection = jest.fn().mockReturnValue({ find: mockFind, update: mockUpdate });
jest.mock('../../src/MongoDBHelper', () => ({
  promiseFindResult: jest.fn().mockImplementation(callback => callback({
    collection: mockCollection,
  })),
  promiseNextResult: jest.fn().mockImplementation(callback => callback({
    collection: mockCollection,
  })),
  promiseInsertResult: jest.fn().mockImplementation(callback => callback({
    collection: mockCollection,
  })),
  getDB: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue({
      find: jest.fn().mockReturnValue({
        next: jest.fn().mockImplementation(callback => callback(null, 'imgInfo')),
      }),
    }),
  }),
}));

describe('Hexagram model', () => {
  test('fetchHexagrams with empty query', () => {
    Hexagram.fetchHexagrams({});

    expect(mockCollection).toHaveBeenCalledTimes(1);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_HEXAGRAMS);
    expect(mockFind).toHaveBeenCalledTimes(1);
    expect(mockFind).toHaveBeenLastCalledWith({});
  });

  test('fetchHexagrams with upperId query', () => {
    Hexagram.fetchHexagrams({ upperId: '0' });

    expect(mockCollection).toHaveBeenCalledTimes(2);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_HEXAGRAMS);
    expect(mockFind).toHaveBeenCalledTimes(2);
    expect(mockFind).toHaveBeenLastCalledWith({});

    Hexagram.fetchHexagrams({ upperId: '5b182e9138dbb7258cc39547' });
    expect(mockCollection).toHaveBeenCalledTimes(3);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_HEXAGRAMS);
    expect(mockFind).toHaveBeenCalledTimes(3);
    expect(mockFind).toHaveBeenLastCalledWith({ upper_trigrams_id: new ObjectId('5b182e9138dbb7258cc39547') });
  });

  test('fetchHexagrams with lowerId query', () => {
    Hexagram.fetchHexagrams({ lowerId: '0' });

    expect(mockCollection).toHaveBeenCalledTimes(4);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_HEXAGRAMS);
    expect(mockFind).toHaveBeenCalledTimes(4);
    expect(mockFind).toHaveBeenLastCalledWith({});

    Hexagram.fetchHexagrams({ lowerId: '5b182e9138dbb7258cc39547' });
    expect(mockCollection).toHaveBeenCalledTimes(5);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_HEXAGRAMS);
    expect(mockFind).toHaveBeenCalledTimes(5);
    expect(mockFind).toHaveBeenLastCalledWith({ lower_trigrams_id: new ObjectId('5b182e9138dbb7258cc39547') });
  });

  test('fetchHexagrams with line13Id query', () => {
    Hexagram.fetchHexagrams({ line13Id: '0' });

    expect(mockCollection).toHaveBeenCalledTimes(6);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_HEXAGRAMS);
    expect(mockFind).toHaveBeenCalledTimes(6);
    expect(mockFind).toHaveBeenLastCalledWith({});

    Hexagram.fetchHexagrams({ line13Id: '5b182e9138dbb7258cc39547' });
    expect(mockCollection).toHaveBeenCalledTimes(7);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_HEXAGRAMS);
    expect(mockFind).toHaveBeenCalledTimes(7);
    expect(mockFind).toHaveBeenLastCalledWith({ line_13_id: new ObjectId('5b182e9138dbb7258cc39547') });
  });

  test('fetchHexagrams with line25Id query', () => {
    Hexagram.fetchHexagrams({ line25Id: '0' });

    expect(mockCollection).toHaveBeenCalledTimes(8);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_HEXAGRAMS);
    expect(mockFind).toHaveBeenCalledTimes(8);
    expect(mockFind).toHaveBeenLastCalledWith({});

    Hexagram.fetchHexagrams({ line25Id: '5b182e9138dbb7258cc39547' });
    expect(mockCollection).toHaveBeenCalledTimes(9);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_HEXAGRAMS);
    expect(mockFind).toHaveBeenCalledTimes(9);
    expect(mockFind).toHaveBeenLastCalledWith({ line_25_id: new ObjectId('5b182e9138dbb7258cc39547') });
  });

  test('fetchHexagrams with line46Id query', () => {
    Hexagram.fetchHexagrams({ line46Id: '0' });

    expect(mockCollection).toHaveBeenCalledTimes(10);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_HEXAGRAMS);
    expect(mockFind).toHaveBeenCalledTimes(10);
    expect(mockFind).toHaveBeenLastCalledWith({});

    Hexagram.fetchHexagrams({ line46Id: '5b182e9138dbb7258cc39547' });
    expect(mockCollection).toHaveBeenCalledTimes(11);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_HEXAGRAMS);
    expect(mockFind).toHaveBeenCalledTimes(11);
    expect(mockFind).toHaveBeenLastCalledWith({ line_46_id: new ObjectId('5b182e9138dbb7258cc39547') });
  });

  test('fetchHexagramBasedOnImgArr without error', () => {
    const { promiseNextResult } = require('../../src/MongoDBHelper');
    Hexagram.fetchHexagramBasedOnImgArr('imageArr');

    expect(promiseNextResult).toHaveBeenCalledTimes(1);
    expect(mockCollection).toHaveBeenCalledTimes(12);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_HEXAGRAMS);
  });

  test('findHexagramImagesForReading', async () => {
    const { getDB } = require('../../src/MongoDBHelper');
    const reading = { hexagram_arr_1: 'arr1', hexagram_arr_2: 'arr2' };
    await expect(Hexagram.findHexagramImagesForReading(reading)).resolves.toEqual({
      hexagram_arr_1: 'arr1',
      hexagram_arr_2: 'arr2',
      img1Info: 'imgInfo',
      img2Info: 'imgInfo',
    });

    expect(getDB).toHaveBeenCalledTimes(2);
    expect(getDB().collection).toHaveBeenCalledTimes(2);
    expect(getDB().collection).toHaveBeenLastCalledWith(COLLECTION_HEXAGRAMS);
    expect(getDB().collection().find).toHaveBeenCalledTimes(2);
    expect(getDB().collection().find).toHaveBeenNthCalledWith(1, { img_arr: reading.hexagram_arr_1 });
    expect(getDB().collection().find).toHaveBeenNthCalledWith(2, { img_arr: reading.hexagram_arr_2 });
    expect(getDB().collection().find().next).toHaveBeenCalledTimes(2);
  });

  test('updateHexagram', () => {
    const { promiseInsertResult } = require('../../src/MongoDBHelper');
    Hexagram.updateHexagram({ _id: '5b182e9138dbb7258cc39547', other: true });

    expect(promiseInsertResult).toHaveBeenCalledTimes(1);
    expect(mockCollection).toHaveBeenCalledTimes(13);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_HEXAGRAMS);
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenLastCalledWith({ _id: new ObjectId('5b182e9138dbb7258cc39547') }, { $set: { other: true } });
  });
});
