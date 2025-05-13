import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('/test');

    expect(mockedAxios.create).toHaveBeenCalledTimes(1);
  });

  test('should perform request to correct provided url', async () => {
    // Write your test here
  });

  test('should return response data', async () => {
    // Write your test here
  });
});
