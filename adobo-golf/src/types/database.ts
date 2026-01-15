export type Player = {
  id: number;
  created_at: string;
  name: string;
  ghin_no: string;
  handicap_index: number;
}

export type Series = {
  id: number;
  created_at: string;
  name: string;
  start_at: string;
  end_at: string;
}

export type Event = {
  id: number;
  created_at: string;
  name: string;
  course_name: string;
  start_at: string;
  end_at: string;
  series_id: number;
}

export type Result = {
  id: number;
  created_at: string;
  player_id: number;
  event_id: number;
  points: number;
}

export type Photo = {
  id: number;
  created_at: string;
  name: string;
  event_id: number;
  storage_bucket: string;
  storage_path: string;
}
