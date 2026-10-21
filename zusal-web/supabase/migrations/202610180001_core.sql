-- Public reads are tenant scoped. All entitlement writes are service-only.
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '' check (length(display_name)<=80),
 trial_started_at timestamptz, trial_ends_at timestamptz,
 trial_kind text check(trial_kind in ('launch','standard')),
 subscription_status text, current_period_end timestamptz,
 cancel_at_period_end boolean not null default false, renewal_failed_at timestamptz,
 paddle_customer_id text unique, paddle_subscription_id text unique,
 billing_event_at timestamptz,
 created_at timestamptz not null default now()
);
create function public.create_profile() returns trigger language plpgsql security definer set search_path='' as $$
begin insert into public.profiles(id) values(new.id); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.create_profile();
create table public.model_requests (
 account_id uuid not null references public.profiles(id) on delete cascade,
 id text not null check(length(id) between 1 and 160), occurred_at timestamptz not null,
 model text not null, provider text not null, ingested_at timestamptz not null default now(),
 status text not null check(status in ('successful','failed','canceled')),
 input_tokens bigint check(input_tokens>=0), output_tokens bigint check(output_tokens>=0),
 estimated_cost_usd numeric check(estimated_cost_usd>=0), routing_reason text,
 routing_ms bigint check(routing_ms>=0), response_ms bigint check(response_ms>=0),
 primary key(account_id,id)
);
create index model_requests_time on public.model_requests(account_id,occurred_at desc);
create table public.daily_usage (
 account_id uuid not null references public.profiles(id) on delete cascade,
 day date not null, requests bigint not null default 0, tokens bigint not null default 0,
 estimated_cost_usd numeric, missing_tokens bigint not null default 0, missing_cost bigint not null default 0,
 model_counts jsonb not null default '{}', primary key(account_id,day)
);
create table public.devices (
 id uuid primary key default gen_random_uuid(), account_id uuid not null references public.profiles(id) on delete cascade,
 name text not null check(length(name) between 1 and 80), token_hash text not null unique,
 created_at timestamptz not null default now(), last_seen_at timestamptz, revoked_at timestamptz
);
create index devices_account on public.devices(account_id);
create table public.pairings (
 device_hash text primary key, user_code text not null unique, name text not null,
 expires_at timestamptz not null, approved_by uuid references public.profiles(id) on delete cascade,
 consumed_at timestamptz, created_at timestamptz not null default now()
);
create table public.launch_counter (id boolean primary key default true check(id), activations bigint not null default 0);
insert into public.launch_counter(id) values(true);
-- Retain replay markers through the accepted reporting window, separately from visible history.
create table public.usage_receipts (
 account_id uuid references public.profiles(id) on delete cascade,
 request_id text, accepted_at timestamptz not null default now(), primary key(account_id,request_id)
);
create table public.checkout_intents (
 transaction_id text primary key, account_id uuid not null references public.profiles(id) on delete cascade,
 price_id text not null, created_at timestamptz not null default now()
);
create table public.billing_events(event_id text primary key, occurred_at timestamptz not null, received_at timestamptz not null default now());
create table public.rate_limits(bucket text primary key, count integer not null, resets_at timestamptz not null);

alter table public.profiles enable row level security;
alter table public.model_requests enable row level security;
alter table public.daily_usage enable row level security;
alter table public.devices enable row level security;
alter table public.pairings enable row level security;
alter table public.launch_counter enable row level security;
alter table public.usage_receipts enable row level security;
alter table public.checkout_intents enable row level security;
alter table public.billing_events enable row level security;
alter table public.rate_limits enable row level security;
create policy own_profile on public.profiles for select to authenticated using(id=(select auth.uid()));
create policy edit_profile on public.profiles for update to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
create policy own_requests on public.model_requests for select to authenticated using(account_id=(select auth.uid()) and occurred_at>=now()-interval '30 days');
create policy own_daily on public.daily_usage for select to authenticated using(account_id=(select auth.uid()) and day>=(now()-interval '12 months')::date);
create policy own_devices on public.devices for select to authenticated using(account_id=(select auth.uid()));
create policy revoke_devices on public.devices for update to authenticated using(account_id=(select auth.uid()) and revoked_at is null) with check(account_id=(select auth.uid()) and revoked_at is not null);
revoke all on public.profiles,public.model_requests,public.daily_usage,public.devices,public.pairings,public.launch_counter,public.usage_receipts,public.checkout_intents,public.billing_events,public.rate_limits from anon,authenticated;
grant select on public.profiles,public.model_requests,public.daily_usage to authenticated;
grant update(display_name) on public.profiles to authenticated;
grant select(id,account_id,name,created_at,last_seen_at,revoked_at),update(revoked_at) on public.devices to authenticated;
grant all on public.profiles,public.model_requests,public.daily_usage,public.devices,public.pairings,public.launch_counter,public.usage_receipts,public.checkout_intents,public.billing_events,public.rate_limits to service_role;

create function public.take_rate(p_bucket text,p_limit integer,p_seconds integer) returns boolean
language plpgsql security definer set search_path='' as $$
declare n integer;
begin
 insert into public.rate_limits as r(bucket,count,resets_at) values(p_bucket,1,now()+make_interval(secs=>p_seconds))
 on conflict(bucket) do update set count=case when r.resets_at<=now() then 1 else r.count+1 end,
 resets_at=case when r.resets_at<=now() then now()+make_interval(secs=>p_seconds) else r.resets_at end returning count into n;
 return n<=p_limit;
end $$;

create function public.accept_usage(p_account uuid,p_device uuid,p_event jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare a public.profiles; n bigint; stamp timestamptz; d date; tokens bigint; cost numeric; inserted integer;
begin
 select * into a from public.profiles where id=p_account for update;
 if not found then raise exception 'Account unavailable'; end if;
 if not exists(select 1 from public.devices where id=p_device and account_id=p_account and revoked_at is null) then raise exception 'Device unavailable'; end if;
 stamp=(p_event->>'occurred_at')::timestamptz;
 if stamp<now()-interval '24 hours' or stamp>now()+interval '5 minutes' then raise exception 'Reporting timestamp outside allowed window'; end if;
 insert into public.usage_receipts(account_id,request_id) values(p_account,p_event->>'id') on conflict do nothing;
 get diagnostics inserted=row_count;
 if inserted=0 then return jsonb_build_object('duplicate',true); end if;
 -- Trial is based on first server-accepted successful completion; account row and counter serialize grants.
 if a.trial_started_at is null and a.subscription_status is null and p_event->>'status'='successful' then
  update public.launch_counter set activations=activations+1 where id=true returning activations into n;
  update public.profiles set trial_started_at=now(),trial_ends_at=now()+case when n<=1000 then interval '30 days' else interval '14 days' end,
  trial_kind=case when n<=1000 then 'launch' else 'standard' end where id=p_account;
 end if;
 insert into public.model_requests(account_id,id,occurred_at,model,provider,status,input_tokens,output_tokens,estimated_cost_usd,routing_reason,routing_ms,response_ms)
 values(p_account,p_event->>'id',stamp,p_event->>'model',p_event->>'provider',p_event->>'status',(p_event->>'input_tokens')::bigint,(p_event->>'output_tokens')::bigint,(p_event->>'estimated_cost_usd')::numeric,p_event->>'routing_reason',(p_event->>'routing_ms')::bigint,(p_event->>'response_ms')::bigint);
 d=(stamp at time zone 'UTC')::date;
 tokens=coalesce((p_event->>'input_tokens')::bigint,0)+coalesce((p_event->>'output_tokens')::bigint,0);
 cost=(p_event->>'estimated_cost_usd')::numeric;
 insert into public.daily_usage as u(account_id,day,requests,tokens,estimated_cost_usd,missing_tokens,missing_cost,model_counts)
 values(p_account,d,1,tokens,cost,case when p_event->>'input_tokens' is null or p_event->>'output_tokens' is null then 1 else 0 end,case when cost is null then 1 else 0 end,jsonb_build_object(p_event->>'model',1))
 on conflict(account_id,day) do update set requests=u.requests+1,tokens=u.tokens+excluded.tokens,
 estimated_cost_usd=case when u.estimated_cost_usd is null and excluded.estimated_cost_usd is null then null else coalesce(u.estimated_cost_usd,0)+coalesce(excluded.estimated_cost_usd,0) end,
 missing_tokens=u.missing_tokens+excluded.missing_tokens,missing_cost=u.missing_cost+excluded.missing_cost,
 model_counts=jsonb_set(u.model_counts,array[p_event->>'model'],to_jsonb(coalesce((u.model_counts->>(p_event->>'model'))::bigint,0)+1));
 update public.devices set last_seen_at=now() where id=p_device;
 return jsonb_build_object('accepted',true);
end $$;

create function public.consume_pair(p_hash text,p_token_hash text) returns uuid
language plpgsql security definer set search_path='' as $$
declare p public.pairings; device_id uuid;
begin
 select * into p from public.pairings where device_hash=p_hash for update;
 if not found or p.expires_at<=now() or p.consumed_at is not null or p.approved_by is null then return null; end if;
 insert into public.devices(account_id,name,token_hash) values(p.approved_by,p.name,p_token_hash) returning id into device_id;
 update public.pairings set consumed_at=now() where device_hash=p_hash;
 return device_id;
end $$;

create function public.prune_usage() returns void language plpgsql security definer set search_path='' as $$
begin
 delete from public.model_requests where occurred_at<now()-interval '30 days';
 delete from public.daily_usage where day<(now()-interval '12 months')::date;
 delete from public.usage_receipts where accepted_at<now()-interval '31 days';
 delete from public.pairings where expires_at<now()-interval '1 day';
 delete from public.rate_limits where resets_at<now()-interval '1 day';
 delete from public.checkout_intents where created_at<now()-interval '30 days';
 delete from public.billing_events where received_at<now()-interval '90 days';
end $$;
revoke all on function public.create_profile(),public.take_rate(text,integer,integer),public.accept_usage(uuid,uuid,jsonb),public.consume_pair(text,text),public.prune_usage() from public,anon,authenticated;
grant execute on function public.take_rate(text,integer,integer),public.accept_usage(uuid,uuid,jsonb),public.consume_pair(text,text),public.prune_usage() to service_role;

create function public.apply_billing(p_account uuid,p_event text,p_at timestamptz,p_subscription text,p_status text,p_end timestamptz,p_cancel boolean) returns void
language plpgsql security definer set search_path='' as $$
declare a public.profiles; inserted integer;
begin
 select * into a from public.profiles where id=p_account for update;
 if not found then raise exception 'Account unavailable'; end if;
 insert into public.billing_events(event_id,occurred_at) values(p_event,p_at) on conflict do nothing;
 get diagnostics inserted=row_count;
 if inserted=0 or (a.billing_event_at is not null and a.billing_event_at>p_at) then return; end if;
 update public.profiles set paddle_subscription_id=p_subscription,subscription_status=p_status,current_period_end=p_end,cancel_at_period_end=p_cancel,billing_event_at=p_at,
 renewal_failed_at=case when p_status='past_due' then coalesce(a.renewal_failed_at,p_at) else null end where id=p_account;
end $$;
revoke all on function public.apply_billing(uuid,text,timestamptz,text,text,timestamptz,boolean) from public,anon,authenticated;
grant execute on function public.apply_billing(uuid,text,timestamptz,text,text,timestamptz,boolean) to service_role;

create table public.trial_emails(
 account_id uuid references public.profiles(id) on delete cascade,
 kind text check(kind in ('ending','expired')), trial_end timestamptz not null,
 leased_until timestamptz, sent_at timestamptz, primary key(account_id,kind,trial_end)
);
alter table public.trial_emails enable row level security;
revoke all on public.trial_emails from anon,authenticated;
grant all on public.trial_emails to service_role;
create function public.claim_trial_email() returns table(account_id uuid,kind text,trial_end timestamptz)
language plpgsql security definer set search_path='' as $$
begin
 insert into public.trial_emails(account_id,kind,trial_end)
 select id,case when trial_ends_at<=now() then 'expired' else 'ending' end,trial_ends_at from public.profiles
 where trial_ends_at between now()-interval '1 day' and now()+interval '3 days' and coalesce(subscription_status,'') not in ('active','past_due','trialing') on conflict do nothing;
 return query with picked as (
 select e.account_id,e.kind,e.trial_end from public.trial_emails e join public.profiles p on p.id=e.account_id
 where e.sent_at is null and (e.leased_until is null or e.leased_until<now()) and p.trial_ends_at=e.trial_end
 and coalesce(p.subscription_status,'') not in ('active','past_due','trialing')
 and ((e.kind='ending' and e.trial_end>now()) or (e.kind='expired' and e.trial_end<=now()))
 order by e.trial_end limit 1 for update of e skip locked
 ) update public.trial_emails e set leased_until=now()+interval '10 minutes' from picked t
 where e.account_id=t.account_id and e.kind=t.kind and e.trial_end=t.trial_end returning e.account_id,e.kind,e.trial_end;
end $$;
revoke all on function public.claim_trial_email() from public,anon,authenticated;
grant execute on function public.claim_trial_email() to service_role;
insert into public.profiles(id) select id from auth.users on conflict do nothing;

create table public.site_totals(day date not null,event text not null,page text not null,total bigint not null default 0,primary key(day,event,page));
alter table public.site_totals enable row level security;
revoke all on public.site_totals from anon,authenticated;
grant all on public.site_totals to service_role;
create function public.count_site_event(p_event text,p_page text) returns void language sql security definer set search_path='' as $$
 insert into public.site_totals as s(day,event,page,total) values((now() at time zone 'UTC')::date,p_event,p_page,1)
 on conflict(day,event,page) do update set total=s.total+1;
$$;
revoke all on function public.count_site_event(text,text) from public,anon,authenticated;
grant execute on function public.count_site_event(text,text) to service_role;
