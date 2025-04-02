
export type Direction = 'up' | 'down' | 'left' | 'right';
export type Color = 'blue' | 'red' | 'purple' | 'white';

export enum MegaverseObjectType {
  SPACE = 'space',
  POLYANET = 'polyanet',
  COMETH = 'cometh',
  SOLOON = 'soloon'
}

export abstract class MegaverseBase {
  readonly type: MegaverseObjectType;

  protected constructor(type: MegaverseObjectType) {
    this.type = type;
  }
}

export class Space extends MegaverseBase {
  readonly type: MegaverseObjectType.SPACE;

  constructor() {
    super(MegaverseObjectType.SPACE);
  }
}

export class Polyanet extends MegaverseBase {
  readonly type: MegaverseObjectType.POLYANET;

  constructor() {
    super(MegaverseObjectType.POLYANET);
  }
}

export class Cometh extends MegaverseBase {
  readonly type: MegaverseObjectType.COMETH;
  readonly direction: Direction;

  constructor(direction: Direction) {
    super(MegaverseObjectType.COMETH);
    this.direction = direction;
  }
}

export class Soloon extends MegaverseBase {
  readonly type: MegaverseObjectType.SOLOON;
  readonly color: Color;

  constructor(color: Color) {
    super(MegaverseObjectType.SOLOON);
    this.color = color;
  }
}

export type MegaverseObject = Space | Polyanet | Cometh | Soloon;
export type Megaverse = MegaverseObject[][];