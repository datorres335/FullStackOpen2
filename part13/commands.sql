CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES
    ('Johny Test', 'https://test.com', 'Test Title', 42),
    ('Dave Test', 'https://www.example.com', 'Test By Example', 35);

SELECT * FROM blogs;

\d blogs;