-- Hace cumplir en la base de datos el flujo de estados del tracker
-- y exige evidencia para marcar un compromiso como completado.

create or replace function public.enforce_commitment_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    if not (
      (old.status = 'pendiente'   and new.status in ('en_progreso', 'bloqueado', 'cancelado')) or
      (old.status = 'en_progreso' and new.status in ('bloqueado', 'completado', 'cancelado')) or
      (old.status = 'bloqueado'   and new.status in ('en_progreso', 'cancelado'))
    ) then
      raise exception 'No se puede pasar de % a %.', old.status, new.status
        using errcode = 'check_violation';
    end if;

    if new.status = 'completado' and char_length(coalesce(trim(new.evidence), '')) < 5 then
      raise exception 'Para completar un compromiso hay que registrar la evidencia.'
        using errcode = 'check_violation';
    end if;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists commitments_enforce_status on public.commitments;

create trigger commitments_enforce_status
  before update on public.commitments
  for each row execute function public.enforce_commitment_status();
