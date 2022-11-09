use actix_web::cookie::time::PrimitiveDateTime;

pub struct User {
    id: Option<u64>,
    email: Option<String>,
    last_login: Option<PrimitiveDateTime>,
    login_counter: Option<u64>,
}

pub const USER_TABLE_CREATION_STATEMENT: &str = r#"CREATE TABLE IF NOT EXISTS users
                                                (id SERIAL PRIMARY KEY,
                                                name VARCHAR(20),
                                                email VARCHAR(30),
                                                login_counter INT,
                                                last_login TIMESTAMP);"#;
