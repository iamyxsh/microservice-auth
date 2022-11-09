use sqlx::{postgres::PgPoolOptions, Pool, Postgres};

use crate::entities::USER_TABLE_CREATION_STATEMENT;

pub async fn return_pool() -> Pool<Postgres> {
    PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres://root:password@localhost:5434/postgres")
        .await
        .unwrap()
}

pub async fn create_tables(pool: &Pool<Postgres>) {
    let _ = sqlx::query(USER_TABLE_CREATION_STATEMENT)
        .execute(pool)
        .await;
}
