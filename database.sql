create table organization(
    id bigserial not null primary key, 
    fullname varchar(255) not null, 
    shortname varchar(255)
)