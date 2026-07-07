-- 決勝トーナメントの勝者反映をDBトリガー化。
-- これまでは src/lib/seedTournament.js の propagateWinner()
-- （管理画面の保存ボタン経由のみ）でしか次ラウンドに勝者が反映されず、
-- Supabaseへの直接SQL更新では反映が漏れ、手動コピーのミスで
-- 準決勝に誤ったチームが表示される事故が起きた。
-- reseed_tournament と同じ「文レベルトリガー・冪等再計算」方式で、
-- 保存経路によらず自動的に正しく伝播するようにする。

CREATE OR REPLACE FUNCTION public.propagate_tournament_winner()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  mapping record;
  src matches%ROWTYPE;
  winner text;
BEGIN
  -- 自分の UPDATE による再帰発火を防ぐ（reseed_tournament と同じ方式）
  IF pg_trigger_depth() > 1 THEN RETURN NULL; END IF;

  FOR mapping IN
    SELECT * FROM (VALUES
      ('M23','M29','home_team'), -- QF①勝者 → SF①ホーム
      ('M24','M29','away_team'), -- QF②勝者 → SF①アウェイ
      ('M25','M30','home_team'), -- QF③勝者 → SF②ホーム
      ('M26','M30','away_team'), -- QF④勝者 → SF②アウェイ
      ('M29','M34','home_team'), -- SF①勝者 → 男子決勝ホーム
      ('M30','M34','away_team'), -- SF②勝者 → 男子決勝アウェイ
      ('M32','M33','away_team')  -- 女子SF勝者 → 女子決勝アウェイ
    ) AS t(src_id, next_id, next_slot)
  LOOP
    SELECT * INTO src FROM matches WHERE id = mapping.src_id;
    IF NOT FOUND OR src.status <> 'completed' THEN CONTINUE; END IF;

    IF src.home_score > src.away_score THEN winner := src.home_team;
    ELSIF src.away_score > src.home_score THEN winner := src.away_team;
    ELSE winner := src.pk_winner;
    END IF;

    IF winner IS NULL THEN CONTINUE; END IF;

    IF mapping.next_slot = 'home_team' THEN
      UPDATE matches SET home_team = winner WHERE id = mapping.next_id AND home_team IS DISTINCT FROM winner;
    ELSE
      UPDATE matches SET away_team = winner WHERE id = mapping.next_id AND away_team IS DISTINCT FROM winner;
    END IF;
  END LOOP;

  RETURN NULL;
END;
$function$;

DROP TRIGGER IF EXISTS trg_propagate_tournament_winner ON matches;
CREATE TRIGGER trg_propagate_tournament_winner
AFTER INSERT OR UPDATE ON matches
FOR EACH STATEMENT
EXECUTE FUNCTION propagate_tournament_winner();
