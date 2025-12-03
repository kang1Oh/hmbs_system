--
-- PostgreSQL database dump
--

\restrict nx1uPpOcaUq4TUVTnaaEdcnYD3AjX5t2Kpqy8KoijwDu2AEgR32o4cZDXHiAsUR

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: approvals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.approvals (
    approval_id integer NOT NULL,
    request_id integer,
    user_id integer,
    name character varying(100),
    role_id integer,
    status_id integer,
    remarks text,
    date_approved timestamp without time zone
);


ALTER TABLE public.approvals OWNER TO postgres;

--
-- Name: approvals_approval_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.approvals_approval_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.approvals_approval_id_seq OWNER TO postgres;

--
-- Name: approvals_approval_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.approvals_approval_id_seq OWNED BY public.approvals.approval_id;


--
-- Name: borrow_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.borrow_items (
    item_id integer NOT NULL,
    request_id integer,
    tool_id integer,
    requested_qty integer
);


ALTER TABLE public.borrow_items OWNER TO postgres;

--
-- Name: borrow_items_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.borrow_items_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.borrow_items_item_id_seq OWNER TO postgres;

--
-- Name: borrow_items_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.borrow_items_item_id_seq OWNED BY public.borrow_items.item_id;


--
-- Name: borrow_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.borrow_requests (
    request_id integer NOT NULL,
    user_id integer,
    status_id integer,
    request_slip_id integer,
    lab_date date,
    date_requested timestamp without time zone,
    lab_time character varying(20),
    subject character varying(100),
    instructor_id integer
);


ALTER TABLE public.borrow_requests OWNER TO postgres;

--
-- Name: borrow_requests_request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.borrow_requests_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.borrow_requests_request_id_seq OWNER TO postgres;

--
-- Name: borrow_requests_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.borrow_requests_request_id_seq OWNED BY public.borrow_requests.request_id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    category_name character varying(100)
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_category_id_seq OWNER TO postgres;

--
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    group_id integer NOT NULL,
    request_id integer,
    user_id integer,
    is_leader boolean
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- Name: groups_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.groups_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.groups_group_id_seq OWNER TO postgres;

--
-- Name: groups_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.groups_group_id_seq OWNED BY public.groups.group_id;


--
-- Name: releases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.releases (
    release_id integer NOT NULL,
    request_id integer,
    released_by integer,
    release_date date
);


ALTER TABLE public.releases OWNER TO postgres;

--
-- Name: releases_release_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.releases_release_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.releases_release_id_seq OWNER TO postgres;

--
-- Name: releases_release_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.releases_release_id_seq OWNED BY public.releases.release_id;


--
-- Name: returns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.returns (
    return_id integer NOT NULL,
    request_id integer,
    tool_id integer,
    quantity integer,
    status character varying(50),
    remarks text,
    returned_to integer,
    return_date date
);


ALTER TABLE public.returns OWNER TO postgres;

--
-- Name: returns_return_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.returns_return_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.returns_return_id_seq OWNER TO postgres;

--
-- Name: returns_return_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.returns_return_id_seq OWNED BY public.returns.return_id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    role_id integer NOT NULL,
    role_name character varying(100) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_role_id_seq OWNER TO postgres;

--
-- Name: roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_role_id_seq OWNED BY public.roles.role_id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.statuses (
    status_id integer NOT NULL,
    status_label character varying(50) NOT NULL
);


ALTER TABLE public.statuses OWNER TO postgres;

--
-- Name: statuses_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.statuses_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.statuses_status_id_seq OWNER TO postgres;

--
-- Name: statuses_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.statuses_status_id_seq OWNED BY public.statuses.status_id;


--
-- Name: tools; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tools (
    tool_id integer NOT NULL,
    category_id integer,
    name character varying(100),
    location character varying(100),
    available_qty integer,
    unit character varying(50),
    price numeric(10,2),
    img character varying(255),
    tool_status character varying(50),
    disposal_status character varying(50)
);


ALTER TABLE public.tools OWNER TO postgres;

--
-- Name: tools_tool_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tools_tool_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tools_tool_id_seq OWNER TO postgres;

--
-- Name: tools_tool_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tools_tool_id_seq OWNED BY public.tools.tool_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    role_id integer,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(100),
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: approvals approval_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approvals ALTER COLUMN approval_id SET DEFAULT nextval('public.approvals_approval_id_seq'::regclass);


--
-- Name: borrow_items item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_items ALTER COLUMN item_id SET DEFAULT nextval('public.borrow_items_item_id_seq'::regclass);


--
-- Name: borrow_requests request_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_requests ALTER COLUMN request_id SET DEFAULT nextval('public.borrow_requests_request_id_seq'::regclass);


--
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- Name: groups group_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups ALTER COLUMN group_id SET DEFAULT nextval('public.groups_group_id_seq'::regclass);


--
-- Name: releases release_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.releases ALTER COLUMN release_id SET DEFAULT nextval('public.releases_release_id_seq'::regclass);


--
-- Name: returns return_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.returns ALTER COLUMN return_id SET DEFAULT nextval('public.returns_return_id_seq'::regclass);


--
-- Name: roles role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN role_id SET DEFAULT nextval('public.roles_role_id_seq'::regclass);


--
-- Name: statuses status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statuses ALTER COLUMN status_id SET DEFAULT nextval('public.statuses_status_id_seq'::regclass);


--
-- Name: tools tool_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tools ALTER COLUMN tool_id SET DEFAULT nextval('public.tools_tool_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: approvals approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approvals
    ADD CONSTRAINT approvals_pkey PRIMARY KEY (approval_id);


--
-- Name: borrow_items borrow_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_items
    ADD CONSTRAINT borrow_items_pkey PRIMARY KEY (item_id);


--
-- Name: borrow_requests borrow_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_requests
    ADD CONSTRAINT borrow_requests_pkey PRIMARY KEY (request_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (group_id);


--
-- Name: releases releases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.releases
    ADD CONSTRAINT releases_pkey PRIMARY KEY (release_id);


--
-- Name: returns returns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_pkey PRIMARY KEY (return_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: statuses statuses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statuses
    ADD CONSTRAINT statuses_pkey PRIMARY KEY (status_id);


--
-- Name: tools tools_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tools
    ADD CONSTRAINT tools_pkey PRIMARY KEY (tool_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: approvals approvals_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approvals
    ADD CONSTRAINT approvals_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.borrow_requests(request_id);


--
-- Name: approvals approvals_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approvals
    ADD CONSTRAINT approvals_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id);


--
-- Name: approvals approvals_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approvals
    ADD CONSTRAINT approvals_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.statuses(status_id);


--
-- Name: approvals approvals_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approvals
    ADD CONSTRAINT approvals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: borrow_items borrow_items_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_items
    ADD CONSTRAINT borrow_items_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.borrow_requests(request_id);


--
-- Name: borrow_items borrow_items_tool_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_items
    ADD CONSTRAINT borrow_items_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.tools(tool_id);


--
-- Name: borrow_requests borrow_requests_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_requests
    ADD CONSTRAINT borrow_requests_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.users(user_id);


--
-- Name: borrow_requests borrow_requests_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_requests
    ADD CONSTRAINT borrow_requests_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.statuses(status_id);


--
-- Name: borrow_requests borrow_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.borrow_requests
    ADD CONSTRAINT borrow_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: groups groups_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.borrow_requests(request_id);


--
-- Name: groups groups_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: releases releases_released_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.releases
    ADD CONSTRAINT releases_released_by_fkey FOREIGN KEY (released_by) REFERENCES public.users(user_id);


--
-- Name: releases releases_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.releases
    ADD CONSTRAINT releases_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.borrow_requests(request_id);


--
-- Name: returns returns_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.borrow_requests(request_id);


--
-- Name: returns returns_returned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_returned_by_fkey FOREIGN KEY (returned_to) REFERENCES public.users(user_id);


--
-- Name: returns returns_tool_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.tools(tool_id);


--
-- Name: tools tools_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tools
    ADD CONSTRAINT tools_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id);


--
-- PostgreSQL database dump complete
--

\unrestrict nx1uPpOcaUq4TUVTnaaEdcnYD3AjX5t2Kpqy8KoijwDu2AEgR32o4cZDXHiAsUR

