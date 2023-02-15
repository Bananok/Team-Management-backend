export {};

declare global {
  namespace jest {
    interface Expect {
      // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
      toBeTypeOrNull(expected: any): any;
      // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
      toBeObjectContainingOrNull(expected: any): any;
      // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
      toBeArray(expected: any): any;
      // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
      toBeArrayOrNull(expected: any): any;
      // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
      toBeFloat(numDigits?: number): any;
      // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
      toBeFloatOrNull(numDigits?: number): any;
      // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
      toBeOneOf(items: any[]): any;
    }
  }
}
