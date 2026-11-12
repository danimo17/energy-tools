export interface Entity {
  id: string;
}

export type NewEntity<T extends Entity> = Omit<T, 'id'>;

export interface CrudState<T extends Entity> {
  items: T[];
  loading: boolean;
}
