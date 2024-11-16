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
values ('admin', md5('!12345:l4igwsjdga')),
       ('manager', md5('!12345:l4igwsjdga')),
       ('employee1', md5('!12345:l4igwsjdga')),
       ('employee2', md5('!12345:l4igwsjdga'));

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
values ('Main department', 'root'), ('IT Department', 'It''s example');;

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
values (1, 1, 'admin',    '+998995441550', 'Management System', 'admin'),
       (2, 2, 'Utkir.Kh',  '+998995441551', 'Management of IT', 'manager'),
       (3, 2, 'Nurbek.T', '+998995441552', 'Data Engineer', 'employee'),
       (4, 2, 'Jonibek.N', '+998995441553', 'Software Engineer', 'employee');

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

drop table if exists requests;
create table requests (
    id int auto_increment primary key,
    employee_id int not null,
    branch_id int not null,
    type varchar(100),
    comment varchar(100),
    status enum('reject', 'approve', 'wait', 'new') default 'new',
    active boolean default true,
    updated_dt datetime default current_timestamp on update current_timestamp,
    created_dt datetime default current_timestamp,
    constraint fk_requests_employee foreign key (employee_id) references employees(id) on delete cascade,
    constraint fk_requests_branches foreign key (branch_id) references branches(id) on delete cascade
);

#################### view ####################
drop view if exists vw_users;
create view vw_users as (
    select u.*, e.role, e.branch_id, e.id as employee_id
    from users u
    inner join employees e on u.id = e.user_id
);

select * from vw_users;

-- Pivot timesheet data for the last 5 days
drop view if exists vw_timesheets;
create view vw_timesheets as
WITH recent_dates AS (
    SELECT DISTINCT date_worked
    FROM timesheets
    WHERE date_worked >= CURDATE() - INTERVAL 5 DAY
    ORDER BY date_worked DESC
    LIMIT 5
),
pivot_data AS (
    SELECT
        employee_id,
        date_worked,
        MIN(start_time) as start_time,
        MAX(end_time) as end_time,
        SUM(hours_worked) AS hours_worked
    FROM timesheets
    WHERE date_worked >= CURDATE() - INTERVAL 5 DAY
    GROUP BY employee_id, date_worked
)
SELECT
    e.full_name,
    e.branch_id,
    p.employee_id,
    MAX(CASE WHEN p.date_worked = DATE_SUB(CURDATE(), INTERVAL -4 DAY) THEN concat( p.hours_worked) ELSE 0 END) AS `day1`,
    MAX(CASE WHEN p.date_worked = DATE_SUB(CURDATE(), INTERVAL -3 DAY) THEN concat( p.hours_worked) ELSE 0 END) AS `day2`,
    MAX(CASE WHEN p.date_worked = DATE_SUB(CURDATE(), INTERVAL -2 DAY) THEN concat(p.hours_worked) ELSE 0 END) AS `day3`,
    MAX(CASE WHEN p.date_worked = DATE_SUB(CURDATE(), INTERVAL -1 DAY) THEN concat( p.hours_worked) ELSE 0 END) AS `day4`,
    MAX(CASE WHEN p.date_worked = DATE_SUB(CURDATE(), INTERVAL 0 DAY) THEN concat(p.hours_worked) ELSE 0 END) AS `day5`
FROM pivot_data p
left join employees e on e.id = p.employee_id
GROUP BY e.full_name, e.branch_id, p.employee_id;


select * from vw_timesheets ;



#################### proc ####################
