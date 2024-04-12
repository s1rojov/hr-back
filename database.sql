create table organization(
    id bigserial not null primary key, 
    fullname varchar(255) not null, 
    shortname varchar(255)
)

create table part(
    id bigserial not null primary key, 
    fullname varchar(255) not null, 
    shortname varchar(255)
    org_id bigint references organization(id)
)

create table section(
    id bigserial not null primary key, 
    fullname varchar(255) not null, 
    shortname varchar(255)
    part_id bigint references part(id)
)

create table employee_type(
    id bigserial not null primary key, 
    name varchar(255) not null,
    count integer not null,
    section_id bigint references section(id)
)

create table employee(
    id bigserial not null primary key, 
    fullname varchar(255) not null,
    type_id bigint references employee_type(id),
    section_id bigint references section(id)
)

create table admin(
    id bigserial not null primary key, 
    fullname varchar(255) not null,
    login varchar(50) not null,
    password varchar(50) not null,
    org_id bigint references organization(id)
)