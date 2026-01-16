-- Trigger to increment participation_score on check-in
create or replace function increment_participation_score()
returns trigger as $$
begin
  update public.profiles
  set participation_score = participation_score + 10
  where id = new.user_id;
  return new;
end;
$$ language plpgsql;

create trigger on_attendance_check_in
  after insert on attendance_logs
  for each row execute procedure increment_participation_score();

-- View for User Rankings
-- Score = participation_score + (manner_score * 2)
create or replace view user_rankings as
select
  p.id,
  p.nickname,
  p.avatar_url,
  (coalesce(p.participation_score, 0) + (coalesce(p.manner_score, 36.5) * 2)) as score,
  rank() over (order by (coalesce(p.participation_score, 0) + (coalesce(p.manner_score, 36.5) * 2)) desc) as rank
from profiles p;

-- View for Study Rankings
-- Score = Total Attendance * 10 (Simplified for now as "Activity Score")
create or replace view study_rankings as
select
  s.id,
  s.title,
  s.description,
  count(a.id) * 10 as score,
  rank() over (order by count(a.id) * 10 desc) as rank
from studies s
left join attendance_logs a on s.id = a.study_id
group by s.id;
