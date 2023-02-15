expect.extend({
  toBeTypeOrNull(received, expected) {
    if (received === null) {
      return {
        message: () => 'Ok',
        pass: true,
      };
    }

    try {
      expect(received).toEqual(expect.any(expected));

      return {
        message: () => 'Ok',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => `expected ${received} to be ${expected} type or null`,
        pass: false,
      };
    }
  },

  toBeObjectContainingOrNull(received, expected) {
    if (received === null) {
      return {
        message: () => 'Ok',
        pass: true,
      };
    }

    try {
      expect(received).toEqual(expect.objectContaining(expected));

      return {
        message: () => 'Ok',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => `expected ${received} to be ${expected} type or null`,
        pass: false,
      };
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toBeArray(received: any[], expected: any) {
    try {
      received.forEach((item) => {
        expect(item).toEqual(expected);
      });

      return {
        message: () => 'Ok',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => `expected ${received} to be ${expected} type`,
        pass: false,
      };
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toBeArrayOrNull(received: any[], expected: any) {
    if (received === null) {
      return {
        message: () => 'Ok',
        pass: true,
      };
    }

    try {
      received.forEach((item) => {
        expect(item).toEqual(expected);
      });

      return {
        message: () => 'Ok',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => `expected ${received} to be ${expected} type or null`,
        pass: false,
      };
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toBeFloat(received: any, numDigits?: number) {
    try {
      expect(received).toBeCloseTo(received, numDigits);

      return {
        message: () => 'Ok',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => `expected ${received} to be float type`,
        pass: false,
      };
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toBeFloatOrNull(received: any, numDigits?: number) {
    if (received === null) {
      return {
        message: () => 'Ok',
        pass: true,
      };
    }

    try {
      expect(received).toBeCloseTo(received, numDigits);

      return {
        message: () => 'Ok',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => `expected ${received} to be float type or null`,
        pass: false,
      };
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toBeOneOf(received: any, items: Array<any>) {
    const pass = items.includes(received);

    if (pass) {
      return {
        message: () => 'Ok',
        pass: true,
      };
    }

    return {
      message: () => `expected ${received} to be contained in array [${items}]`,
      pass: false,
    };
  },
});
