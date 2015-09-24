-- Table: users

-- DROP TABLE users;

CREATE TABLE users
(
  id integer NOT NULL DEFAULT nextval('"Users_id_seq"'::regclass),
  email character varying(255),
  password character varying(255),
  "createdAt" timestamp with time zone NOT NULL,
  "updatedAt" timestamp with time zone NOT NULL,
  CONSTRAINT "Users_pkey" PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE users
  OWNER TO postgreadmin;
