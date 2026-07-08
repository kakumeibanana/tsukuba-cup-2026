-- オウンゴール記録用のフラグを追加。
-- own_goal=true の行は team_name=得点が入った側(利益を受けたチーム)、
-- player_name=相手チームでオウンゴールを決めてしまった選手、を意味する。
ALTER TABLE goals ADD COLUMN IF NOT EXISTS own_goal boolean NOT NULL DEFAULT false;
