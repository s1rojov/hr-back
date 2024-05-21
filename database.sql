create table organization(
    id bigserial not null primary key, 
    fullname varchar(255) not null, 
    shortname varchar(255),
    description text
)


-- facultet
create table faculty(
    id bigserial not null primary key, 
    fullname varchar(255) not null, 
    shortname varchar(255),
    org_id bigint references organization(id)
)


-- kafedra
create table directory( 
    id bigserial not null primary key, 
    fullname varchar(255) not null, 
    shortname varchar(255),
    faculty_id bigint references faculty(id)
)

create table employee_type(
    id bigserial not null primary key, 
    name varchar(255) not null,
    count integer not null,
    directory_id bigint references directory(id)
)

--ozgaryapti db dan yangilash kk

create table employee(
    id bigserial not null primary key, 
    fullname varchar(255) not null,
    type_id bigint references employee_type(id),
    is_teacher boolean not null,
    is_leadership boolean not null,
    directory_id bigint references directory(id)
)

create table admin(
    id bigserial not null primary key, 
    fullname varchar(255) not null,
    login varchar(50) not null,
    password varchar(50) not null,
    org_id bigint references organization(id)
)