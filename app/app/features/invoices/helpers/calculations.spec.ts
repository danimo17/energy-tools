import { round2 } from '@app/helpers/math';
import { computeTax, computeTotal } from './calculations';

describe('calculations', () => {
  it('rounds to two decimals', () => {
    expect(round2(1.005)).toBe(1.01);
    expect(round2(718.3575)).toBe(718.36);
  });

  it('computes the tax as 21 % of the base', () => {
    expect(computeTax(1250)).toBe(262.5);
    expect(computeTax(3420.75)).toBe(718.36);
  });

  it('computes the total as base + tax', () => {
    expect(computeTotal(1250, 262.5)).toBe(1512.5);
  });
});
