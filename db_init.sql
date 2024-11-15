-- drop and create the database
drop database if exists urbantech_2024;
create database urbantech_2024;
use urbantech_2024;

#################### users ####################

-- drop and create the 'users' table
drop table if exists users;
create table users (
    id int auto_increment primary key,
    username varchar(200) unique,
    password varchar(200),
    active boolean default true,
    updated_dt datetime default current_timestamp on update current_timestamp,
    created_dt datetime default current_timestamp
);

-- insert initial data into 'users' table
insert into users (username, password)
values ('admin', md5('admin:l4igwsjdga')),
       ('manager#1', md5('manager:l4igwsjdga')),
       ('manager#2', md5('manager:l4igwsjdga'));

-- drop and create the 'branches' table
drop table if exists branches;
create table branches (
    id int auto_increment primary key,
    branch_name varchar(200),
    branch_description varchar(200),
    active boolean default true,
    updated_dt datetime default current_timestamp on update current_timestamp,
    created_dt datetime default current_timestamp
);

insert into branches (branch_name, branch_description)
values ('main department', 'root');

-- drop and create the 'employees' table
drop table if exists employees;
create table employees (
    id int auto_increment primary key,
    user_id int,
    branch_id int,
    full_name varchar(200),
    phone_no varchar(100),
    profession varchar(100),
    role enum('admin','manager', 'employee') default 'employee',
    active boolean default true,
    updated_dt datetime default current_timestamp on update current_timestamp,
    created_dt datetime default current_timestamp,
    constraint fk_branch_employee foreign key (branch_id) references branches(id) on delete cascade,
    constraint fk_user_branch foreign key (user_id) references users(id) on delete cascade
);

-- insert initial data into 'employees' table
insert into employees (user_id, branch_id, full_name, phone_no, profession, role)
values (1, 1, 'admin', '0001', 'management', 'admin');

-- drop and create the 'timesheets' table
drop table if exists timesheets;
create table timesheets (
    id int auto_increment primary key,
    employee_id int not null,
    date_worked date not null,
    hours_worked decimal(5,2),
    start_time time,
    end_time time,
    active boolean default true,
    updated_dt datetime default current_timestamp on update current_timestamp,
    created_dt datetime default current_timestamp,
    constraint fk_timesheet_employee foreign key (employee_id) references employees(id) on delete cascade
);

select current_date()


select * from timesheets ;


#################### view ####################
create view vw_users as (
    select u.*, e.role, e.branch_id, e.id as employee_id
    from users u
    inner join employees e on u.id = e.user_id
);

select * from vw_users;


#################### proc ####################
