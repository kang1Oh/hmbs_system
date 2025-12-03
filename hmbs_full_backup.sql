--
-- PostgreSQL database dump
--

\restrict HcjmFnMcLl0kgCx7D8odSI8MWfuoDYcjs31I9vu8gm0FTuZxgGIHu88uDB1oCQW

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
-- Data for Name: approvals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.approvals (approval_id, request_id, user_id, name, role_id, status_id, remarks, date_approved) FROM stdin;
1	4	2	Jane Doe	2	2	Approved request	2025-10-25 15:50:38.941
2	2	1	John Smith	1	2	Approved by admin	2025-10-28 03:14:31.81
3	7	2	Jane Doe	2	6	No group members listed.	2025-10-26 18:45:29.937
4	5	1	John Smith	1	2	Approved by admin	2025-10-28 02:51:44.307
5	9	1	John Smith	1	2	Approved by admin	2025-10-28 03:23:03.617
6	1	2	Jane Doe	2	2	Approved request	2025-10-24 19:07:05.546
7	9	2	Jane Doe	2	2	Approved request	2025-10-28 03:22:14.113
8	2	4	Linda Davis	3	2	Approved request	2025-10-28 03:13:52.994
9	6	4	Linda Davis	3	2	Approved request	2025-11-02 18:20:46.544
10	8	2	Jane Doe	2	2	Approved request	2025-10-24 19:14:47.018
11	3	1	John Smith	1	2	Approved by admin	2025-10-25 15:23:13.969
12	6	1	John Smith	1	2	Approved by admin	2025-11-02 18:27:17.974
13	9	4	Linda Davis	3	2	Approved request	2025-10-28 03:22:38.113
14	3	4	Linda Davis	3	2	Approved request	2025-10-25 15:22:54.056
15	1	4	Linda Davis	3	2	Approved request	2025-10-24 19:07:32.955
16	4	4	Linda Davis	3	2	Approved request	2025-10-25 15:51:51.821
17	6	2	Jane Doe	2	2	Approved request	2025-11-02 18:17:38.472
18	8	4	Linda Davis	3	2	Approved request	2025-10-24 19:15:07.809
19	5	4	Linda Davis	3	2	Approved request	2025-10-28 02:51:07.946
20	5	3	Robert Brown	2	2	Approved request	2025-10-28 02:50:39.274
21	8	1	John Smith	1	2	Approved by admin	2025-10-24 19:15:24.57
22	2	2	Jane Doe	2	2	Approved request	2025-10-28 03:13:18.81
23	4	1	John Smith	1	2	Approved by admin	2025-10-25 15:53:22.253
24	3	2	Jane Doe	2	2	Approved request	2025-10-25 15:22:32.8
25	1	1	John Smith	1	2	Approved by admin	2025-10-24 19:07:48.066
26	10	2	Jane Doe	2	2	Approved request	2025-11-15 07:57:48.989
27	11	2	Jane Doe	2	6	Wrong tools for the subject or vice versa.	2025-11-15 08:48:03.929
28	10	4	Linda Davis	3	2	Approved request	2025-11-15 08:58:59.104
29	10	1	John Smith	1	2	Approved by admin	2025-11-15 09:36:43.83
31	12	10	Michael Johnson	2	2	Approved request	2025-11-15 18:27:39.177414
32	12	4	Linda Davis	3	2	Approved request	2025-11-15 18:36:47.699827
34	12	\N	John Smith	1	6	High Cocktail Table is in use.	2025-11-15 18:55:17.931343
35	13	2	Jane Doe	2	2	Approved request	2025-11-15 19:08:36.848323
36	13	4	Linda Davis	3	2	Approved request	2025-11-15 19:08:55.849229
37	13	1	John Smith	1	2	Approved by admin	2025-11-15 19:09:46.56899
38	14	2	Jane Doe	2	2	Approved request	2025-11-27 08:29:25.099558
39	14	4	Linda Davis	3	2	Approved request	2025-11-27 08:30:03.807405
40	14	1	John Smith	1	2	Approved by admin	2025-11-27 08:30:33.476747
41	16	10	Michael Johnson	2	2	Approved request	2025-11-27 15:25:10.537793
42	15	10	Michael Johnson	2	6	Incorrect Name	2025-11-27 15:25:26.654104
43	16	4	Linda Davis	3	2	Approved request	2025-11-27 15:32:45.713593
44	16	1	John Smith	1	2	Approved by admin	2025-11-27 15:33:02.963276
45	17	2	Jane Doe	2	2	Approved request	2025-11-27 15:47:20.663211
46	17	4	Linda Davis	3	2	Approved request	2025-11-27 15:47:31.671
47	17	1	John Smith	1	2	Approved by admin	2025-11-27 15:47:58.502588
\.


--
-- Data for Name: borrow_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.borrow_items (item_id, request_id, tool_id, requested_qty) FROM stdin;
1	5	110	1
2	5	2	1
3	6	54	1
4	4	15	1
5	1	6	1
6	2	244	2
7	2	39	1
8	6	236	1
9	8	62	1
10	9	178	1
11	1	4	1
12	7	87	1
13	9	211	1
14	3	87	1
15	7	231	1
16	5	113	1
17	3	51	1
18	8	110	1
19	8	109	1
20	7	173	2
21	8	39	1
22	4	120	1
23	4	67	5
24	10	121	1
25	10	123	1
26	10	145	1
27	10	7	1
28	11	57	1
29	12	218	1
30	12	215	1
31	13	22	1
32	13	39	1
33	13	240	1
34	13	143	1
35	14	2	2
36	14	18	10
37	14	9	1
38	15	2	1
39	16	2	2
40	16	36	1
41	16	59	1
42	16	67	1
44	17	158	1
43	17	141	1
45	17	124	1
46	18	2	1
47	18	106	1
48	18	239	1
49	18	6	1
50	18	206	1
51	18	22	1
\.


--
-- Data for Name: borrow_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.borrow_requests (request_id, user_id, status_id, request_slip_id, lab_date, date_requested, lab_time, subject, instructor_id) FROM stdin;
1	8	5	86114	2025-10-27	2025-10-24 19:01:44.323	9:00	Baking	2
2	5	5	55998	2025-10-31	2025-10-28 03:11:37.058	11:00	Kitchen Etiquette	2
3	5	5	72760	2025-10-27	2025-10-24 19:19:46.138	16:00	OJT	2
4	5	5	90773	2025-10-28	2025-10-25 15:49:12.053	23:45	Wine Tasting	2
7	7	6	31126	2025-10-29	2025-10-26 18:41:16.912	14:45	Catering	2
8	7	5	37179	2025-10-27	2025-10-24 18:56:30.996	9:00	Salad Making	2
9	7	5	63806	2025-10-31	2025-10-28 03:21:07.089	11:00	Table	2
6	5	5	48863	2025-11-05	2025-11-02 18:13:34.776	9:00	Janitorial Duty	2
5	8	5	32448	2025-10-27	2025-10-24 19:09:21.075	9:00	Knife Handling	3
11	8	6	47736	2025-11-18	2025-11-15 08:44:06.945	09:00	Baking	2
10	5	5	91634	2025-11-18	2025-11-15 07:33:40.287	15:00	Baking	2
12	5	6	78193	2025-11-18	2025-11-15 10:03:23.603	08:00	Event Preparation	10
13	5	5	33087	2025-11-18	2025-11-15 11:07:37.689	08:00	Pasta Making	2
14	5	5	35005	2025-12-01	2025-11-27 00:28:01.993	09:26	Bar Hopping	2
15	5	6	72418	2025-12-02	2025-11-27 00:34:39.647	08:34	sadsf	10
16	8	5	78929	2025-12-01	2025-11-27 00:50:13.684	10:49	kitchen 	10
17	7	5	19866	2025-12-01	2025-11-27 07:45:57.801	15:45	Grilling	2
18	11	1	71096	2025-12-01	2025-11-27 07:55:51.862	20:00	bread and pastry	10
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (category_id, category_name) FROM stdin;
1	Baking & Pantry Tools
2	Cooking Wares & Equipment
3	Kitchen Utensils and Gadgets
4	Food Preparation Equipment
5	Serving Tools
6	Bar Tools & Drinkware
7	Dining Equipment
8	Storage & Utility
9	Furnitures & Fixtures
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups (group_id, request_id, user_id, is_leader) FROM stdin;
1	1	8	t
2	1	9	f
3	8	5	f
4	4	5	f
5	3	6	f
6	6	5	t
7	2	5	t
8	7	7	f
9	9	7	t
10	4	6	t
11	6	12	f
12	2	7	f
13	8	7	t
14	2	6	f
15	9	6	f
16	8	6	f
17	7	7	t
18	5	9	f
19	6	7	f
20	3	5	t
21	5	8	t
22	10	5	t
23	10	12	f
24	10	24	f
25	11	8	t
26	11	25	f
27	12	6	t
28	12	5	f
29	12	8	f
30	13	25	t
31	13	9	f
32	13	5	f
33	14	6	t
34	14	7	f
35	14	8	f
36	15	6	t
37	15	7	f
38	16	12	t
39	16	24	f
40	16	8	f
41	17	6	t
42	17	7	f
43	17	8	f
44	18	6	t
45	18	8	f
46	18	12	f
\.


--
-- Data for Name: releases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.releases (release_id, request_id, released_by, release_date) FROM stdin;
1	8	1	2025-10-24
2	6	1	2025-11-02
3	1	1	2025-10-24
4	4	1	2025-10-28
5	2	1	2025-10-28
6	9	1	2025-10-28
7	3	1	2025-10-25
8	5	1	2025-11-13
9	10	1	2025-11-15
10	13	1	2025-11-15
11	14	1	2025-11-27
12	16	1	2025-11-27
13	17	1	2025-11-27
\.


--
-- Data for Name: returns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.returns (return_id, request_id, tool_id, quantity, status, remarks, returned_to, return_date) FROM stdin;
1	1	6	1	Returned	Good Condition	1	2025-10-24
2	9	211	1	Returned	Good Condition	1	2025-10-28
3	2	244	2	Returned	Good Condition	1	2025-10-28
4	3	87	1	Returned	Good Condition	1	2025-10-25
5	4	120	1	Returned	Good Condition	1	2025-10-28
6	9	178	1	Returned	Good Condition	1	2025-10-28
7	6	54	1	Returned	Good Condition	1	2025-11-02
8	8	110	1	Returned	Good Condition	1	2025-10-24
9	8	109	1	Returned	Good Condition	1	2025-10-24
10	3	51	1	Returned	Good Condition	1	2025-10-25
11	4	15	1	Returned	Good Condition	1	2025-10-28
12	8	62	1	Returned	Good Condition	1	2025-10-24
13	4	67	5	Returned	Good Condition	1	2025-10-28
14	1	4	1	Returned	Good Condition	1	2025-10-24
15	8	39	1	Returned	Good Condition	1	2025-10-24
16	2	39	1	Returned	Good Condition	1	2025-10-28
18	6	236	1	Returned	Good Condition	1	2025-11-13
19	5	2	1	Returned	Good Condition	1	2025-11-13
20	5	113	1	Returned	Good Condition	1	2025-11-13
17	5	110	1	Returned	Good Condition	1	2025-11-13
21	10	121	1	Returned	Good Condition	1	2025-11-15
23	10	145	1	Returned	Good Condition	1	2025-11-15
24	10	7	1	Returned	Good Condition	1	2025-11-15
22	10	123	1	Returned	Good Condition	1	2025-11-15
25	13	22	1	Returned	Good Condition	1	2025-11-15
26	13	39	1	Returned	Good Condition	1	2025-11-15
27	13	240	1	Returned	Good Condition	1	2025-11-15
28	13	143	1	Returned	Good Condition	1	2025-11-15
30	14	2	2	Returned	Good Condition	1	2025-11-27
29	14	18	10	Returned	Good Condition	1	2025-11-27
31	14	9	1	Returned	Good Condition	1	2025-11-27
32	16	2	2	Returned		1	2025-11-27
33	16	36	1	Returned		1	2025-11-27
34	16	59	1	Returned		1	2025-11-27
35	16	67	1	Returned		1	2025-11-27
36	17	141	1	Returned		1	2025-11-27
37	17	158	1	Returned		1	2025-11-27
38	17	124	1	Returned		1	2025-11-27
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (role_id, role_name) FROM stdin;
1	Admin
2	Instructor
3	Program Head
4	Student
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (sid, sess, expire) FROM stdin;
0cScwBaZqIqpk-JrFP-S_OpLQagL_5Mq	{"cookie":{"originalMaxAge":86400000,"expires":"2025-11-28T07:24:23.231Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"user_id":4,"email":"programhead2@hmbs.com","role_id":"3","name":"Linda Davis"}}	2025-11-28 15:47:34
VzFcpuN8Hwy2ZQFPvTCCD6ZVTYYRrMAN	{"cookie":{"originalMaxAge":86400000,"expires":"2025-11-28T07:47:14.110Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"user_id":2,"email":"instructor1@hmbs.com","role_id":"2","name":"Jane Doe"}}	2025-11-28 15:47:23
VPLfg7Aa4CQefkssYHU6GV06-9DlZi8E	{"cookie":{"originalMaxAge":86400000,"expires":"2025-11-28T00:30:21.695Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"user_id":1,"email":"admin@hmbs.com","role_id":"1","name":"John Smith"}}	2025-11-28 15:49:38
4YqaBa9kE3svhvsQ17B2slVUzIKNUfJy	{"cookie":{"originalMaxAge":86400000,"expires":"2025-11-28T07:52:29.923Z","secure":false,"httpOnly":true,"path":"/","sameSite":"lax"},"user":{"user_id":11,"email":"student6@hmbs.com","role_id":"4","name":"Jane Rose Bandoy"}}	2025-11-29 12:06:49
\.


--
-- Data for Name: statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.statuses (status_id, status_label) FROM stdin;
1	pending
2	approved
3	released
4	reviewed
5	returned
6	denied
\.


--
-- Data for Name: tools; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tools (tool_id, category_id, name, location, available_qty, unit, price, img, tool_status, disposal_status) FROM stdin;
1	1	Airbrush Kit	CBA 404	1	Unit	100.00	/uploads/tools/image-1760964254167-308646838.jpg	Available	Good Condition
2	3	Assorted Small Knife	CBA 404	16	Piece	100.00	/uploads/tools/image-1760964291094-440156702.jpeg	Available	Good Condition
3	1	Baking Compressor Black Color Set	CBA 404	8	Piece	100.00	/uploads/tools/image-1760964380274-357223319.jpg	Available	Good Condition
4	1	Baking/Cooking Tray - Metal Tray	CBA 404	16	Piece	100.00	/uploads/tools/image-1760964474159-315541444.jpg	Available	Good Condition
5	1	Baking/Cooking Tray Thick - Heavy Duty Tray	CBA 404	2	Piece	100.00	/uploads/tools/image-1760964519520-778779960.jpg	Available	For Repair
6	1	Baking Tin Pans Rectangular Baking Pan (Assorted Sizes S, M,L)	CBA 405	1	Set	100.00	/uploads/tools/image-1760964544630-631941940.jpg	Available	Good Condition
7	1	Baking Tin Pans Round Baking Pan	CBA 404	35	Piece	100.00	/uploads/tools/image-1760964655288-427713638.jpg	Available	Good Condition
8	1	Baking Tin Pans Tube Baking Pan	CBA 404	25	Piece	100.00	/uploads/tools/image-1760964679337-160448420.jpg	Available	Good Condition
9	6	Bar Tray Rectangular	CBA 404	10	Piece	100.00	/uploads/tools/image-1760964960125-988992603.jpg	Available	Good Condition
10	6	Bar Tray Serving Tray Ceramic	CBA 404	12	Piece	100.00	/uploads/tools/image-1760965029605-828521721.jpg	Available	Good Condition
11	6	Bar Knife	CBA 404	15	Piece	100.00	/uploads/tools/image-1760964700745-319577227.jpg	Available	Good Condition
12	6	Bar Spoon Ice Pick	CBA 404	7	Piece	100.00	/uploads/tools/image-1760964736656-201881235.jpg	Available	Good Condition
13	6	Bar Mat	CBA 404	3	Pieces	100.00	/uploads/tools/image-1760964716528-913088985.jpg	Available	Good Condition
14	6	Bar Spoon with Fondue Fork	CBA 405	1	Set	100.00	/uploads/tools/image-1760964774434-68383669.jpg	Available	Good Condition
15	6	Bar Tray Oval Tray	CBA 404	5	Piece	100.00	/uploads/tools/image-1760964942165-685998625.jpg	Available	Good Condition
16	6	Bar Tray Round	CBA 404	30	Piece	100.00	/uploads/tools/image-1760965013321-335002754.jpg	Available	Good Condition
17	1	Beaker Measuring Glass for Liquid	CBA 404	6	Piece	100.00	/uploads/tools/image-1760965069605-960501367.jpg	Available	For Repair
18	6	Beer Mug	CBA 404	10	Piece	100.00	/uploads/tools/image-1760965090629-335247928.jpeg	Available	Good Condition
19	1	Biscuit Molder Stainless	CBA 404	40	Piece	100.00	/uploads/tools/image-1760965106397-258648739.jpg	Available	Good Condition
20	3	Blender Smoothie Blender	CBA 404	3	Pieces	100.00	/uploads/tools/image-1760965156564-110333448.jpg	Available	Good Condition
21	4	Bowl Plastic Mixing Bowl	CBA 404	40	Piece	100.00	/uploads/tools/image-1760965206732-667590971.jpg	Available	Good Condition
22	4	Bowl Stainless Mixing Bowl	CBA 404	10	Piece	100.00	/uploads/tools/image-1760965223412-771235043.jpg	Available	Good Condition
23	4	Cake Server	CBA 404	10	Unit	100.00	/uploads/tools/image-1760965251669-344722297.jpg	Available	Good Condition
24	1	1 Layer Glass Cake Stand	CBA 404	20	Piece	100.00	/uploads/tools/image-1760963675086-246038722.jpg	Available	Good Condition
25	1	2 Layer Glass Cake Stand	CBA 404	3	Piece	100.00	/uploads/tools/image-1760963708487-876791097.jpg	Available	Good Condition
26	1	3 Layer Glass Footed Platter	CBA 404	22	Piece	100.00	/uploads/tools/image-1760963949994-701758668.jpg	Available	Good Condition
27	1	3 Layer Silver Cake Stand	CBA 404	35	Piece	100.00	/uploads/tools/image-1760964067912-220248181.jpg	Available	Good Condition
28	1	3 Layer Floating Cake Stand	CBA 404	3	Piece	100.00	/uploads/tools/image-1760963858290-199115625.jpg	Available	Good Condition
29	1	3 Layer Pillar Cake Stand	CBA 404	15	Piece	100.00	/uploads/tools/image-1760964034428-139918761.jpg	Available	Good Condition
30	1	Cake Stand Stackable Cake Plates	CBA 404	15	Set	100.00	/uploads/tools/image-1760965299381-629663496.jpg	Available	Good Condition
31	1	Cake Turner Metal	CBA 404	12	Piece	100.00	/uploads/tools/image-1760965377541-834226271.jpg	Available	Good Condition
32	1	Cake Turntable Plastic	CBA 404	12	Pieces	100.00	/uploads/tools/image-1760965405509-824667532.jpg	Available	Good Condition
33	7	Ceramic Bowl Ceramic Soup Bowl with Handle and Cover	CBA 404	25	Piece	100.00	/uploads/tools/image-1760965444063-180802364.jpg	Available	Good Condition
34	6	Champagne Flute	CBA 404	30	Piece	100.00	/uploads/tools/image-1760965486700-330963333.jpeg	Available	Good Condition
35	3	Chef’s Thermometer Stainless	CBA 404	5	Piece	100.00	/uploads/tools/image-1760965534878-787362182.jpg	Available	For Repair
36	3	Chopping Boards White (assorted size)	My Heart	1	Unit	100.00	/uploads/tools/image-1760965581112-446194760.jpg	Available	Good Condition
37	3	Chopping Boards Wood	CBA 404	5	Piece	100.00	/uploads/tools/image-1760965593964-125485016.jpg	Available	Good Condition
38	6	Cocktail Strainer Bar Strainer Stainless	CBA 404	8	Piece	100.00	/uploads/tools/image-1760965652662-965578871.jpg	Available	Good Condition
39	4	Colander Strainer Stainless with 2 Handles	CBA 404	8	Piece	100.00	/uploads/tools/image-1760965723094-494571169.jpg	Available	Good Condition
40	6	Container Bar Caddy	CBA 404	10	Unit	100.00	/uploads/tools/image-1760965795046-573071016.jpg	Available	Good Condition
41	1	Cookie Pans Sheets (assorted)	CBA 404	4	Piece	100.00	/uploads/tools/image-1760965831019-261770926.jpeg	Available	Good Condition
42	4	Cork Screw Waiters Cork Screw Black Color	CBA 404	6	Piece	100.00	/uploads/tools/image-1760965858563-668002782.jpg	Available	Good Condition
43	7	Food Cover 2	CBA 404	8	Piece	100.00	/uploads/tools/image-1760965918084-18761745.jpg	Available	Good Condition
44	4	Cups Assorted Size	CBA 405	11	Unit	100.00	/uploads/tools/image-1760965945164-93131628.jpg	Available	For Disposal
45	6	Cups with Saucer White Gold Design	CBA 404	15	Piece	100.00	/uploads/tools/image-1760965968979-751315573.jpg	Available	Good Condition
46	4	Can Opener	CBA 404	40	Set	100.00	/uploads/tools/image-1760966008995-397788608.jpg	Available	Good Condition
47	1	Dough Cutter	CBA 404	1	Unit	100.00	/uploads/tools/image-1760966023771-21449998.jpg	Available	Good Condition
48	1	Pizza Cutter	CBA 404	16	Piece	100.00	/uploads/tools/image-1760966037818-181196369.jpg	Available	Good Condition
49	7	Dinner Stainless Regular Size	CBA 404	5	Piece	100.00	/uploads/tools/image-1760966177923-996993402.jpg	Available	Good Condition
50	8	Dish Rack Brown Color Plastic	CBA 404	7	Piece	100.00	/uploads/tools/image-1760966204099-77909560.jpg	Available	Good Condition
51	9	Extension Wire Omni 4 meters	CBA 404	15	Piece	100.00	/uploads/tools/image-1760966358554-693941994.jpg	Available	Good Condition
52	8	First Aid Kit 53 Items Inside	CBA 404	20	Piece	100.00	/uploads/tools/image-1760966374746-230263185.jpg	Available	Good Condition
53	3	Fish Knife	CBA 404	5	Piece	100.00	/uploads/tools/image-1760966405610-981867008.jpeg	Available	For Repair
54	8	Food Trolley with Bin 3 Layers Durable Plastic	CBA 404	8	Piece	100.00	/uploads/tools/image-1760966425524-957815672.jpg	Available	Good Condition
55	5	Food Warmer Chafing Dish (Double)	CBA 404	40	Piece	100.00	/uploads/tools/image-1760966526995-524542037.jpg	Available	Good Condition
56	5	Food Warmer Chafing Dish (Rectangle)	CBA 404	3	Pieces	100.00	/uploads/tools/image-1760966542138-492782837.jpg	Available	Good Condition
57	5	Food Warmer Soup Chafing Dish (Round)	CBA 404	20	Piece	100.00	/uploads/tools/image-1760966557858-253264156.jpg	Available	Good Condition
58	7	Dessert Fork	CBA 404	10	Piece	100.00	/uploads/tools/image-1760966589938-557072364.jpg	Available	Good Condition
59	7	Dinner Fork	CBA 404	20	Piece	100.00	/uploads/tools/image-1760966632633-712299403.jpg	Available	Good Condition
60	7	Fish Fork	CBA 404	30	Set	100.00	/uploads/tools/image-1760966645664-399527832.jpg	Available	Good Condition
61	7	Oyster Fork	CBA 404	22	Piece	100.00	/uploads/tools/image-1760966671458-528564494.jpg	Available	Good Condition
62	7	Salad Fork	CBA 404	40	Piece	100.00	/uploads/tools/image-1760966688322-270207720.jpg	Available	Good Condition
63	7	Serving Fork	CBA 404	16	Piece	100.00	/uploads/tools/image-1760966703929-903019739.jpg	Available	Good Condition
64	2	Deep Fryer Fan with Cover and Strainer	CBA 404	7	Piece	100.00	/uploads/tools/image-1760966814218-129201435.jpg	Available	Good Condition
65	2	Electric Deep Fryer with Strainer	CBA 404	40	Set	100.00	/uploads/tools/image-1760966835410-437200387.jpg	Available	Good Condition
66	3	Garnishing Tools	CBA 404	12	Piece	100.00	/uploads/tools/image-1760966872204-853804657.jpeg	Available	Good Condition
67	6	Brandy Snifter Glass	CBA 404	30	Piece	100.00	/uploads/tools/image-1760966918378-737551455.jpeg	Available	Good Condition
68	6	Halo-halo Glass	CBA 404	213	Pieces	100.00	/uploads/tools/image-1760966932090-792727432.jpeg	Available	Good Condition
69	6	Hurricane Glass	CBA 404	10	Piece	100.00	/uploads/tools/image-1760966944578-384109268.jpeg	Available	Good Condition
70	6	Irish Coffee Glass	CBA 404	18	Piece	100.00	/uploads/tools/image-1760966958233-41913227.jpeg	Available	Good Condition
71	6	Martini Glass (Large)	CBA 404	50	Set	100.00	/uploads/tools/image-1760986120074-538066333.jpeg	Available	Good Condition
72	6	Martini Glass (Small)	CBA 404	5	Piece	100.00	/uploads/tools/image-1760986556173-31409689.jpg	Available	For Repair
73	6	Pilsner Glass	CBA 404	20	Piece	100.00	/uploads/tools/image-1760986584530-103830171.jpeg	Available	Good Condition
74	6	Poco Grande	CBA 404	4	Piece	100.00	/uploads/tools/image-1760986725815-827704043.jpg	Available	For Disposal
75	8	Glass Rack Plastic Glass Crate (assorted colors)	CBA 404	10	Piece	100.00	/uploads/tools/image-1760987380035-784343959.jpeg	Available	Good Condition
76	8	Glass Rack Plastic Goblet Crate (assorted colors)	CBA 404	12	Piece	100.00	/uploads/tools/image-1760987437317-654543845.jpeg	Available	Good Condition
77	6	Red Wine Glass	CBA 404	5	Piece	100.00	/uploads/tools/image-1760987477599-517639032.jpeg	Available	For Repair
78	6	Sherbet Glass	CBA 404	16	Piece	100.00	/uploads/tools/image-1760987504875-527283865.png	Available	Good Condition
79	6	Shot Glass	CBA 404	10	Piece	100.00	/uploads/tools/image-1760987541016-3974678.jpeg	Available	Good Condition
80	6	Tumbler Glass	CBA 404	18	Piece	100.00	/uploads/tools/image-1760987559237-829365531.jpeg	Available	Good Condition
81	2	Glass Under Liner Round Plastic (pink, blue)	CBA 404	6	Piece	100.00	/uploads/tools/image-1760987865486-42065605.jpg	Available	For Repair
82	6	Water Goblet	CBA 404	35	Piece	100.00	/uploads/tools/image-1760987908711-750668778.png	Available	Good Condition
83	6	White Wine Glass	CBA 404	20	Piece	100.00	/uploads/tools/image-1760987956849-627667953.jpeg	Available	Good Condition
84	3	Grater Black Handle	CBA 404	4	Piece	100.00	/uploads/tools/image-1760987993845-980966164.jpeg	Available	For Disposal
85	5	Gravy server Stainless	CBA 404	5	Piece	100.00	/uploads/tools/image-1760988047354-318610792.jpeg	Available	For Repair
86	2	Non-stick Griller	CBA 404	16	Piece	100.00	/uploads/tools/image-1760988073581-32643394.jpeg	Available	Good Condition
87	9	Heavy Duty Plastic Table 5ft x 4ft Foldable (Color White)	CBA 404	15	Set	100.00	/uploads/tools/image-1760988101980-793921539.jpeg	Available	Good Condition
88	9	Heavy Duty Plastic Table 6ft x 4ft Foldable (Color White)	CBA 404	10	Piece	100.00	/uploads/tools/image-1760988121446-968244935.jpeg	Available	Good Condition
89	6	Ice Bucket Glass	CBA 404	8	Piece	100.00	/uploads/tools/image-1760988148987-446949280.jpeg	Available	Good Condition
90	6	Ice Bucket Stainless	CBA 404	3	Pieces	100.00	/uploads/tools/image-1760988168453-619814766.jpeg	Available	Good Condition
91	5	Ice Cream Scooper Stainless	CBA 405	11	Unit	100.00	/uploads/tools/image-1760988260359-328302469.jpeg	Available	For Disposal
92	4	Ice Crusher Heavy Duty Machine	CBA 404	6	Piece	100.00	/uploads/tools/image-1760988352285-233916157.jpeg	Available	For Repair
93	3	Ice Pick Steel Black Handle	CBA 404	4	Piece	100.00	/uploads/tools/image-1760988400117-129290021.jpeg	Available	For Disposal
94	5	Ice Scooper Stainless	CBA 404	5	Piece	100.00	/uploads/tools/image-1760988504974-78338272.jpeg	Available	For Repair
95	5	Ice Tong Stainless Tong	CBA 404	5	Piece	100.00	/uploads/tools/image-1760988534825-559121815.jpeg	Available	Good Condition
96	1	Icing Design Plastic White	CBA 404	40	Piece	100.00	/uploads/tools/image-1760988608424-309912304.jpeg	Available	Good Condition
97	2	Industrial Rice Cooker	CBA 404	3	Piece	100.00	/uploads/tools/image-1760988629623-528163585.jpeg	Available	Good Condition
98	6	Jogger Bottler Assorted Colors	CBA 405	1	Set	100.00	/uploads/tools/image-1760988689086-688116130.jpeg	Available	Good Condition
99	6	Juice Dispenser Plastic with Stainless (Short)	CBA 404	20	Piece	100.00	/uploads/tools/image-1760988713444-590614632.jpeg	Available	Good Condition
100	6	Juice Dispenser Tower	CBA 404	6	Piece	100.00	/uploads/tools/image-1760988732190-866595504.jpeg	Available	Good Condition
101	6	Juice Electric Presser	CBA 404	5	Piece	100.00	/uploads/tools/image-1760988775834-853428431.jpeg	Available	For Repair
102	6	Juice with Pourer	CBA 405	1	Set	100.00	/uploads/tools/image-1760988812253-170100935.jpeg	Available	Good Condition
103	3	Kitchen Knife Bar	CBA 404	10	Unit	100.00	/uploads/tools/image-1760988834373-347758839.jpeg	Available	Good Condition
104	3	Kitchen Tools & Gadgets Stainless	CBA 404	30	Set	100.00	/uploads/tools/image-1760988795459-880537260.jpeg	Unavailable	Good Condition
105	3	Bread Knife	CBA 404	50	Set	100.00	/uploads/tools/image-1760988859850-412005795.png	Available	Good Condition
106	3	Chef Knife	CBA 404	30	Piece	100.00	/uploads/tools/image-1760988875587-593467075.jpeg	Available	Good Condition
107	7	Dinner Knife	CBA 404	9	Piece	100.00	/uploads/tools/image-1760988895608-286350217.jpeg	Available	Good Condition
108	3	Oyster Knife	CBA 404	20	Piece	100.00	/uploads/tools/image-1760988920289-448888501.jpeg	Available	Good Condition
109	3	Salad Knife	CBA 404	15	Piece	100.00	/uploads/tools/image-1760988942314-903327091.jpeg	Available	Good Condition
110	3	Serrated Knife (Big)	CBA 404	14	Piece	100.00	/uploads/tools/image-1760988975054-9278964.jpeg	Available	Good Condition
111	3	Serrated Knife (Small)	CBA 404	4	Piece	100.00	/uploads/tools/image-1760989004899-236361128.jpeg	Available	For Disposal
112	3	Knife Stainless Steel Kitchen Knife Set 5 pieces	CBA 404	7	Piece	100.00	/uploads/tools/image-1760989028430-264306723.jpeg	Available	Good Condition
113	3	Steak Knife	CBA 404	12	Piece	100.00	/uploads/tools/image-1760989068724-499546647.jpeg	Available	Good Condition
114	3	Ladle Turner Long Stainless	CBA 404	10	Piece	100.00	/uploads/tools/image-1760989159765-207821254.jpg	Available	Good Condition
115	3	Ladle Turner Slotted Black Turner	CBA 404	25	Piece	100.00	/uploads/tools/image-1760989209091-252842074.png	Available	Good Condition
116	3	Ladle Turner Slotted Green Turner	CBA 404	6	Piece	100.00	/uploads/tools/image-1760989259768-748224352.jpeg	Available	For Repair
117	3	Ladle Turner Slotted White Turner (plastic)	CBA 404	14	Piece	100.00	/uploads/tools/image-1760989275583-62775723.jpeg	Available	Good Condition
118	3	Ladle Turner Wooden Spoon	CBA 404	6	Piece	100.00	/uploads/tools/image-1760989294334-445779308.jpeg	Available	For Repair
119	3	Lemon Squeezer Stainless Steel	CBA 404	18	Piece	100.00	/uploads/tools/image-1760989325816-737484440.jpeg	Available	Good Condition
120	6	Liquid Bottle Glass	CBA 404	5	Piece	100.00	/uploads/tools/image-1760989342083-48395128.jpeg	Available	Good Condition
121	1	Measuring Cups Plastic for Dry Ingredients	CBA 404	10	Piece	100.00	/uploads/tools/image-1760989418713-508803391.jpg	Available	Good Condition
122	1	Measuring Glass Tumbler Glass Black	CBA 404	6	Piece	100.00	/uploads/tools/image-1760989529972-894314670.jpg	Available	For Repair
123	1	Measuring Glass with Black Design	CBA 404	40	Piece	100.00	/uploads/tools/image-1760989515891-392844598.jpeg	Available	Good Condition
124	2	Hand Mixer Heavy Duty 3D (brand)	CBA 404	20	Piece	100.00	/uploads/tools/image-1760989570954-178745112.jpeg	Available	Good Condition
125	2	Heavy Duty Kitchen Aide Stand Mixer	CBA 404	7	Piece	100.00	/uploads/tools/image-1760989618226-312533808.jpeg	Available	Good Condition
126	2	Stand Mixer with Stainless Bowl (Heavy Duty, Dowell Black)	CBA 404	3	Pieces	100.00	/uploads/tools/image-1760989687840-392291081.jpeg	Available	Good Condition
127	8	Mop Bucket Yellow Color with Water Placement	CBA 405	11	Unit	100.00	/uploads/tools/image-1760989732146-304841337.jpeg	Available	For Disposal
128	3	Mortar and Pestle	CBA 405	1	Set	100.00	/uploads/tools/image-1760989753458-863819595.jpeg	Available	Good Condition
129	3	Muddler Wooden Muddler	CBA 404	10	Piece	100.00	/uploads/tools/image-1760989786428-409643410.jpeg	Available	Good Condition
130	1	Muffin Pan By 6	CBA 404	10	Piece	100.00	/uploads/tools/image-1761496581787-474182861.jpeg	Available	Good Condition
131	1	Muffin Pan By 12	CBA 404	2	Piece	100.00	/uploads/tools/image-1760989807795-914524242.jpeg	Available	For Repair
132	1	Muffin Pan By 24	CBA 404	10	Piece	100.00	/uploads/tools/image-1761496566039-566124147.jpeg	Available	Good Condition
133	1	Muffin Pan Heart Baking Pan	CBA 404	213	Pieces	100.00	/uploads/tools/image-1761496597811-318930592.jpeg	Available	Good Condition
134	5	Muffin Pan Leche Flan Molder	CBA 404	15	Piece	100.00	/uploads/tools/image-1761496609083-251221109.jpeg	Available	Good Condition
135	1	Muffin Pan Pie Pan	CBA 404	18	Piece	100.00	/uploads/tools/image-1761496787501-66460968.jpg	Available	Good Condition
136	1	Muffin Pan Pizza Pan	CBA 404	12	Pieces	100.00	/uploads/tools/image-1761496874540-787469101.jpeg	Available	Good Condition
137	3	Non-contact Infrared Thermometer Food Heat Thermometer	CBA 404	30	Piece	100.00	/uploads/tools/image-1761496905188-290971109.jpeg	Available	Good Condition
138	3	Oven Thermometer Stainless	CBA 404	25	Piece	100.00	/uploads/tools/image-1761497006700-797734179.jpeg	Available	Good Condition
139	2	Barbeque Grill Pan (Steel, Black Color)	CBA 404	12	Piece	100.00	/uploads/tools/image-1761497207413-765664012.jpg	Available	Good Condition
140	2	Non-stick Frying Pan	CBA 404	1	Unit	100.00	/uploads/tools/image-1761497235883-701084582.png	Available	Good Condition
141	2	Omelete Pan	CBA 404	10	Piece	100.00	/uploads/tools/image-1761497566812-824904876.jpg	Available	Good Condition
142	2	Sauce Pan Double Boiler	CBA 404	14	Piece	100.00	/uploads/tools/image-1761497605739-22172022.png	Available	Good Condition
143	3	Pasta Maker Stainless	CBA 404	25	Piece	100.00	/uploads/tools/image-1761497699380-20207146.jpg	Available	Good Condition
144	5	Pasta Server Silver Stainless	CBA 404	10	Piece	100.00	/uploads/tools/image-1761497722035-261395366.jpeg	Available	Good Condition
145	1	Patry Brush Assorted Designs and Colors	CBA 404	9	Piece	100.00	/uploads/tools/image-1761497747015-675977339.jpeg	Available	Good Condition
146	3	Peeler Assorted Color and Sizes	CBA 405	1	Set	100.00	/uploads/tools/image-1761497763051-273528297.png	Available	Good Condition
147	6	Pitcher Stainless 1L (555 Brand)	CBA 404	15	Set	100.00	/uploads/tools/image-1761497793458-342484085.jpeg	Available	Good Condition
148	7	Plates Big Square Plate	CBA 404	9	Piece	100.00	/uploads/tools/image-1761497903788-282778543.jpeg	Available	Good Condition
149	7	Plates Bread Plate	CBA 404	7	Piece	100.00	/uploads/tools/image-1761497918824-344336066.jpeg	Available	Good Condition
150	7	Plates Dessert Plate	CBA 404	8	Piece	100.00	/uploads/tools/image-1761497938780-521924923.jpeg	Available	Good Condition
151	7	Plates Dinner Plate Assorted Sizes	CBA 404	18	Piece	100.00	/uploads/tools/image-1761497954275-279678655.jpeg	Available	Good Condition
152	7	Plates Lasagna Plate	CBA 404	5	Piece	100.00	/uploads/tools/image-1761497972533-161977282.jpeg	Available	For Repair
153	7	Plates Salad Plate	CBA 404	10	Piece	100.00	/uploads/tools/image-1761497990007-495305546.jpeg	Available	Good Condition
154	7	Plates Show Plate	CBA 404	2	Piece	100.00	/uploads/tools/image-1761498010340-926699844.jpeg	Available	For Repair
155	7	Plates Small Square Plate	CBA 404	4	Piece	100.00	/uploads/tools/image-1761498024563-320975036.jpeg	Available	For Disposal
156	7	Plates Small Square Plate	CBA 404	7	Piece	100.00	/uploads/tools/image-1761498097316-686903842.jpeg	Available	Good Condition
157	7	Plates Sushi Plate	CBA 404	7	Piece	100.00	/uploads/tools/image-1761498110835-552327805.jpeg	Available	Good Condition
158	2	Stainless Pot	CBA 404	20	Piece	100.00	/uploads/tools/image-1761498211815-743032535.jpeg	Available	Good Condition
159	6	Pourer Assorted Colors	CBA 404	50	Set	100.00	/uploads/tools/image-1761498281781-194492398.jpeg	Available	Good Condition
160	2	Pressure Cooker Stainless with Black Handle	CBA 404	8	Piece	100.00	/uploads/tools/image-1761498294363-816128689.jpeg	Available	Good Condition
161	3	Ramekin Plain White	CBA 404	5	Piece	100.00	/uploads/tools/image-1761498314380-668037807.png	Available	Good Condition
162	2	Rice Cooker 10 Cups Capacity	CBA 404	30	Piece	100.00	/uploads/tools/image-1761498331924-514971729.jpeg	Available	Good Condition
163	2	Rice Cooker Heavy Duty	CBA 404	30	Set	100.00	/uploads/tools/image-1761498347172-979933837.jpeg	Available	Good Condition
164	3	Rolling Pins Acrylic Style	CBA 404	213	Pieces	100.00	/uploads/tools/image-1761498379742-422013293.jpeg	Available	Good Condition
165	3	Rolling Pins Wood Style	CBA 404	40	Set	100.00	/uploads/tools/image-1761498405149-203339176.jpeg	Available	Good Condition
166	3	Rubber Scraper Assorted Handles and Sizes	CBA 404	22	Piece	100.00	/uploads/tools/image-1761498438436-898788302.jpeg	Available	Good Condition
167	3	Sharpening Honing Steel with Black Handle	CBA 404	20	Piece	100.00	/uploads/tools/image-1761498468627-858202581.jpg	Available	Good Condition
168	3	Sharpening Stone Gray Color	CBA 404	8	Piece	100.00	/uploads/tools/image-1761498485651-717570369.jpg	Available	Good Condition
169	3	Sifter Stainless without Handles (assorted sizes)	CBA 404	25	Piece	100.00	/uploads/tools/image-1761499050234-375903970.jpg	Available	Good Condition
170	3	Sifter with Black Handle	CBA 404	1	Unit	100.00	/uploads/tools/image-1761499133302-609395778.jpg	Available	Good Condition
171	9	Silk Chair Cover White	CBA 404	5	Piece	100.00	/uploads/tools/image-1761499173292-470538201.jpg	Available	For Repair
172	5	Sizzling Plate Metal Wood Plate	CBA 404	6	Piece	100.00	/uploads/tools/image-1761499203798-654865416.jpg	Available	Good Condition
173	9	Skirting Cloth (Pongee) Black	CBA 404	10	Piece	100.00	/uploads/tools/image-1761499230673-294198463.jpg	Available	Good Condition
174	9	Skirting Cloth (Pongee) Blue	CBA 404	7	Piece	100.00	/uploads/tools/image-1761499245711-515763689.jpg	Available	Good Condition
175	9	Skirting Cloth (Pongee) Blue Violet	CBA 404	10	Piece	100.00	/uploads/tools/image-1761499260541-6353832.jpg	Available	Good Condition
176	9	Skirting Cloth (Pongee) Brown	CBA 404	3	Pieces	100.00	/uploads/tools/image-1761499275382-315169195.jpg	Available	Good Condition
177	9	Skirting Cloth (Pongee) Dark Pink	CBA 404	18	Piece	100.00	/uploads/tools/image-1761499301845-641121502.jpg	Available	Good Condition
178	9	Skirting Cloth (Pongee) Green	CBA 404	12	Pieces	100.00	/uploads/tools/image-1761499315557-37314533.jpg	Available	Good Condition
179	9	Skirting Cloth (Pongee) Light Pink	CBA 404	1	Unit	100.00	/uploads/tools/image-1761499333909-3547034.jpg	Available	Good Condition
180	9	Skirting Cloth (Pongee) Maroon	CBA 404	20	Piece	100.00	/uploads/tools/image-1761499414438-211460024.jpg	Available	Good Condition
181	9	Skirting Cloth (Silk) Mint Light Green	CBA 404	1	Piece	100.00	/uploads/tools/image-1761499434797-604284367.jpg	Available	Good Condition
182	9	Skirting Cloth (Silk) Orange	CBA 404	1	Piece	100.00	/uploads/tools/image-1761499468158-733495246.jpg	Available	Good Condition
183	9	Skirting Cloth (Silk) Pink	CBA 404	1	Piece	100.00	/uploads/tools/image-1761499536508-237811698.jpg	Available	Good Condition
184	9	Skirting Cloth (Silk) Red	CBA 404	1	Piece	100.00	/uploads/tools/image-1761499556470-602415456.jpg	Available	Good Condition
185	9	Skirting Cloth (Silk) Sky Blue Silver	CBA 404	1	Piece	100.00	/uploads/tools/image-1761499578549-806224156.jpg	Available	Good Condition
186	3	Slicer Mandolin Slicer	CBA 404	1	Piece	100.00	/uploads/tools/image-1761499595189-354338534.jpg	Available	Good Condition
187	9	Smart TV 50 Inches	CBA 404	1	Piece	100.00	/uploads/tools/image-1761499616988-770521917.jpg	Available	Good Condition
188	5	Soup Bowl Red Black Color	CBA 404	1	Piece	100.00	/uploads/tools/image-1761499910657-489252117.jpg	Available	Good Condition
189	5	Soup Bowl Sky Blue Color with Handle	CBA 404	1	Piece	100.00	/uploads/tools/image-1761499679647-198255977.jpg	Available	Good Condition
190	5	Soup Bowl White Color (Medium size)	CBA 404	1	Piece	100.00	/uploads/tools/image-1761499698966-248919938.jpg	Available	Good Condition
191	5	Soup Bowl White Color (Small)	CBA 404	1	Piece	100.00	/uploads/tools/image-1761499783710-679767804.jpg	Available	Good Condition
192	5	Soup Bowl White Color with Handle	CBA 404	1	Piece	100.00	/uploads/tools/image-1761499819238-398550417.jpg	Available	Good Condition
193	5	Soup Server Stainless Silver Assorted Sizes	CBA 404	1	Piece	100.00	/uploads/tools/image-1761499941950-448450138.jpg	Available	Good Condition
194	5	Soy Dish Plain White	CBA 404	1	Piece	100.00	/uploads/tools/image-1761499965452-240294718.jpg	Available	Good Condition
195	5	Spatula Metal	CBA 404	1	Piece	100.00	/uploads/tools/image-1761499990853-355172287.jpg	Available	Good Condition
196	5	Spatula Off-set Spatula 3 Inch Length	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500007158-432707672.jpg	Available	Good Condition
197	7	Dessert Spoon	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500033132-282048045.jpg	Available	Good Condition
198	7	Dinner Spoon	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500051668-529606417.jpg	Available	Good Condition
199	7	Halo-halo Spoon Long Spoon	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500072096-111338356.jpg	Available	Good Condition
200	5	Serving Spoon	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500240455-239186364.jpg	Available	Good Condition
201	5	Soup Spoon	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500279008-851489660.jpg	Available	Good Condition
202	1	Spring Form Pan (Round)	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500308005-679228459.jpg	Available	Good Condition
203	2	Stock Pot Stainless (2L)	CBA 404	1	Piece	100.00	/uploads/tools/image-1761498231189-32342337.jpg	Available	Good Condition
204	2	Stock Pot Stainless Assorted Sizes	CBA 404	1	Piece	100.00	/uploads/tools/image-1761498243284-269001478.jpg	Available	Good Condition
205	8	Storage Box White Plastic Assorted Cover Colors	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500401685-245840465.jpg	Available	Good Condition
206	2	Stove Burner Doubel Burner	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500423989-28098414.jpg	Available	Good Condition
207	9	Table Buffet Table Rectangular Plastic and Folded Stand	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500448308-70599219.jpg	Available	Good Condition
208	9	Table Cloth (Pongee) Red	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500462688-765497427.jpg	Available	Good Condition
209	9	Table Cloth (Pongee) White	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500486671-872694499.jpg	Available	Good Condition
210	9	Table Cloth (Silk) Apple Green	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500563629-818063117.jpg	Available	Good Condition
211	9	Table Cloth (Silk) Maroon	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500584409-654468377.jpg	Available	Good Condition
212	9	Table Cloth (Silk) Mint Green	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500602439-908909275.jpg	Available	Good Condition
213	9	Table Cloth (Silk) Orange	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500617374-595710259.jpg	Available	Good Condition
214	9	Table Cloth (Silk) Pink	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500659070-402642261.jpg	Available	Good Condition
215	9	Table Cloth (Silk) Red	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500674669-502922833.jpg	Available	Good Condition
216	9	Table Cloth (Silk) White	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500709644-428876584.jpg	Available	Good Condition
217	9	Table Cloth (Silk) Yellow	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500726292-850155378.jpg	Available	Good Condition
218	9	Table High Cocktail Table	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500745039-940146597.jpg	Available	Good Condition
219	7	Table Napkins Black	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500797564-177723171.jpg	Available	Good Condition
220	7	Table Napkins Blue Green	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500831253-113639444.jpg	Available	Good Condition
221	7	Table Napkins Dark Blue	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500853052-914694768.jpg	Available	Good Condition
222	7	Table Napkins Dark Pink	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500878813-143368700.jpg	Available	Good Condition
223	7	Table Napkins Green	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500906640-474006858.jpg	Available	Good Condition
224	7	Table Napkins Light Pink	CBA 404	1	Piece	100.00	/uploads/tools/image-1761500974861-71508206.jpg	Available	Good Condition
225	7	Table Napkins Maroon	CBA 404	1	Piece	100.00	/uploads/tools/image-1761501028326-227745332.jpg	Available	Good Condition
226	7	Table Napkins Red	CBA 404	1	Piece	100.00	/uploads/tools/image-1761501070597-103536629.jpg	Available	Good Condition
227	7	Table Napkins Turquoise	CBA 404	1	Piece	100.00	/uploads/tools/image-1761501089086-863536118.jpg	Available	Good Condition
228	7	Table Napkins Yellow	CBA 404	1	Piece	100.00	/uploads/tools/image-1761501109606-410847984.jpg	Available	Good Condition
229	9	Table Square White Good for 4 Persons	CBA 404	1	Piece	100.00	/uploads/tools/image-1761501130720-789254963.jpg	Available	Good Condition
230	5	Food Tong Stainless	CBA 404	1	Piece	100.00	/uploads/tools/image-1761501148909-714589010.jpg	Available	Good Condition
231	9	Top Cloth (Silk) Red	CBA 404	1	Piece	100.00	/uploads/tools/image-1761501165622-588681330.jpg	Available	Good Condition
232	9	Top Cloth (Silk) White	CBA 404	1	Piece	100.00	/uploads/tools/image-1761501182053-899587843.jpg	Available	Good Condition
233	5	Tray Silver Stainless	CBA 404	1	Piece	100.00	/uploads/tools/image-1761501213445-493857391.jpg	Available	Good Condition
234	2	Turbo/Glass	CBA 404	1	Piece	100.00	/uploads/tools/image-1761501516958-617676644.png	Available	Good Condition
235	8	Utility Rack Steel 2 Layers	CBA 404	1	Piece	100.00	/uploads/tools/image-1761501585518-202850394.jpg	Available	Good Condition
236	8	Utility Tray Plastic Gray	CBA 404	1	Piece	100.00	/uploads/tools/image-1761501820607-892730985.jpg	Available	Good Condition
237	8	Water Dispenser Hot and Cold (Dowell)	CBA 404	1	Piece	100.00	/uploads/tools/image-1761501920288-750875603.jpg	Available	Good Condition
238	8	Weighing Scaled Digital D.C	CBA 404	1	Piece	100.00	/uploads/tools/image-1761502022855-931300569.jpg	Available	Good Condition
239	8	Weighing Scale Kitchen Scale	CBA 404	1	Piece	100.00	/uploads/tools/image-1761501990297-274520682.jpg	Available	Good Condition
240	3	Whire Whisk Stainless	CBA 404	1	Piece	100.00	/uploads/tools/image-1761502051622-379482601.jpg	Available	Good Condition
241	6	Wine Rack Stainless	CBA 404	1	Piece	100.00	/uploads/tools/image-1761502073728-478382344.jpg	Available	Good Condition
242	6	Wine Rack Wine Bucket	CBA 404	1	Piece	100.00	/uploads/tools/image-1761502113544-420539670.jpg	Available	Good Condition
243	2	Wok 3L	CBA 404	1	Piece	100.00	/uploads/tools/image-1761502143814-885925764.jpg	Available	Good Condition
244	5	Garlic Press	CBA 404	10	Pieces	100.00	/uploads/tools/image-1761620916248-971512730.jpg	Available	Good Condition
245	8	Box	CBA 404	10	Pieces	100.00	/uploads/tools/image-1763024295404-309826078.jpg	Available	Good Condition
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, role_id, email, password, name, active, created_at) FROM stdin;
1	1	admin@hmbs.com	admin123	John Smith	t	2025-10-24 18:55:19.914
2	2	instructor1@hmbs.com	staff201	Jane Doe	t	2025-10-24 18:55:19.93
3	2	instructor2@hmbs.com	staff202	Robert Brown	t	2025-10-24 18:55:19.939
4	3	programhead2@hmbs.com	staff302	Linda Davis	t	2025-10-24 18:55:19.947
5	4	student1@hmbs.com	student401	Chris Lee	t	2025-10-24 18:55:19.956
6	4	student2@hmbs.com	student402	Emily Clark	t	2025-10-24 18:55:19.964
7	4	student3@hmbs.com	student403	David Wilson	t	2025-10-24 18:55:19.972
8	4	student4@hmbs.com	student404	Sarah Martinez	t	2025-10-24 18:55:19.981
9	4	student5@hmbs.com	student405	James Taylor	t	2025-10-24 18:55:19.988
10	2	instructor3@hmbs.com	staff203	Michael Johnson	t	2025-10-28 03:26:33.145
12	4	student7@hmbs.com	student407	Edward Uriel	t	2025-10-28 03:55:53.525
11	4	student6@hmbs.com	student406	Jane Rose Bandoy	f	2025-10-28 03:27:02.794
14	4	student8@hmbs.com	student408	James Taylor	t	2025-11-13 17:43:40.775814
15	4	student9@hmbs.com	student409	Tyler Weiss	f	2025-11-13 17:53:49.149099
13	4	foxpainter@hmbs.com	student406	Xiao Kang	f	2025-11-13 17:36:48.014853
17	4	student10@hmbs.com	student410	Jane Rose Bandoy	t	2025-11-13 19:24:03.783555
18	4	student11@hmbs.com	student411	Tyler Durden	f	2025-11-13 22:13:06.740031
19	4	student12@hmbs.com	student413	Tyler Weiss	f	2025-11-13 22:13:06.7552
20	4	student13@hmbs.com	student415	Tyler Durden	f	2025-11-13 22:13:06.756645
21	4	student14@hmbs.com	student417	Tyler Weiss	f	2025-11-13 22:13:06.758058
24	4	student15@hmbs.com	student415	Tyler Weiss	t	2025-11-13 22:32:19.129547
25	4	student16@hmbs.com	student416	Tyler Durden	t	2025-11-13 22:32:19.144418
\.


--
-- Name: approvals_approval_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.approvals_approval_id_seq', 47, true);


--
-- Name: borrow_items_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.borrow_items_item_id_seq', 51, true);


--
-- Name: borrow_requests_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.borrow_requests_request_id_seq', 18, true);


--
-- Name: categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_category_id_seq', 1, false);


--
-- Name: groups_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groups_group_id_seq', 46, true);


--
-- Name: releases_release_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.releases_release_id_seq', 13, true);


--
-- Name: returns_return_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.returns_return_id_seq', 38, true);


--
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 1, false);


--
-- Name: statuses_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.statuses_status_id_seq', 1, false);


--
-- Name: tools_tool_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tools_tool_id_seq', 248, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 25, true);


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

\unrestrict HcjmFnMcLl0kgCx7D8odSI8MWfuoDYcjs31I9vu8gm0FTuZxgGIHu88uDB1oCQW

