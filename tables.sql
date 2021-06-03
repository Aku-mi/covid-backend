CREATE TABLE users(
	id UUID NOT NULL PRIMARY KEY,
	name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	dni BIGINT NOT NULL,
	user_name TEXT NOT NULL,
	password TEXT NOT NULL,
	role UUID REFERENCES roles (id),
	token_version BIGINT NOT NULL,
	UNIQUE(dni),
	UNIQUE(user_name)
);

CREATE TABLE roles(
	id UUID NOT NULL PRIMARY KEY,
	name TEXT NOT NULL
);

CREATE TABLE cases(
	id UUID NOT NULL PRIMARY KEY,
	name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	dni BIGINT NOT NULL,
	sex TEXT NOT NULL,
	birth_date BIGINT NOT NULL,
	home_address TEXT NOT NULL,
	job_address TEXT NOT NULL,
	test_result BOOLEAN NOT NULL,
	test_date BIGINT NOT NULL,
	UNIQUE(dni)
);

CREATE TABLE case_history(
	id UUID NOT NULL PRIMARY KEY,
	state TEXT NOT NULL,
	update_date BIGINT NOT NULL,
	case_id UUID REFERENCES cases (id)
);