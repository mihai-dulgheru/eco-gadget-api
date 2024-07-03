import { convertFormDataToJson } from '../middleware';

describe('convertFormDataToJson', () => {
  test('converts simple FormData to JSON', async () => {
    const req = {
      body: {
        formData: JSON.stringify({
          name: 'John',
          age: 30,
        }),
      },
    };

    await convertFormDataToJson(req, {}, () => {});

    expect(req.body).toEqual({
      name: 'John',
      age: 30,
    });
  });

  test('converts nested FormData to JSON', async () => {
    const req = {
      body: {
        formData: JSON.stringify({
          user: {
            name: 'John',
            age: 30,
          },
        }),
      },
    };

    await convertFormDataToJson(req, {}, () => {});

    expect(req.body).toEqual({
      user: { name: 'John', age: 30 },
    });
  });

  test('converts array FormData to JSON', async () => {
    const req = {
      body: {
        formData: JSON.stringify({
          tags: ['tag1', 'tag2'],
        }),
      },
    };

    await convertFormDataToJson(req, {}, () => {});

    expect(req.body).toEqual({
      tags: ['tag1', 'tag2'],
    });
  });
});
