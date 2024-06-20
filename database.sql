create table leadership(
    id bigserial primary key,
    fullname varchar(255) not null,
    phone varchar(255) not null,
    position varchar(255) not null,
    address varchar(255) not null,
    birthday date not null,
    pass_information varchar(255) not null,
    experience text,
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
)

-- create table department_head(
--     id bigserial primary key,
--     fullname varchar(255) not null,
--     phone varchar(255) not null,
--     address varchar(255) not null,
--     birthday date not null,
--     pass_information varchar(255) not null,
--     experience text,
--     kafedra_id bigint references kafedra(id),
--     department_id bigint references department(id),
--     unique_code varchar(255) not null,
--     updated_at TIMESTAMP DEFAULT NOW(),
--     created_at TIMESTAMP DEFAULT NOW()
-- )


-- bo'linma
create table division(
    id bigserial primary key, 
    fullname varchar(255) not null, 
    shortname varchar(255),
)


-- kafedra 
create table kafedra( 
    id bigserial primary key, 
    fullname varchar(255) not null, 
    shortname varchar(255),
    division_id bigint references division(id)
)

create table department(
    id bigserial primary key, 
    fullname varchar(255) not null, 
    shortname varchar(255)
)

create table employee_type(
    id bigserial primary key, 
    name varchar(255) not null,
    count integer not null,
    kafedra_id bigint references kafedra(id),
    department_id bigint references department(id),
)   

create table employee(
    id bigserial primary key,
    fullname varchar(255) not null,
    phone varchar(255) not null,
    address varchar(255) not null,
    birthday date not null,
    pass_information varchar(255) not null,
    experience text,
    employee_type_id bigint references employee_type(id),
    shtat varchar(255) not null,
    unique_code varchar(255) not null,
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
)

create table admin(
    id bigserial primary key, 
    fullname varchar(255) not null,
    login varchar(50) not null,
    password varchar(50) not null,
)