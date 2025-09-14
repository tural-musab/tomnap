-- Otomatik profil oluşturma ve mevcut kullanıcılar için backfill

-- Yeni kullanıcı insert edildiğinde profiles tablosuna otomatik kayıt aç
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'user_name'), split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data ->> 'full_name'), new.email),
    (new.raw_user_meta_data ->> 'avatar_url')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Mevcut auth.users kayıtları için geriye dönük doldurma
insert into public.profiles (id, username, full_name, avatar_url)
select u.id,
       coalesce((u.raw_user_meta_data ->> 'user_name'), split_part(u.email, '@', 1)) as username,
       coalesce((u.raw_user_meta_data ->> 'full_name'), u.email) as full_name,
       (u.raw_user_meta_data ->> 'avatar_url') as avatar_url
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;


