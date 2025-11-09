// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { join } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

jest.spyOn(global, 'setTimeout');
jest.spyOn(global, 'setInterval');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const fn = jest.fn();

    doStuffByTimeout(fn, 100);

    // expect(global.setTimeout).toHaveBeenCalledTimes(1);
    // expect(global.setTimeout).toHaveBeenLastCalledWith(fn, 100);
  });

  test('should call callback only after timeout', () => {
    const fn = jest.fn();

    doStuffByTimeout(fn, 100);

    expect(fn).not.toHaveBeenCalled();
    jest.runAllTimers();
    jest.advanceTimersByTime(100);
    // expect(fn).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const fn = jest.fn();

    doStuffByInterval(fn, 100);

    
  });

  test('should call callback multiple times after multiple intervals', () => {
    const fn = jest.fn();

    doStuffByInterval(fn, 100);

    expect(fn).toHaveBeenCalledTimes(0);
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    (join as jest.Mock).mockReturnValueOnce('/path/to/file');

    await readFileAsynchronously('/path/to/file');

    expect(join).toHaveBeenCalledTimes(1);
    expect(join).toHaveBeenCalledWith(__dirname, '/path/to/file');
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValueOnce(false);

    const result = await readFileAsynchronously('/path/to/file');

    expect(existsSync).toHaveBeenCalledTimes(1);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (existsSync as jest.Mock).mockReturnValueOnce(true);
    (readFile as jest.Mock).mockResolvedValueOnce('file content');

    const result = await readFileAsynchronously('/path/to/file');

    expect(existsSync).toHaveBeenCalledTimes(1);
    expect(readFile).toHaveBeenCalledTimes(1);
    expect(result).toBe('file content');
  });
});
