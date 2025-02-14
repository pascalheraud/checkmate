--liquibase formatted sql

--changeset liquibase:1
CREATE TABLE checkmate.template (id bigserial primary key not null);
alter table template add column name text not null;

CREATE TABLE checkmate.template_group (id bigserial primary key not null);
alter table template_group add column name text not null;
alter table template_group add column template_id bigint not null references template(id);

CREATE TABLE checkmate.template_item (id bigserial primary key not null);
alter table template_item add column template_group_id bigint not null references template_group(id);
alter table template_item add column name text not null;

--changeset liquibase:2
create type checklist_status as enum ('OK', 'KO', 'N/A');
CREATE TABLE checkmate.checklist (id bigserial primary key not null);
alter table checklist add column template_id bigint not null references template(id);

CREATE TABLE checkmate.checklist_group (id bigserial primary key not null);
alter table checklist_group add column checklist_id bigint not null references checklist(id);
alter table checklist_group add column template_group_id bigint not null references template_group(id);
alter table checklist_group add column status checklist_status not null;

CREATE TABLE checkmate.checklist_item (id bigserial primary key not null);
alter table checklist_item add column checklist_group_id bigint not null references checklist_group(id);
alter table checklist_item add column template_item_id bigint not null references template_item(id);
alter table checklist_item add column status checklist_status not null;

--changeset liquibase:3
alter table checklist add column name text not null;

--changeset liquibase:4
alter table checklist add column status checklist_status not null;
