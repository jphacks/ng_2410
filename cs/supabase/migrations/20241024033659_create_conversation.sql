create table "public"."conversation" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "item_id" character varying not null,
    "parent_item_id" character varying,
    "conversation_session_id" uuid not null,
    "role" character varying not null,
    "content" character varying not null,
    "test" smallint
);


alter table "public"."conversation" enable row level security;

create table "public"."conversation_session" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "name" character varying
);


alter table "public"."conversation_session" enable row level security;

CREATE UNIQUE INDEX conversation_pkey ON public.conversation USING btree (id);

CREATE UNIQUE INDEX conversation_session_pkey ON public.conversation_session USING btree (id);

alter table "public"."conversation" add constraint "conversation_pkey" PRIMARY KEY using index "conversation_pkey";

alter table "public"."conversation_session" add constraint "conversation_session_pkey" PRIMARY KEY using index "conversation_session_pkey";

alter table "public"."conversation" add constraint "conversation_conversation_session_id_fkey" FOREIGN KEY (conversation_session_id) REFERENCES conversation_session(id) ON DELETE CASCADE not valid;

alter table "public"."conversation" validate constraint "conversation_conversation_session_id_fkey";

alter table "public"."conversation_session" add constraint "conversation_session_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."conversation_session" validate constraint "conversation_session_user_id_fkey";

alter table "public"."conversation_session" add constraint "conversation_session_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."conversation_session" validate constraint "conversation_session_user_id_fkey1";

grant delete on table "public"."conversation" to "anon";

grant insert on table "public"."conversation" to "anon";

grant references on table "public"."conversation" to "anon";

grant select on table "public"."conversation" to "anon";

grant trigger on table "public"."conversation" to "anon";

grant truncate on table "public"."conversation" to "anon";

grant update on table "public"."conversation" to "anon";

grant delete on table "public"."conversation" to "authenticated";

grant insert on table "public"."conversation" to "authenticated";

grant references on table "public"."conversation" to "authenticated";

grant select on table "public"."conversation" to "authenticated";

grant trigger on table "public"."conversation" to "authenticated";

grant truncate on table "public"."conversation" to "authenticated";

grant update on table "public"."conversation" to "authenticated";

grant delete on table "public"."conversation" to "service_role";

grant insert on table "public"."conversation" to "service_role";

grant references on table "public"."conversation" to "service_role";

grant select on table "public"."conversation" to "service_role";

grant trigger on table "public"."conversation" to "service_role";

grant truncate on table "public"."conversation" to "service_role";

grant update on table "public"."conversation" to "service_role";

grant delete on table "public"."conversation_session" to "anon";

grant insert on table "public"."conversation_session" to "anon";

grant references on table "public"."conversation_session" to "anon";

grant select on table "public"."conversation_session" to "anon";

grant trigger on table "public"."conversation_session" to "anon";

grant truncate on table "public"."conversation_session" to "anon";

grant update on table "public"."conversation_session" to "anon";

grant delete on table "public"."conversation_session" to "authenticated";

grant insert on table "public"."conversation_session" to "authenticated";

grant references on table "public"."conversation_session" to "authenticated";

grant select on table "public"."conversation_session" to "authenticated";

grant trigger on table "public"."conversation_session" to "authenticated";

grant truncate on table "public"."conversation_session" to "authenticated";

grant update on table "public"."conversation_session" to "authenticated";

grant delete on table "public"."conversation_session" to "service_role";

grant insert on table "public"."conversation_session" to "service_role";

grant references on table "public"."conversation_session" to "service_role";

grant select on table "public"."conversation_session" to "service_role";

grant trigger on table "public"."conversation_session" to "service_role";

grant truncate on table "public"."conversation_session" to "service_role";

grant update on table "public"."conversation_session" to "service_role";


