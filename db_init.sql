drop database if exists urbantech_2024;
create database urbantech_2024;
use urbantech_2024;

drop table if exists users;
create table users (
    id int auto_increment primary key,
    name varchar(200),
    username varchar(200),
    password varchar(200),
    role enum('admin', 'user', 'manager', 'employee') default 'user',
    active boolean default true,
    updated_dt datetime default current_timestamp on update current_timestamp,
    created_dt datetime default current_timestamp,
    unique (username)
);

insert into users (name, username, password, role) value ('admin', 'admin', md5('z4g^LdVr8s&c:A9fG3kL1mNpQrS7tUvWzYx8J6oVb'), 'admin');
insert into users (name, username, password, role) value ('manager#1', 'manager#1', md5('KA5HtF=s2TZC:A9fG3kL1mNpQrS7tUvWzYx8J6oVb'), 'manager');
insert into users (name, username, password, role) value ('manager#2', 'manager#2', md5('E^rm#QEVcu6T:A9fG3kL1mNpQrS7tUvWzYx8J6oVb'), 'manager');

