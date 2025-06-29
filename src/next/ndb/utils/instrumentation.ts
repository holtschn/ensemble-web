/**
 * Instrumentation utility functions for Notendatenbank (NDB)
 * Handles brass quintet instrumentation parsing and calculations
 */

export interface Instrumentation {
  renderValue(): string;
  numTrumpets(): number;
  withTrumpets(newValue: number): Instrumentation;
  numHorns(): number;
  withHorns(newValue: number): Instrumentation;
  numTrombones(): number;
  withTrombones(newValue: number): Instrumentation;
  numEuphoniums(): number;
  withEuphoniums(newValue: number): Instrumentation;
  numTubas(): number;
  withTubas(newValue: number): Instrumentation;
  numTotal(): number;
}

class InstrumentationImpl implements Instrumentation {
  private readonly trpt: number;
  private readonly horn: number;
  private readonly trbn: number;
  private readonly euph: number;
  private readonly tuba: number;

  constructor(
    trpt: number,
    horn: number,
    trbn: number,
    euph: number,
    tuba: number
  ) {
    this.trpt = Math.abs(trpt) % 10;
    this.horn = Math.abs(horn) % 10;
    this.trbn = Math.abs(trbn) % 10;
    this.euph = Math.abs(euph) % 10;
    this.tuba = Math.abs(tuba) % 10;
  }

  renderValue(): string {
    return (
      `${this.trpt}` +
      `${this.horn}` +
      `${this.trbn}` +
      `${this.euph}` +
      `${this.tuba}`
    );
  }

  numTrumpets(): number {
    return this.trpt;
  }

  withTrumpets(newValue: number): Instrumentation {
    return new InstrumentationImpl(
      newValue,
      this.horn,
      this.trbn,
      this.euph,
      this.tuba
    );
  }

  numHorns(): number {
    return this.horn;
  }

  withHorns(newValue: number): Instrumentation {
    return new InstrumentationImpl(
      this.trpt,
      newValue,
      this.trbn,
      this.euph,
      this.tuba
    );
  }

  numTrombones(): number {
    return this.trbn;
  }

  withTrombones(newValue: number): Instrumentation {
    return new InstrumentationImpl(
      this.trpt,
      this.horn,
      newValue,
      this.euph,
      this.tuba
    );
  }

  numEuphoniums(): number {
    return this.euph;
  }

  withEuphoniums(newValue: number): Instrumentation {
    return new InstrumentationImpl(
      this.trpt,
      this.horn,
      this.trbn,
      newValue,
      this.tuba
    );
  }

  numTubas(): number {
    return this.tuba;
  }

  withTubas(newValue: number): Instrumentation {
    return new InstrumentationImpl(
      this.trpt,
      this.horn,
      this.trbn,
      this.euph,
      newValue
    );
  }

  numTotal(): number {
    return this.trpt + this.horn + this.trbn + this.euph + this.tuba;
  }
}

/**
 * Converts a string representation of instrumentation to an Instrumentation object
 *
 * @param values - String in format "THTEU" where:
 *   T = Trumpets, H = Horns, T = Trombones, E = Euphoniums, U = Tubas
 * @returns Instrumentation object
 */
export const toInstrumentation = (values: string): Instrumentation => {
  const trpt = Number(values?.[0] ?? '0');
  const horn = Number(values?.[1] ?? '0');
  const trbn = Number(values?.[2] ?? '0');
  const euph = Number(values?.[3] ?? '0');
  const tuba = Number(values?.[4] ?? '0');
  return new InstrumentationImpl(trpt, horn, trbn, euph, tuba);
};

/**
 * Creates a default instrumentation (4-2-4-0-1 brass quintet)
 */
export const createDefaultInstrumentation = (): Instrumentation => {
  return new InstrumentationImpl(4, 2, 4, 0, 1);
};
