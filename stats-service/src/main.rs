mod db;
mod entities;
pub mod kafka_client;
mod services;

use actix_web::{
    web::{self, Data},
    App, HttpServer,
};
use db::{create_tables, return_pool};
use kafka_client::consume_messages;
use services::{get_stats, AppState};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let pool = return_pool().await;

    let _ = create_tables(&pool).await;

    let _ = consume_messages("USER_LOGGED_IN".to_string());

    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(AppState { db: pool.clone() }))
            .route("/hello", web::get().to(|| async { "Hello World!" }))
            .service(get_stats)
    })
    .bind(("0.0.0.0", 3003))?
    .run()
    .await
}
