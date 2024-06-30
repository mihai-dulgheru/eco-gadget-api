import { jsonToFormData } from '../utils';

describe('jsonToFormData', () => {
  test('converts simple JSON to FormData', () => {
    const json = { name: 'John', age: 30 };
    const formData = jsonToFormData(json);
    expect(formData.get('name')).toBe('John');
    expect(formData.get('age')).toBe('30');
  });

  test('converts nested JSON to FormData', () => {
    const json = { user: { name: 'John', age: 30 } };
    const formData = jsonToFormData(json);
    expect(formData.get('user[name]')).toBe('John');
    expect(formData.get('user[age]')).toBe('30');
  });

  test('converts array in JSON to FormData', () => {
    const json = { tags: ['tag1', 'tag2'] };
    const formData = jsonToFormData(json);
    expect(formData.get('tags[0]')).toBe('tag1');
    expect(formData.get('tags[1]')).toBe('tag2');
  });
});
