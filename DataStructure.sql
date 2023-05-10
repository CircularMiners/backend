CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE mineral (
	mineral_chemical_formula VARCHAR(200) not NULL PRIMARY KEY,
	--one of below columns should be mandatory, but as one only that mandatory the not null criteria should be added on FE instead of DB structure
	mineral_chemical_name VARCHAR(500),
	mineral_name VARCHAR(500)
);

CREATE TABLE minerepresentative (
	mine_representative_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	mine_representative_name VARCHAR(150) not null,
	mine_representative_email VARCHAR(500) not null,
	mine_representative_password VARCHAR not null,
	mine_representative_company_name VARCHAR(200) not null,
	mine_representative_usertype VARCHAR(30) not null,
	mine_representative_phonenumber VARCHAR(20) not null
);

CREATE TABLE datarequestor (
	datarequestor_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	datarequestor_name VARCHAR(150) not null,
	datarequestor_email VARCHAR(500) not null,
	datarequestor_password VARCHAR not null,
	datarequestor_company_name VARCHAR(200) not null,
	datarequestor_usertype VARCHAR(30) not null
);

CREATE TABLE mine (
	mine_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	mine_name VARCHAR not null,
	mine_location VARCHAR(250) not null,
	mine_description TEXT,
	mine_representative_id UUID REFERENCES minerepresentative(mine_representative_id) not NULL
);

CREATE TABLE sidestream (
	sidestream_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	sidestream_createtime TIMESTAMP not null,
	sidestream_orename VARCHAR(200),
	sidestream_weight NUMERIC,
	sidestream_size NUMERIC,
	mine_representative_id UUID REFERENCES minerepresentative(mine_representative_id),
	sidestream_description VARCHAR(250) not null
	mine_id UUID REFERENCES mine(mine_id) not null
);


CREATE TABLE mineralcomposition (
	mineral_composition_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	mineral_composition_name VARCHAR(250) not null,
	mineral_chemical_formula VARCHAR(200) REFERENCES mineral(mineral_chemical_formula),
	sidestream_id UUID REFERENCES sidestream(sidestream_id),
	mineral_composition_percentage NUMERIC(6,3) not null --percentage with 3 decimal point
);

CREATE TABLE requestaccess (
	request_access_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	request_access_message TEXT,
	request_access_datetime TIMESTAMP not null,
	sidestream_id UUID REFERENCES sidestream(sidestream_id),
	mine_representative_id UUID REFERENCES minerepresentative(mine_representative_id) not null,
	request_access_status VARCHAR(50) not null,
	datarequestor_id UUID REFERENCES datarequestor(datarequestor_id)
);

