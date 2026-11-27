-- Run in an approved Supabase project. No real records or passwords included.
begin;
create table if not exists public.qec_staff (
 user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.qec_kpi (
 id bigint generated always as identity primary key,
 indicator text not null, programme text not null,
 period_start date not null, period_end date not null check(period_end >= period_start),
 achievement numeric not null check(achievement between 0 and 100),
 target numeric not null check(target between 0 and 100),
 direction text not null check(direction in ('up','down')),
 source text not null, verified boolean not null default false
);
alter table public.qec_staff enable row level security;
alter table public.qec_kpi enable row level security;
revoke all on public.qec_staff, public.qec_kpi from anon, authenticated;
grant select on public.qec_staff, public.qec_kpi to authenticated;
create policy qec_own_membership on public.qec_staff for select to authenticated using (user_id = auth.uid());
create policy qec_staff_read_verified on public.qec_kpi for select to authenticated using (verified and exists(select 1 from public.qec_staff s where s.user_id = auth.uid()));
commit;
-- Create staff user in Auth dashboard, disable public signups, then add its UUID to qec_staff via SQL editor.
-- Insert approved aggregate KPI rows via administrator only. Never use service_role key in browser.
