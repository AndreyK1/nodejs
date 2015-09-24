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
  
  
  -- Table: messages

-- DROP TABLE messages;

CREATE TABLE messages
(
  text text,
  id bigint NOT NULL DEFAULT nextval('"Messages_id_seq"'::regclass),
  user_id bigint,
  "updatedAt" timestamp with time zone NOT NULL,
  "createdAt" timestamp with time zone NOT NULL,
  CONSTRAINT messages_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE messages
  OWNER TO postgres;

  
  -- Sequence: "Messages_id_seq"

-- DROP SEQUENCE "Messages_id_seq";

CREATE SEQUENCE "Messages_id_seq"
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE "Messages_id_seq"
  OWNER TO postgres;

  
  -- Sequence: "Users_id_seq"

-- DROP SEQUENCE "Users_id_seq";

CREATE SEQUENCE "Users_id_seq"
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 5
  CACHE 1;
ALTER TABLE "Users_id_seq"
  OWNER TO postgres;

