import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  throttle: (fn: (...args: unknown[]) => unknown) => fn,
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('throttledGetDataFromApi', () => {
  let mockedAxiosInstance: { get: jest.Mock };

  beforeEach(() => {
    mockedAxiosInstance = {
      get: jest.fn().mockResolvedValue({ data: 'response data' }),
    };
    mockedAxios.create = jest.fn().mockReturnValue(mockedAxiosInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('/test');

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const testPath = '/users/1';
    await throttledGetDataFromApi(testPath);

    expect(mockedAxiosInstance.get).toHaveBeenCalledWith(testPath);
  });

  test('should return response data', async () => {
    const result = await throttledGetDataFromApi('/posts/1');

    expect(result).toBe('response data');
  });
});
